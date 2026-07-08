---
id: contatti
title: Tool contatti Freshdesk
description: Reference dei tool contatti Freshdesk MCP per listare, cercare, leggere, creare e aggiornare requester con campi standard e custom.
sidebar_label: Contatti
---

# Contatti

5 tool per elencare, leggere, cercare, creare e aggiornare i contatti.

---

## freshdesk_list_contacts <span className="fd-tag">read</span>

Elenca i contatti con paginazione e filtri opzionali.

**Alias:** `list_contacts`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `page` | integer | No | `1` |
| `per_page` | integer (1–100) | No | `30` |
| `email` | string | No | `null` |
| `company_id` | integer | No | `null` |
| `updated_since` | string (ISO 8601) | No | `null` |

**Chiamata**

```json
{ "company_id": 3001, "per_page": 50 }
```

**Risposta**

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

Recupera il dettaglio di un contatto per ID.

**Alias:** `get_contact`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `contact_id` | integer | Sì | - |

**Risposta**

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

Cerca contatti per nome o email (autocomplete).

**Alias:** `search_contacts`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `query` | string | Sì | - |

**Chiamata**

```json
{ "query": "rossi" }
```

**Risposta**

```json
[
  { "id": 6001, "name": "Mario Rossi", "email": "mario.rossi@acme.it" }
]
```

---

## freshdesk_create_contact <span className="fd-tag fd-tag--write">write</span>

Crea un nuovo contatto.

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `contact` | object (ContactCreate) | Sì | - |

**Campi di `contact`** - `name` è obbligatorio e serve **almeno uno** tra `email`, `phone`, `mobile`, `twitter_id`, `unique_external_id`:

| Campo | Tipo | Obbligatorio | Note |
|---|---|---|---|
| `name` | string | Sì | Nome completo |
| `email` | string | Condizionale | Email primaria |
| `phone` | string | Condizionale | Telefono fisso |
| `mobile` | string | Condizionale | Cellulare |
| `twitter_id` | string | Condizionale | Handle Twitter |
| `unique_external_id` | string | Condizionale | ID esterno univoco |
| `company_id` | integer | No | Azienda di appartenenza |
| `job_title` | string | No | Ruolo/qualifica |
| `description` | string | No | Note sul contatto |
| `custom_fields` | object | No | Campi custom |

**Chiamata**

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

**Risposta**

```json
{ "id": 6002, "name": "Giulia Bianchi", "email": "giulia.bianchi@acme.it", "company_id": 3001 }
```

---

## freshdesk_update_contact <span className="fd-tag fd-tag--write">update</span>

Aggiorna un contatto.

**Alias:** `update_contact`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `contact_id` | integer | Sì | - |
| `contact_fields` | object | Sì | - |

Chiavi comuni di `contact_fields`: `name`, `email`, `phone`, `company_id`, `job_title`, `custom_fields`.

**Chiamata**

```json
{ "contact_id": 6002, "contact_fields": { "job_title": "Direttore Acquisti" } }
```

**Risposta**

```json
{ "id": 6002, "name": "Giulia Bianchi", "job_title": "Direttore Acquisti" }
```
