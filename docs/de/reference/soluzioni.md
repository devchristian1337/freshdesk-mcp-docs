---
id: soluzioni
title: Tool knowledge base Freshdesk
description: Reference dei tool knowledge base Freshdesk MCP per categorie, cartelle, articoli, ricerca, creazione e aggiornamento delle solutions.
sidebar_label: Knowledge base
---
#Wissensdatenbank

13 Tools zur Verwaltung der Freshdesk-Wissensdatenbank (Lösungen): Kategorien, Ordner und Artikel sowie Textsuche für Artikel.

:::info[Referenzwerte]
Artikel **Status**: „1“ Entwurf · „2“ veröffentlicht.
:::

## Kategorien

### freshdesk_list_solution_categories <span className="fd-tag">lesen</span>

Listet die Kategorien der Wissensdatenbank auf. Keine Parameter.

**Alias:** `list_solution_categories`

**Antwort**
```json
[
  { "id": 401, "name": "Guide utente", "description": "Manuali e how-to" }
]
```
### freshdesk_view_solution_category <span className="fd-tag">lesen</span>

Rufen Sie eine Kategorie nach ID ab.

**Alias:** `view_solution_category`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `category_id` | Ganzzahl | Ja | - |

**Antwort**
```json
{ "id": 401, "name": "Guide utente", "description": "Manuali e how-to" }
```
### freshdesk_create_solution_category <span className="fd-tag fd-tag--write">write</span>

Erstellen Sie eine Kategorie. „Name“ ist erforderlich.

**Alias:** `create_solution_category`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `category_fields` | Objekt | Ja | - |

„category_fields“: „Name“ (erforderlich), „Beschreibung“ (optional).

**Anruf**
```json
{ "category_fields": { "name": "Guide utente", "description": "Manuali e how-to" } }
```
**Antwort**
```json
{ "id": 402, "name": "Guide utente", "description": "Manuali e how-to" }
```
### freshdesk_update_solution_category <span className="fd-tag fd-tag--write">Update</span>

Aktualisieren Sie eine Kategorie. „Name“ bleibt erforderlich.

**Alias:** `update_solution_category`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `category_id` | Ganzzahl | Ja | - |
| `category_fields` | Objekt | Ja | - |

**Anruf**
```json
{ "category_id": 402, "category_fields": { "name": "Guide e manuali" } }
```
## Ordner

### freshdesk_list_solution_folders <span className="fd-tag">gelesen</span>

Listet Ordner in einer Kategorie auf.

**Alias:** `list_solution_folders`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `category_id` | Ganzzahl | Ja | - |

**Antwort**
```json
[
  { "id": 501, "name": "Accesso", "category_id": 402 }
]
```
### freshdesk_view_solution_folder <span className="fd-tag">gelesen</span>

Rufen Sie einen Ordner nach ID ab.

**Alias:** `view_solution_category_folder`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `folder_id` | Ganzzahl | Ja | - |

**Antwort**
```json
{ "id": 501, "name": "Accesso", "category_id": 402, "visibility": 1 }
```
### freshdesk_create_solution_folder <span className="fd-tag fd-tag--write">write</span>

Erstellen Sie einen Ordner in einer Kategorie. „Name“ ist erforderlich.

**Alias:** `create_solution_category_folder`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `category_id` | Ganzzahl | Ja | - |
| `folder_fields` | Objekt | Ja | - |

`folder_fields`: `name` (erforderlich), `description`/`visibility` (optional).

**Anruf**
```json
{ "category_id": 402, "folder_fields": { "name": "Accesso", "visibility": 1 } }
```
**Antwort**
```json
{ "id": 502, "name": "Accesso", "category_id": 402, "visibility": 1 }
```
### freshdesk_update_solution_folder <span className="fd-tag fd-tag--write">Update</span>

Aktualisieren Sie einen Ordner. „Name“ bleibt erforderlich.

**Alias:** `update_solution_category_folder`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `folder_id` | Ganzzahl | Ja | - |
| `folder_fields` | Objekt | Ja | - |

**Anruf**
```json
{ "folder_id": 502, "folder_fields": { "name": "Accesso e credenziali" } }
```
## Artikel

### freshdesk_list_solution_articles <span className="fd-tag">gelesen</span>

Listet die Elemente in einem Ordner auf.

**Alias:** `list_solution_articles`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `folder_id` | Ganzzahl | Ja | - |

**Antwort**
```json
[
  { "id": 9001, "title": "Reimpostare la password", "status": 2, "folder_id": 502 }
]
```
### freshdesk_view_solution_article <span className="fd-tag">gelesen</span>

Ruft einen Artikel nach ID ab (einschließlich HTML-Text).

**Alias:** `view_solution_article`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `Artikel-ID` | Ganzzahl | Ja | - |

**Antwort**
```json
{
  "id": 9001,
  "title": "Reimpostare la password",
  "description": "<p>Vai su Impostazioni → Sicurezza...</p>",
  "status": 2,
  "folder_id": 502
}
```
### freshdesk_search_solution_articles <span className="fd-tag">gelesen</span>

Durchsuchen Sie Wissensdatenbankartikel nach Text (Endpunkt „/search/solutions“).

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `Abfrage` | Zeichenfolge | Ja | - |

„Abfrage“ ist der Text, nach dem im Titel/Inhalt der Artikel gesucht werden soll.

**Anruf**
```json
{ "query": "password" }
```
**Antwort** – Liste passender Artikel (ID, Titel, Kategorie/Ordner):
```json
[
  { "id": 9001, "title": "Reimpostare la password", "category_id": 402, "folder_id": 502 }
]
```
### freshdesk_create_solution_article <span className="fd-tag fd-tag--write">write</span>

Erstellen Sie einen Artikel in der Wissensdatenbank. Erfordert „Titel“, „Beschreibung“ (HTML-Text) und „Status“.

**Alias:** `create_solution_article`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `folder_id` | Ganzzahl | Ja | - |
| `article_fields` | Objekt | Ja | - |

`article_fields`: `title`, `description` (HTML) und `status` (`1`=Entwurf, `2`=veröffentlicht), alle erforderlich.

**Anruf**
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
**Antwort**
```json
{ "id": 9002, "title": "Reimpostare la password", "status": 2, "folder_id": 502 }
```
### freshdesk_update_solution_article <span className="fd-tag fd-tag--write">Update</span>

Aktualisieren Sie einen Wissensdatenbankartikel.

**Alias:** `update_solution_article`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `Artikel-ID` | Ganzzahl | Ja | - |
| `article_fields` | Objekt | Ja | - |

Gemeinsame Schlüssel: „Titel“, „Beschreibung“, „Status“.

**Anruf**
```json
{ "article_id": 9002, "article_fields": { "status": 2, "title": "Come reimpostare la password" } }
```

