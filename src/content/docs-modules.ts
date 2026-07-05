import type {ComponentType} from 'react';

/** Forma di un modulo markdown compilato dalla pipeline MDX. */
export type DocModule = {
  default: ComponentType<{components?: Record<string, unknown>}>;
  frontmatter: {
    id?: string;
    title?: string;
    description?: string;
    sidebar_label?: string;
    slug?: string;
  };
  tableOfContents: {
    value: string;
    depth: number;
    id?: string;
    children?: DocModule['tableOfContents'];
  }[];
};

/**
 * Tutti i .md di docs/, lazy: un chunk per documento.
 * Le chiavi dei glob usano sempre '/' (anche su Windows).
 */
const modules = import.meta.glob('../../docs/**/*.md') as Record<
  string,
  () => Promise<DocModule>
>;

/** Carica il modulo del documento con l'id dato (es. "reference/tickets"). */
export function loadDoc(id: string): Promise<DocModule> {
  const loader = modules[`../../docs/${id}.md`];
  if (!loader) {
    throw new Error(`Documento non trovato: docs/${id}.md`);
  }
  return loader();
}
