# Freshdesk MCP — Documentazione

Sito di documentazione tecnica per [**freshdesk-mcp**](https://github.com/devchristian1337/freshdesk-mcp), costruito con [Docusaurus](https://docusaurus.io/) (preset classic, TypeScript) con tema Warm Modern, dark mode e ricerca locale offline (`@easyops-cn/docusaurus-search-local`).

Sito di produzione: **https://freshdesk-mcp.com**

## Sviluppo locale

Requisiti: Node.js ≥ 20.

```bash
npm install        # installa le dipendenze (incl. il plugin di ricerca)
npm start          # dev server con hot reload su http://localhost:3000
npm run build      # genera il sito statico nella cartella build/
npm run serve      # serve in locale la build di produzione
```

## Deploy su Cloudflare Pages

Collega il repository a Cloudflare Pages e usa questi parametri:

| Impostazione | Valore |
|---|---|
| **Framework preset** | None (Docusaurus) |
| **Build command** | `npm run build` |
| **Build output directory** | `build` |
| **Root directory** | `freshdesk-mcp-docs` (se il repo contiene anche altro) |
| **Node version** | `20` o superiore (variabile d'ambiente `NODE_VERSION`) |

Il routing lato client è gestito da [`static/_redirects`](static/_redirects) (`/* /index.html 200`), copiato automaticamente in `build/` durante la build.

### Dominio custom

`url` e `baseUrl` in [`docusaurus.config.ts`](docusaurus.config.ts) sono impostati per il dominio **freshdesk-mcp.com** (`baseUrl: '/'`). Per cambiarli, aggiorna i campi `url`/`baseUrl` e ridistribuisci.

## Struttura

```
docs/
  intro.md, installazione.md, configurazione.md, esempi.md
  reference/   overview + 9 categorie di tool + prompts
src/
  pages/index.tsx      landing Warm Modern
  css/custom.css        tema (palette, font, dark mode)
  components/Reveal/    scroll-reveal accessibile
static/_redirects       fallback SPA per Cloudflare Pages
```

I contenuti sono in italiano e descrivono esclusivamente tool e parametri realmente presenti nel codice del server.
