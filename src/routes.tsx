import type {RouteObject} from 'react-router';
import SiteLayout from './layouts/SiteLayout';
import NotFound from './pages/NotFound';
import DocPage from './pages/DocPage';
import {orderedDocs} from './content/docs.config';
import {loadDoc} from './content/docs-modules';

/**
 * Albero delle route, condiviso tra client (main.tsx) e prerender SSG
 * (entry-server.tsx). Ogni documento è una route lazy: un chunk per pagina,
 * e il prerender può attendere il modulo prima di renderizzare.
 */

function docRoute(docId: string): RouteObject {
  return {
    path: `docs/${docId}`,
    lazy: async () => {
      const mod = await loadDoc(docId);
      return {
        Component: function Doc() {
          return <DocPage docId={docId} mod={mod} />;
        },
      };
    },
  };
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      {
        index: true,
        lazy: async () => ({Component: (await import('./pages/Home')).default}),
      },
      ...orderedDocs.map((d) => docRoute(d.id)),
      {path: '*', element: <NotFound />},
    ],
  },
];
