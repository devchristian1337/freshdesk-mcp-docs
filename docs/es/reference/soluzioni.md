---
id: soluzioni
title: Tool knowledge base Freshdesk
description: Reference dei tool knowledge base Freshdesk MCP per categorie, cartelle, articoli, ricerca, creazione e aggiornamento delle solutions.
sidebar_label: Knowledge base
---
#base de conocimientos

13 herramientas para gestionar la base de conocimientos (soluciones) de Freshdesk: categorías, carpetas y artículos, así como búsqueda de texto para artículos.

:::info[Valores de referencia]
Artículo **estado**: `1` borrador · `2` publicado.
:::

## Categorías

### Freshdesk_list_solution_categories <span className="fd-tag">leer</span>

Enumera las categorías de la base de conocimientos. Sin parámetros.

**Alias:** `list_solution_categories`

**Respuesta**
```json
[
  { "id": 401, "name": "Guide utente", "description": "Manuali e how-to" }
]
```
### Freshdesk_view_solution_category <span className="fd-tag">leer</span>

Recuperar una categoría por ID.

**Alias:** `view_solution_category`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `categoría_id` | entero | Sí | - |

**Respuesta**
```json
{ "id": 401, "name": "Guide utente", "description": "Manuali e how-to" }
```
### Freshdesk_create_solution_category <span className="fd-tag fd-tag--write">escribir</span>

Crea una categoría. Se requiere "nombre".

**Alias:** `create_solution_category`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `campos_categoría` | objeto | Sí | - |

`category_fields`: `nombre` (obligatorio), `descripción` (opcional).

**Llamar**
```json
{ "category_fields": { "name": "Guide utente", "description": "Manuali e how-to" } }
```
**Respuesta**
```json
{ "id": 402, "name": "Guide utente", "description": "Manuali e how-to" }
```
### Freshdesk_update_solution_category <span className="fd-tag fd-tag--write">actualizar</span>

Actualizar una categoría. "nombre" sigue siendo obligatorio.

**Alias:** `update_solution_category`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `categoría_id` | entero | Sí | - |
| `campos_categoría` | objeto | Sí | - |

**Llamar**
```json
{ "category_id": 402, "category_fields": { "name": "Guide e manuali" } }
```
## Carpetas

### Freshdesk_list_solution_folders <span className="fd-tag">leer</span>

Enumera las carpetas de una categoría.

**Alias:** `list_solution_folders`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `categoría_id` | entero | Sí | - |

**Respuesta**
```json
[
  { "id": 501, "name": "Accesso", "category_id": 402 }
]
```
### Freshdesk_view_solution_folder <span className="fd-tag">leer</span>

Recuperar una carpeta por ID.

**Alias:** `view_solution_category_folder`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `id_carpeta` | entero | Sí | - |

**Respuesta**
```json
{ "id": 501, "name": "Accesso", "category_id": 402, "visibility": 1 }
```
### Freshdesk_create_solution_folder <span className="fd-tag fd-tag--write">escribir</span>

Crea una carpeta en una categoría. Se requiere "nombre".

**Alias:** `create_solution_category_folder`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `categoría_id` | entero | Sí | - |
| `campos_carpeta` | objeto | Sí | - |

`folder_fields`: `nombre` (obligatorio), `descripción`/`visibilidad` (opcional).

**Llamar**
```json
{ "category_id": 402, "folder_fields": { "name": "Accesso", "visibility": 1 } }
```
**Respuesta**
```json
{ "id": 502, "name": "Accesso", "category_id": 402, "visibility": 1 }
```
### Freshdesk_update_solution_folder <span className="fd-tag fd-tag--write">actualizar</span>

Actualizar una carpeta. "nombre" sigue siendo obligatorio.

**Alias:** `update_solution_category_folder`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `id_carpeta` | entero | Sí | - |
| `campos_carpeta` | objeto | Sí | - |

**Llamar**
```json
{ "folder_id": 502, "folder_fields": { "name": "Accesso e credenziali" } }
```
## Artículos

### Freshdesk_list_solution_articles <span className="fd-tag">leer</span>

Enumera los elementos de una carpeta.

**Alias:** `list_solution_articles`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `id_carpeta` | entero | Sí | - |

**Respuesta**
```json
[
  { "id": 9001, "title": "Reimpostare la password", "status": 2, "folder_id": 502 }
]
```
### Freshdesk_view_solution_article <span className="fd-tag">leer</span>

Recupera un artículo por ID (incluye cuerpo HTML).

**Alias:** `view_solution_article`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `artículo_id` | entero | Sí | - |

**Respuesta**
```json
{
  "id": 9001,
  "title": "Reimpostare la password",
  "description": "<p>Vai su Impostazioni → Sicurezza...</p>",
  "status": 2,
  "folder_id": 502
}
```
### Freshdesk_search_solution_articles <span className="fd-tag">leer</span>

Busque artículos de la base de conocimientos por texto (punto final `/search/solutions`).

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `consulta` | cadena | Sí | - |

`query` es el texto a buscar en el título/contenido de los artículos.

**Llamar**
```json
{ "query": "password" }
```
**Respuesta** - lista de artículos coincidentes (id, título, categoría/carpeta):
```json
[
  { "id": 9001, "title": "Reimpostare la password", "category_id": 402, "folder_id": 502 }
]
```
### Freshdesk_create_solution_article <span className="fd-tag fd-tag--write">escribir</span>

Cree un artículo en la base de conocimientos. Requiere "título", "descripción" (cuerpo HTML) y "estado".

**Alias:** `create_solution_article`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `id_carpeta` | entero | Sí | - |
| `campos_artículo` | objeto | Sí | - |

`article_fields`: `título`, `descripción` (HTML) y `estado` (`1`=borrador, `2`=publicado), todos obligatorios.

**Llamar**
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
**Respuesta**
```json
{ "id": 9002, "title": "Reimpostare la password", "status": 2, "folder_id": 502 }
```
### Freshdesk_update_solution_article <span className="fd-tag fd-tag--write">actualizar</span>

Actualizar un artículo de la base de conocimientos.

**Alias:** `update_solution_article`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `artículo_id` | entero | Sí | - |
| `campos_artículo` | objeto | Sí | - |

Claves comunes: `título`, `descripción`, `estado`.

**Llamar**
```json
{ "article_id": 9002, "article_fields": { "status": 2, "title": "Come reimpostare la password" } }
```

