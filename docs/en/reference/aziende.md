---
id: aziende
title: Tool aziende Freshdesk
description: Reference dei tool aziende Freshdesk MCP per listare, cercare, leggere, creare e aggiornare company, domini e campi account.
sidebar_label: Aziende
---
# Companies

5 tools to list, read, search, create and update companies.

---

## freshdesk_list_companies <span className="fd-tag">read</span>

Lists companies with pagination.

**Alias:** `list_companies`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `page` | integer | No | `1` |
| `per_page` | integer (1–100) | No | `30` |

**Answer**
```json
{
  "companies": [
    { "id": 3001, "name": "Acme S.p.A.", "domains": ["acme.it"] }
  ],
  "pagination": { "current_page": 1, "next_page": null, "prev_page": null, "per_page": 30 }
}
```
---

## freshdesk_view_company <span className="fd-tag">read</span>

Retrieve the detail of a company by ID.

**Alias:** `view_company`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `company_id` | integer | Yes | - |

**Answer**
```json
{
  "id": 3001,
  "name": "Acme S.p.A.",
  "domains": ["acme.it"],
  "industry": "Manifatturiero",
  "account_tier": "Premium"
}
```
---

## freshdesk_search_companies <span className="fd-tag">read</span>

Search for companies by name (autocomplete). Merge the old `search_companies` and `find_company_by_name`.

**Alias:** `search_companies`, `find_company_by_name`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `query` | string | Yes | - |

`query` is the name (even partial) of the company to search for.

**Call**
```json
{ "query": "acme" }
```
**Answer**
```json
[
  { "id": 3001, "name": "Acme S.p.A." }
]
```
---

## freshdesk_create_company <span className="fd-tag fd-tag--write">write</span>

Create a new company.

| Parameter | Type | Required | Default |
|---|---|---|---|
| `company` | object(CompanyCreate) | Yes | - |

**Fields of `company`** - `name` is required:

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | Yes | Unique company name |
| `domains` | string array | No | Associated email domains |
| `description` | string | No | Description |
| `notes` | string | No | Internal note |
| `health_score` | string | No | Ex. `Happy`, `At risk` |
| `account_tier` | string | No | Ex. `Premium` |
| `industry` | string | No | Sector to which you belong |
| `custom_fields` | object | No | Custom fields |

**Call**
```json
{
  "company": {
    "name": "Acme S.p.A.",
    "domains": ["acme.it"],
    "industry": "Manifatturiero",
    "account_tier": "Premium"
  }
}
```
**Answer**
```json
{ "id": 3002, "name": "Acme S.p.A.", "domains": ["acme.it"] }
```
---

## freshdesk_update_company <span className="fd-tag fd-tag--write">update</span>

Update a company. All fields are optional; if the payload is empty an error is returned.

| Parameter | Type | Required | Default |
|---|---|---|---|
| `company_id` | integer | Yes | - |
| `company` | object (CompanyUpdate) | Yes | - |

**`company`** fields (all optional): `name`, `domains`, `description`, `note`, `health_score`, `account_tier`, `industry`, `custom_fields`.

**Call**
```json
{ "company_id": 3002, "company": { "account_tier": "Enterprise" } }
```
**Answer**
```json
{ "id": 3002, "name": "Acme S.p.A.", "account_tier": "Enterprise" }
```
If no field is provided:
```json
{ "error": "Nessun campo fornito per l'aggiornamento dell'azienda." }
```

