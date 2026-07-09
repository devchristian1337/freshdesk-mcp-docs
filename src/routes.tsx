import type {RouteObject} from 'react-router';
import SiteLayout from './layouts/SiteLayout';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import {orderedDocs, type DocId} from './content/docs.config';
import {loadDoc} from './content/docs-modules';
import {LocaleProvider} from './i18n/LocaleProvider';
import {defaultLocale, locales, type Locale} from './i18n/config';

/**
 * Albero delle route, condiviso tra client (main.tsx) e prerender SSG
 * (entry-server.tsx). La Home resta eager per includere subito il suo CSS nel
 * primo paint; ogni documento resta lazy: un chunk per pagina, e il prerender
 * puo attendere il modulo prima di renderizzare.
 */

function docRoute(locale: Locale, docId: DocId): RouteObject {
  return {
    path: `docs/${docId}`,
    lazy: async () => {
      const [{default: DocPage}, mod] = await Promise.all([
        import('./pages/DocPage'),
        loadDoc(locale, docId),
      ]);
      return {
        Component: function Doc() {
          return <DocPage docId={docId} mod={mod} />;
        },
      };
    },
  };
}

function localeRoute(locale: Locale): RouteObject {
  return {
    path: locale === defaultLocale ? '/' : locale,
    element: (
      <LocaleProvider locale={locale}>
        <SiteLayout />
      </LocaleProvider>
    ),
    children: [
      {index: true, element: <Home />},
      ...orderedDocs(locale).map((doc) => docRoute(locale, doc.id)),
      {path: '*', element: <NotFound />},
    ],
  };
}

export const routes: RouteObject[] = locales.map(localeRoute);
