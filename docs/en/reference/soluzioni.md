---
id: soluzioni
title: Tool knowledge base Freshdesk
description: Reference dei tool knowledge base Freshdesk MCP per categorie, cartelle, articoli, ricerca, creazione e aggiornamento delle solutions.
sidebar_label: Knowledge base
---
#Knowledgebase

13 tools to manage the Freshdesk knowledge base (solutions): categories, folders and articles, as well as text search for articles.

:::info[Reference values]
Article **status**: `1` draft · `2` published.
:::

## Categories

### freshdesk_list_solution_categories <span className="fd-tag">read</span>

Lists the knowledge base categories. No parameters.

**Alias:** `list_solution_categories`

**Answer**
```json
[
  { "id": 401, "name": "Guide utente", "description": "Manuali e how-to" }
]
```
### freshdesk_view_solution_category <span className="fd-tag">read</span>

Retrieve a category by ID.

**Alias:** `view_solution_category`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `category_id` | integer | Yes | - |

**Answer**
```json
{ "id": 401, "name": "Guide utente", "description": "Manuali e how-to" }
```
### freshdesk_create_solution_category <span className="fd-tag fd-tag--write">write</span>

Create a category. `name` is required.

**Alias:** `create_solution_category`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `category_fields` | object | Yes | - |

`category_fields`: `name` (required), `description` (optional).

**Call**
```json
{ "category_fields": { "name": "Guide utente", "description": "Manuali e how-to" } }
```
**Answer**
```json
{ "id": 402, "name": "Guide utente", "description": "Manuali e how-to" }
```
### freshdesk_update_solution_category <span className="fd-tag fd-tag--write">update</span>

Update a category. `name` remains required.

**Alias:** `update_solution_category`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `category_id` | integer | Yes | - |
| `category_fields` | object | Yes | - |

**Call**
```json
{ "category_id": 402, "category_fields": { "name": "Guide e manuali" } }
```
## Folders

### freshdesk_list_solution_folders <span className="fd-tag">read</span>

Lists folders in a category.

**Alias:** `list_solution_folders`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `category_id` | integer | Yes | - |

**Answer**
```json
[
  { "id": 501, "name": "Accesso", "category_id": 402 }
]
```
### freshdesk_view_solution_folder <span className="fd-tag">read</span>

Retrieve a folder by ID.

**Alias:** `view_solution_category_folder`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `folder_id` | integer | Yes | - |

**Answer**
```json
{ "id": 501, "name": "Accesso", "category_id": 402, "visibility": 1 }
```
### freshdesk_create_solution_folder <span className="fd-tag fd-tag--write">write</span>

Create a folder in a category. `name` is required.

**Alias:** `create_solution_category_folder`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `category_id` | integer | Yes | - |
| `folder_fields` | object | Yes | - |

`folder_fields`: `name` (required), `description`/`visibility` (optional).

**Call**
```json
{ "category_id": 402, "folder_fields": { "name": "Accesso", "visibility": 1 } }
```
**Answer**
```json
{ "id": 502, "name": "Accesso", "category_id": 402, "visibility": 1 }
```
### freshdesk_update_solution_folder <span className="fd-tag fd-tag--write">update</span>

Update a folder. `name` remains required.

**Alias:** `update_solution_category_folder`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `folder_id` | integer | Yes | - |
| `folder_fields` | object | Yes | - |

**Call**
```json
{ "folder_id": 502, "folder_fields": { "name": "Accesso e credenziali" } }
```
## Articles

### freshdesk_list_solution_articles <span className="fd-tag">read</span>

Lists the items in a folder.

**Alias:** `list_solution_articles`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `folder_id` | integer | Yes | - |

**Answer**
```json
[
  { "id": 9001, "title": "Reimpostare la password", "status": 2, "folder_id": 502 }
]
```
### freshdesk_view_solution_article <span className="fd-tag">read</span>

Retrieves an article by ID (includes HTML body).

**Alias:** `view_solution_article`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `article_id` | integer | Yes | - |

**Answer**
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

Search knowledge base articles by text (`/search/solutions` endpoint).

| Parameter | Type | Required | Default |
|---|---|---|---|
| `query` | string | Yes | - |

`query` is the text to search for in the title/content of the articles.

**Call**
```json
{ "query": "password" }
```
**Response** - list of matching articles (id, title, category/folder):
```json
[
  { "id": 9001, "title": "Reimpostare la password", "category_id": 402, "folder_id": 502 }
]
```
### freshdesk_create_solution_article <span className="fd-tag fd-tag--write">write</span>

Create an article in the knowledge base. Requires `title`, `description` (HTML body), and `status`.

**Alias:** `create_solution_article`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `folder_id` | integer | Yes | - |
| `article_fields` | object | Yes | - |

`article_fields`: `title`, `description` (HTML), and `status` (`1`=draft, `2`=published), all required.

**Call**
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
**Answer**
```json
{ "id": 9002, "title": "Reimpostare la password", "status": 2, "folder_id": 502 }
```
### freshdesk_update_solution_article <span className="fd-tag fd-tag--write">update</span>

Update a knowledge base article.

**Alias:** `update_solution_article`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `article_id` | integer | Yes | - |
| `article_fields` | object | Yes | - |

Common keys: `title`, `description`, `status`.

**Call**
```json
{ "article_id": 9002, "article_fields": { "status": 2, "title": "Come reimpostare la password" } }
```

