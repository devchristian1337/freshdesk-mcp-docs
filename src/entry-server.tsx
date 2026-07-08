import {StrictMode} from 'react';
import {renderToString} from 'react-dom/server';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router';
import {ThemeProvider} from './theme/ThemeProvider';
import {routes} from './routes';
import {loadDoc} from './content/docs-modules';
import {docRefOf, orderedDocs} from './content/docs.config';
import {site} from './site.config';

/**
 * Entry SSG: usato solo da scripts/prerender.mjs dopo la build client.
 * createStaticHandler risolve le route lazy prima del render, quindi
 * renderToString produce l'HTML completo di ogni pagina.
 */

const handler = createStaticHandler(routes);

export async function render(path: string): Promise<string> {
  const context = await handler.query(
    new Request(new URL(path, site.url).href),
  );
  if (context instanceof Response) {
    throw new Error(`Redirect inatteso durante il prerender di ${path}`);
  }
  const router = createStaticRouter(handler.dataRoutes, context);
  return renderToString(
    <StrictMode>
      <ThemeProvider>
        <StaticRouterProvider router={router} context={context} hydrate={false} />
      </ThemeProvider>
    </StrictMode>,
  );
}

export type RouteMeta = {
  path: string;
  title: string;
  pageTitle: string;
  description: string;
  kind: 'home' | 'doc';
  breadcrumbs: {name: string; path: string}[];
};

/** Elenco delle route pubbliche con i meta per <title>/<meta> statici. */
export async function collectRoutes(): Promise<RouteMeta[]> {
  const out: RouteMeta[] = [
    {
      path: '/',
      title: 'Freshdesk MCP: 64 tool per integrare Freshdesk con AI',
      pageTitle: site.title,
      description: site.tagline,
      kind: 'home',
      breadcrumbs: [{name: 'Home', path: '/'}],
    },
  ];
  for (const doc of orderedDocs) {
    const mod = await loadDoc(doc.id);
    const pageTitle = mod.frontmatter.title ?? docRefOf(doc.id)?.label ?? doc.id;
    const isReference = doc.id.startsWith('reference/');
    const sectionPath = isReference ? '/docs/reference/overview' : '/docs/intro';
    const sectionName = isReference ? 'Reference dei tool' : 'Documentazione';
    out.push({
      path: `/docs/${doc.id}`,
      title: `${pageTitle} | ${site.title}`,
      pageTitle,
      description: mod.frontmatter.description ?? site.tagline,
      kind: 'doc',
      breadcrumbs:
        doc.id === 'intro'
          ? [
              {name: 'Home', path: '/'},
              {name: pageTitle, path: `/docs/${doc.id}`},
            ]
          : [
              {name: 'Home', path: '/'},
              {name: sectionName, path: sectionPath},
              {name: pageTitle, path: `/docs/${doc.id}`},
            ],
    });
  }
  return out;
}

export const siteInfo = site;
