import type {Locale} from './config';

type UiCopy = {
  siteTagline: string;
  documentation: string;
  reference: string;
  examples: string;
  home: string;
  search: string;
  searchLabel: string;
  lightTheme: string;
  darkTheme: string;
  language: string;
  docsIndex: string;
  previous: string;
  next: string;
  breadcrumbs: string;
  adjacentPages: string;
  searchUnavailable: string;
  untitled: string;
  notFoundTitle: string;
  notFoundText: string;
  goToIntro: string;
  footerCopyright: string;
  footerDocs: string;
  footerReference: string;
  footerResources: string;
  repository: string;
  freshdeskApi: string;
  guide: string;
  overview: string;
  installation: string;
  configuration: string;
  introduction: string;
  conversations: string;
  contacts: string;
  companies: string;
  agents: string;
  groups: string;
  fields: string;
  cannedResponses: string;
  solutions: string;
  prompts: string;
  tickets: string;
};

export const uiCopy: Record<Locale, UiCopy> = {
  en: {
    siteTagline: 'Technical documentation for Freshdesk MCP: install, configure, and use 64 MCP tools for tickets, contacts, companies, and knowledge base.',
    documentation: 'Documentation', reference: 'Reference', examples: 'Examples', home: 'Home', search: 'Search', searchLabel: 'Search (Ctrl+K)', lightTheme: 'Light theme', darkTheme: 'Dark theme', language: 'Language', docsIndex: 'Documentation index', previous: 'Previous', next: 'Next', breadcrumbs: 'Breadcrumbs', adjacentPages: 'Adjacent pages', searchUnavailable: 'The search index is generated during build: run', untitled: 'Untitled', notFoundTitle: 'Page not found', notFoundText: 'The requested address does not exist or has moved. Start again from the introduction or the tool reference.', goToIntro: 'Go to introduction', footerCopyright: 'Freshdesk MCP - technical documentation.', footerDocs: 'Documentation', footerReference: 'Tool reference', footerResources: 'Resources', repository: 'GitHub repository', freshdeskApi: 'Freshdesk API', guide: 'Guide', overview: 'Overview', installation: 'Installation', configuration: 'Configuration', introduction: 'Introduction', conversations: 'Conversations', contacts: 'Contacts', companies: 'Companies', agents: 'Agents', groups: 'Groups', fields: 'Fields', cannedResponses: 'Canned responses', solutions: 'Knowledge base', prompts: 'Prompts', tickets: 'Tickets',
  },
  it: {
    siteTagline: 'Documentazione tecnica di Freshdesk MCP: installa, configura e usa 64 tool MCP per ticket, contatti, aziende e knowledge base.',
    documentation: 'Documentazione', reference: 'Reference', examples: 'Esempi', home: 'Home', search: 'Cerca', searchLabel: 'Cerca (Ctrl+K)', lightTheme: 'Tema chiaro', darkTheme: 'Tema scuro', language: 'Lingua', docsIndex: 'Indice della documentazione', previous: 'Precedente', next: 'Successivo', breadcrumbs: 'Percorso', adjacentPages: 'Pagine adiacenti', searchUnavailable: 'L’indice di ricerca viene generato in build: esegui', untitled: 'Senza titolo', notFoundTitle: 'Pagina non trovata', notFoundText: 'L’indirizzo richiesto non esiste o è stato spostato. Riparti dall’introduzione o dalla reference dei tool.', goToIntro: 'Vai all’introduzione', footerCopyright: 'Freshdesk MCP - documentazione tecnica.', footerDocs: 'Documentazione', footerReference: 'Reference dei tool', footerResources: 'Risorse', repository: 'Repository GitHub', freshdeskApi: 'API Freshdesk', guide: 'Guida', overview: 'Panoramica', installation: 'Installazione', configuration: 'Configurazione', introduction: 'Introduzione', conversations: 'Conversazioni', contacts: 'Contatti', companies: 'Aziende', agents: 'Agenti', groups: 'Gruppi', fields: 'Campi', cannedResponses: 'Risposte predefinite', solutions: 'Knowledge base', prompts: 'Prompt', tickets: 'Ticket',
  },
  es: {
    siteTagline: 'Documentación técnica de Freshdesk MCP: instala, configura y utiliza 64 herramientas MCP para tickets, contactos, empresas y base de conocimientos.',
    documentation: 'Documentación', reference: 'Referencia', examples: 'Ejemplos', home: 'Inicio', search: 'Buscar', searchLabel: 'Buscar (Ctrl+K)', lightTheme: 'Tema claro', darkTheme: 'Tema oscuro', language: 'Idioma', docsIndex: 'Índice de documentación', previous: 'Anterior', next: 'Siguiente', breadcrumbs: 'Ruta', adjacentPages: 'Páginas adyacentes', searchUnavailable: 'El índice de búsqueda se genera durante la compilación: ejecuta', untitled: 'Sin título', notFoundTitle: 'Página no encontrada', notFoundText: 'La dirección solicitada no existe o se ha movido. Vuelve a la introducción o a la referencia de herramientas.', goToIntro: 'Ir a la introducción', footerCopyright: 'Freshdesk MCP - documentación técnica.', footerDocs: 'Documentación', footerReference: 'Referencia de herramientas', footerResources: 'Recursos', repository: 'Repositorio de GitHub', freshdeskApi: 'API de Freshdesk', guide: 'Guía', overview: 'Resumen', installation: 'Instalación', configuration: 'Configuración', introduction: 'Introducción', conversations: 'Conversaciones', contacts: 'Contactos', companies: 'Empresas', agents: 'Agentes', groups: 'Grupos', fields: 'Campos', cannedResponses: 'Respuestas predefinidas', solutions: 'Base de conocimientos', prompts: 'Prompts', tickets: 'Tickets',
  },
  de: {
    siteTagline: 'Technische Dokumentation für Freshdesk MCP: Installiere, konfiguriere und nutze 64 MCP-Tools für Tickets, Kontakte, Unternehmen und Wissensdatenbank.',
    documentation: 'Dokumentation', reference: 'Referenz', examples: 'Beispiele', home: 'Startseite', search: 'Suche', searchLabel: 'Suche (Ctrl+K)', lightTheme: 'Helles Design', darkTheme: 'Dunkles Design', language: 'Sprache', docsIndex: 'Dokumentationsindex', previous: 'Zurück', next: 'Weiter', breadcrumbs: 'Pfad', adjacentPages: 'Benachbarte Seiten', searchUnavailable: 'Der Suchindex wird beim Build erstellt: ausführen', untitled: 'Ohne Titel', notFoundTitle: 'Seite nicht gefunden', notFoundText: 'Die angeforderte Adresse existiert nicht oder wurde verschoben. Beginne erneut mit der Einführung oder der Tool-Referenz.', goToIntro: 'Zur Einführung', footerCopyright: 'Freshdesk MCP - technische Dokumentation.', footerDocs: 'Dokumentation', footerReference: 'Tool-Referenz', footerResources: 'Ressourcen', repository: 'GitHub-Repository', freshdeskApi: 'Freshdesk API', guide: 'Leitfaden', overview: 'Übersicht', installation: 'Installation', configuration: 'Konfiguration', introduction: 'Einführung', conversations: 'Unterhaltungen', contacts: 'Kontakte', companies: 'Unternehmen', agents: 'Agenten', groups: 'Gruppen', fields: 'Felder', cannedResponses: 'Vordefinierte Antworten', solutions: 'Wissensdatenbank', prompts: 'Prompts', tickets: 'Tickets',
  },
  fr: {
    siteTagline: 'Documentation technique de Freshdesk MCP : installez, configurez et utilisez 64 outils MCP pour les tickets, contacts, entreprises et la base de connaissances.',
    documentation: 'Documentation', reference: 'Référence', examples: 'Exemples', home: 'Accueil', search: 'Rechercher', searchLabel: 'Rechercher (Ctrl+K)', lightTheme: 'Thème clair', darkTheme: 'Thème sombre', language: 'Langue', docsIndex: 'Index de la documentation', previous: 'Précédent', next: 'Suivant', breadcrumbs: 'Fil d’Ariane', adjacentPages: 'Pages adjacentes', searchUnavailable: 'L’index de recherche est généré à la compilation : exécutez', untitled: 'Sans titre', notFoundTitle: 'Page introuvable', notFoundText: 'L’adresse demandée n’existe pas ou a été déplacée. Recommencez depuis l’introduction ou la référence des outils.', goToIntro: 'Aller à l’introduction', footerCopyright: 'Freshdesk MCP - documentation technique.', footerDocs: 'Documentation', footerReference: 'Référence des outils', footerResources: 'Ressources', repository: 'Dépôt GitHub', freshdeskApi: 'API Freshdesk', guide: 'Guide', overview: 'Vue d’ensemble', installation: 'Installation', configuration: 'Configuration', introduction: 'Introduction', conversations: 'Conversations', contacts: 'Contacts', companies: 'Entreprises', agents: 'Agents', groups: 'Groupes', fields: 'Champs', cannedResponses: 'Réponses prédéfinies', solutions: 'Base de connaissances', prompts: 'Prompts', tickets: 'Tickets',
  },
};
