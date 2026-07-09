---
id: esempi
title: Esempi workflow Freshdesk
description: Esempi pratici per usare Freshdesk MCP in triage ticket, onboarding clienti, campi custom, knowledge base e modalità read-only.
---
# Exemples

Des flux d'utilisation réels qui montrent comment les outils se combinent. Les exemples utilisent les noms canoniques « freshdesk_* » et montrent les arguments passés à chaque outil.

## 1. Trier et répondre à un ticket

Recherchez les tickets urgents ouverts, lisez le contexte, annotez et répondez en interne au client, puis mettez à jour le statut.

**Étape 1 - Recherchez des tickets ouverts et urgents** avec [`freshdesk_search_tickets`](./reference/tickets.md#freshdesk_search_tickets-read) :
```json
{ "status": 2, "priority": 4 }
```
**Étape 2 - Lisez le ticket avec la conversation** avec [`freshdesk_get_ticket`](./reference/tickets.md#freshdesk_get_ticket-read) :
```json
{ "ticket_id": 980, "include": "conversations,requester" }
```
Vous pouvez également récupérer l'intégralité du fil de discussion avec [`freshdesk_get_ticket_conversation`](./reference/conversations.md#freshdesk_get_ticket_conversation-read) :
```json
{ "ticket_id": 980 }
```
**Étape 3 - Ajoutez une note interne** avec [`freshdesk_create_ticket_note`](./reference/conversations.md#freshdesk_create_ticket_note-write) :
```json
{ "ticket_id": 980, "body": "<p>Disservizio confermato sul nodo di produzione. In escalation al gruppo Infrastruttura.</p>" }
```
**Étape 4 - Répondre au client** avec [`freshdesk_create_ticket_reply`](./reference/conversazioni.md#freshdesk_create_ticket_reply-write) :
```json
{ "ticket_id": 980, "body": "<p>Stiamo lavorando al ripristino del servizio, la aggiorniamo entro un'ora.</p>" }
```
**Étape 5 - Attribuer et mettre à jour le statut** avec [`freshdesk_update_ticket`](./reference/tickets.md#freshdesk_update_ticket-update) :
```json
{ "ticket_id": 980, "ticket_fields": { "status": 3, "responder_id": 123, "group_id": 15 } }
```
## 2. Intégration d'un nouveau client

Vérifiez si l'entreprise existe, sinon créez-la, puis créez le contact et ouvrez le premier ticket.

**Étape 1 - Recherchez l'entreprise** avec [`freshdesk_search_companies`](./reference/aziende.md#freshdesk_search_companies-read) :
```json
{ "query": "acme" }
```
**Étape 2 - Créez l'entreprise** (si elle n'existe pas) avec [`freshdesk_create_company`](./reference/companies.md#freshdesk_create_company-write) :
```json
{ "company": { "name": "Acme S.p.A.", "domains": ["acme.it"], "industry": "Manifatturiero" } }
```
**Étape 3 - Créez le contact** lié à l'entreprise avec [`freshdesk_create_contact`](./reference/contacts.md#freshdesk_create_contact-write) :
```json
{ "contact": { "name": "Mario Rossi", "email": "mario.rossi@acme.it", "company_id": 3002, "job_title": "IT Manager" } }
```
**Étape 4 - Ouvrez le premier ticket** avec [`freshdesk_create_ticket`](./reference/tickets.md#freshdesk_create_ticket-write) :
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
## 3. Créez un ticket avec des champs personnalisés

Avant de remplir les champs personnalisés, renseignez-vous sur les noms internes et les valeurs autorisées.

**Étape 1 : Répertoriez les champs de ticket** avec [`freshdesk_get_ticket_fields`](./reference/tickets.md#freshdesk_get_ticket_fields-read) (sans arguments), ou inspectez un seul champ avec [`freshdesk_get_field_properties`](./reference/tickets.md#freshdesk_get_field_properties-read) :
```json
{ "field_name": "cf_causa" }
```
**Étape 2 - Créez le ticket** en valorisant `custom_fields` avec [`freshdesk_create_ticket`](./reference/tickets.md#freshdesk_create_ticket-write) :
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
## 4. Publier un article dans la base de connaissances

Identifiez la catégorie et le dossier, puis créez l'article et vérifiez sa présence avec la recherche.

**Étape 1 : Répertoriez les catégories** avec [`freshdesk_list_solution_categories`](./reference/solutions.md#freshdesk_list_solution_categories-read) (sans arguments), puis les dossiers avec [`freshdesk_list_solution_folders`](./reference/solutions.md#freshdesk_list_solution_folders-read) :
```json
{ "category_id": 402 }
```
**Étape 2 - Créez l'article publié** avec [`freshdesk_create_solution_article`](./reference/solutions.md#freshdesk_create_solution_article-write) :
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
**Étape 3 - Vérifiez avec la recherche** via [`freshdesk_search_solution_articles`](./reference/soluzioni.md#freshdesk_search_solution_articles-read) :
```json
{ "query": "password" }
```
## 5. Travaillez en mode lecture seule

Pour l'analyse et le reporting sans mutations de ticket, démarrez le serveur avec `FRESHDESK_TICKETS_READ_ONLY=true` (ou l'en-tête `X-Freshdesk-Tickets-Read-Only: true`). Outils de lecture - tels que [`freshdesk_get_tickets`](./reference/tickets.md#freshdesk_get_tickets-read), [`freshdesk_get_ticket_conversation`](./reference/conversazioni.md#freshdesk_get_ticket_conversation-read) et [`freshdesk_list_contacts`](./reference/contacts.md#freshdesk_list_contacts-read) - restent disponibles ; le bloc couvre également les réponses, les notes, les mises à jour et les résumés des conversations. Cependant, il ne bloque pas les écritures sur des ressources autres que les tickets.
