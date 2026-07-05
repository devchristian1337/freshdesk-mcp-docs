---
id: tickets
title: Ticket
description: Reference dei tool sui ticket — lista, ricerca, dettaglio, CRUD, riepiloghi e field.
sidebar_label: Ticket
---

# Ticket

12 tool per elencare, cercare, leggere, creare, aggiornare ed eliminare i ticket, oltre ai riepiloghi (summary) e alle proprietà dei ticket field.

:::info[Valori di riferimento]
Diversi tool usano i valori interni di Freshdesk:

- **source**: `1` email · `2` portal · `3` phone · `7` chat · `9` feedback widget · `10` outbound email
- **priority**: `1` low · `2` medium · `3` high · `4` urgent
- **status**: `2` open · `3` pending · `4` resolved · `5` closed
:::

---

## freshdesk_get_ticket_fields <span className="fd-tag">read</span>

Elenca i ticket field configurati (standard e custom) con i loro valori ammessi. Utile prima di creare/aggiornare ticket con campi custom.

**Alias:** `get_ticket_fields`

Nessun parametro.

**Risposta** — lista di field con `name` (chiave interna), `label`, `type` e, per i dropdown, `choices`:

```json
[
  { "id": 1, "name": "status", "label": "Status", "type": "default_status" },
  { "id": 7, "name": "cf_causa", "label": "Causa", "type": "custom_dropdown",
    "choices": ["Bug", "Configurazione", "Formazione"] }
]
```

---

## freshdesk_get_tickets <span className="fd-tag">read</span>

Elenca i ticket con paginazione semplice. Per filtrare usa `freshdesk_list_tickets`; per query testuali usa `freshdesk_search_tickets`.

**Alias:** `get_tickets`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `page` | integer | No | `1` |
| `per_page` | integer (1–100) | No | `30` |

**Chiamata**

```json
{ "page": 1, "per_page": 30 }
```

**Risposta**

```json
{
  "tickets": [
    { "id": 101, "subject": "Errore in fase di login", "status": 2, "priority": 3 }
  ],
  "pagination": { "current_page": 1, "next_page": 2, "prev_page": null, "per_page": 30 }
}
```

---

## freshdesk_list_tickets <span className="fd-tag">read</span>

Elenca i ticket applicando i filtri nativi dell'endpoint `GET /tickets`.

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `filter_name` | string | No | `null` |
| `requester_id` | integer | No | `null` |
| `company_id` | integer | No | `null` |
| `updated_since` | string (ISO 8601) | No | `null` |
| `order_by` | string | No | `null` |
| `order_type` | string | No | `null` |
| `page` | integer | No | `1` |
| `per_page` | integer (1–100) | No | `30` |

- `filter_name`: `new_and_my_open`, `watching`, `spam`, `deleted`.
- `order_by`: `created_at`, `due_by`, `updated_at`, `status`.
- `order_type`: `asc`, `desc`.

**Chiamata**

```json
{
  "filter_name": "new_and_my_open",
  "updated_since": "2026-01-01T00:00:00Z",
  "order_by": "updated_at",
  "order_type": "desc"
}
```

**Risposta**

```json
{
  "tickets": [
    { "id": 240, "subject": "Richiesta nuova utenza", "status": 3, "updated_at": "2026-06-10T09:12:00Z" }
  ],
  "pagination": { "current_page": 1, "next_page": null, "prev_page": null, "per_page": 30 }
}
```

---

## freshdesk_get_ticket <span className="fd-tag">read</span>

Recupera un singolo ticket, con la possibilità di incorporare dati correlati.

**Alias:** `get_ticket`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `ticket_id` | integer | Sì | — |
| `include` | string | No | `null` |

`include` accetta valori separati da virgola: `conversations`, `requester`, `company`, `stats`.

**Chiamata**

```json
{ "ticket_id": 12345, "include": "conversations,requester" }
```

**Risposta** — l'oggetto ticket (con le sezioni richieste in `include`):

```json
{
  "id": 12345,
  "subject": "Errore in fase di login",
  "status": 2,
  "priority": 3,
  "requester_id": 6001,
  "group_id": 12,
  "tags": ["login", "urgente"],
  "created_at": "2026-06-09T08:30:00Z",
  "updated_at": "2026-06-10T11:05:00Z"
}
```

---

## freshdesk_search_tickets <span className="fd-tag">read</span>

Cerca ticket con la query DSL di Freshdesk (endpoint `/search/tickets`).

**Alias:** `search_tickets`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `query` | string | Sì | — |
| `page` | integer (1–10) | No | `1` |

La ricerca è limitata a 10 pagine / 300 risultati.

**Chiamata**

```json
{ "query": "status:2 AND priority:4", "page": 1 }
```

**Risposta** — risultato della ricerca Freshdesk:

```json
{
  "results": [
    { "id": 980, "subject": "Sistema irraggiungibile", "status": 2, "priority": 4 }
  ],
  "total": 1
}
```

---

## freshdesk_create_ticket <span className="fd-tag fd-tag--write">write</span>

Crea un ticket. Soggetto a [modalità read-only](../configurazione.md#modalità-read-only).

**Alias:** `create_ticket`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `subject` | string | Sì | — |
| `description` | string (HTML) | Sì | — |
| `source` | integer (source) | Sì | — |
| `priority` | integer (priority) | Sì | — |
| `status` | integer (status) | Sì | — |
| `email` | string | Condizionale | `null` |
| `requester_id` | integer | Condizionale | `null` |
| `custom_fields` | object | No | `null` |
| `additional_fields` | object | No | `null` |

È obbligatorio almeno uno tra `email` e `requester_id`. `additional_fields` raccoglie altri campi top-level (es. `{"type": "Question", "group_id": 123}`).

**Chiamata**

```json
{
  "subject": "Problema di fatturazione",
  "description": "<p>Il cliente segnala un importo errato.</p>",
  "source": 2,
  "priority": 3,
  "status": 2,
  "email": "cliente@acme.it",
  "additional_fields": { "type": "Question", "group_id": 12 }
}
```

**Risposta**

```json
{ "success": true, "message": "Ticket creato", "ticket": { "id": 12346, "subject": "Problema di fatturazione" } }
```

In caso di errore di validazione:

```json
{ "success": false, "error": "Errore di validazione: [{'field': 'email', 'message': '...'}]" }
```

---

## freshdesk_update_ticket <span className="fd-tag fd-tag--write">update</span>

Aggiorna i campi di un ticket. Soggetto a [modalità read-only](../configurazione.md#modalità-read-only).

**Alias:** `update_ticket`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `ticket_id` | integer | Sì | — |
| `ticket_fields` | object | Sì | — |

Chiavi comuni di `ticket_fields`: `status` (2–5), `priority` (1–4), `group_id`, `responder_id` (agente assegnatario), `type`, `tags` (lista), `custom_fields` (dict).

**Chiamata**

```json
{
  "ticket_id": 12345,
  "ticket_fields": { "status": 4, "responder_id": 123, "custom_fields": { "cf_causa": "Bug" } }
}
```

**Risposta**

```json
{ "success": true, "message": "Ticket aggiornato", "ticket": { "id": 12345, "status": 4 } }
```

---

## freshdesk_delete_ticket <span className="fd-tag fd-tag--delete">delete</span>

Elimina (sposta nel cestino) un ticket. Operazione distruttiva, soggetta a [modalità read-only](../configurazione.md#modalità-read-only).

**Alias:** `delete_ticket`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `ticket_id` | integer | Sì | — |

**Chiamata**

```json
{ "ticket_id": 12345 }
```

**Risposta**

```json
{ "success": true, "message": "Ticket eliminato" }
```

---

## freshdesk_view_ticket_summary <span className="fd-tag">read</span>

Recupera il riepilogo (summary) di un ticket.

**Alias:** `view_ticket_summary`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `ticket_id` | integer | Sì | — |

**Risposta**

```json
{ "id": 55, "ticket_id": 12345, "body": "Cliente con importo errato; in attesa di verifica." }
```

---

## freshdesk_update_ticket_summary <span className="fd-tag fd-tag--write">update</span>

Crea o aggiorna il riepilogo di un ticket. Soggetto a [modalità read-only](../configurazione.md#modalità-read-only).

**Alias:** `update_ticket_summary`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `ticket_id` | integer | Sì | — |
| `body` | string | Sì | — |

**Chiamata**

```json
{ "ticket_id": 12345, "body": "Verificato l'importo: emessa nota di credito." }
```

---

## freshdesk_delete_ticket_summary <span className="fd-tag fd-tag--delete">delete</span>

Elimina il riepilogo di un ticket. Operazione distruttiva, soggetta a [modalità read-only](../configurazione.md#modalità-read-only).

**Alias:** `delete_ticket_summary`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `ticket_id` | integer | Sì | — |

**Risposta**

```json
{ "success": true, "message": "Riepilogo del ticket eliminato" }
```

---

## freshdesk_get_field_properties <span className="fd-tag">read</span>

Recupera le proprietà di uno specifico ticket field per nome interno.

**Alias:** `get_field_properties`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `field_name` | string | Sì | — |

Il nome `type` viene mappato automaticamente sul campo di sistema `ticket_type`.

**Chiamata**

```json
{ "field_name": "priority" }
```

**Risposta** — l'oggetto field corrispondente (o `null` se non trovato):

```json
{
  "id": 3,
  "name": "priority",
  "label": "Priority",
  "type": "default_priority",
  "choices": { "Low": 1, "Medium": 2, "High": 3, "Urgent": 4 }
}
```
