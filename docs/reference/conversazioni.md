---
id: conversazioni
title: Tool conversazioni Freshdesk
description: Reference dei tool conversazioni Freshdesk MCP per leggere thread, creare reply o note, aggiornare messaggi e gestire allegati ticket.
sidebar_label: Conversazioni
---

# Conversazioni

5 tool per il thread di conversazione di un ticket: lettura completa, reply pubbliche, note interne, modifica di un messaggio e allegati.

---

## freshdesk_get_ticket_conversation <span className="fd-tag">read</span>

Recupera l'intero thread di conversazione di un ticket, impaginando automaticamente tutte le pagine.

**Alias:** `get_ticket_conversation`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `ticket_id` | integer | Sì | - |

**Risposta** - lista di messaggi (reply pubbliche e note private); ognuno con `body`/`body_text`, `user_id`, `private` (true per le note interne), `incoming`, `created_at` ed eventuali `attachments`:

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

:::caution[Dimensione del contesto]
Su ticket con molti scambi i body HTML possono essere lunghi: il tool restituisce comunque tutte le pagine.
:::

---

## freshdesk_create_ticket_reply <span className="fd-tag fd-tag--write">write</span>

Invia una reply pubblica (visibile al cliente) su un ticket. Soggetto a [modalità read-only](../configurazione.md#modalità-read-only).

**Alias:** `create_ticket_reply`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `ticket_id` | integer | Sì | - |
| `body` | string (HTML) | Sì | - |

**Chiamata**

```json
{ "ticket_id": 12345, "body": "<p>Abbiamo reimpostato il suo accesso, può riprovare.</p>" }
```

**Risposta** - l'oggetto conversazione creato:

```json
{ "id": 7003, "ticket_id": 12345, "private": false, "body": "<p>Abbiamo reimpostato il suo accesso, può riprovare.</p>" }
```

---

## freshdesk_create_ticket_note <span className="fd-tag fd-tag--write">write</span>

Aggiunge una nota privata (interna, non visibile al cliente) a un ticket. Soggetto a [modalità read-only](../configurazione.md#modalità-read-only).

**Alias:** `create_ticket_note`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `ticket_id` | integer | Sì | - |
| `body` | string (HTML) | Sì | - |

**Chiamata**

```json
{ "ticket_id": 12345, "body": "<p>Cliente ricontattato telefonicamente, problema confermato.</p>" }
```

**Risposta**

```json
{ "id": 7004, "ticket_id": 12345, "private": true, "body": "<p>Cliente ricontattato telefonicamente, problema confermato.</p>" }
```

---

## freshdesk_update_ticket_conversation <span className="fd-tag fd-tag--write">update</span>

Aggiorna il corpo di una conversazione (reply o nota) esistente. Soggetto a [modalità read-only](../configurazione.md#modalità-read-only).

**Alias:** `update_ticket_conversation`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `conversation_id` | integer | Sì | - |
| `body` | string (HTML) | Sì | - |

:::note
`conversation_id` è l'ID del messaggio, non del ticket.
:::

**Chiamata**

```json
{ "conversation_id": 7004, "body": "<p>Nota aggiornata con l'esito della verifica.</p>" }
```

---

## freshdesk_get_ticket_attachments <span className="fd-tag">read</span>

Elenca allegati e immagini inline di un ticket e delle sue conversazioni. Di default restituisce **solo i metadati** per non saturare il contesto.

**Alias:** `get_ticket_attachments`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `ticket_id` | integer | Sì | - |
| `include_content` | boolean | No | `false` |
| `max_total_bytes` | integer | No | `5242880` (5 MB) |

Con `include_content=true` viene aggiunto anche `data_base64`, con cap rigidi: **max 1 MB per file** e `max_total_bytes` complessivi (default 5 MB). Oltre il budget i file sono marcati `truncated: true` e va usato `attachment_url`.

**Chiamata**

```json
{ "ticket_id": 12345, "include_content": false }
```

**Risposta**

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
