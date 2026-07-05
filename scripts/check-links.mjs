/**
 * Verifica dei link interni sull'HTML prerenderizzato in build/
 * (sostituisce onBrokenLinks: 'throw' di Docusaurus).
 * - link interno verso una pagina inesistente → build fallita (exit 1)
 * - ancora inesistente nella pagina di destinazione → warning
 */
import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';

const buildDir = path.join(process.cwd(), 'build');

/** Raccoglie ricorsivamente tutti i file .html della build. */
async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** Normalizza un pathname di pagina nella chiave della mappa (senza slash finale). */
function pageKey(p) {
  const clean = p.replace(/\/+$/, '');
  return clean === '' ? '/' : clean;
}

const files = await htmlFiles(buildDir);
const pages = new Map(); // pathname -> {html, ids}

for (const file of files) {
  const rel = path.relative(buildDir, file).split(path.sep).join('/');
  const pathname = pageKey(
    '/' + (rel === 'index.html' ? '' : rel.replace(/\/?index\.html$/, '').replace(/\.html$/, '')),
  );
  const html = await readFile(file, 'utf8');
  const ids = new Set(
    [...html.matchAll(/\sid=["']?([^"'\s>]+)/g)].map((m) => m[1]),
  );
  pages.set(pathname, {html, ids});
}

let broken = 0;
let anchorWarnings = 0;

for (const [pathname, {html}] of pages) {
  for (const match of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith('/')) continue; // esterni e ancore locali
    if (href.startsWith('//')) continue;
    const [target, hash] = href.split('#');
    const key = pageKey(target);
    // Asset statici (immagini, pagefind, ecc.): verifica solo pagine.
    if (/\.[a-z0-9]+$/i.test(key) && !key.endsWith('.html')) continue;

    const page = pages.get(key);
    if (!page) {
      console.error(`LINK ROTTO: ${pathname} -> ${href}`);
      broken++;
      continue;
    }
    // Gli href sono percent-encoded, gli id nel DOM no: confronto decodificato.
    const decodedHash = hash ? decodeURIComponent(hash) : hash;
    if (decodedHash && !page.ids.has(decodedHash)) {
      console.warn(`ancora assente: ${pathname} -> ${href}`);
      anchorWarnings++;
    }
  }
}

console.log(
  `check-links: ${pages.size} pagine, ${broken} link rotti, ${anchorWarnings} ancore mancanti`,
);
if (broken > 0) process.exit(1);
