/**
 * Configurazione del sito (ex themeConfig di Docusaurus).
 * Unica fonte per titolo, navbar, footer e metadati globali.
 */

export const site = {
  title: 'Freshdesk MCP',
  tagline:
    'Documentazione tecnica di Freshdesk MCP: installa, configura e usa 64 tool MCP per ticket, contatti, aziende e knowledge base.',
  url: 'https://freshdesk-mcp.com',
  language: 'it',
  locale: 'it_IT',
  socialImage: '/img/docusaurus-social-card.jpg',
  logo: '/img/logo.png',
  repoUrl: 'https://github.com/devchristian1337/freshdesk-mcp',
} as const;

export type NavItem = {label: string; to?: string; href?: string};

export const navbarItems: NavItem[] = [
  {label: 'Documentazione', to: '/docs/intro'},
  {label: 'Reference', to: '/docs/reference/overview'},
  {label: 'Esempi', to: '/docs/esempi'},
];

export type FooterColumn = {
  title: string;
  items: {label: string; to?: string; href?: string}[];
};

export const footerColumns: FooterColumn[] = [
  {
    title: 'Documentazione',
    items: [
      {label: 'Introduzione', to: '/docs/intro'},
      {label: 'Installazione', to: '/docs/installazione'},
      {label: 'Configurazione', to: '/docs/configurazione'},
      {label: 'Esempi', to: '/docs/esempi'},
    ],
  },
  {
    title: 'Reference dei tool',
    items: [
      {label: 'Panoramica', to: '/docs/reference/overview'},
      {label: 'Ticket', to: '/docs/reference/tickets'},
      {label: 'Knowledge base', to: '/docs/reference/soluzioni'},
      {label: 'Prompt', to: '/docs/reference/prompts'},
    ],
  },
  {
    title: 'Risorse',
    items: [
      {label: 'Repository GitHub', href: 'https://github.com/devchristian1337/freshdesk-mcp'},
      {label: 'API Freshdesk', href: 'https://developers.freshdesk.com/api/'},
    ],
  },
];

export const footerCopyright =
  'Freshdesk MCP - documentazione tecnica. Costruito con React + Vite.';
