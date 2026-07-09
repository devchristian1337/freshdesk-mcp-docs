---
id: prompts
title: Prompt MCP Freshdesk
description: Reference dei prompt MCP Freshdesk per guidare il modello nella creazione di ticket e reply con payload corretti e contesto ticket.
sidebar_label: Prompt
---
# Prompts

In addition to the tools, the server exposes **2 MCP prompts** (registered with `@mcp.prompt`). The prompts do not call the API directly: they produce a guided text that helps the model to correctly compose the payload, directing it to the right tools.

Use them when you want to reduce ambiguity in payload generation. An MCP prompt is particularly useful in clients that leave the model to choose the next tool: instead of handwriting all the JSON, the prompt remembers required fields, expected format, and preliminary checks.

## Recommended flow

To create tickets, first collect subject, description, priority, status, channel and requester. If the ticket uses custom fields, get the metadata with `freshdesk_get_field_properties` before invoking `freshdesk_create_ticket`. For replies, always read the updated conversation with `freshdesk_get_ticket_conversation`, then generate a short HTML body consistent with the tone of previous replies.

Prompts do not replace security or validation tools: they serve to give the model a repeatable operational trace. If a workflow requires human approval, use the prompt to prepare the payload and show the expected action, then invoke the tool only after confirmation in the client.

---

## create_ticket

Guides the creation of a ticket in Freshdesk.

| Topic | Type | Required |
|---|---|---|
| `subject` | string | Yes |
| `description` | string | Yes |
| `source` | string | Yes |
| `priority` | string | Yes |
| `status` | string | Yes |
| `email` | string | Yes |

The prompt returns a statement that encapsulates the arguments as payload and reminds the model to:

- use `freshdesk_get_field_properties()` to know allowed values and internal keys of the fields;
- treat `type` as **system field** (not custom), passing it as a top-level field (in `additional_fields`), not inside `custom_fields`.

The generated text is of the type:
```text
Crea un ticket in Freshdesk usando questo payload:

{'subject': ..., 'description': ..., 'source': ..., 'priority': ..., 'status': ..., 'email': ...}

Se ti servono informazioni sui campi (valori ammessi o chiavi interne) usa
`freshdesk_get_field_properties()`.
...
```
Downstream, the model typically invokes [`freshdesk_create_ticket`](./tickets.md#freshdesk_create_ticket-write).

---

## create_reply

Guides the creation of a reply on a ticket.

| Topic | Type | Required |
|---|---|---|
| `ticket_id` | integer | Yes |
| `reply_message` | string | Yes |

The prompt returns a statement that encapsulates `{ "body": reply_message }` and reminds the model to:

- format `body` in **HTML**, in a short but contextually complete way;
- review the ticket conversation first with [`freshdesk_get_ticket_conversation`](./conversazioni.md#freshdesk_get_ticket_conversation-read);
- keep tone and style consistent with previous replies.

Downstream, the model typically invokes [`freshdesk_create_ticket_reply`](./conversazioni.md#freshdesk_create_ticket_reply-write).
```text
Crea una reply per il ticket {ticket_id} in Freshdesk usando questo payload:

{'body': ...}
...
```

