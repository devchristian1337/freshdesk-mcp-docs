---
id: conversazioni
title: Tool conversazioni Freshdesk
description: Reference dei tool conversazioni Freshdesk MCP per leggere thread, creare reply o note, aggiornare messaggi e gestire allegati ticket.
sidebar_label: Conversazioni
---
# Conversations

5 tools for the conversation thread of a ticket: complete reading, public replies, internal notes, editing a message and attachments.

---

## freshdesk_get_ticket_conversation <span className="fd-tag">read</span>

Retrieves the entire conversation thread of a ticket, automatically paginating all pages.

**Alias:** `get_ticket_conversation`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `ticket_id` | integer | Yes | - |

**Reply** - list of messages (public replies and private notes); each with `body`/`body_text`, `user_id`, `private` (true for internal notes), `incoming`, `created_at` and any `attachments`:
```json
[
  {
    "id": 7001,
    "user_id": 6001,
    "private": false,
    "incoming": true,
    "body_text": "Non riesco ad accedere al portale.",
    "created_at": "2026-06-09T08:31:00Z",
    "attachments": []
  },
  {
    "id": 7002,
    "user_id": 123,
    "private": true,
    "incoming": false,
    "body_text": "Verificare credenziali SSO del cliente.",
    "created_at": "2026-06-09T09:02:00Z"
  }
]
```
:::caution[Context size]
On tickets with many exchanges the HTML bodies can be long: the tool still returns all the pages.
:::

---

## freshdesk_create_ticket_reply <span className="fd-tag fd-tag--write">write</span>

Send a public reply (visible to the customer) on a ticket. Subject to [read-only mode](../configuration.md#read-only-mode).

**Alias:** `create_ticket_reply`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `ticket_id` | integer | Yes | - |
| `body` | string (HTML) | Yes | - |

**Call**
```json
{ "ticket_id": 12345, "body": "<p>Abbiamo reimpostato il suo accesso, può riprovare.</p>" }
```
**Reply** - the created conversation object:
```json
{ "id": 7003, "ticket_id": 12345, "private": false, "body": "<p>Abbiamo reimpostato il suo accesso, può riprovare.</p>" }
```
---

## freshdesk_create_ticket_note <span className="fd-tag fd-tag--write">write</span>

Adds a private (internal, not visible to the customer) note to a ticket. Subject to [read-only mode](../configuration.md#read-only-mode).

**Alias:** `create_ticket_note`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `ticket_id` | integer | Yes | - |
| `body` | string (HTML) | Yes | - |

**Call**
```json
{ "ticket_id": 12345, "body": "<p>Cliente ricontattato telefonicamente, problema confermato.</p>" }
```
**Answer**
```json
{ "id": 7004, "ticket_id": 12345, "private": true, "body": "<p>Cliente ricontattato telefonicamente, problema confermato.</p>" }
```
---

## freshdesk_update_ticket_conversation <span className="fd-tag fd-tag--write">update</span>

Update the body of an existing conversation (reply or note). Subject to [read-only mode](../configuration.md#read-only-mode).

**Alias:** `update_ticket_conversation`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `conversation_id` | integer | Yes | - |
| `body` | string (HTML) | Yes | - |

:::notes
`conversation_id` is the ID of the message, not the ticket.
:::

**Call**
```json
{ "conversation_id": 7004, "body": "<p>Nota aggiornata con l'esito della verifica.</p>" }
```
---

## freshdesk_get_ticket_attachments <span className="fd-tag">read</span>

Lists attachments and inline images of a ticket and its conversations. By default it returns **only the metadata** to avoid saturating the context.

**Alias:** `get_ticket_attachments`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `ticket_id` | integer | Yes | - |
| `include_content` | boolean | No | `false` |
| `max_total_bytes` | integer | No | `5242880` (5 MB) |

With `include_content=true` `data_base64` is also added, with hard caps: **max 1 MB per file** and `max_total_bytes` overall (default 5 MB). Over budget files are marked `truncated: true` and `attachment_url` should be used.

**Call**
```json
{ "ticket_id": 12345, "include_content": false }
```
**Answer**
```json
{
  "attachments": [
    {
      "source": "ticket",
      "type": "file",
      "name": "schermata.png",
      "content_type": "image/png",
      "size": 84213,
      "attachment_url": "https://tuazienda.freshdesk.com/helpdesk/attachments/123"
    },
    {
      "source": "conversation",
      "type": "inline_image",
      "name": "inline-1.png",
      "attachment_url": "https://tuazienda.freshdesk.com/helpdesk/attachments/124"
    }
  ],
  "summary": "Trovati 1 allegati file e 1 immagini inline",
  "include_content": false
}
```

