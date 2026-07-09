---
id: esempi
title: Esempi workflow Freshdesk
description: Esempi pratici per usare Freshdesk MCP in triage ticket, onboarding clienti, campi custom, knowledge base e modalità read-only.
---
# Ejemplos

Flujos de uso reales que muestran cómo se combinan las herramientas. Los ejemplos utilizan los nombres canónicos `freshdesk_*` y muestran los argumentos pasados ​​a cada herramienta.

## 1. Clasificar y responder a un ticket

Encuentre tickets urgentes abiertos, lea el contexto, realice anotaciones internas y responda al cliente, luego actualice el estado.

**Paso 1: busque tickets abiertos y urgentes** con [`freshdesk_search_tickets`](./reference/tickets.md#freshdesk_search_tickets-read):
```json
{ "status": 2, "priority": 4 }
```
**Paso 2: lea el ticket con la conversación** con [`freshdesk_get_ticket`](./reference/tickets.md#freshdesk_get_ticket-read):
```json
{ "ticket_id": 980, "include": "conversations,requester" }
```
Alternativamente, obtenga el hilo completo con [`freshdesk_get_ticket_conversation`](./reference/conversations.md#freshdesk_get_ticket_conversation-read):
```json
{ "ticket_id": 980 }
```
**Paso 3: agregue una nota interna** con [`freshdesk_create_ticket_note`](./reference/conversations.md#freshdesk_create_ticket_note-write):
```json
{ "ticket_id": 980, "body": "<p>Disservizio confermato sul nodo di produzione. In escalation al gruppo Infrastruttura.</p>" }
```
**Paso 4: Responder al cliente** con [`freshdesk_create_ticket_reply`](./reference/conversazioni.md#freshdesk_create_ticket_reply-write):
```json
{ "ticket_id": 980, "body": "<p>Stiamo lavorando al ripristino del servizio, la aggiorniamo entro un'ora.</p>" }
```
**Paso 5: Asigne y actualice el estado** con [`freshdesk_update_ticket`](./reference/tickets.md#freshdesk_update_ticket-update):
```json
{ "ticket_id": 980, "ticket_fields": { "status": 3, "responder_id": 123, "group_id": 15 } }
```
## 2. Incorporación de un nuevo cliente

Verifique si la empresa existe, de lo contrario créela, luego cree el contacto y abra el primer ticket.

**Paso 1: busque la empresa** con [`freshdesk_search_companies`](./reference/aziende.md#freshdesk_search_companies-read):
```json
{ "query": "acme" }
```
**Paso 2: cree la empresa** (si no existe) con [`freshdesk_create_company`](./reference/companies.md#freshdesk_create_company-write):
```json
{ "company": { "name": "Acme S.p.A.", "domains": ["acme.it"], "industry": "Manifatturiero" } }
```
**Paso 3: cree el contacto** vinculado a la empresa con [`freshdesk_create_contact`](./reference/contacts.md#freshdesk_create_contact-write):
```json
{ "contact": { "name": "Mario Rossi", "email": "mario.rossi@acme.it", "company_id": 3002, "job_title": "IT Manager" } }
```
**Paso 4: abra el primer ticket** con [`freshdesk_create_ticket`](./reference/tickets.md#freshdesk_create_ticket-write):
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
## 3. Crea un ticket con campos personalizados

Antes de completar los campos personalizados, averigüe los nombres internos y los valores permitidos.

**Paso 1: enumere los campos del ticket** con [`freshdesk_get_ticket_fields`](./reference/tickets.md#freshdesk_get_ticket_fields-read) (sin argumentos), o inspeccione un solo campo con [`freshdesk_get_field_properties`](./reference/tickets.md#freshdesk_get_field_properties-read):
```json
{ "field_name": "cf_causa" }
```
**Paso 2: cree el ticket** valorando `custom_fields` con [`freshdesk_create_ticket`](./reference/tickets.md#freshdesk_create_ticket-write):
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
## 4. Publicar un artículo en la base de conocimientos.

Identifique la categoría y carpeta, luego cree el artículo y verifique su presencia con la búsqueda.

**Paso 1: enumerar las categorías** con [`freshdesk_list_solution_categories`](./reference/solutions.md#freshdesk_list_solution_categories-read) (sin argumentos), luego las carpetas con [`freshdesk_list_solution_folders`](./reference/solutions.md#freshdesk_list_solution_folders-read):
```json
{ "category_id": 402 }
```
**Paso 2: cree el artículo publicado** con [`freshdesk_create_solution_article`](./reference/solutions.md#freshdesk_create_solution_article-write):
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
**Paso 3: verifique con la búsqueda** a través de [`freshdesk_search_solution_articles`](./reference/soluzioni.md#freshdesk_search_solution_articles-read):
```json
{ "query": "password" }
```
## 5. Trabajar en modo de solo lectura

Para análisis e informes sin mutaciones de tickets, inicie el servidor con `FRESHDESK_TICKETS_READ_ONLY=true` (o el encabezado `X-Freshdesk-Tickets-Read-Only: true`). Herramientas de lectura, como [`freshdesk_get_tickets`](./reference/tickets.md#freshdesk_get_tickets-read), [`freshdesk_get_ticket_conversation`](./reference/conversazioni.md#freshdesk_get_ticket_conversation-read) y [`freshdesk_list_contacts`](./reference/contacts.md#freshdesk_list_contacts-read) - permanece disponible; el bloque también cubre respuestas, notas, actualizaciones de conversaciones y resúmenes. Sin embargo, no bloquea las escrituras en recursos distintos de los tickets.
