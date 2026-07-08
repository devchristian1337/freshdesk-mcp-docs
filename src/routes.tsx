import type {RouteObject} from 'react-router';
import SiteLayout from './layouts/SiteLayout';
import NotFound from './pages/NotFound';
import DocPage from './pages/DocPage';
import Home from './pages/Home';
import {orderedDocs} from './content/docs.config';
import {loadDoc} from './content/docs-modules';

/**
 * Albero delle route, condiviso tra client (main.tsx) e prerender SSG
 * (entry-server.tsx). La Home resta eager per includere subito il suo CSS nel
 * primo paint; ogni documento resta lazy: un chunk per pagina, e il prerender
 * puo attendere il modulo prima di renderizzare.
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
        element: <Home />,
      },
      ...orderedDocs.map((d) => docRoute(d.id)),
      {path: '*', element: <NotFound />},
    ],
  },
];
