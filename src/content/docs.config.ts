import {uiCopy} from '../i18n/copy';
import type {Locale} from '../i18n/config';

export type DocId =
  | 'intro'
  | 'installazione'
  | 'configurazione'
  | 'reference/overview'
  | 'reference/tickets'
  | 'reference/conversazioni'
  | 'reference/contatti'
  | 'reference/aziende'
  | 'reference/agenti'
  | 'reference/gruppi'
  | 'reference/campi'
  | 'reference/risposte-predefinite'
  | 'reference/soluzioni'
  | 'reference/prompts'
  | 'esempi';

export type DocRef = {id: DocId; label: string};
export type SidebarSection = {label?: string; items: DocRef[]};

/** Struttura stabile delle route; cambia soltanto il testo mostrato. */
export function sidebarSections(locale: Locale): SidebarSection[] {
  const t = uiCopy[locale];
  return [
    {items: [{id: 'intro', label: t.introduction}]},
    {
      label: t.guide,
      items: [
        {id: 'installazione', label: t.installation},
        {id: 'configurazione', label: t.configuration},
      ],
    },
    {
      label: t.footerReference,
      items: [
        {id: 'reference/overview', label: t.overview},
        {id: 'reference/tickets', label: t.tickets},
        {id: 'reference/conversazioni', label: t.conversations},
        {id: 'reference/contatti', label: t.contacts},
        {id: 'reference/aziende', label: t.companies},
        {id: 'reference/agenti', label: t.agents},
        {id: 'reference/gruppi', label: t.groups},
        {id: 'reference/campi', label: t.fields},
        {id: 'reference/risposte-predefinite', label: t.cannedResponses},
        {id: 'reference/soluzioni', label: t.solutions},
        {id: 'reference/prompts', label: t.prompts},
      ],
    },
    {items: [{id: 'esempi', label: t.examples}]},
  ];
}

export function orderedDocs(locale: Locale): DocRef[] {
  return sidebarSections(locale).flatMap((section) => section.items);
}

export function sectionOf(locale: Locale, id: DocId): SidebarSection | undefined {
  return sidebarSections(locale).find((section) => section.items.some((doc) => doc.id === id));
}

export function docRefOf(locale: Locale, id: DocId): DocRef | undefined {
  return orderedDocs(locale).find((doc) => doc.id === id);
}

export function prevNextOf(locale: Locale, id: DocId): {prev?: DocRef; next?: DocRef} {
  const docs = orderedDocs(locale);
  const index = docs.findIndex((doc) => doc.id === id);
  return index === -1 ? {} : {prev: docs[index - 1], next: docs[index + 1]};
}
