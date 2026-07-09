---
id: esempi
title: Esempi workflow Freshdesk
description: Esempi pratici per usare Freshdesk MCP in triage ticket, onboarding clienti, campi custom, knowledge base e modalità read-only.
---

# Esempi

Flussi d'uso reali che mostrano come i tool si combinano. Gli esempi usano i nomi canonici `freshdesk_*` e mostrano gli argomenti passati a ogni tool.

## 1. Triage e risposta a un ticket

Trova i ticket urgenti aperti, leggi il contesto, annota internamente e rispondi al cliente, poi aggiorna lo stato.

**Passo 1 - Cerca i ticket aperti e urgenti** con [`freshdesk_search_tickets`](./reference/tickets.md#freshdesk_search_tickets-read):

```json
{ "status": 2, "priority": 4 }
```

**Passo 2 - Leggi il ticket con la conversazione** con [`freshdesk_get_ticket`](./reference/tickets.md#freshdesk_get_ticket-read):

```json
{ "ticket_id": 980, "include": "conversations,requester" }
```

In alternativa, recupera l'intero thread con [`freshdesk_get_ticket_conversation`](./reference/conversazioni.md#freshdesk_get_ticket_conversation-read):

```json
{ "ticket_id": 980 }
```

**Passo 3 - Aggiungi una nota interna** con [`freshdesk_create_ticket_note`](./reference/conversazioni.md#freshdesk_create_ticket_note-write):

```json
{ "ticket_id": 980, "body": "<p>Disservizio confermato sul nodo di produzione. In escalation al gruppo Infrastruttura.</p>" }
```

**Passo 4 - Rispondi al cliente** con [`freshdesk_create_ticket_reply`](./reference/conversazioni.md#freshdesk_create_ticket_reply-write):

```json
{ "ticket_id": 980, "body": "<p>Stiamo lavorando al ripristino del servizio, la aggiorniamo entro un'ora.</p>" }
```

**Passo 5 - Assegna e aggiorna lo stato** con [`freshdesk_update_ticket`](./reference/tickets.md#freshdesk_update_ticket-update):

```json
{ "ticket_id": 980, "ticket_fields": { "status": 3, "responder_id": 123, "group_id": 15 } }
```

## 2. Onboarding di un nuovo cliente

Verifica se l'azienda esiste, altrimenti creala, poi crea il contatto e apri il primo ticket.

**Passo 1 - Cerca l'azienda** con [`freshdesk_search_companies`](./reference/aziende.md#freshdesk_search_companies-read):

```json
{ "query": "acme" }
```

**Passo 2 - Crea l'azienda** (se non esiste) con [`freshdesk_create_company`](./reference/aziende.md#freshdesk_create_company-write):

```json
{ "company": { "name": "Acme S.p.A.", "domains": ["acme.it"], "industry": "Manifatturiero" } }
```

**Passo 3 - Crea il contatto** collegato all'azienda con [`freshdesk_create_contact`](./reference/contatti.md#freshdesk_create_contact-write):

```json
{ "contact": { "name": "Mario Rossi", "email": "mario.rossi@acme.it", "company_id": 3002, "job_title": "IT Manager" } }
```

**Passo 4 - Apri il primo ticket** con [`freshdesk_create_ticket`](./reference/tickets.md#freshdesk_create_ticket-write):

```json
{
  "subject": "Attivazione ambiente di test",
  "description": "<p>Richiesta di attivazione dell'ambiente di test per il nuovo cliente.</p>",
  "source": 2,
  "priority": 2,
  "status": 2,
  "email": "mario.rossi@acme.it",
  "additional_fields": { "type": "Question", "group_id": 12 }
}
```

## 3. Creare un ticket con campi custom

Prima di valorizzare i campi custom, scopri i nomi interni e i valori ammessi.

**Passo 1 - Elenca i ticket field** con [`freshdesk_get_ticket_fields`](./reference/tickets.md#freshdesk_get_ticket_fields-read) (nessun argomento), oppure ispeziona un singolo campo con [`freshdesk_get_field_properties`](./reference/tickets.md#freshdesk_get_field_properties-read):

```json
{ "field_name": "cf_causa" }
```

**Passo 2 - Crea il ticket** valorizzando `custom_fields` con [`freshdesk_create_ticket`](./reference/tickets.md#freshdesk_create_ticket-write):

```json
{
  "subject": "Anomalia in stampa referto",
  "description": "<p>Errore durante la generazione del PDF.</p>",
  "source": 2,
  "priority": 3,
  "status": 2,
  "email": "cliente@acme.it",
  "custom_fields": { "cf_causa": "Bug" },
  "additional_fields": { "type": "Incident" }
}
```

## 4. Pubblicare un articolo nella knowledge base

Individua categoria e cartella, poi crea l'articolo e verificane la presenza con la ricerca.

**Passo 1 - Elenca le categorie** con [`freshdesk_list_solution_categories`](./reference/soluzioni.md#freshdesk_list_solution_categories-read) (nessun argomento), poi le cartelle con [`freshdesk_list_solution_folders`](./reference/soluzioni.md#freshdesk_list_solution_folders-read):

```json
{ "category_id": 402 }
```

**Passo 2 - Crea l'articolo pubblicato** con [`freshdesk_create_solution_article`](./reference/soluzioni.md#freshdesk_create_solution_article-write):

```json
{
  "folder_id": 502,
  "article_fields": {
    "title": "Come reimpostare la password",
    "description": "<p>Vai su Impostazioni → Sicurezza e seleziona \"Reimposta password\".</p>",
    "status": 2
  }
}
```

**Passo 3 - Verifica con la ricerca** tramite [`freshdesk_search_solution_articles`](./reference/soluzioni.md#freshdesk_search_solution_articles-read):

```json
{ "query": "password" }
```

## 5. Lavorare in sola lettura

Per analisi e reportistica senza mutazioni sui ticket, avvia il server con `FRESHDESK_TICKETS_READ_ONLY=true` (o l'header `X-Freshdesk-Tickets-Read-Only: true`). I tool di lettura - come [`freshdesk_get_tickets`](./reference/tickets.md#freshdesk_get_tickets-read), [`freshdesk_get_ticket_conversation`](./reference/conversazioni.md#freshdesk_get_ticket_conversation-read) e [`freshdesk_list_contacts`](./reference/contatti.md#freshdesk_list_contacts-read) - restano disponibili; il blocco copre anche reply, note, aggiornamento conversazioni e riepiloghi. Non blocca invece le scritture su risorse diverse dai ticket.
