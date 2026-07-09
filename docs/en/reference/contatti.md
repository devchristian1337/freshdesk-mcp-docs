---
id: contatti
title: Tool contatti Freshdesk
description: Reference dei tool contatti Freshdesk MCP per listare, cercare, leggere, creare e aggiornare requester con campi standard e custom.
sidebar_label: Contatti
---
# Contacts

5 tools to list, read, search, create and update contacts.

---

## freshdesk_list_contacts <span className="fd-tag">read</span>

List contacts with optional pagination and filters.

**Alias:** `list_contacts`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `page` | integer | No | `1` |
| `per_page` | integer (1–100) | No | `30` |
| `email` | string | No | `null` |
| `company_id` | integer | No | `null` |
| `updated_since` | string (ISO 8601) | No | `null` |

**Call**
```json
{ "company_id": 3001, "per_page": 50 }
```
**Answer**
```json
{
  "contacts": [
    { "id": 6001, "name": "Mario Rossi", "email": "mario.rossi@acme.it", "company_id": 3001 }
  ],
  "pagination": { "current_page": 1, "next_page": null, "prev_page": null, "per_page": 50 }
}
```
---

## freshdesk_get_contact <span className="fd-tag">read</span>

Retrieve the detail of a contact by ID.

**Alias:** `get_contact`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `contact_id` | integer | Yes | - |

**Answer**
```json
{
  "id": 6001,
  "name": "Mario Rossi",
  "email": "mario.rossi@acme.it",
  "phone": "+39 02 1234567",
  "company_id": 3001,
  "job_title": "IT Manager"
}
```
---

## freshdesk_search_contacts <span className="fd-tag">read</span>

Search contacts by name or email (autocomplete).

**Alias:** `search_contacts`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `query` | string | Yes | - |

**Call**
```json
{ "query": "rossi" }
```
**Answer**
```json
[
  { "id": 6001, "name": "Mario Rossi", "email": "mario.rossi@acme.it" }
]
```
---

## freshdesk_create_contact <span className="fd-tag fd-tag--write">write</span>

Create a new contact.

| Parameter | Type | Required | Default |
|---|---|---|---|
| `contact` | object (ContactCreate) | Yes | - |

**`contact` fields** - `name` is mandatory and requires **at least one** of `email`, `phone`, `mobile`, `twitter_id`, `unique_external_id`:

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | Yes | Full name |
| `email` | string | Conditional | Primary Email |
| `phone` | string | Conditional | Landline |
| `mobile` | string | Conditional | Mobile |
| `twitter_id` | string | Conditional | Twitter handle |
| `unique_external_id` | string | Conditional | Unique External ID |
| `company_id` | integer | No | Company you belong to |
| `job_title` | string | No | Role/qualification |
| `description` | string | No | Contact Notes |
| `custom_fields` | object | No | Custom fields |

**Call**
```json
{
  "contact": {
    "name": "Giulia Bianchi",
    "email": "giulia.bianchi@acme.it",
    "company_id": 3001,
    "job_title": "Responsabile Acquisti"
  }
}
```
**Answer**
```json
{ "id": 6002, "name": "Giulia Bianchi", "email": "giulia.bianchi@acme.it", "company_id": 3001 }
```
---

## freshdesk_update_contact <span className="fd-tag fd-tag--write">update</span>

Update a contact.

**Alias:** `update_contact`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `contact_id` | integer | Yes | - |
| `contact_fields` | object | Yes | - |

Common `contact_fields` keys: `name`, `email`, `phone`, `company_id`, `job_title`, `custom_fields`.

**Call**
```json
{ "contact_id": 6002, "contact_fields": { "job_title": "Direttore Acquisti" } }
```
**Answer**
```json
{ "id": 6002, "name": "Giulia Bianchi", "job_title": "Direttore Acquisti" }
```

