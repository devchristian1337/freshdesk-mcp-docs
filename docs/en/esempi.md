---
id: esempi
title: Esempi workflow Freshdesk
description: Esempi pratici per usare Freshdesk MCP in triage ticket, onboarding clienti, campi custom, knowledge base e modalità read-only.
---
# Examples

Real usage flows that show how the tools combine. The examples use the canonical names `freshdesk_*` and show the arguments passed to each tool.

## 1. Triage and respond to a ticket

Find open urgent tickets, read the context, internally annotate and respond to the customer, then update the status.

**Step 1 - Search for open and urgent tickets** with [`freshdesk_search_tickets`](./reference/tickets.md#freshdesk_search_tickets-read):
```json
{ "status": 2, "priority": 4 }
```
**Step 2 - Read the ticket with the conversation** with [`freshdesk_get_ticket`](./reference/tickets.md#freshdesk_get_ticket-read):
```json
{ "ticket_id": 980, "include": "conversations,requester" }
```
Alternatively, fetch the entire thread with [`freshdesk_get_ticket_conversation`](./reference/conversations.md#freshdesk_get_ticket_conversation-read):
```json
{ "ticket_id": 980 }
```
**Step 3 - Add an internal note** with [`freshdesk_create_ticket_note`](./reference/conversations.md#freshdesk_create_ticket_note-write):
```json
{ "ticket_id": 980, "body": "<p>Disservizio confermato sul nodo di produzione. In escalation al gruppo Infrastruttura.</p>" }
```
**Step 4 - Reply to customer** with [`freshdesk_create_ticket_reply`](./reference/conversazioni.md#freshdesk_create_ticket_reply-write):
```json
{ "ticket_id": 980, "body": "<p>Stiamo lavorando al ripristino del servizio, la aggiorniamo entro un'ora.</p>" }
```
**Step 5 - Assign and update status** with [`freshdesk_update_ticket`](./reference/tickets.md#freshdesk_update_ticket-update):
```json
{ "ticket_id": 980, "ticket_fields": { "status": 3, "responder_id": 123, "group_id": 15 } }
```
## 2. Onboarding a new client

Check if the company exists, otherwise create it, then create the contact and open the first ticket.

**Step 1 - Search for the company** with [`freshdesk_search_companies`](./reference/aziende.md#freshdesk_search_companies-read):
```json
{ "query": "acme" }
```
**Step 2 - Create the company** (if it doesn't exist) with [`freshdesk_create_company`](./reference/companies.md#freshdesk_create_company-write):
```json
{ "company": { "name": "Acme S.p.A.", "domains": ["acme.it"], "industry": "Manifatturiero" } }
```
**Step 3 - Create the contact** linked to the company with [`freshdesk_create_contact`](./reference/contacts.md#freshdesk_create_contact-write):
```json
{ "contact": { "name": "Mario Rossi", "email": "mario.rossi@acme.it", "company_id": 3002, "job_title": "IT Manager" } }
```
**Step 4 - Open the first ticket** with [`freshdesk_create_ticket`](./reference/tickets.md#freshdesk_create_ticket-write):
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
## 3. Create a ticket with custom fields

Before completing the custom fields, find out the internal names and allowed values.

**Step 1 - List ticket fields** with [`freshdesk_get_ticket_fields`](./reference/tickets.md#freshdesk_get_ticket_fields-read) (no arguments), or inspect a single field with [`freshdesk_get_field_properties`](./reference/tickets.md#freshdesk_get_field_properties-read):
```json
{ "field_name": "cf_causa" }
```
**Step 2 - Create the ticket** by valuing `custom_fields` with [`freshdesk_create_ticket`](./reference/tickets.md#freshdesk_create_ticket-write):
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
## 4. Publish an article to the knowledge base

Identify the category and folder, then create the article and check its presence with the search.

**Step 1 - List categories** with [`freshdesk_list_solution_categories`](./reference/solutions.md#freshdesk_list_solution_categories-read) (no arguments), then folders with [`freshdesk_list_solution_folders`](./reference/solutions.md#freshdesk_list_solution_folders-read):
```json
{ "category_id": 402 }
```
**Step 2 - Create the published article** with [`freshdesk_create_solution_article`](./reference/solutions.md#freshdesk_create_solution_article-write):
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
**Step 3 - Check with search** via [`freshdesk_search_solution_articles`](./reference/soluzioni.md#freshdesk_search_solution_articles-read):
```json
{ "query": "password" }
```
## 5. Work in read-only mode

For analysis and reporting without ticket mutations, start the server with `FRESHDESK_TICKETS_READ_ONLY=true` (or the `X-Freshdesk-Tickets-Read-Only: true` header). Reading tools - such as [`freshdesk_get_tickets`](./reference/tickets.md#freshdesk_get_tickets-read), [`freshdesk_get_ticket_conversation`](./reference/conversazioni.md#freshdesk_get_ticket_conversation-read) and [`freshdesk_list_contacts`](./reference/contacts.md#freshdesk_list_contacts-read) - remain available; the block also covers replies, notes, conversation updates and summaries. However, it does not block writes to resources other than tickets.
