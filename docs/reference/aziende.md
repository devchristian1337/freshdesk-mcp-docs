---
id: aziende
title: Aziende
description: Reference dei tool sulle aziende (companies) Freshdesk.
sidebar_label: Aziende
---

# Aziende

5 tool per elencare, leggere, cercare, creare e aggiornare le aziende.

---

## freshdesk_list_companies <span className="fd-tag">read</span>

Elenca le aziende con paginazione.

**Alias:** `list_companies`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `page` | integer | No | `1` |
| `per_page` | integer (1–100) | No | `30` |

**Risposta**

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

Recupera il dettaglio di un'azienda per ID.

**Alias:** `view_company`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `company_id` | integer | Sì | — |

**Risposta**

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

Cerca aziende per nome (autocomplete). Unifica i vecchi `search_companies` e `find_company_by_name`.

**Alias:** `search_companies`, `find_company_by_name`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `query` | string | Sì | — |

`query` è il nome (anche parziale) dell'azienda da cercare.

**Chiamata**

```json
{ "query": "acme" }
```

**Risposta**

```json
[
  { "id": 3001, "name": "Acme S.p.A." }
]
```

---

## freshdesk_create_company <span className="fd-tag fd-tag--write">write</span>

Crea una nuova azienda.

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `company` | object (CompanyCreate) | Sì | — |

**Campi di `company`** — `name` è obbligatorio:

| Campo | Tipo | Obbligatorio | Note |
|---|---|---|---|
| `name` | string | Sì | Nome univoco dell'azienda |
| `domains` | array di string | No | Domini email associati |
| `description` | string | No | Descrizione |
| `note` | string | No | Nota interna |
| `health_score` | string | No | Es. `Happy`, `At risk` |
| `account_tier` | string | No | Es. `Premium` |
| `industry` | string | No | Settore di appartenenza |
| `custom_fields` | object | No | Campi custom |

**Chiamata**

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

**Risposta**

```json
{ "id": 3002, "name": "Acme S.p.A.", "domains": ["acme.it"] }
```

---

## freshdesk_update_company <span className="fd-tag fd-tag--write">update</span>

Aggiorna un'azienda. Tutti i campi sono opzionali; se il payload è vuoto viene restituito un errore.

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `company_id` | integer | Sì | — |
| `company` | object (CompanyUpdate) | Sì | — |

**Campi di `company`** (tutti opzionali): `name`, `domains`, `description`, `note`, `health_score`, `account_tier`, `industry`, `custom_fields`.

**Chiamata**

```json
{ "company_id": 3002, "company": { "account_tier": "Enterprise" } }
```

**Risposta**

```json
{ "id": 3002, "name": "Acme S.p.A.", "account_tier": "Enterprise" }
```

Se non viene fornito alcun campo:

```json
{ "error": "Nessun campo fornito per l'aggiornamento dell'azienda." }
```
