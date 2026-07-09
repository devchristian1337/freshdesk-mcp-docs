---
id: soluzioni
title: Tool knowledge base Freshdesk
description: Reference dei tool knowledge base Freshdesk MCP per categorie, cartelle, articoli, ricerca, creazione e aggiornamento delle solutions.
sidebar_label: Knowledge base
---
#Base de connaissances

13 outils pour gérer la base de connaissances Freshdesk (solutions) : catégories, dossiers et articles, ainsi que recherche textuelle des articles.

:::info[Valeurs de référence]
Article **statut** : « 1 » brouillon · « 2 » publié.
:::

## Catégories

### freshdesk_list_solution_categories <span className="fd-tag">lire</span>

Répertorie les catégories de la base de connaissances. Aucun paramètre.

**Alias :** `list_solution_categories`

**Réponse**
```json
[
  { "id": 401, "name": "Guide utente", "description": "Manuali e how-to" }
]
```
### freshdesk_view_solution_category <span className="fd-tag">lire</span>

Récupérer une catégorie par ID.

**Alias :** `view_solution_category`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `category_id` | entier | Oui | - |

**Répondre**
```json
{ "id": 401, "name": "Guide utente", "description": "Manuali e how-to" }
```
### freshdesk_create_solution_category <span className="fd-tag fd-tag--write">écrire</span>

Créez une catégorie. `nom` est requis.

**Alias :** `create_solution_category`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `category_fields` | objet | Oui | - |

`category_fields` : `nom` (obligatoire), `description` (facultatif).

**Appel**
```json
{ "category_fields": { "name": "Guide utente", "description": "Manuali e how-to" } }
```
**Répondre**
```json
{ "id": 402, "name": "Guide utente", "description": "Manuali e how-to" }
```
### freshdesk_update_solution_category <span className="fd-tag fd-tag--write">mise à jour</span>

Mettre à jour une catégorie. `name` reste requis.

**Alias :** `update_solution_category`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `category_id` | entier | Oui | - |
| `category_fields` | objet | Oui | - |

**Appel**
```json
{ "category_id": 402, "category_fields": { "name": "Guide e manuali" } }
```
## Dossiers

### freshdesk_list_solution_folders <span className="fd-tag">lire</span>

Répertorie les dossiers dans une catégorie.

**Alias :** `list_solution_folders`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `category_id` | entier | Oui | - |

**Répondre**
```json
[
  { "id": 501, "name": "Accesso", "category_id": 402 }
]
```
### freshdesk_view_solution_folder <span className="fd-tag">lire</span>

Récupérer un dossier par ID.

**Alias :** `view_solution_category_folder`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_dossier` | entier | Oui | - |

**Répondre**
```json
{ "id": 501, "name": "Accesso", "category_id": 402, "visibility": 1 }
```
### freshdesk_create_solution_folder <span className="fd-tag fd-tag--write">écrire</span>

Créez un dossier dans une catégorie. `nom` est requis.

**Alias :** `create_solution_category_folder`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `category_id` | entier | Oui | - |
| `folder_fields` | objet | Oui | - |

`folder_fields` : `nom` (obligatoire), `description`/`visibilité` (facultatif).

**Appel**
```json
{ "category_id": 402, "folder_fields": { "name": "Accesso", "visibility": 1 } }
```
**Répondre**
```json
{ "id": 502, "name": "Accesso", "category_id": 402, "visibility": 1 }
```
### freshdesk_update_solution_folder <span className="fd-tag fd-tag--write">mise à jour</span>

Mettez à jour un dossier. `name` reste requis.

**Alias :** `update_solution_category_folder`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_dossier` | entier | Oui | - |
| `folder_fields` | objet | Oui | - |

**Appel**
```json
{ "folder_id": 502, "folder_fields": { "name": "Accesso e credenziali" } }
```
##Articles

### freshdesk_list_solution_articles <span className="fd-tag">lire</span>

Répertorie les éléments d'un dossier.

**Alias :** `list_solution_articles`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_dossier` | entier | Oui | - |

**Répondre**
```json
[
  { "id": 9001, "title": "Reimpostare la password", "status": 2, "folder_id": 502 }
]
```
### freshdesk_view_solution_article <span className="fd-tag">lire</span>

Récupère un article par ID (inclut le corps HTML).

**Alias :** `view_solution_article`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_article` | entier | Oui | - |

**Répondre**
```json
{
  "id": 9001,
  "title": "Reimpostare la password",
  "description": "<p>Vai su Impostazioni → Sicurezza...</p>",
  "status": 2,
  "folder_id": 502
}
```
### freshdesk_search_solution_articles <span className="fd-tag">lire</span>

Rechercher des articles de la base de connaissances par texte (point de terminaison `/search/solutions`).

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `requête` | chaîne | Oui | - |

`query` est le texte à rechercher dans le titre/contenu des articles.

**Appel**
```json
{ "query": "password" }
```
**Réponse** - liste des articles correspondants (identifiant, titre, catégorie/dossier) :
```json
[
  { "id": 9001, "title": "Reimpostare la password", "category_id": 402, "folder_id": 502 }
]
```
### freshdesk_create_solution_article <span className="fd-tag fd-tag--write">écrire</span>

Créez un article dans la base de connaissances. Nécessite « titre », « description » (corps HTML) et « statut ».

**Alias :** `create_solution_article`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_dossier` | entier | Oui | - |
| `champs_articles` | objet | Oui | - |

`article_fields` : `titre`, `description` (HTML) et `statut` (`1`=brouillon, `2`=publié), tous obligatoires.

**Appel**
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
**Répondre**
```json
{ "id": 9002, "title": "Reimpostare la password", "status": 2, "folder_id": 502 }
```
### freshdesk_update_solution_article <span className="fd-tag fd-tag--write">mise à jour</span>

Mettre à jour un article de la base de connaissances.

**Alias :** `update_solution_article`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_article` | entier | Oui | - |
| `champs_articles` | objet | Oui | - |

Clés communes : `titre`, `description`, `statut`.

**Appel**
```json
{ "article_id": 9002, "article_fields": { "status": 2, "title": "Come reimpostare la password" } }
```

