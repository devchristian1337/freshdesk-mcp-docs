import type {ComponentType} from 'react';
import type {Locale} from '../i18n/config';
import type {DocId} from './docs.config';

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

/**
 * Carica il documento nella raccolta specificata. La raccolta italiana
 * conserva i Markdown originali nella radice docs/; le altre sono separate.
 */
export function loadDoc(locale: Locale, id: DocId): Promise<DocModule> {
  const localizedKey = `../../docs/${locale}/${id}.md`;
  const fallbackKey = `../../docs/${id}.md`;
  const loader = locale === 'it' ? modules[fallbackKey] : modules[localizedKey];
  if (!loader) {
    throw new Error(`Documento non trovato: ${localizedKey}`);
  }
  return loader();
}
