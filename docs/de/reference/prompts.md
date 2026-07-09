---
id: prompts
title: Prompt MCP Freshdesk
description: Reference dei prompt MCP Freshdesk per guidare il modello nella creazione di ticket e reply con payload corretti e contesto ticket.
sidebar_label: Prompt
---
# Eingabeaufforderungen

Zusätzlich zu den Tools stellt der Server **2 MCP-Eingabeaufforderungen** bereit (registriert mit „@mcp.prompt“). Die Eingabeaufforderungen rufen die API nicht direkt auf: Sie erzeugen einen geführten Text, der dem Modell hilft, die Nutzlast richtig zusammenzustellen und sie an die richtigen Tools weiterzuleiten.

Verwenden Sie sie, wenn Sie die Mehrdeutigkeit bei der Nutzlastgenerierung reduzieren möchten. Eine MCP-Eingabeaufforderung ist besonders nützlich für Kunden, die das Modell verlassen, um das nächste Tool auszuwählen: Anstatt den gesamten JSON-Code handschriftlich zu schreiben, merkt sich die Eingabeaufforderung erforderliche Felder, das erwartete Format und vorläufige Prüfungen.

## Empfohlener Durchfluss

Um Tickets zu erstellen, erfassen Sie zunächst Betreff, Beschreibung, Priorität, Status, Kanal und Anforderer. Wenn das Ticket benutzerdefinierte Felder verwendet, rufen Sie die Metadaten mit „freshdesk_get_field_properties“ ab, bevor Sie „freshdesk_create_ticket“ aufrufen. Lesen Sie für Antworten immer die aktualisierte Konversation mit „freshdesk_get_ticket_conversation“ und generieren Sie dann einen kurzen HTML-Text, der dem Ton vorheriger Antworten entspricht.

Eingabeaufforderungen ersetzen keine Sicherheits- oder Validierungstools: Sie dienen dazu, dem Modell eine wiederholbare Betriebsverfolgung zu geben. Wenn ein Workflow eine menschliche Genehmigung erfordert, verwenden Sie die Eingabeaufforderung, um die Nutzlast vorzubereiten und die erwartete Aktion anzuzeigen. Rufen Sie das Tool dann erst nach Bestätigung im Client auf.

---

## create_ticket

Leitet die Erstellung eines Tickets in Freshdesk.

| Thema | Geben Sie | ein Erforderlich |
|---|---|---|
| `Betreff` | Zeichenfolge | Ja |
| `Beschreibung` | Zeichenfolge | Ja |
| „Quelle“ | Zeichenfolge | Ja |
| „Priorität“ | Zeichenfolge | Ja |
| `Status` | Zeichenfolge | Ja |
| „E-Mail“ | Zeichenfolge | Ja |

Die Eingabeaufforderung gibt eine Anweisung zurück, die die Argumente als Nutzlast kapselt und das Modell daran erinnert:

- Verwenden Sie „freshdesk_get_field_properties()“, um zulässige Werte und interne Schlüssel der Felder zu erfahren;
- Behandeln Sie „Typ“ als **Systemfeld** (nicht benutzerdefiniert) und übergeben Sie es als Feld der obersten Ebene (in „additional_fields“), nicht innerhalb von „custom_fields“.

Der generierte Text ist vom Typ:
```text
Crea un ticket in Freshdesk usando questo payload:

{'subject': ..., 'description': ..., 'source': ..., 'priority': ..., 'status': ..., 'email': ...}

Se ti servono informazioni sui campi (valori ammessi o chiavi interne) usa
`freshdesk_get_field_properties()`.
...
```
Nachgelagert ruft das Modell normalerweise [`freshdesk_create_ticket`](./tickets.md#freshdesk_create_ticket-write) auf.

---

## create_reply

Leitet die Erstellung einer Antwort auf ein Ticket.

| Thema | Geben Sie | ein Erforderlich |
|---|---|---|
| `ticket_id` | Ganzzahl | Ja |
| `reply_message` | Zeichenfolge | Ja |

Die Eingabeaufforderung gibt eine Anweisung zurück, die `{ "body": reply_message }` kapselt und das Modell daran erinnert:

- „Körper“ in **HTML** formatieren, kurz, aber kontextbezogen vollständig;
- Überprüfen Sie zuerst die Ticketkonversation mit [`freshdesk_get_ticket_conversation`](./conversazioni.md#freshdesk_get_ticket_conversation-read);
- Halten Sie Ton und Stil im Einklang mit früheren Antworten.

Nachgelagert ruft das Modell normalerweise [`freshdesk_create_ticket_reply`](./conversazioni.md#freshdesk_create_ticket_reply-write) auf.
```text
Crea una reply per il ticket {ticket_id} in Freshdesk usando questo payload:

{'body': ...}
...
```
