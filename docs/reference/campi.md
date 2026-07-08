---
id: campi
title: Tool campi Freshdesk
description: Reference dei tool campi Freshdesk MCP per ticket field, contact field e company field, con lettura, creazione e aggiornamento.
sidebar_label: Campi
---

# Campi

8 tool per gestire i field (standard e custom) di ticket, contatti e aziende. I ticket field si gestiscono tramite gli endpoint admin.

---

## freshdesk_create_ticket_field <span className="fd-tag fd-tag--write">write</span>

Crea un ticket field custom (endpoint admin).

**Alias:** `create_ticket_field`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `ticket_field_fields` | object | Sì | - |

`ticket_field_fields` richiede almeno `label` e `type` (es. `custom_text`, `custom_dropdown`); per i dropdown includere `choices`.

**Chiamata**

```json
{
  "ticket_field_fields": {
    "label": "Causa",
    "type": "custom_dropdown",
    "choices": ["Bug", "Configurazione", "Formazione"]
  }
}
```

**Risposta**

```json
{ "id": 50, "name": "cf_causa", "label": "Causa", "type": "custom_dropdown" }
```

---

## freshdesk_view_ticket_field <span className="fd-tag">read</span>

Recupera un ticket field per ID (endpoint admin).

**Alias:** `view_ticket_field`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `ticket_field_id` | integer | Sì | - |

**Risposta**

```json
{ "id": 50, "name": "cf_causa", "label": "Causa", "type": "custom_dropdown", "choices": ["Bug", "Configurazione"] }
```

---

## freshdesk_update_ticket_field <span className="fd-tag fd-tag--write">update</span>

Aggiorna un ticket field custom (endpoint admin).

**Alias:** `update_ticket_field`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `ticket_field_id` | integer | Sì | - |
| `ticket_field_fields` | object | Sì | - |

Chiavi comuni: `label`, `choices`.

**Chiamata**

```json
{ "ticket_field_id": 50, "ticket_field_fields": { "choices": ["Bug", "Configurazione", "Formazione", "Altro"] } }
```

---

## freshdesk_list_contact_fields <span className="fd-tag">read</span>

Elenca tutti i contact field (standard e custom) con i nomi interni.

**Alias:** `list_contact_fields`

Nessun parametro.

**Risposta**

```json
[
  { "id": 1, "name": "name", "label": "Nome", "type": "default_name" },
  { "id": 9, "name": "cf_reparto", "label": "Reparto", "type": "custom_text" }
]
```

---

## freshdesk_view_contact_field <span className="fd-tag">read</span>

Recupera un contact field per ID.

**Alias:** `view_contact_field`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `contact_field_id` | integer | Sì | - |

**Risposta**

```json
{ "id": 9, "name": "cf_reparto", "label": "Reparto", "type": "custom_text" }
```

---

## freshdesk_create_contact_field <span className="fd-tag fd-tag--write">write</span>

Crea un contact field custom.

**Alias:** `create_contact_field`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `field` | object (ContactFieldCreate) | Sì | - |

**Campi di `field`:**

| Campo | Tipo | Obbligatorio | Default | Note |
|---|---|---|---|---|
| `label` | string | Sì | - | Nome lato agenti |
| `label_for_customers` | string | Sì | - | Nome lato clienti |
| `type` | string | Sì | - | Uno tra: `custom_text`, `custom_paragraph`, `custom_checkbox`, `custom_number`, `custom_dropdown`, `custom_phone_number`, `custom_url`, `custom_date` |
| `editable_in_signup` | boolean | No | `false` | Valorizzabile in signup |
| `position` | integer | No | `1` | Posizione del campo |
| `required_for_agents` | boolean | No | `false` | Obbligatorio per gli agenti |
| `customers_can_edit` | boolean | No | `false` | Modificabile dal cliente |
| `required_for_customers` | boolean | No | `false` | Obbligatorio nel portale |
| `displayed_for_customers` | boolean | No | `false` | Visibile nel portale |
| `choices` | array di object | No | `null` | Per i dropdown: `[{ "value": "Testo", "position": 1 }]` |

**Chiamata**

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

**Risposta**

```json
{ "id": 12, "name": "cf_reparto", "label": "Reparto", "type": "custom_text" }
```

---

## freshdesk_update_contact_field <span className="fd-tag fd-tag--write">update</span>

Aggiorna un contact field custom.

**Alias:** `update_contact_field`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `contact_field_id` | integer | Sì | - |
| `contact_field_fields` | object | Sì | - |

Chiavi comuni: `label`, `choices`.

**Chiamata**

```json
{ "contact_field_id": 12, "contact_field_fields": { "label": "Reparto aziendale" } }
```

---

## freshdesk_list_company_fields <span className="fd-tag">read</span>

Elenca tutti i company field (standard e custom) con i nomi interni.

**Alias:** `list_company_fields`

Nessun parametro.

**Risposta**

```json
[
  { "id": 1, "name": "name", "label": "Nome", "type": "default_name" },
  { "id": 5, "name": "cf_settore", "label": "Settore", "type": "custom_dropdown" }
]
```
