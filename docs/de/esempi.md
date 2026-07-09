---
id: esempi
title: Esempi workflow Freshdesk
description: Esempi pratici per usare Freshdesk MCP in triage ticket, onboarding clienti, campi custom, knowledge base e modalità read-only.
---
# Beispiele

Echte Nutzungsströme, die zeigen, wie die Tools kombiniert werden. Die Beispiele verwenden die kanonischen Namen „freshdesk_*“ und zeigen die an jedes Tool übergebenen Argumente.

## 1. Triage und antworte auf ein Ticket

Suchen Sie nach offenen dringenden Tickets, lesen Sie den Kontext, machen Sie intern Anmerkungen und antworten Sie dem Kunden, und aktualisieren Sie dann den Status.

**Schritt 1 – Suche nach offenen und dringenden Tickets** mit [`freshdesk_search_tickets`](./reference/tickets.md#freshdesk_search_tickets-read):
```json
{ "status": 2, "priority": 4 }
```
**Schritt 2 – Lesen Sie das Ticket mit der Konversation** mit [`freshdesk_get_ticket`](./reference/tickets.md#freshdesk_get_ticket-read):
```json
{ "ticket_id": 980, "include": "conversations,requester" }
```
Alternativ können Sie den gesamten Thread mit [`freshdesk_get_ticket_conversation`](./reference/conversations.md#freshdesk_get_ticket_conversation-read) abrufen:
```json
{ "ticket_id": 980 }
```
**Schritt 3 – Fügen Sie eine interne Notiz hinzu** mit [`freshdesk_create_ticket_note`](./reference/conversations.md#freshdesk_create_ticket_note-write):
```json
{ "ticket_id": 980, "body": "<p>Disservizio confermato sul nodo di produzione. In escalation al gruppo Infrastruttura.</p>" }
```
**Schritt 4 – Dem Kunden antworten** mit [`freshdesk_create_ticket_reply`](./reference/conversazioni.md#freshdesk_create_ticket_reply-write):
```json
{ "ticket_id": 980, "body": "<p>Stiamo lavorando al ripristino del servizio, la aggiorniamo entro un'ora.</p>" }
```
**Schritt 5 – Status zuweisen und aktualisieren** mit [`freshdesk_update_ticket`](./reference/tickets.md#freshdesk_update_ticket-update):
```json
{ "ticket_id": 980, "ticket_fields": { "status": 3, "responder_id": 123, "group_id": 15 } }
```
## 2. Onboarding eines neuen Kunden

Prüfen Sie, ob das Unternehmen existiert, andernfalls erstellen Sie es, erstellen Sie dann den Kontakt und öffnen Sie das erste Ticket.

**Schritt 1 – Suchen Sie nach dem Unternehmen** mit [`freshdesk_search_companies`](./reference/aziende.md#freshdesk_search_companies-read):
```json
{ "query": "acme" }
```
**Schritt 2 – Erstellen Sie das Unternehmen** (falls es nicht existiert) mit [`freshdesk_create_company`](./reference/companies.md#freshdesk_create_company-write):
```json
{ "company": { "name": "Acme S.p.A.", "domains": ["acme.it"], "industry": "Manifatturiero" } }
```
**Schritt 3 – Erstellen Sie den Kontakt**, der mit dem Unternehmen mit [`freshdesk_create_contact`](./reference/contacts.md#freshdesk_create_contact-write) verknüpft ist:
```json
{ "contact": { "name": "Mario Rossi", "email": "mario.rossi@acme.it", "company_id": 3002, "job_title": "IT Manager" } }
```
**Schritt 4 – Öffnen Sie das erste Ticket** mit [`freshdesk_create_ticket`](./reference/tickets.md#freshdesk_create_ticket-write):
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
## 3. Erstellen Sie ein Ticket mit benutzerdefinierten Feldern

Informieren Sie sich vor dem Ausfüllen der benutzerdefinierten Felder über die internen Namen und zulässigen Werte.

**Schritt 1 – Ticketfelder auflisten** mit [`freshdesk_get_ticket_fields`](./reference/tickets.md#freshdesk_get_ticket_fields-read) (keine Argumente) oder ein einzelnes Feld mit [`freshdesk_get_field_properties`](./reference/tickets.md#freshdesk_get_field_properties-read) prüfen:
```json
{ "field_name": "cf_causa" }
```
**Schritt 2 – Erstellen Sie das Ticket**, indem Sie „custom_fields“ mit [`freshdesk_create_ticket`](./reference/tickets.md#freshdesk_create_ticket-write) bewerten:
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
## 4. Veröffentlichen Sie einen Artikel in der Wissensdatenbank

Identifizieren Sie die Kategorie und den Ordner, erstellen Sie dann den Artikel und überprüfen Sie sein Vorhandensein mit der Suche.

**Schritt 1 – Kategorien auflisten** mit [`freshdesk_list_solution_categories`](./reference/solutions.md#freshdesk_list_solution_categories-read) (keine Argumente), dann Ordner mit [`freshdesk_list_solution_folders`](./reference/solutions.md#freshdesk_list_solution_folders-read):
```json
{ "category_id": 402 }
```
**Schritt 2 – Erstellen Sie den veröffentlichten Artikel** mit [`freshdesk_create_solution_article`](./reference/solutions.md#freshdesk_create_solution_article-write):
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
**Schritt 3 – Mit der Suche prüfen** über [`freshdesk_search_solution_articles`](./reference/soluzioni.md#freshdesk_search_solution_articles-read):
```json
{ "query": "password" }
```
## 5. Arbeiten Sie im schreibgeschützten Modus

Für Analysen und Berichte ohne Ticketmutationen starten Sie den Server mit „FRESHDESK_TICKETS_READ_ONLY=true“ (oder dem Header „X-Freshdesk-Tickets-Read-Only: true“). Lesetools – wie [`freshdesk_get_tickets`](./reference/tickets.md#freshdesk_get_tickets-read), [`freshdesk_get_ticket_conversation`](./reference/conversazioni.md#freshdesk_get_ticket_conversation-read) und [`freshdesk_list_contacts`](./reference/contacts.md#freshdesk_list_contacts-read) – bleiben verfügbar; Der Block umfasst auch Antworten, Notizen, Konversationsaktualisierungen und Zusammenfassungen. Schreibvorgänge auf andere Ressourcen als Tickets werden jedoch nicht blockiert.
