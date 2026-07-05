import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {createBrowserRouter, matchRoutes, RouterProvider} from 'react-router';
import {ThemeProvider} from './theme/ThemeProvider';
import {routes} from './routes';
import './styles/tokens.css';
import './styles/base.css';

/**
 * Entry client. In produzione l'HTML è prerenderizzato (SSG): prima di
 * idratare risolviamo i moduli lazy della route corrente, altrimenti il
 * primo render non combacerebbe con l'HTML statico.
 */
const lazyMatches = matchRoutes(routes, window.location)?.filter(
  (m) => m.route.lazy,
);
if (lazyMatches && lazyMatches.length > 0) {
  await Promise.all(
    lazyMatches.map(async (m) => {
      const routeModule = await (
        m.route.lazy as () => Promise<Record<string, unknown>>
      )();
      Object.assign(m.route, {...routeModule, lazy: undefined});
    }),
  );
}

const router = createBrowserRouter(routes);
const rootEl = document.getElementById('root')!;
const app = (
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);

// Idrata se il prerender ha già riempito #root, altrimenti (dev) monta da zero.
if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}
