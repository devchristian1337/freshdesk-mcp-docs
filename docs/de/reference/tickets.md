---
id: tickets
title: Tool ticket Freshdesk
description: Reference dei tool ticket Freshdesk MCP per lista, ricerca, dettaglio, creazione, aggiornamento, delete, riepiloghi e ticket field.
sidebar_label: Ticket
---
# Tickets

12 Tools zum Auflisten, Suchen, Lesen, Erstellen, Aktualisieren und Löschen von Tickets sowie Zusammenfassungen und Ticketfeldeigenschaften.

:::info[Referenzwerte]
Mehrere Tools nutzen die internen Werte von Freshdesk:

- **Quelle**: „1“ E-Mail · „2“ Portal · „3“ Telefon · „7“ Chat · „9“ Feedback-Widget · „10“ ausgehende E-Mail
- **Priorität**: „1“ niedrig · „2“ mittel · „3“ hoch · „4“ dringend
- **Status**: „2“ offen · „3“ ausstehend · „4“ gelöst · „5“ geschlossen
:::

---

## freshdesk_get_ticket_fields <span className="fd-tag">lesen</span>

Listet die konfigurierten Ticketfelder (Standard und benutzerdefiniert) mit ihren zulässigen Werten auf. Nützlich vor dem Erstellen/Aktualisieren von Tickets mit benutzerdefinierten Feldern.

**Alias:** `get_ticket_fields`

Keine Parameter.

**Antwort** – Liste der Felder mit „Name“ (interner Schlüssel), „Label“, „Typ“ und, für Dropdowns, „Auswahlmöglichkeiten“:
```json
[
  { "id": 1, "name": "status", "label": "Status", "type": "default_status" },
  { "id": 7, "name": "cf_causa", "label": "Causa", "type": "custom_dropdown",
    "choices": ["Bug", "Configurazione", "Formazione"] }
]
```
---

## freshdesk_get_tickets <span className="fd-tag">lesen</span>

Listen Sie Tickets mit einfacher Paginierung auf. Zum Filtern verwenden Sie „freshdesk_list_tickets“; Für Textabfragen verwenden Sie „freshdesk_search_tickets“.

**Alias:** `get_tickets`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `Seite` | Ganzzahl | Nein | `1` |
| `per_page` | Ganzzahl (1–100) | Nein | `30` |
| `include_full` | boolescher Wert | Nein | „falsch“ |

Standardmäßig enthält jedes Ticket nur die wesentlichen Felder für die Liste und alle ausgefüllten „custom_fields“. Setzen Sie „include_full=true“, um die vollständige Nutzlast jedes Tickets zu erhalten.

**Anruf**
```json
{ "page": 1, "per_page": 30 }
```
**Antwort**
```json
{
  "tickets": [
    { "id": 101, "subject": "Errore in fase di login", "status": 2, "priority": 3 }
  ],
  "pagination": { "current_page": 1, "next_page": 2, "prev_page": null, "per_page": 30 }
}
```
---

## freshdesk_list_tickets <span className="fd-tag">gelesen</span>

Listen Sie Tickets auf, indem Sie die nativen Filter des Endpunkts „GET /tickets“ anwenden.

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `filter_name` | Zeichenfolge | Nein | `null` |
| `requester_id` | Ganzzahl | Nein | `null` |
| `company_id` | Ganzzahl | Nein | `null` |
| `updated_since` | Zeichenfolge (ISO 8601) | Nein | `null` |
| `order_by` | Zeichenfolge | Nein | `null` |
| `order_type` | Zeichenfolge | Nein | `null` |
| `Seite` | Ganzzahl | Nein | `1` |
| `per_page` | Ganzzahl (1–100) | Nein | `30` |
| `include_full` | boolescher Wert | Nein | „falsch“ |

- „Filtername“: „new_and_my_open“, „watching“, „spam“, „deleted“.
- „order_by“: „created_at“, „due_by“, „updated_at“, „status“.
- „order_type“: „asc“, „desc“.
- „include_full“: gibt die vollständige Nutzlast jedes Tickets zurück; Standardmäßig projiziert der Server die wesentlichen Felder für die Liste.

**Anruf**
```json
{
  "filter_name": "new_and_my_open",
  "updated_since": "2026-01-01T00:00:00Z",
  "order_by": "updated_at",
  "order_type": "desc"
}
```
**Antwort**
```json
{
  "tickets": [
    { "id": 240, "subject": "Richiesta nuova utenza", "status": 3, "updated_at": "2026-06-10T09:12:00Z" }
  ],
  "pagination": { "current_page": 1, "next_page": null, "prev_page": null, "per_page": 30 }
}
```
---

## freshdesk_get_ticket <span className="fd-tag">lesen</span>

Rufen Sie ein einzelnes Ticket ab, mit der Möglichkeit, zugehörige Daten einzubetten.

**Alias:** `get_ticket`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `ticket_id` | Ganzzahl | Ja | - |
| „einschließen“ | Zeichenfolge | Nein | `null` |

„include“ akzeptiert durch Kommas getrennte Werte: „conversations“, „requester“, „company“, „stats“.

**Anruf**
```json
{ "ticket_id": 12345, "include": "conversations,requester" }
```
**Antwort** – das Ticketobjekt (mit den erforderlichen Abschnitten in „include“):
```json
{
  "id": 12345,
  "subject": "Errore in fase di login",
  "status": 2,
  "priority": 3,
  "requester_id": 6001,
  "group_id": 12,
  "tags": ["login", "urgente"],
  "created_at": "2026-06-09T08:30:00Z",
  "updated_at": "2026-06-10T11:05:00Z"
}
```
---

## freshdesk_search_tickets <span className="fd-tag">gelesen</span>

Suchen Sie nach Tickets über strukturierte Filter im Endpunkt „/search/tickets“. Der Server erstellt das Freshdesk DSL, kombiniert Filter mit „AND“ und übernimmt die Zitat- und Datumsformatierung. Es gibt keine Volltextsuche nach „Betreff“ oder „Beschreibung“. Um nach Unternehmen oder Antragsteller zu filtern, verwenden Sie „freshdesk_list_tickets“ mit „company_id“ oder „requester_id“.

**Alias:** `search_tickets`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `Status` | Ganzzahl | Nein | `null` |
| „Priorität“ | Ganzzahl | Nein | `null` |
| `agent_id` | Ganzzahl | Nein | `null` |
| `group_id` | Ganzzahl | Nein | `null` |
| `ticket_type` | Zeichenfolge | Nein | `null` |
| `Tag` | Zeichenfolge | Nein | `null` |
| `created_after` | string (`yyyy-mm-dd`) | Nein | `null` |
| `created_before` | string (`yyyy-mm-dd`) | Nein | `null` |
| `updated_after` | string (`yyyy-mm-dd`) | Nein | `null` |
| `updated_before` | string (`yyyy-mm-dd`) | Nein | `null` |
| `custom_fields` | Objekt | Nein | `null` |
| `Abfrage` | string (erweitertes DSL) | Nein | `null` |
| `Seite` | Ganzzahl (1–10) | Nein | `1` |
| `include_full` | boolescher Wert | Nein | „falsch“ |

Stellen Sie mindestens einen strukturierten Filter oder eine gültige DSL-Abfrage bereit. „query“ ist ein erweitertes DSL-Fragment, kein Freitext; Bei Verwendung zusammen mit Filtern wird es mit diesen über „UND“ verknüpft. In „custom_fields“ wird das Präfix „cf_“ automatisch hinzugefügt, wenn es fehlt.

**Anruf**
```json
{ "status": 2, "priority": 4, "group_id": 15, "updated_after": "2026-01-01" }
```
**Antwort** – Freshdesk-Suchergebnis:
```json
{
  "results": [
    { "id": 980, "subject": "Sistema irraggiungibile", "status": 2, "priority": 4 }
  ],
  "total": 1
}
```
---

## freshdesk_create_ticket <span className="fd-tag fd-tag--write">write</span>

Erstellen Sie ein Ticket. Vorbehaltlich des [schreibgeschützten Modus](../configuration.md#read-only-mode).

**Alias:** `create_ticket`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `Betreff` | Zeichenfolge | Ja | - |
| `Beschreibung` | Zeichenfolge (HTML) | Ja | - |
| „Quelle“ | ganze Zahl (Quelle) | Ja | - |
| „Priorität“ | Ganzzahl (Priorität) | Ja | - |
| `Status` | Ganzzahl (Status) | Ja | - |
| „E-Mail“ | Zeichenfolge | Bedingt | `null` |
| `requester_id` | Ganzzahl | Bedingt | `null` |
| `custom_fields` | Objekt | Nein | `null` |
| `additional_fields` | Objekt | Nein | `null` |

Mindestens eine der Optionen „email“ und „requester_id“ ist erforderlich. `additional_fields` sammelt andere Felder der obersten Ebene (z. B. `{"type": "Question", "group_id": 123}`).

**Anruf**
```json
{
  "subject": "Problema di fatturazione",
  "description": "<p>Il cliente segnala un importo errato.</p>",
  "source": 2,
  "priority": 3,
  "status": 2,
  "email": "cliente@acme.it",
  "additional_fields": { "type": "Question", "group_id": 12 }
}
```
**Antwort**
```json
{ "success": true, "message": "Ticket creato", "ticket": { "id": 12346, "subject": "Problema di fatturazione" } }
```
Im Falle eines Validierungsfehlers:
```json
{ "success": false, "error": "Errore di validazione: [{'field': 'email', 'message': '...'}]" }
```
---

## freshdesk_update_ticket <span className="fd-tag fd-tag--write">Update</span>

Aktualisieren Sie die Felder eines Tickets. Vorbehaltlich des [schreibgeschützten Modus](../configuration.md#read-only-mode).

**Alias:** `update_ticket`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `ticket_id` | Ganzzahl | Ja | - |
| `ticket_fields` | Objekt | Ja | - |

Allgemeine „Ticket_fields“-Schlüssel: „Status“ (2–5), „Priorität“ (1–4), „Gruppen-ID“, „Responder_ID“ (Submit-Agent), „Typ“, „Tags“ (Liste), „Custom_fields“ (Dikt).

**Anruf**
```json
{
  "ticket_id": 12345,
  "ticket_fields": { "status": 4, "responder_id": 123, "custom_fields": { "cf_causa": "Bug" } }
}
```
**Antwort**
```json
{ "success": true, "message": "Ticket aggiornato", "ticket": { "id": 12345, "status": 4 } }
```
---

## freshdesk_delete_ticket <span className="fd-tag fd-tag--delete">löschen</span>

Ein Ticket löschen (in den Papierkorb verschieben). Zerstörerischer Vorgang, unterliegt dem [schreibgeschützten Modus](../configurazione.md#read-only-mode).

**Alias:** `delete_ticket`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `ticket_id` | Ganzzahl | Ja | - |

**Anruf**
```json
{ "ticket_id": 12345 }
```
**Antwort**
```json
{ "success": true, "message": "Ticket eliminato" }
```
---

## freshdesk_view_ticket_summary <span className="fd-tag">gelesen</span>

Ruft die Zusammenfassung eines Tickets ab.

**Alias:** `view_ticket_summary`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `ticket_id` | Ganzzahl | Ja | - |

**Antwort**
```json
{ "id": 55, "ticket_id": 12345, "body": "Cliente con importo errato; in attesa di verifica." }
```
---

## freshdesk_update_ticket_summary <span className="fd-tag fd-tag--write">Update</span>

Erstellen oder aktualisieren Sie eine Ticketzusammenfassung. Vorbehaltlich des [schreibgeschützten Modus](../configuration.md#read-only-mode).

**Alias:** `update_ticket_summary`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `ticket_id` | Ganzzahl | Ja | - |
| „Körper“ | Zeichenfolge | Ja | - |

**Anruf**
```json
{ "ticket_id": 12345, "body": "Verificato l'importo: emessa nota di credito." }
```
---

## freshdesk_delete_ticket_summary <span className="fd-tag fd-tag--delete">löschen</span>

Löschen Sie eine Ticketzusammenfassung. Zerstörerischer Vorgang, unterliegt dem [schreibgeschützten Modus](../configurazione.md#read-only-mode).

**Alias:** `delete_ticket_summary`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `ticket_id` | Ganzzahl | Ja | - |

**Antwort**
```json
{ "success": true, "message": "Riepilogo del ticket eliminato" }
```
---

## freshdesk_get_field_properties <span className="fd-tag">lesen</span>

Ruft die Eigenschaften eines bestimmten Ticketfelds anhand des internen Namens ab.

**Alias:** `get_field_properties`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `Feldname` | Zeichenfolge | Ja | - |

Der Name „type“ wird automatisch dem Systemfeld „ticket_type“ zugeordnet.

**Anruf**
```json
{ "field_name": "priority" }
```
**Antwort** – das passende Feldobjekt (oder „null“, wenn nicht gefunden):
```json
{
  "id": 3,
  "name": "priority",
  "label": "Priority",
  "type": "default_priority",
  "choices": { "Low": 1, "Medium": 2, "High": 3, "Urgent": 4 }
}
```

