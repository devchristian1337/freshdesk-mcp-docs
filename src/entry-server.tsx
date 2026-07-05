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
        <StaticRouterProvider router={router} context={context} />
      </ThemeProvider>
    </StrictMode>,
  );
}

export type RouteMeta = {path: string; title: string; description: string};

/** Elenco delle route pubbliche con i meta per <title>/<meta> statici. */
export async function collectRoutes(): Promise<RouteMeta[]> {
  const out: RouteMeta[] = [
    {path: '/', title: `Documentazione | ${site.title}`, description: site.tagline},
  ];
  for (const doc of orderedDocs) {
    const mod = await loadDoc(doc.id);
    const title = mod.frontmatter.title ?? docRefOf(doc.id)?.label ?? doc.id;
    out.push({
      path: `/docs/${doc.id}`,
      title: `${title} | ${site.title}`,
      description: mod.frontmatter.description ?? site.tagline,
    });
  }
  return out;
}

export const siteInfo = site;
