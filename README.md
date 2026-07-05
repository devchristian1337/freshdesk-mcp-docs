# Freshdesk MCP — Documentazione

Sito di documentazione tecnica per [**freshdesk-mcp**](https://github.com/devchristian1337/freshdesk-mcp): applicazione React autonoma (Vite + react-router) con contenuti MDX, prerender statico di ogni pagina, ricerca offline [Pagefind](https://pagefind.app/) e tema chiaro/scuro.

Sito di produzione: **https://freshdesk-mcp.com**

## Sviluppo locale

Requisiti: Node.js ≥ 20.19.

```bash
npm install
npm run dev        # dev server Vite su http://localhost:5173
npm run build      # build completa in build/ (client + prerender + indice di ricerca)
npm run preview    # serve in locale la build di produzione
npm run typecheck  # controllo TypeScript
```

Nota: in `npm run dev` la ricerca non è attiva — l'indice Pagefind viene
generato in build. Per provarla: `npm run build && npm run preview`.

## Pipeline di build

`npm run build` esegue in sequenza:

1. `vite build` — bundle client in `build/`
2. `vite build --ssr` — bundle server temporaneo in `build-ssr/`
3. `scripts/prerender.mjs` — HTML statico per ogni route (+ `404.html`, `sitemap.xml`, meta per pagina)
4. `pagefind --site build` — indice di ricerca in `build/pagefind/`
5. `scripts/check-links.mjs` — verifica dei link interni (build fallita se rotti)

## Deploy su Cloudflare

Il sito è servito come **Workers Static Assets** ([wrangler.jsonc](wrangler.jsonc), asset in `./build`):

```bash
npm run build
npx wrangler deploy
```

In alternativa (Cloudflare Pages, Git integration): build command `npm run build`, output directory `build`, `NODE_VERSION=20.19` o superiore.

## Struttura

```
docs/                    contenuti markdown (MDX: ammessi JSX inline e admonition :::tipo[Titolo])
src/
  content/docs.config.ts struttura sidebar/route (ordine, categorie, etichette)
  content/docs-modules.ts caricamento lazy dei .md
  layouts/               SiteLayout (navbar/footer) e DocLayout (sidebar/articolo/TOC)
  pages/                 Home (landing), DocPage (renderer MDX), NotFound
  components/            Navbar, Footer, Sidebar, Toc, CodeBlock, SearchModal, ...
  styles/                tokens.css (design system) + base.css (tipografia, markdown)
plugins/                 plugin remark custom (admonition, riscrittura link .md)
scripts/                 prerender SSG e verifica link
```

Per aggiungere una pagina: crea il file in `docs/` e aggiungi la voce in
`src/content/docs.config.ts` (sidebar, ordine e route derivano da lì).

I contenuti sono in italiano e descrivono esclusivamente tool e parametri realmente presenti nel codice del server.
