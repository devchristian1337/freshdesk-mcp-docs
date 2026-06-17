import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// Sidebar manuale: ordine e categorie coerenti con le pagine in docs/.
const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Guida',
      collapsed: false,
      items: ['installazione', 'configurazione'],
    },
    {
      type: 'category',
      label: 'Reference dei tool',
      collapsed: false,
      items: [
        'reference/overview',
        'reference/tickets',
        'reference/conversazioni',
        'reference/contatti',
        'reference/aziende',
        'reference/agenti',
        'reference/gruppi',
        'reference/campi',
        'reference/risposte-predefinite',
        'reference/soluzioni',
        'reference/prompts',
      ],
    },
    'esempi',
  ],
};

export default sidebars;
