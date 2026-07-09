import type {Locale} from '../../i18n/config';

export type HomeContent = {
  title: string;
  subtitle: string;
  start: string;
  configureClient: string;
  registryEyebrow: string;
  registryTitle: string;
  offerEyebrow: string;
  offerTitle: string;
  useCasesEyebrow: string;
  useCasesTitle: string;
  connectionEyebrow: string;
  connectionTitle: string;
  localMode: string;
  remoteMode: string;
  localText: string;
  remoteText: string;
  seeConfiguration: string;
  seeInstallation: string;
  ctaTitle: string;
  ctaText: string;
  installServer: string;
  githubCode: string;
  request: string;
  tool: string;
  response: string;
  requestExample: string;
  ticketSubject: string;
  active: string;
  features: {title: string; body: string}[];
  useCases: {title: string; body: string}[];
  registry: {label: string; promptLabel: string}[];
};

const commonRegistry = ['Tickets', 'Conversations', 'Contacts', 'Companies', 'Agents', 'Groups', 'Fields', 'Canned responses', 'Knowledge base'];

export const homeContent: Record<Locale, HomeContent> = {
  en: {
    title: 'Bring Freshdesk into your AI assistant', subtitle: 'freshdesk-mcp exposes 64 tools and 2 prompts through Model Context Protocol: tickets, conversations, contacts, companies, knowledge base, and custom fields in natural language.', start: 'Get started', configureClient: 'Configure client', registryEyebrow: 'Registry', registryTitle: '64 tools, organized by domain', offerEyebrow: 'What it offers', offerTitle: 'A complete surface for the Freshdesk API', useCasesEyebrow: 'When to use it', useCasesTitle: 'An MCP layer for AI-assisted Freshdesk workflows', connectionEyebrow: 'How it connects', connectionTitle: 'Two ways to run it', localMode: 'Local · stdio', remoteMode: 'Remote · HTTP', localText: 'The client starts the server locally in Claude Desktop, Cursor, or Windsurf. Credentials stay in environment variables.', remoteText: 'A Docker or Railway deployment serves /mcp, with a health check on /health. Credentials travel per request through headers.', seeConfiguration: 'See configuration →', seeInstallation: 'See installation →', ctaTitle: 'Ready to get started?', ctaText: 'You only need a Freshdesk API key and an MCP client. It takes a few minutes.', installServer: 'Install server', githubCode: 'Code on GitHub', request: 'request', tool: 'tool', response: 'response', requestExample: '“Show ticket #12345 and its full conversation”', ticketSubject: 'Login error', active: 'active', registry: commonRegistry.map((label) => ({label, promptLabel: 'Guided prompts create_ticket and create_reply'})),
    features: [
      {title: '64 tools, consistent naming', body: 'Every operation has a canonical freshdesk_* name. Deprecated aliases keep existing clients working.'},
      {title: 'Multi-tenant over HTTP', body: 'One deployment can serve multiple Freshdesk accounts with credentials supplied per request.'},
      {title: 'Read-only mode', body: 'FRESHDESK_TICKETS_READ_ONLY=true blocks ticket creation, updates, and deletion while retaining reads.'},
      {title: 'Context-safe attachments', body: 'Attachment metadata and URLs are returned by default. Base64 content is downloaded only when needed.'},
      {title: 'Complete conversations', body: 'Ticket conversations automatically page through public replies and private notes in one response.'},
      {title: 'ToolAnnotations', body: 'Each tool declares read, write, update, or delete behaviour to support safer AI automations.'},
    ],
    useCases: [
      {title: 'Customer support', body: 'Retrieve tickets, conversations, and attachments before preparing a response with the real context.'},
      {title: 'Internal operations', body: 'Connect requests, customers, agents, groups, and companies while keeping write operations explicit.'},
      {title: 'Knowledge base', body: 'Find existing articles, create structured drafts, and keep recurring support content current.'},
    ],
  },
  it: {
    title: 'Porta Freshdesk dentro il tuo assistente AI', subtitle: 'freshdesk-mcp espone 64 tool e 2 prompt tramite Model Context Protocol: ticket, conversazioni, contatti, aziende, knowledge base e campi custom in linguaggio naturale.', start: 'Inizia', configureClient: 'Configura il client', registryEyebrow: 'Registro', registryTitle: '64 tool, organizzati per dominio', offerEyebrow: 'Cosa offre', offerTitle: 'Una superficie completa sull’API di Freshdesk', useCasesEyebrow: 'Quando usarlo', useCasesTitle: 'Un layer MCP per workflow Freshdesk assistiti dall’AI', connectionEyebrow: 'Come si collega', connectionTitle: 'Due modi di eseguirlo', localMode: 'Locale · stdio', remoteMode: 'Remoto · HTTP', localText: 'Il client avvia il server in locale con Claude Desktop, Cursor o Windsurf. Le credenziali restano nelle variabili d’ambiente.', remoteText: 'Un deploy Docker o Railway serve /mcp, con health check su /health. Le credenziali viaggiano per-richiesta via header.', seeConfiguration: 'Vedi la configurazione →', seeInstallation: 'Vedi l’installazione →', ctaTitle: 'Pronto a iniziare?', ctaText: 'Servono solo una API key Freshdesk e un client MCP. Bastano pochi minuti.', installServer: 'Installa il server', githubCode: 'Codice su GitHub', request: 'richiesta', tool: 'tool', response: 'risposta', requestExample: '«Mostrami il ticket #12345 e tutta la sua conversazione»', ticketSubject: 'Errore in fase di login', active: 'attivo', registry: ['Ticket', 'Conversazioni', 'Contatti', 'Aziende', 'Agenti', 'Gruppi', 'Campi', 'Risposte predefinite', 'Knowledge base'].map((label) => ({label, promptLabel: 'Prompt guidati create_ticket e create_reply'})),
    features: [
      {title: '64 tool, naming coerente', body: 'Ogni operazione ha un nome canonico freshdesk_*. Gli alias deprecati mantengono compatibili i client esistenti.'},
      {title: 'Multi-tenant via HTTP', body: 'Un solo deploy può servire più account Freshdesk con credenziali fornite per-richiesta.'},
      {title: 'Modalità read-only', body: 'FRESHDESK_TICKETS_READ_ONLY=true blocca creazione, modifica ed eliminazione dei ticket, mantenendo la lettura.'},
      {title: 'Allegati context-safe', body: 'Metadati e URL degli allegati sono restituiti di default. Il contenuto base64 viene scaricato solo quando serve.'},
      {title: 'Conversazioni complete', body: 'Le conversazioni dei ticket impaginano automaticamente reply pubbliche e note interne in un’unica risposta.'},
      {title: 'ToolAnnotations', body: 'Ogni tool dichiara il comportamento read, write, update o delete per automazioni AI più prudenti.'},
    ],
    useCases: [{title: 'Assistenza clienti', body: 'Recupera ticket, conversazioni e allegati prima di preparare una risposta con il contesto reale.'}, {title: 'Operations interne', body: 'Collega richieste, clienti, agenti, gruppi e aziende mantenendo esplicite le operazioni di scrittura.'}, {title: 'Knowledge base', body: 'Trova articoli esistenti, crea bozze strutturate e mantiene aggiornati i contenuti di supporto.'}],
  },
  es: {
    title: 'Lleva Freshdesk a tu asistente de IA', subtitle: 'freshdesk-mcp expone 64 herramientas y 2 prompts mediante Model Context Protocol: tickets, conversaciones, contactos, empresas, base de conocimientos y campos personalizados en lenguaje natural.', start: 'Empezar', configureClient: 'Configurar cliente', registryEyebrow: 'Registro', registryTitle: '64 herramientas organizadas por dominio', offerEyebrow: 'Qué ofrece', offerTitle: 'Una superficie completa para la API de Freshdesk', useCasesEyebrow: 'Cuándo usarlo', useCasesTitle: 'Una capa MCP para flujos de Freshdesk asistidos por IA', connectionEyebrow: 'Cómo se conecta', connectionTitle: 'Dos formas de ejecutarlo', localMode: 'Local · stdio', remoteMode: 'Remoto · HTTP', localText: 'El cliente inicia el servidor localmente en Claude Desktop, Cursor o Windsurf. Las credenciales permanecen en variables de entorno.', remoteText: 'Un despliegue de Docker o Railway sirve /mcp, con health check en /health. Las credenciales se envían por solicitud mediante cabeceras.', seeConfiguration: 'Ver configuración →', seeInstallation: 'Ver instalación →', ctaTitle: '¿Todo listo para empezar?', ctaText: 'Solo necesitas una API key de Freshdesk y un cliente MCP. Tardarás unos minutos.', installServer: 'Instalar servidor', githubCode: 'Código en GitHub', request: 'solicitud', tool: 'herramienta', response: 'respuesta', requestExample: '«Muéstrame el ticket #12345 y toda su conversación»', ticketSubject: 'Error al iniciar sesión', active: 'activo', registry: ['Tickets', 'Conversaciones', 'Contactos', 'Empresas', 'Agentes', 'Grupos', 'Campos', 'Respuestas predefinidas', 'Base de conocimientos'].map((label) => ({label, promptLabel: 'Prompts guiados create_ticket y create_reply'})),
    features: [{title: '64 herramientas con nombres coherentes', body: 'Cada operación tiene un nombre canónico freshdesk_*. Los alias obsoletos mantienen los clientes existentes.'}, {title: 'Multi-tenant mediante HTTP', body: 'Un único despliegue puede servir varias cuentas de Freshdesk con credenciales por solicitud.'}, {title: 'Modo de solo lectura', body: 'FRESHDESK_TICKETS_READ_ONLY=true bloquea la creación, edición y eliminación de tickets.'}, {title: 'Adjuntos seguros para el contexto', body: 'Los metadatos y URL se devuelven por defecto. El contenido base64 se descarga solo cuando es necesario.'}, {title: 'Conversaciones completas', body: 'Las conversaciones de tickets paginan automáticamente respuestas públicas y notas privadas.'}, {title: 'ToolAnnotations', body: 'Cada herramienta declara el comportamiento read, write, update o delete para automatizaciones más seguras.'}],
    useCases: [{title: 'Atención al cliente', body: 'Recupera tickets, conversaciones y adjuntos antes de preparar una respuesta con el contexto real.'}, {title: 'Operaciones internas', body: 'Conecta solicitudes, clientes, agentes, grupos y empresas manteniendo explícitas las operaciones de escritura.'}, {title: 'Base de conocimientos', body: 'Busca artículos existentes, crea borradores estructurados y mantiene actualizado el contenido de soporte.'}],
  },
  de: {
    title: 'Bringe Freshdesk in deinen KI-Assistenten', subtitle: 'freshdesk-mcp stellt 64 Tools und 2 Prompts über Model Context Protocol bereit: Tickets, Unterhaltungen, Kontakte, Unternehmen, Wissensdatenbank und benutzerdefinierte Felder in natürlicher Sprache.', start: 'Loslegen', configureClient: 'Client konfigurieren', registryEyebrow: 'Register', registryTitle: '64 Tools nach Bereich organisiert', offerEyebrow: 'Funktionsumfang', offerTitle: 'Eine vollständige Schnittstelle zur Freshdesk API', useCasesEyebrow: 'Wann einsetzen', useCasesTitle: 'Eine MCP-Schicht für KI-gestützte Freshdesk-Workflows', connectionEyebrow: 'Verbindung', connectionTitle: 'Zwei Ausführungsarten', localMode: 'Lokal · stdio', remoteMode: 'Remote · HTTP', localText: 'Der Client startet den Server lokal in Claude Desktop, Cursor oder Windsurf. Zugangsdaten bleiben in Umgebungsvariablen.', remoteText: 'Ein Docker- oder Railway-Deployment bedient /mcp, mit Health Check unter /health. Zugangsdaten werden per Header übertragen.', seeConfiguration: 'Konfiguration ansehen →', seeInstallation: 'Installation ansehen →', ctaTitle: 'Bereit für den Start?', ctaText: 'Du benötigst nur einen Freshdesk API key und einen MCP-Client. Das dauert wenige Minuten.', installServer: 'Server installieren', githubCode: 'Code auf GitHub', request: 'Anfrage', tool: 'Tool', response: 'Antwort', requestExample: '„Zeige Ticket #12345 und die gesamte Unterhaltung“', ticketSubject: 'Fehler bei der Anmeldung', active: 'aktiv', registry: ['Tickets', 'Unterhaltungen', 'Kontakte', 'Unternehmen', 'Agenten', 'Gruppen', 'Felder', 'Vordefinierte Antworten', 'Wissensdatenbank'].map((label) => ({label, promptLabel: 'Geführte Prompts create_ticket und create_reply'})),
    features: [{title: '64 Tools mit einheitlichen Namen', body: 'Jede Operation hat einen kanonischen Namen freshdesk_*. Veraltete Aliase halten vorhandene Clients funktionsfähig.'}, {title: 'Multi-Tenant über HTTP', body: 'Ein Deployment kann mehrere Freshdesk-Konten mit anfragebezogenen Zugangsdaten bedienen.'}, {title: 'Nur-Lesen-Modus', body: 'FRESHDESK_TICKETS_READ_ONLY=true blockiert Erstellen, Ändern und Löschen von Tickets.'}, {title: 'Kontextsichere Anhänge', body: 'Metadaten und URLs werden standardmäßig zurückgegeben. Base64-Inhalte werden nur bei Bedarf geladen.'}, {title: 'Vollständige Unterhaltungen', body: 'Ticket-Unterhaltungen enthalten automatisch öffentliche Antworten und private Notizen.'}, {title: 'ToolAnnotations', body: 'Jedes Tool deklariert read, write, update oder delete für sicherere KI-Automatisierungen.'}],
    useCases: [{title: 'Kundensupport', body: 'Rufe Tickets, Unterhaltungen und Anhänge ab, bevor du eine Antwort mit echtem Kontext vorbereitest.'}, {title: 'Interne Abläufe', body: 'Verknüpfe Anfragen, Kunden, Agenten, Gruppen und Unternehmen bei expliziten Schreiboperationen.'}, {title: 'Wissensdatenbank', body: 'Finde vorhandene Artikel, erstelle strukturierte Entwürfe und halte Support-Inhalte aktuell.'}],
  },
  fr: {
    title: 'Intégrez Freshdesk à votre assistant IA', subtitle: 'freshdesk-mcp expose 64 outils et 2 prompts via Model Context Protocol : tickets, conversations, contacts, entreprises, base de connaissances et champs personnalisés en langage naturel.', start: 'Commencer', configureClient: 'Configurer le client', registryEyebrow: 'Registre', registryTitle: '64 outils organisés par domaine', offerEyebrow: 'Fonctionnalités', offerTitle: 'Une surface complète pour l’API Freshdesk', useCasesEyebrow: 'Quand l’utiliser', useCasesTitle: 'Une couche MCP pour les flux Freshdesk assistés par IA', connectionEyebrow: 'Connexion', connectionTitle: 'Deux modes d’exécution', localMode: 'Local · stdio', remoteMode: 'Distant · HTTP', localText: 'Le client démarre le serveur localement dans Claude Desktop, Cursor ou Windsurf. Les identifiants restent dans les variables d’environnement.', remoteText: 'Un déploiement Docker ou Railway sert /mcp, avec un health check sur /health. Les identifiants passent par requête dans les en-têtes.', seeConfiguration: 'Voir la configuration →', seeInstallation: 'Voir l’installation →', ctaTitle: 'Prêt à commencer ?', ctaText: 'Il suffit d’une API key Freshdesk et d’un client MCP. Cela prend quelques minutes.', installServer: 'Installer le serveur', githubCode: 'Code sur GitHub', request: 'requête', tool: 'outil', response: 'réponse', requestExample: '« Montre-moi le ticket #12345 et toute sa conversation »', ticketSubject: 'Erreur de connexion', active: 'actif', registry: ['Tickets', 'Conversations', 'Contacts', 'Entreprises', 'Agents', 'Groupes', 'Champs', 'Réponses prédéfinies', 'Base de connaissances'].map((label) => ({label, promptLabel: 'Prompts guidés create_ticket et create_reply'})),
    features: [{title: '64 outils aux noms cohérents', body: 'Chaque opération possède un nom canonique freshdesk_*. Les alias obsolètes préservent les clients existants.'}, {title: 'Multi-tenant avec HTTP', body: 'Un seul déploiement peut servir plusieurs comptes Freshdesk avec des identifiants fournis par requête.'}, {title: 'Mode lecture seule', body: 'FRESHDESK_TICKETS_READ_ONLY=true bloque la création, la modification et la suppression des tickets.'}, {title: 'Pièces jointes adaptées au contexte', body: 'Les métadonnées et URL sont retournées par défaut. Le contenu base64 est téléchargé uniquement si nécessaire.'}, {title: 'Conversations complètes', body: 'Les conversations de tickets regroupent automatiquement réponses publiques et notes privées.'}, {title: 'ToolAnnotations', body: 'Chaque outil déclare read, write, update ou delete pour des automatisations IA plus sûres.'}],
    useCases: [{title: 'Support client', body: 'Récupérez tickets, conversations et pièces jointes avant de préparer une réponse avec le contexte réel.'}, {title: 'Opérations internes', body: 'Reliez demandes, clients, agents, groupes et entreprises en gardant les écritures explicites.'}, {title: 'Base de connaissances', body: 'Recherchez des articles existants, créez des brouillons structurés et maintenez le contenu de support.'}],
  },
};
