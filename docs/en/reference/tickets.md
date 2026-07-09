---
id: tickets
title: Tool ticket Freshdesk
description: Reference dei tool ticket Freshdesk MCP per lista, ricerca, dettaglio, creazione, aggiornamento, delete, riepiloghi e ticket field.
sidebar_label: Ticket
---
# Tickets

12 tools to list, search, read, create, update and delete tickets, as well as summaries and ticket field properties.

:::info[Reference values]
Several tools use Freshdesk's internal values:

- **source**: `1` email · `2` portal · `3` phone · `7` chat · `9` feedback widget · `10` outbound email
- **priority**: `1` low · `2` medium · `3` high · `4` urgent
- **status**: `2` open · `3` pending · `4` resolved · `5` closed
:::

---

## freshdesk_get_ticket_fields <span className="fd-tag">read</span>

Lists the configured ticket fields (standard and custom) with their allowed values. Useful before creating/updating tickets with custom fields.

**Alias:** `get_ticket_fields`

No parameters.

**Answer** - list of fields with `name` (internal key), `label`, `type` and, for dropdowns, `choices`:
```json
[
  { "id": 1, "name": "status", "label": "Status", "type": "default_status" },
  { "id": 7, "name": "cf_causa", "label": "Causa", "type": "custom_dropdown",
    "choices": ["Bug", "Configurazione", "Formazione"] }
]
```
---

## freshdesk_get_tickets <span className="fd-tag">read</span>

List tickets with simple pagination. To filter use `freshdesk_list_tickets`; for text queries use `freshdesk_search_tickets`.

**Alias:** `get_tickets`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `page` | integer | No | `1` |
| `per_page` | integer (1–100) | No | `30` |
| `include_full` | boolean | No | `false` |

By default each ticket contains only the essential fields for the list and any `custom_fields` filled in. Set `include_full=true` to receive the full payload of each ticket.

**Call**
```json
{ "page": 1, "per_page": 30 }
```
**Answer**
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

List tickets by applying the native filters of the `GET /tickets` endpoint.

| Parameter | Type | Required | Default |
|---|---|---|---|
| `filter_name` | string | No | `null` |
| `requester_id` | integer | No | `null` |
| `company_id` | integer | No | `null` |
| `updated_since` | string (ISO 8601) | No | `null` |
| `order_by` | string | No | `null` |
| `order_type` | string | No | `null` |
| `page` | integer | No | `1` |
| `per_page` | integer (1–100) | No | `30` |
| `include_full` | boolean | No | `false` |

- `filter_name`: `new_and_my_open`, `watching`, `spam`, `deleted`.
- `order_by`: `created_at`, `due_by`, `updated_at`, `status`.
- `order_type`: `asc`, `desc`.
- `include_full`: returns the complete payload of each ticket; by default the server projects the essential fields for the list.

**Call**
```json
{
  "filter_name": "new_and_my_open",
  "updated_since": "2026-01-01T00:00:00Z",
  "order_by": "updated_at",
  "order_type": "desc"
}
```
**Answer**
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

Retrieve a single ticket, with the ability to embed related data.

**Alias:** `get_ticket`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `ticket_id` | integer | Yes | - |
| `include` | string | No | `null` |

`include` accepts comma separated values: `conversations`, `requester`, `company`, `stats`.

**Call**
```json
{ "ticket_id": 12345, "include": "conversations,requester" }
```
**Response** - the ticket object (with the required sections in `include`):
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

Search tickets via structured filters in the `/search/tickets` endpoint. The server builds the Freshdesk DSL, combines filters with `AND`, and handles quoting and date formatting. There is no full-text search on `subject` or `description`; to filter by company or requester use `freshdesk_list_tickets` with `company_id` or `requester_id`.

**Alias:** `search_tickets`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `status` | integer | No | `null` |
| `priority` | integer | No | `null` |
| `agent_id` | integer | No | `null` |
| `group_id` | integer | No | `null` |
| `ticket_type` | string | No | `null` |
| `tag` | string | No | `null` |
| `created_after` | string (`yyyy-mm-dd`) | No | `null` |
| `created_before` | string (`yyyy-mm-dd`) | No | `null` |
| `updated_after` | string (`yyyy-mm-dd`) | No | `null` |
| `updated_before` | string (`yyyy-mm-dd`) | No | `null` |
| `custom_fields` | object | No | `null` |
| `query` | string (advanced DSL) | No | `null` |
| `page` | integer (1–10) | No | `1` |
| `include_full` | boolean | No | `false` |

Provide at least one structured filter or a valid DSL `query`. `query` is an advanced DSL fragment, not free text; if used together with filters it is combined with them via `AND`. In `custom_fields` the `cf_` prefix is ​​automatically added if missing.

**Call**
```json
{ "status": 2, "priority": 4, "group_id": 15, "updated_after": "2026-01-01" }
```
**Answer** - Freshdesk search result:
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

Create a ticket. Subject to [read-only mode](../configuration.md#read-only-mode).

**Alias:** `create_ticket`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `subject` | string | Yes | - |
| `description` | string (HTML) | Yes | - |
| `source` | integer (source) | Yes | - |
| `priority` | integer (priority) | Yes | - |
| `status` | integer (status) | Yes | - |
| `email` | string | Conditional | `null` |
| `requester_id` | integer | Conditional | `null` |
| `custom_fields` | object | No | `null` |
| `additional_fields` | object | No | `null` |

At least one of `email` and `requester_id` is required. `additional_fields` collects other top-level fields (e.g. `{"type": "Question", "group_id": 123}`).

**Call**
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
**Answer**
```json
{ "success": true, "message": "Ticket creato", "ticket": { "id": 12346, "subject": "Problema di fatturazione" } }
```
In case of validation error:
```json
{ "success": false, "error": "Errore di validazione: [{'field': 'email', 'message': '...'}]" }
```
---

## freshdesk_update_ticket <span className="fd-tag fd-tag--write">update</span>

Update the fields of a ticket. Subject to [read-only mode](../configuration.md#read-only-mode).

**Alias:** `update_ticket`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `ticket_id` | integer | Yes | - |
| `ticket_fields` | object | Yes | - |

Common `ticket_fields` keys: `status` (2–5), `priority` (1–4), `group_id`, `responder_id` (submit agent), `type`, `tags` (list), `custom_fields` (dict).

**Call**
```json
{
  "ticket_id": 12345,
  "ticket_fields": { "status": 4, "responder_id": 123, "custom_fields": { "cf_causa": "Bug" } }
}
```
**Answer**
```json
{ "success": true, "message": "Ticket aggiornato", "ticket": { "id": 12345, "status": 4 } }
```
---

## freshdesk_delete_ticket <span className="fd-tag fd-tag--delete">delete</span>

Delete (move to trash) a ticket. Destructive operation, subject to [read-only mode](../configurazione.md#read-only-mode).

**Alias:** `delete_ticket`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `ticket_id` | integer | Yes | - |

**Call**
```json
{ "ticket_id": 12345 }
```
**Answer**
```json
{ "success": true, "message": "Ticket eliminato" }
```
---

## freshdesk_view_ticket_summary <span className="fd-tag">read</span>

Retrieves the summary of a ticket.

**Alias:** `view_ticket_summary`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `ticket_id` | integer | Yes | - |

**Answer**
```json
{ "id": 55, "ticket_id": 12345, "body": "Cliente con importo errato; in attesa di verifica." }
```
---

## freshdesk_update_ticket_summary <span className="fd-tag fd-tag--write">update</span>

Create or update a ticket summary. Subject to [read-only mode](../configuration.md#read-only-mode).

**Alias:** `update_ticket_summary`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `ticket_id` | integer | Yes | - |
| `body` | string | Yes | - |

**Call**
```json
{ "ticket_id": 12345, "body": "Verificato l'importo: emessa nota di credito." }
```
---

## freshdesk_delete_ticket_summary <span className="fd-tag fd-tag--delete">delete</span>

Delete a ticket summary. Destructive operation, subject to [read-only mode](../configurazione.md#read-only-mode).

**Alias:** `delete_ticket_summary`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `ticket_id` | integer | Yes | - |

**Answer**
```json
{ "success": true, "message": "Riepilogo del ticket eliminato" }
```
---

## freshdesk_get_field_properties <span className="fd-tag">read</span>

Retrieves the properties of a specific ticket field by internal name.

**Alias:** `get_field_properties`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `field_name` | string | Yes | - |

The `type` name is automatically mapped to the `ticket_type` system field.

**Call**
```json
{ "field_name": "priority" }
```
**Response** - the matching field object (or `null` if not found):
```json
{
  "id": 3,
  "name": "priority",
  "label": "Priority",
  "type": "default_priority",
  "choices": { "Low": 1, "Medium": 2, "High": 3, "Urgent": 4 }
}
```

