import {visit} from 'unist-util-visit';
import type {Root, Parent, PhrasingContent} from 'mdast';

/**
 * Trasforma le container directive (`:::info[Titolo] ... :::`) in markup
 * di admonition puro (hast), senza dipendere da componenti React:
 *
 *   <aside class="admonition admonition--info">
 *     <p class="admonition__title">Titolo</p>
 *     ...contenuto...
 *   </aside>
 *
 * Tipi supportati (con titolo di default in italiano quando assente).
 */

const DEFAULT_TITLES: Record<string, string> = {
  note: 'Nota',
  info: 'Info',
  tip: 'Suggerimento',
  warning: 'Attenzione',
  caution: 'Attenzione',
  danger: 'Pericolo',
};

/** Estrae il testo piano da un sottoalbero mdast (basta per le etichette). */
function textOf(node: {value?: string; children?: unknown[]}): string {
  if (typeof node.value === 'string') return node.value;
  if (Array.isArray(node.children)) {
    return node.children.map((c) => textOf(c as never)).join('');
  }
  return '';
}

type DirectiveNode = Parent & {
  type: 'containerDirective';
  name: string;
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
  };
};

export default function remarkAdmonitions() {
  return (tree: Root) => {
    visit(tree, 'containerDirective', (node: DirectiveNode) => {
      const title = DEFAULT_TITLES[node.name];
      if (!title) return;

      let label = title;
      const first = node.children[0] as
        | (Parent & {data?: {directiveLabel?: boolean}})
        | undefined;
      // La sintassi :::tipo[Etichetta] produce un paragrafo marcato
      // come directiveLabel: lo consumiamo come titolo.
      if (first?.data?.directiveLabel) {
        label = textOf(first) || title;
        node.children.shift();
      }

      node.children.unshift({
        type: 'paragraph',
        data: {hProperties: {className: ['admonition__title']}},
        children: [{type: 'text', value: label} as PhrasingContent],
      } as never);

      const data = (node.data ??= {});
      data.hName = 'aside';
      data.hProperties = {
        className: ['admonition', `admonition--${node.name}`],
      };
    });
  };
}
