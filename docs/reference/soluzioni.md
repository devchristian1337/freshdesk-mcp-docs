---
id: soluzioni
title: Tool knowledge base Freshdesk
description: Reference dei tool knowledge base Freshdesk MCP per categorie, cartelle, articoli, ricerca, creazione e aggiornamento delle solutions.
sidebar_label: Knowledge base
---

# Knowledge base

13 tool per gestire la knowledge base (solutions) di Freshdesk: categorie, cartelle e articoli, oltre alla ricerca testuale degli articoli.

:::info[Valori di riferimento]
**status** dell'articolo: `1` draft (bozza) · `2` published (pubblicato).
:::

## Categorie

### freshdesk_list_solution_categories <span className="fd-tag">read</span>

Elenca le categorie della knowledge base. Nessun parametro.

**Alias:** `list_solution_categories`

**Risposta**

```json
[
  { "id": 401, "name": "Guide utente", "description": "Manuali e how-to" }
]
```

### freshdesk_view_solution_category <span className="fd-tag">read</span>

Recupera una categoria per ID.

**Alias:** `view_solution_category`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `category_id` | integer | Sì | - |

**Risposta**

```json
{ "id": 401, "name": "Guide utente", "description": "Manuali e how-to" }
```

### freshdesk_create_solution_category <span className="fd-tag fd-tag--write">write</span>

Crea una categoria. `name` è obbligatorio.

**Alias:** `create_solution_category`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `category_fields` | object | Sì | - |

`category_fields`: `name` (obbligatorio), `description` (opzionale).

**Chiamata**

```json
{ "category_fields": { "name": "Guide utente", "description": "Manuali e how-to" } }
```

**Risposta**

```json
{ "id": 402, "name": "Guide utente", "description": "Manuali e how-to" }
```

### freshdesk_update_solution_category <span className="fd-tag fd-tag--write">update</span>

Aggiorna una categoria. `name` resta obbligatorio.

**Alias:** `update_solution_category`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `category_id` | integer | Sì | - |
| `category_fields` | object | Sì | - |

**Chiamata**

```json
{ "category_id": 402, "category_fields": { "name": "Guide e manuali" } }
```

## Cartelle

### freshdesk_list_solution_folders <span className="fd-tag">read</span>

Elenca le cartelle di una categoria.

**Alias:** `list_solution_folders`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `category_id` | integer | Sì | - |

**Risposta**

```json
[
  { "id": 501, "name": "Accesso", "category_id": 402 }
]
```

### freshdesk_view_solution_folder <span className="fd-tag">read</span>

Recupera una cartella per ID.

**Alias:** `view_solution_category_folder`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `folder_id` | integer | Sì | - |

**Risposta**

```json
{ "id": 501, "name": "Accesso", "category_id": 402, "visibility": 1 }
```

### freshdesk_create_solution_folder <span className="fd-tag fd-tag--write">write</span>

Crea una cartella in una categoria. `name` è obbligatorio.

**Alias:** `create_solution_category_folder`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `category_id` | integer | Sì | - |
| `folder_fields` | object | Sì | - |

`folder_fields`: `name` (obbligatorio), `description`/`visibility` (opzionali).

**Chiamata**

```json
{ "category_id": 402, "folder_fields": { "name": "Accesso", "visibility": 1 } }
```

**Risposta**

```json
{ "id": 502, "name": "Accesso", "category_id": 402, "visibility": 1 }
```

### freshdesk_update_solution_folder <span className="fd-tag fd-tag--write">update</span>

Aggiorna una cartella. `name` resta obbligatorio.

**Alias:** `update_solution_category_folder`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `folder_id` | integer | Sì | - |
| `folder_fields` | object | Sì | - |

**Chiamata**

```json
{ "folder_id": 502, "folder_fields": { "name": "Accesso e credenziali" } }
```

## Articoli

### freshdesk_list_solution_articles <span className="fd-tag">read</span>

Elenca gli articoli di una cartella.

**Alias:** `list_solution_articles`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `folder_id` | integer | Sì | - |

**Risposta**

```json
[
  { "id": 9001, "title": "Reimpostare la password", "status": 2, "folder_id": 502 }
]
```

### freshdesk_view_solution_article <span className="fd-tag">read</span>

Recupera un articolo per ID (include il corpo HTML).

**Alias:** `view_solution_article`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `article_id` | integer | Sì | - |

**Risposta**

```json
{
  "id": 9001,
  "title": "Reimpostare la password",
  "description": "<p>Vai su Impostazioni → Sicurezza...</p>",
  "status": 2,
  "folder_id": 502
}
```

### freshdesk_search_solution_articles <span className="fd-tag">read</span>

Cerca articoli della knowledge base per testo (endpoint `/search/solutions`).

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `query` | string | Sì | - |

`query` è il testo da cercare nel titolo/contenuto degli articoli.

**Chiamata**

```json
{ "query": "password" }
```

**Risposta** - lista di articoli corrispondenti (id, title, categoria/cartella):

```json
[
  { "id": 9001, "title": "Reimpostare la password", "category_id": 402, "folder_id": 502 }
]
```

### freshdesk_create_solution_article <span className="fd-tag fd-tag--write">write</span>

Crea un articolo nella knowledge base. Richiede `title`, `description` (corpo HTML) e `status`.

**Alias:** `create_solution_article`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `folder_id` | integer | Sì | - |
| `article_fields` | object | Sì | - |

`article_fields`: `title`, `description` (HTML) e `status` (`1`=draft, `2`=published), tutti obbligatori.

**Chiamata**

```json
{
  "folder_id": 502,
  "article_fields": {
    "title": "Reimpostare la password",
    "description": "<p>Vai su Impostazioni → Sicurezza e seleziona \"Reimposta password\".</p>",
    "status": 2
  }
}
```

**Risposta**

```json
{ "id": 9002, "title": "Reimpostare la password", "status": 2, "folder_id": 502 }
```

### freshdesk_update_solution_article <span className="fd-tag fd-tag--write">update</span>

Aggiorna un articolo della knowledge base.

**Alias:** `update_solution_article`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `article_id` | integer | Sì | - |
| `article_fields` | object | Sì | - |

Chiavi comuni: `title`, `description`, `status`.

**Chiamata**

```json
{ "article_id": 9002, "article_fields": { "status": 2, "title": "Come reimpostare la password" } }
```
