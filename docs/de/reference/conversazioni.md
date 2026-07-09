---
id: conversazioni
title: Tool conversazioni Freshdesk
description: Reference dei tool conversazioni Freshdesk MCP per leggere thread, creare reply o note, aggiornare messaggi e gestire allegati ticket.
sidebar_label: Conversazioni
---
# Gespräche

5 Tools für den Konversationsthread eines Tickets: vollständiges Lesen, öffentliche Antworten, interne Notizen, Bearbeiten einer Nachricht und Anhänge.

---

## freshdesk_get_ticket_conversation <span className="fd-tag">lesen</span>

Ruft den gesamten Konversationsthread eines Tickets ab und paginiert automatisch alle Seiten.

**Alias:** `get_ticket_conversation`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `ticket_id` | Ganzzahl | Ja | - |

**Antworten** – Liste der Nachrichten (öffentliche Antworten und private Notizen); jeweils mit „body“/„body_text“, „user_id“, „private“ (gilt für interne Notizen), „incoming“, „created_at“ und allen „attachments“:
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
:::caution[Kontextgröße]
Bei Tickets mit vielen Umtauschvorgängen können die HTML-Körper lang sein: Das Tool gibt trotzdem alle Seiten zurück.
:::

---

## freshdesk_create_ticket_reply <span className="fd-tag fd-tag--write">write</span>

Senden Sie eine öffentliche (für den Kunden sichtbare) Antwort auf ein Ticket. Vorbehaltlich des [schreibgeschützten Modus](../configuration.md#read-only-mode).

**Alias:** `create_ticket_reply`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `ticket_id` | Ganzzahl | Ja | - |
| „Körper“ | Zeichenfolge (HTML) | Ja | - |

**Anruf**
```json
{ "ticket_id": 12345, "body": "<p>Abbiamo reimpostato il suo accesso, può riprovare.</p>" }
```
**Antwort** – das erstellte Konversationsobjekt:
```json
{ "id": 7003, "ticket_id": 12345, "private": false, "body": "<p>Abbiamo reimpostato il suo accesso, può riprovare.</p>" }
```
---

## freshdesk_create_ticket_note <span className="fd-tag fd-tag--write">write</span>

Fügt einem Ticket eine private (interne, für den Kunden nicht sichtbare) Notiz hinzu. Vorbehaltlich des [schreibgeschützten Modus](../configuration.md#read-only-mode).

**Alias:** `create_ticket_note`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `ticket_id` | Ganzzahl | Ja | - |
| „Körper“ | Zeichenfolge (HTML) | Ja | - |

**Anruf**
```json
{ "ticket_id": 12345, "body": "<p>Cliente ricontattato telefonicamente, problema confermato.</p>" }
```
**Antwort**
```json
{ "id": 7004, "ticket_id": 12345, "private": true, "body": "<p>Cliente ricontattato telefonicamente, problema confermato.</p>" }
```
---

## freshdesk_update_ticket_conversation <span className="fd-tag fd-tag--write">Update</span>

Aktualisieren Sie den Text einer vorhandenen Konversation (Antwort oder Notiz). Vorbehaltlich des [schreibgeschützten Modus](../configuration.md#read-only-mode).

**Alias:** `update_ticket_conversation`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `conversation_id` | Ganzzahl | Ja | - |
| „Körper“ | Zeichenfolge (HTML) | Ja | - |

:::Notizen
„conversation_id“ ist die ID der Nachricht, nicht das Ticket.
:::

**Anruf**
```json
{ "conversation_id": 7004, "body": "<p>Nota aggiornata con l'esito della verifica.</p>" }
```
---

## freshdesk_get_ticket_attachments <span className="fd-tag">lesen</span>

Listet Anhänge und Inline-Bilder eines Tickets und seiner Konversationen auf. Standardmäßig werden **nur die Metadaten** zurückgegeben, um eine Überlastung des Kontexts zu vermeiden.

**Alias:** `get_ticket_attachments`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `ticket_id` | Ganzzahl | Ja | - |
| `include_content` | boolescher Wert | Nein | „falsch“ |
| `max_total_bytes` | Ganzzahl | Nein | `5242880` (5 MB) |

Mit „include_content=true“ wird auch „data_base64“ hinzugefügt, mit festen Obergrenzen: **max. 1 MB pro Datei** und „max_total_bytes“ insgesamt (Standard 5 MB). Dateien, die über dem Budget liegen, sind mit „truncated: true“ gekennzeichnet und es sollte „attachment_url“ verwendet werden.

**Anruf**
```json
{ "ticket_id": 12345, "include_content": false }
```
**Antwort**
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

