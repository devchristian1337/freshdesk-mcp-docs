/**
 * Struttura della documentazione (ex sidebars.ts): ordine, categorie ed
 * etichette. Fonte unica per sidebar, breadcrumbs, paginazione prev/next
 * e per l'elenco delle route da prerenderizzare.
 */

export type DocRef = {
  /** Percorso relativo a docs/ senza estensione: è anche la route /docs/<id>. */
  id: string;
  /** Etichetta mostrata in sidebar, breadcrumbs e paginazione. */
  label: string;
};

export type SidebarSection = {
  /** Titolo della categoria; assente per le voci di primo livello. */
  label?: string;
  items: DocRef[];
};

export const sidebarSections: SidebarSection[] = [
  {
    items: [{id: 'intro', label: 'Introduzione'}],
  },
  {
    label: 'Guida',
    items: [
      {id: 'installazione', label: 'Installazione'},
      {id: 'configurazione', label: 'Configurazione'},
    ],
  },
  {
    label: 'Reference dei tool',
    items: [
      {id: 'reference/overview', label: 'Panoramica'},
      {id: 'reference/tickets', label: 'Ticket'},
      {id: 'reference/conversazioni', label: 'Conversazioni'},
      {id: 'reference/contatti', label: 'Contatti'},
      {id: 'reference/aziende', label: 'Aziende'},
      {id: 'reference/agenti', label: 'Agenti'},
      {id: 'reference/gruppi', label: 'Gruppi'},
      {id: 'reference/campi', label: 'Campi'},
      {id: 'reference/risposte-predefinite', label: 'Risposte predefinite'},
      {id: 'reference/soluzioni', label: 'Knowledge base'},
      {id: 'reference/prompts', label: 'Prompt'},
    ],
  },
  {
    items: [{id: 'esempi', label: 'Esempi'}],
  },
];

/** Elenco piatto e ordinato: definisce prev/next e le route dei documenti. */
export const orderedDocs: DocRef[] = sidebarSections.flatMap((s) => s.items);

/** Categoria di appartenenza (per le breadcrumbs); undefined per il primo livello. */
export function sectionOf(id: string): SidebarSection | undefined {
  return sidebarSections.find((s) => s.items.some((d) => d.id === id));
}

export function docRefOf(id: string): DocRef | undefined {
  return orderedDocs.find((d) => d.id === id);
}

export function prevNextOf(id: string): {prev?: DocRef; next?: DocRef} {
  const i = orderedDocs.findIndex((d) => d.id === id);
  if (i === -1) return {};
  return {prev: orderedDocs[i - 1], next: orderedDocs[i + 1]};
}
