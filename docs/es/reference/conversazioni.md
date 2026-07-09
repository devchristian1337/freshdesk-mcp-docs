---
id: conversazioni
title: Tool conversazioni Freshdesk
description: Reference dei tool conversazioni Freshdesk MCP per leggere thread, creare reply o note, aggiornare messaggi e gestire allegati ticket.
sidebar_label: Conversazioni
---
# Conversaciones

5 herramientas para el hilo de conversación de un ticket: lectura completa, respuestas públicas, notas internas, edición de un mensaje y archivos adjuntos.

---

## Freshdesk_get_ticket_conversation <span className="fd-tag">leer</span>

Recupera todo el hilo de conversación de un ticket, paginando automáticamente todas las páginas.

**Alias:** `get_ticket_conversation`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `ticket_id` | entero | Sí | - |

**Responder** - lista de mensajes (respuestas públicas y notas privadas); cada uno con `body`/`body_text`, `user_id`, `private` (verdadero para notas internas), `incoming`, `created_at` y cualquier `adjunto`:
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
:::precaución[Tamaño del contexto]
En tickets con muchos intercambios, los cuerpos HTML pueden ser largos: la herramienta aún devuelve todas las páginas.
:::

---

## Freshdesk_create_ticket_reply <span className="fd-tag fd-tag--write">escribir</span>

Envíe una respuesta pública (visible para el cliente) en un ticket. Sujeto a [modo de solo lectura](../configuration.md#read-only-mode).

**Alias:** `create_ticket_reply`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `ticket_id` | entero | Sí | - |
| `cuerpo` | cadena (HTML) | Sí | - |

**Llamar**
```json
{ "ticket_id": 12345, "body": "<p>Abbiamo reimpostato il suo accesso, può riprovare.</p>" }
```
**Responder** - el objeto de conversación creado:
```json
{ "id": 7003, "ticket_id": 12345, "private": false, "body": "<p>Abbiamo reimpostato il suo accesso, può riprovare.</p>" }
```
---

## Freshdesk_create_ticket_note <span className="fd-tag fd-tag--write">escribir</span>

Agrega una nota privada (interna, no visible para el cliente) a un ticket. Sujeto a [modo de solo lectura](../configuration.md#read-only-mode).

**Alias:** `create_ticket_note`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `ticket_id` | entero | Sí | - |
| `cuerpo` | cadena (HTML) | Sí | - |

**Llamar**
```json
{ "ticket_id": 12345, "body": "<p>Cliente ricontattato telefonicamente, problema confermato.</p>" }
```
**Respuesta**
```json
{ "id": 7004, "ticket_id": 12345, "private": true, "body": "<p>Cliente ricontattato telefonicamente, problema confermato.</p>" }
```
---

## Freshdesk_update_ticket_conversation <span className="fd-tag fd-tag--write">actualizar</span>

Actualiza el cuerpo de una conversación existente (respuesta o nota). Sujeto a [modo de solo lectura](../configuration.md#read-only-mode).

**Alias:** `update_ticket_conversation`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `id_conversación` | entero | Sí | - |
| `cuerpo` | cadena (HTML) | Sí | - |

:::notas
`conversation_id` es el ID del mensaje, no el ticket.
:::

**Llamar**
```json
{ "conversation_id": 7004, "body": "<p>Nota aggiornata con l'esito della verifica.</p>" }
```
---

## Freshdesk_get_ticket_attachments <span className="fd-tag">leer</span>

Enumera archivos adjuntos e imágenes en línea de un ticket y sus conversaciones. Por defecto devuelve **solo los metadatos** para evitar saturar el contexto.

**Alias:** `get_ticket_attachments`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `ticket_id` | entero | Sí | - |
| `incluir_contenido` | booleano | No | `falso` |
| `max_total_bytes` | entero | No | `5242880` (5MB) |

Con `include_content=true`, también se agrega `data_base64`, con límites estrictos: **máximo 1 MB por archivo** y `max_total_bytes` en general (5 MB predeterminados). Los archivos que superan el presupuesto están marcados como "truncados: verdadero" y se debe utilizar "attachment_url".

**Llamar**
```json
{ "ticket_id": 12345, "include_content": false }
```
**Respuesta**
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

