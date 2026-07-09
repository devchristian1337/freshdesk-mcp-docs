---
id: risposte-predefinite
title: Tool risposte predefinite
description: Reference dei tool risposte predefinite Freshdesk MCP per cartelle, canned response, contenuti HTML, visibilità e aggiornamenti.
sidebar_label: Risposte predefinite
---
# Canned responses

7 tools to manage canned responses and the folders that contain them.

Canned responses allow you to standardize recurring communications without losing control over the final text sent to the customer. In Freshdesk MCP the tools separate folders and contents: first you identify the folder, then you read or modify the canned response. This is useful when an AI assistant needs to propose a response consistent with internal procedures, refund policies, onboarding messages, or technical support communications.

To avoid unwanted changes, use the `read` tools to retrieve the title, HTML, and visibility before calling a `write` or `update` tool. The `visibility` field governs who can use the response: all agents, only the owner, or selected groups.

---

## freshdesk_list_canned_response_folders <span className="fd-tag">read</span>

Lists the canned response folders.

**Alias:** `list_canned_response_folders`

No parameters.

**Answer**
```json
[
  { "id": 201, "name": "Fatturazione", "responses_count": 8 },
  { "id": 202, "name": "Accesso e credenziali", "responses_count": 5 }
]
```
---

## freshdesk_list_canned_responses <span className="fd-tag">read</span>

Lists the canned responses contained in a folder.

**Alias:** `list_canned_responses`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `folder_id` | integer | Yes | - |

**Call**
```json
{ "folder_id": 201 }
```
**Answer**
```json
[
  { "id": 5001, "title": "Conferma rimborso", "folder_id": 201 }
]
```
---

## freshdesk_view_canned_response <span className="fd-tag">read</span>

Retrieves the detail of a canned response by ID.

**Alias:** `view_canned_response`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `canned_response_id` | integer | Yes | - |

**Answer**
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

Create a canned response.

**Alias:** `create_canned_response`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `response` | object (CannedResponseCreate) | Yes | - |

**`Response` fields:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | Yes | Title |
| `content_html` | string | Yes | HTML Content |
| `folder_id` | integer | Yes | Destination folder |
| `visibility` | integer (0–2) | Yes | `0` all agents · `1` personal · `2` selected groups |
| `group_ids` | array of integers | Conditional | Required if `visibility = 2` |

**Call**
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
**Answer**
```json
{ "id": 5002, "title": "Conferma rimborso", "folder_id": 201, "visibility": 0 }
```
---

## freshdesk_update_canned_response <span className="fd-tag fd-tag--write">update</span>

Update a canned response.

**Alias:** `update_canned_response`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `canned_response_id` | integer | Yes | - |
| `canned_response_fields` | object | Yes | - |

Common keys: `title`, `content_html`, `visibility`.

**Call**
```json
{ "canned_response_id": 5002, "canned_response_fields": { "title": "Conferma rimborso effettuato" } }
```
---

## freshdesk_create_canned_response_folder <span className="fd-tag fd-tag--write">write</span>

Create a canned response folder.

**Alias:** `create_canned_response_folder`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `name` | string | Yes | - |

**Call**
```json
{ "name": "Onboarding" }
```
**Answer**
```json
{ "id": 203, "name": "Onboarding" }
```
---

## freshdesk_update_canned_response_folder <span className="fd-tag fd-tag--write">update</span>

Rename a canned response folder.

**Alias:** `update_canned_response_folder`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `folder_id` | integer | Yes | - |
| `name` | string | Yes | - |

**Call**
```json
{ "folder_id": 203, "name": "Onboarding clienti" }
```

