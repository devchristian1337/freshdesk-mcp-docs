import {uiCopy} from './i18n/copy';
import {defaultLocale, localeInfo, type Locale} from './i18n/config';

const shared = {
  title: 'Freshdesk MCP',
  url: 'https://freshdesk-mcp.com',
  socialImage: '/img/docusaurus-social-card.jpg',
  logo: '/img/logo.png',
  repoUrl: 'https://github.com/devchristian1337/freshdesk-mcp',
} as const;

export function siteFor(locale: Locale) {
  return {
    ...shared,
    language: localeInfo[locale].htmlLang,
    locale: localeInfo[locale].ogLocale,
    tagline: uiCopy[locale].siteTagline,
  };
}

/** Compatibilità per codice eseguito fuori dal provider: inglese di default. */
export const site = siteFor(defaultLocale);

export type NavItem = {label: string; to?: string; href?: string};

export function footerColumns(locale: Locale): {title: string; items: NavItem[]}[] {
  const t = uiCopy[locale];
  return [
    {
      title: t.footerDocs,
      items: [
        {label: t.introduction, to: '/docs/intro'},
        {label: t.installation, to: '/docs/installazione'},
        {label: t.configuration, to: '/docs/configurazione'},
        {label: t.examples, to: '/docs/esempi'},
      ],
    },
    {
      title: t.footerReference,
      items: [
        {label: t.overview, to: '/docs/reference/overview'},
        {label: t.tickets, to: '/docs/reference/tickets'},
        {label: t.solutions, to: '/docs/reference/soluzioni'},
        {label: t.prompts, to: '/docs/reference/prompts'},
      ],
    },
    {
      title: t.footerResources,
      items: [
        {label: t.repository, href: shared.repoUrl},
        {label: t.freshdeskApi, href: 'https://developers.freshdesk.com/api/'},
      ],
    },
  ];
}

export function footerCopyright(locale: Locale): string {
  return uiCopy[locale].footerCopyright;
}
