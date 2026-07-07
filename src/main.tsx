import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {createBrowserRouter, matchRoutes, RouterProvider} from 'react-router';
import {ThemeProvider} from './theme/ThemeProvider';
import {routes} from './routes';
import './styles/tokens.css';
import './styles/base.css';
import './styles/tailwind.css';

/**
 * Entry client. In produzione l'HTML è prerenderizzato (SSG): prima di
 * idratare risolviamo i moduli lazy della route corrente, altrimenti il
 * primo render non combacerebbe con l'HTML statico.
 */
async function boot() {
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

  // Idrata se il prerender ha già riempito #root, altrimenti (dev) monta da
  // zero. Serve firstElementChild, non hasChildNodes(): in dev la root
  // contiene il segnaposto <!--app-html--> e un commento è pur sempre un
  // child node — idratare una root "vuota" fa fallire l'hydration.
  if (rootEl.firstElementChild) {
    hydrateRoot(rootEl, app);
  } else {
    createRoot(rootEl).render(app);
  }
}

boot().catch((err: unknown) => {
  // Il contenuto statico resta comunque leggibile: segnala e non lasciare
  // l'app silenziosamente morta.
  console.error('Bootstrap client fallito:', err);
  (window as never as {__bootError: unknown}).__bootError = err;
});
