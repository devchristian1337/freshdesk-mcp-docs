import path from 'node:path';
import {visit} from 'unist-util-visit';
import type {Root, Link} from 'mdast';
import type {VFile} from 'vfile';

/**
 * Riscrive i link relativi tra file markdown (`./reference/tickets.md`,
 * `../installazione.md#sezione`) nelle route pubbliche (`/docs/...`),
 * così i sorgenti in docs/ restano leggibili e navigabili anche su GitHub.
 */
export default function remarkDocLinks() {
  return (tree: Root, file: VFile) => {
    const filePath = file.path;
    if (!filePath) return;

    // Radice dei contenuti: la cartella docs/ che contiene il file.
    const normalized = filePath.split(path.sep).join('/');
    const docsRootIdx = normalized.lastIndexOf('/docs/');
    if (docsRootIdx === -1) return;
    const docsRoot = normalized.slice(0, docsRootIdx + '/docs'.length);
    const fileDir = path.posix.dirname(normalized);

    visit(tree, 'link', (node: Link) => {
      const url = node.url;
      // Solo link relativi a file .md (con eventuale ancora):
      // esclude URL assoluti, con protocollo e ancore pure.
      if (/^[a-z][\w+.-]*:/i.test(url) || url.startsWith('/') || url.startsWith('#')) {
        return;
      }
      const match = url.match(/^([^#?]+)\.mdx?(#.*)?$/);
      if (!match) return;

      const [, target, hash = ''] = match;
      const resolved = path.posix.normalize(path.posix.join(fileDir, target));
      if (!resolved.startsWith(docsRoot + '/')) return;

      const route = '/docs/' + resolved.slice(docsRoot.length + 1);
      node.url = route + hash;
    });
  };
}
