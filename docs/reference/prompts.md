---
id: prompts
title: Prompt MCP Freshdesk
description: Reference dei prompt MCP Freshdesk per guidare il modello nella creazione di ticket e reply con payload corretti e contesto ticket.
sidebar_label: Prompt
---

# Prompt

Oltre ai tool, il server espone **2 prompt MCP** (registrati con `@mcp.prompt`). I prompt non chiamano direttamente l'API: producono un testo guidato che aiuta il modello a comporre correttamente il payload, indirizzandolo verso i tool giusti.

Usali quando vuoi ridurre ambiguità nella generazione del payload. Un prompt MCP è particolarmente utile nei client che lasciano al modello la scelta del tool successivo: invece di scrivere a mano tutto il JSON, il prompt ricorda campi obbligatori, formato atteso e controlli preliminari.

## Flusso consigliato

Per la creazione ticket, raccogli prima oggetto, descrizione, priorità, stato, canale e requester. Se il ticket usa campi personalizzati, recupera i metadati con `freshdesk_get_field_properties` prima di invocare `freshdesk_create_ticket`. Per le reply, leggi sempre la conversazione aggiornata con `freshdesk_get_ticket_conversation`, poi genera un corpo HTML breve e coerente con il tono delle risposte precedenti.

I prompt non sostituiscono i tool di sicurezza o validazione: servono a dare al modello una traccia operativa ripetibile. Se un workflow richiede approvazione umana, usa il prompt per preparare il payload e mostrare l'azione prevista, poi invoca il tool solo dopo conferma nel client.

---

## create_ticket

Guida la creazione di un ticket in Freshdesk.

| Argomento | Tipo | Obbligatorio |
|---|---|---|
| `subject` | string | Sì |
| `description` | string | Sì |
| `source` | string | Sì |
| `priority` | string | Sì |
| `status` | string | Sì |
| `email` | string | Sì |

Il prompt restituisce un'istruzione che incapsula gli argomenti come payload e ricorda al modello di:

- usare `freshdesk_get_field_properties()` per conoscere valori ammessi e chiavi interne dei campi;
- trattare `type` come **campo di sistema** (non custom), passandolo come campo top-level (in `additional_fields`), non dentro `custom_fields`.

Il testo generato è del tipo:

```text
Crea un ticket in Freshdesk usando questo payload:

{'subject': ..., 'description': ..., 'source': ..., 'priority': ..., 'status': ..., 'email': ...}

Se ti servono informazioni sui campi (valori ammessi o chiavi interne) usa
`freshdesk_get_field_properties()`.
...
```

A valle, il modello tipicamente invoca [`freshdesk_create_ticket`](./tickets.md#freshdesk_create_ticket-write).

---

## create_reply

Guida la creazione di una reply su un ticket.

| Argomento | Tipo | Obbligatorio |
|---|---|---|
| `ticket_id` | integer | Sì |
| `reply_message` | string | Sì |

Il prompt restituisce un'istruzione che incapsula `{ "body": reply_message }` e ricorda al modello di:

- formattare `body` in **HTML**, in modo breve ma contestualmente completo;
- rivedere prima la conversazione del ticket con [`freshdesk_get_ticket_conversation`](./conversazioni.md#freshdesk_get_ticket_conversation-read);
- mantenere tono e stile coerenti con le reply precedenti.

A valle, il modello tipicamente invoca [`freshdesk_create_ticket_reply`](./conversazioni.md#freshdesk_create_ticket_reply-write).
```text
Crea una reply per il ticket {ticket_id} in Freshdesk usando questo payload:

{'body': ...}
...
```
