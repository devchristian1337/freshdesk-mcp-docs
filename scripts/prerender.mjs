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
  const head = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<link rel="canonical" href="${siteInfo.url}${meta.path === '/' ? '' : meta.path}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:image" content="${siteInfo.url}${siteInfo.socialImage}" />`,
    `<meta property="og:type" content="website" />`,
  ].join('\n    ');

  return template
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
    description: siteInfo.tagline,
  });
  await writeFile(path.join(buildDir, '404.html'), html, 'utf8');
  console.log('prerender 404 -> build/404.html');
}

// sitemap.xml (come faceva il preset Docusaurus)
{
  const urls = routes
    .map(
      (r) =>
        `  <url><loc>${siteInfo.url}${r.path === '/' ? '/' : r.path}</loc></url>`,
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  await writeFile(path.join(buildDir, 'sitemap.xml'), xml, 'utf8');
  console.log('sitemap -> build/sitemap.xml');
}

// La build SSR è servita: via.
await rm(ssrDir, {recursive: true, force: true});
console.log(`prerender completato: ${routes.length + 1} pagine`);
