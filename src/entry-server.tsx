import {StrictMode} from 'react';
import {renderToString} from 'react-dom/server';
import {createStaticHandler, createStaticRouter, StaticRouterProvider} from 'react-router';
import {ThemeProvider} from './theme/ThemeProvider';
import {routes} from './routes';
import {loadDoc} from './content/docs-modules';
import {docRefOf, orderedDocs, type DocId} from './content/docs.config';
import {defaultLocale, localeInfo, locales, localizePath, type Locale} from './i18n/config';
import {siteFor} from './site.config';
import {homeContent} from './pages/Home/content';

const handler = createStaticHandler(routes);
const defaultSite = siteFor(defaultLocale);

export async function render(path: string): Promise<string> {
  const context = await handler.query(new Request(new URL(path, defaultSite.url).href));
  if (context instanceof Response) throw new Error(`Unexpected redirect while prerendering ${path}`);
  const router = createStaticRouter(handler.dataRoutes, context);
  return renderToString(<StrictMode><ThemeProvider><StaticRouterProvider router={router} context={context} hydrate={false} /></ThemeProvider></StrictMode>);
}

export type RouteMeta = {
  path: string;
  title: string;
  pageTitle: string;
  description: string;
  kind: 'home' | 'doc';
  breadcrumbs: {name: string; path: string}[];
  locale: Locale;
  language: string;
  ogLocale: string;
  alternates: {language: string; path: string}[];
};

function pathsForDoc(id: DocId): Record<Locale, string> {
  return Object.fromEntries(locales.map((locale) => [locale, localizePath(locale, `/docs/${id}`)])) as Record<Locale, string>;
}

function alternates(paths: Record<Locale, string>): {language: string; path: string}[] {
  return [
    ...locales.map((locale) => ({language: localeInfo[locale].htmlLang, path: paths[locale]})),
    {language: 'x-default', path: paths.en},
  ];
}

export async function collectRoutes(): Promise<RouteMeta[]> {
  const routes: RouteMeta[] = [];
  const homePaths = Object.fromEntries(locales.map((locale) => [locale, localizePath(locale, '/')])) as Record<Locale, string>;

  for (const locale of locales) {
    const site = siteFor(locale);
    const t = homeContent[locale];
    routes.push({
      path: homePaths[locale],
      title: `${t.title} | ${site.title}`,
      pageTitle: site.title,
      description: site.tagline,
      kind: 'home',
      locale,
      language: localeInfo[locale].htmlLang,
      ogLocale: localeInfo[locale].ogLocale,
      alternates: alternates(homePaths),
      breadcrumbs: [{name: 'Home', path: homePaths[locale]}],
    });

    for (const doc of orderedDocs(locale)) {
      const mod = await loadDoc(locale, doc.id);
      const paths = pathsForDoc(doc.id);
      const pageTitle = docRefOf(locale, doc.id)?.label ?? mod.frontmatter.title ?? doc.id;
      const isReference = doc.id.startsWith('reference/');
      const sectionPath = localizePath(locale, isReference ? '/docs/reference/overview' : '/docs/intro');
      const sectionName = isReference ? (locale === 'en' ? 'Tool reference' : docRefOf(locale, 'reference/overview')?.label ?? 'Reference') : (locale === 'en' ? 'Documentation' : docRefOf(locale, 'intro')?.label ?? 'Documentation');
      routes.push({
        path: paths[locale],
        title: `${pageTitle} | ${site.title}`,
        pageTitle,
        description: mod.frontmatter.description ?? site.tagline,
        kind: 'doc',
        locale,
        language: localeInfo[locale].htmlLang,
        ogLocale: localeInfo[locale].ogLocale,
        alternates: alternates(paths),
        breadcrumbs: doc.id === 'intro'
          ? [{name: 'Home', path: homePaths[locale]}, {name: pageTitle, path: paths[locale]}]
          : [{name: 'Home', path: homePaths[locale]}, {name: sectionName, path: sectionPath}, {name: pageTitle, path: paths[locale]}],
      });
    }
  }
  return routes;
}

export const siteInfo = defaultSite;
