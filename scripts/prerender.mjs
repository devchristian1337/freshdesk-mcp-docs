/**
 * Prerender SSG: dopo `vite build` (client, in build/) e la build SSR
 * (entry-server in build-ssr/), renderizza ogni route in un file HTML
 * statico dentro build/, genera 404.html e sitemap.xml, poi elimina
 * build-ssr/. Il risultato è un sito completamente statico per Cloudflare.
 */
import {mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root = process.cwd();
const buildDir = path.join(root, 'build');
const ssrDir = path.join(root, 'build-ssr');

const {render, collectRoutes, siteInfo} = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
);

const template = await readFile(path.join(buildDir, 'index.html'), 'utf8');

/** Sostituisce head e root del template con i contenuti della route. */
function fillTemplate(appHtml, meta) {
  const pageUrl = absoluteUrl(meta.path);
  const imageUrl = absoluteAsset(siteInfo.socialImage);
  const head = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    meta.robots ? `<meta name="robots" content="${escapeHtml(meta.robots)}" />` : '',
    `<link rel="canonical" href="${pageUrl}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${pageUrl}" />`,
    `<meta property="og:site_name" content="${escapeHtml(siteInfo.title)}" />`,
    `<meta property="og:locale" content="${meta.ogLocale}" />`,
    `<meta property="og:image" content="${imageUrl}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="${imageUrl}" />`,
    `<script type="application/ld+json">${jsonForHtml(schemaFor(meta, pageUrl, imageUrl))}</script>`,
    ...meta.alternates.map((alternate) => `<link rel="alternate" hreflang="${alternate.language}" href="${absoluteUrl(alternate.path)}" />`),
  ].filter(Boolean).join('\n    ');

  return template
    .replace(/<html lang="[^"]+">/, `<html lang="${meta.language}">`)
    .replace(/<title>.*?<\/title>/s, '') // il titolo statico del template
    .replace('<!--app-head-->', head)
    .replace('<!--app-html-->', appHtml);
}

function escapeHtml(s) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function absoluteUrl(routePath) {
  return `${siteInfo.url}${routePath === '/' ? '/' : routePath}`;
}

function absoluteAsset(assetPath) {
  return `${siteInfo.url}${assetPath.startsWith('/') ? assetPath : `/${assetPath}`}`;
}

function jsonForHtml(value) {
  return JSON.stringify(value).replaceAll('<', '\\u003c');
}

function schemaFor(meta, pageUrl, imageUrl) {
  const siteUrl = absoluteUrl('/');
  const orgId = `${siteUrl}#organization`;
  const siteId = `${siteUrl}#website`;
  const pageId = `${pageUrl}#webpage`;
  const graph = [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: siteInfo.title,
      url: siteUrl,
      logo: absoluteAsset(siteInfo.logo),
      sameAs: [siteInfo.repoUrl],
    },
    {
      '@type': 'WebSite',
      '@id': siteId,
      name: siteInfo.title,
      url: siteUrl,
      inLanguage: meta.language,
      publisher: {'@id': orgId},
    },
  ];

  if (meta.kind === 'home') {
    graph.push({
      '@type': 'SoftwareApplication',
      '@id': `${siteUrl}#software`,
      name: siteInfo.title,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Windows, macOS, Linux',
      programmingLanguage: 'Python',
      url: siteUrl,
      codeRepository: siteInfo.repoUrl,
      image: imageUrl,
      description: meta.description,
      publisher: {'@id': orgId},
    });
  }

  graph.push({
    '@type': 'WebPage',
    '@id': pageId,
    url: pageUrl,
    name: meta.pageTitle,
    headline: meta.pageTitle,
    description: meta.description,
    image: imageUrl,
    inLanguage: meta.language,
    isPartOf: {'@id': siteId},
    publisher: {'@id': orgId},
  });

  if (meta.breadcrumbs?.length > 1) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: meta.breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path),
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

const routes = await collectRoutes();

// Route pubbliche: / resta index.html, le altre clean URL diventano .html.
for (const meta of routes) {
  const appHtml = await render(meta.path);
  const html = fillTemplate(appHtml, meta);
  const outFile =
    meta.path === '/'
      ? path.join(buildDir, 'index.html')
      : path.join(buildDir, `${meta.path.slice(1)}.html`);
  await mkdir(path.dirname(outFile), {recursive: true});
  await writeFile(outFile, html, 'utf8');
  console.log(`prerender ${meta.path} -> ${path.relative(root, outFile)}`);
}

// Pagina 404 dedicata (wrangler: not_found_handling = "404-page")
{
  const appHtml = await render('/pagina-inesistente');
  const html = fillTemplate(appHtml, {
    path: '/404',
    title: `Pagina non trovata | ${siteInfo.title}`,
    pageTitle: 'Pagina non trovata',
    description: siteInfo.tagline,
    kind: 'doc',
    locale: 'en',
    language: 'en',
    ogLocale: 'en_US',
    alternates: [{language: 'en', path: '/404'}],
    robots: 'noindex, follow',
    breadcrumbs: [
      {name: 'Home', path: '/'},
      {name: 'Pagina non trovata', path: '/404'},
    ],
  });
  await writeFile(path.join(buildDir, '404.html'), html, 'utf8');
  console.log('prerender 404 -> build/404.html');
}

// sitemap.xml (come faceva il preset Docusaurus)
{
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = routes
    .map(
      (r) =>
        `  <url><loc>${absoluteUrl(r.path)}</loc><lastmod>${lastmod}</lastmod></url>`,
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  await writeFile(path.join(buildDir, 'sitemap.xml'), xml, 'utf8');
  console.log('sitemap -> build/sitemap.xml');
}

// La build SSR è servita: via.
await rm(ssrDir, {recursive: true, force: true});
console.log(`prerender completato: ${routes.length + 1} pagine`);
