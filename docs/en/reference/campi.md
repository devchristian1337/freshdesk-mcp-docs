---
id: campi
title: Tool campi Freshdesk
description: Reference dei tool campi Freshdesk MCP per ticket field, contact field e company field, con lettura, creazione e aggiornamento.
sidebar_label: Campi
---
# Fields

8 tools to manage fields (standard and custom) of tickets, contacts and companies. Ticket fields are managed via admin endpoints.

---

## freshdesk_create_ticket_field <span className="fd-tag fd-tag--write">write</span>

Create a custom ticket field (admin endpoint).

**Alias:** `create_ticket_field`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `ticket_field_fields` | object | Yes | - |

`ticket_field_fields` requires at least `label` and `type` (e.g. `custom_text`, `custom_dropdown`); for dropdowns include `choices`.

**Call**
```json
{
  "ticket_field_fields": {
    "label": "Causa",
    "type": "custom_dropdown",
    "choices": ["Bug", "Configurazione", "Formazione"]
  }
}
```
**Answer**
```json
{ "id": 50, "name": "cf_causa", "label": "Causa", "type": "custom_dropdown" }
```
---

## freshdesk_view_ticket_field <span className="fd-tag">read</span>

Retrieve a ticket field by ID (admin endpoint).

**Alias:** `view_ticket_field`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `ticket_field_id` | integer | Yes | - |

**Answer**
```json
{ "id": 50, "name": "cf_causa", "label": "Causa", "type": "custom_dropdown", "choices": ["Bug", "Configurazione"] }
```
---

## freshdesk_update_ticket_field <span className="fd-tag fd-tag--write">update</span>

Update a custom ticket field (admin endpoint).

**Alias:** `update_ticket_field`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `ticket_field_id` | integer | Yes | - |
| `ticket_field_fields` | object | Yes | - |

Common keys: `label`, `choices`.

**Call**
```json
{ "ticket_field_id": 50, "ticket_field_fields": { "choices": ["Bug", "Configurazione", "Formazione", "Altro"] } }
```
---

## freshdesk_list_contact_fields <span className="fd-tag">read</span>

Lists all contact fields (standard and custom) with internal names.

**Alias:** `list_contact_fields`

No parameters.

**Answer**
```json
[
  { "id": 1, "name": "name", "label": "Nome", "type": "default_name" },
  { "id": 9, "name": "cf_reparto", "label": "Reparto", "type": "custom_text" }
]
```
---

## freshdesk_view_contact_field <span className="fd-tag">read</span>

Retrieve a contact field for ID.

**Alias:** `view_contact_field`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `contact_field_id` | integer | Yes | - |

**Answer**
```json
{ "id": 9, "name": "cf_reparto", "label": "Reparto", "type": "custom_text" }
```
---

## freshdesk_create_contact_field <span className="fd-tag fd-tag--write">write</span>

Create a custom contact field.

**Alias:** `create_contact_field`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `field` | object (ContactFieldCreate) | Yes | - |

**Fields of `field`:**

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `label` | string | Yes | - | Agent side name |
| `label_for_customers` | string | Yes | - | Customer side name |
| `type` | string | Yes | - | One of: `custom_text`, `custom_paragraph`, `custom_checkbox`, `custom_number`, `custom_dropdown`, `custom_phone_number`, `custom_url`, `custom_date` |
| `editable_in_signup` | boolean | No | `false` | Valorable in signup |
| `position` | integer | No | `1` | Field position |
| `required_for_agents` | boolean | No | `false` | Mandatory for agents |
| `customers_can_edit` | boolean | No | `false` | Can be modified by the customer |
| `required_for_customers` | boolean | No | `false` | Mandatory in the portal |
| `displayed_for_customers` | boolean | No | `false` | Visible in the portal |
| `choices` | array of objects | No | `null` | For dropdowns: `[{ "value": "Text", "position": 1 }]` |

**Call**
```json
{
  "field": {
    "label": "Reparto",
    "label_for_customers": "Il tuo reparto",
    "type": "custom_text",
    "required_for_agents": true
  }
}
```
**Answer**
```json
{ "id": 12, "name": "cf_reparto", "label": "Reparto", "type": "custom_text" }
```
---

## freshdesk_update_contact_field <span className="fd-tag fd-tag--write">update</span>

Update a custom contact field.

**Alias:** `update_contact_field`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `contact_field_id` | integer | Yes | - |
| `contact_field_fields` | object | Yes | - |

Common keys: `label`, `choices`.

**Call**
```json
{ "contact_field_id": 12, "contact_field_fields": { "label": "Reparto aziendale" } }
```
---

## freshdesk_list_company_fields <span className="fd-tag">read</span>

Lists all company fields (standard and custom) with internal names.

**Alias:** `list_company_fields`

No parameters.

**Answer**
```json
[
  { "id": 1, "name": "name", "label": "Nome", "type": "default_name" },
  { "id": 5, "name": "cf_settore", "label": "Settore", "type": "custom_dropdown" }
]
```

