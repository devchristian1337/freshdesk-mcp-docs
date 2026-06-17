---
id: risposte-predefinite
title: Risposte predefinite
description: Reference dei tool sulle canned response Freshdesk e le relative cartelle.
sidebar_label: Risposte predefinite
---

# Risposte predefinite

7 tool per gestire le canned response e le cartelle che le contengono.

---

## freshdesk_list_canned_response_folders <span className="fd-tag">read</span>

Elenca le cartelle delle canned response.

**Alias:** `list_canned_response_folders`

Nessun parametro.

**Risposta**

```json
[
  { "id": 201, "name": "Fatturazione", "responses_count": 8 },
  { "id": 202, "name": "Accesso e credenziali", "responses_count": 5 }
]
```

---

## freshdesk_list_canned_responses <span className="fd-tag">read</span>

Elenca le canned response contenute in una cartella.

**Alias:** `list_canned_responses`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `folder_id` | integer | Sì | — |

**Chiamata**

```json
{ "folder_id": 201 }
```

**Risposta**

```json
[
  { "id": 5001, "title": "Conferma rimborso", "folder_id": 201 }
]
```

---

## freshdesk_view_canned_response <span className="fd-tag">read</span>

Recupera il dettaglio di una canned response per ID.

**Alias:** `view_canned_response`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `canned_response_id` | integer | Sì | — |

**Risposta**

```json
{
  "id": 5001,
  "title": "Conferma rimborso",
  "content_html": "<p>Confermiamo l'avvenuto rimborso.</p>",
  "folder_id": 201,
  "visibility": 0
}
```

---

## freshdesk_create_canned_response <span className="fd-tag fd-tag--write">write</span>

Crea una canned response.

**Alias:** `create_canned_response`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `response` | object (CannedResponseCreate) | Sì | — |

**Campi di `response`:**

| Campo | Tipo | Obbligatorio | Note |
|---|---|---|---|
| `title` | string | Sì | Titolo |
| `content_html` | string | Sì | Contenuto HTML |
| `folder_id` | integer | Sì | Cartella di destinazione |
| `visibility` | integer (0–2) | Sì | `0` tutti gli agenti · `1` personale · `2` gruppi selezionati |
| `group_ids` | array di integer | Condizionale | Obbligatorio se `visibility = 2` |

**Chiamata**

```json
{
  "response": {
    "title": "Conferma rimborso",
    "content_html": "<p>Confermiamo l'avvenuto rimborso.</p>",
    "folder_id": 201,
    "visibility": 0
  }
}
```

**Risposta**

```json
{ "id": 5002, "title": "Conferma rimborso", "folder_id": 201, "visibility": 0 }
```

---

## freshdesk_update_canned_response <span className="fd-tag fd-tag--write">update</span>

Aggiorna una canned response.

**Alias:** `update_canned_response`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `canned_response_id` | integer | Sì | — |
| `canned_response_fields` | object | Sì | — |

Chiavi comuni: `title`, `content_html`, `visibility`.

**Chiamata**

```json
{ "canned_response_id": 5002, "canned_response_fields": { "title": "Conferma rimborso effettuato" } }
```

---

## freshdesk_create_canned_response_folder <span className="fd-tag fd-tag--write">write</span>

Crea una cartella di canned response.

**Alias:** `create_canned_response_folder`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `name` | string | Sì | — |

**Chiamata**

```json
{ "name": "Onboarding" }
```

**Risposta**

```json
{ "id": 203, "name": "Onboarding" }
```

---

## freshdesk_update_canned_response_folder <span className="fd-tag fd-tag--write">update</span>

Rinomina una cartella di canned response.

**Alias:** `update_canned_response_folder`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `folder_id` | integer | Sì | — |
| `name` | string | Sì | — |

**Chiamata**

```json
{ "folder_id": 203, "name": "Onboarding clienti" }
```
