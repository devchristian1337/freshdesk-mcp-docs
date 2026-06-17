import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Eseguito in Node.js — niente codice client (API browser, JSX...) qui dentro.

const config: Config = {
  title: 'Freshdesk MCP',
  tagline: 'Server MCP per Freshdesk: 64 tool per ticket, contatti, aziende, knowledge base e altro',
  favicon: 'img/favicon.ico',

  future: {
    v4: true, // Compatibilità con Docusaurus v4
  },

  // URL di produzione (dominio custom su Cloudflare Pages)
  url: 'https://freshdesk-mcp.com',
  baseUrl: '/',

  organizationName: 'devchristian1337',
  projectName: 'freshdesk-mcp',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Sito in italiano: imposta html lang="it".
  i18n: {
    defaultLocale: 'it',
    locales: ['it'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/docs',
        },
        blog: false, // solo documentazione
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      // Ricerca locale (offline, nessun servizio esterno). Vedi package.json.
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['it', 'en'],
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Freshdesk MCP',
      hideOnScroll: true,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentazione',
        },
        {
          to: '/docs/reference/overview',
          label: 'Reference',
          position: 'left',
        },
        {
          to: '/docs/esempi',
          label: 'Esempi',
          position: 'left',
        },
        {
          href: 'https://github.com/devchristian1337/freshdesk-mcp',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
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
            {label: 'Pacchetto su PyPI', href: 'https://pypi.org/project/freshdesk-mcp/'},
            {label: 'API Freshdesk', href: 'https://developers.freshdesk.com/api/'},
          ],
        },
      ],
      copyright: `Freshdesk MCP — documentazione tecnica. Costruito con Docusaurus.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'json', 'python', 'toml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
