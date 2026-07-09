---
id: campi
title: Tool campi Freshdesk
description: Reference dei tool campi Freshdesk MCP per ticket field, contact field e company field, con lettura, creazione e aggiornamento.
sidebar_label: Campi
---
# Felder

8 Tools zum Verwalten von Feldern (Standard und benutzerdefinierte) von Tickets, Kontakten und Unternehmen. Ticketfelder werden über Admin-Endpunkte verwaltet.

---

## freshdesk_create_ticket_field <span className="fd-tag fd-tag--write">write</span>

Erstellen Sie ein benutzerdefiniertes Ticketfeld (Administratorendpunkt).

**Alias:** `create_ticket_field`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `ticket_field_fields` | Objekt | Ja | - |

„ticket_field_fields“ erfordert mindestens „label“ und „type“ (z. B. „custom_text“, „custom_dropdown“); für Dropdowns sind „Auswahlmöglichkeiten“ enthalten.

**Anruf**
```json
{
  "ticket_field_fields": {
    "label": "Causa",
    "type": "custom_dropdown",
    "choices": ["Bug", "Configurazione", "Formazione"]
  }
}
```
**Antwort**
```json
{ "id": 50, "name": "cf_causa", "label": "Causa", "type": "custom_dropdown" }
```
---

## freshdesk_view_ticket_field <span className="fd-tag">lesen</span>

Rufen Sie ein Ticketfeld nach ID ab (Administrator-Endpunkt).

**Alias:** `view_ticket_field`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `ticket_field_id` | Ganzzahl | Ja | - |

**Antwort**
```json
{ "id": 50, "name": "cf_causa", "label": "Causa", "type": "custom_dropdown", "choices": ["Bug", "Configurazione"] }
```
---

## freshdesk_update_ticket_field <span className="fd-tag fd-tag--write">Update</span>

Aktualisieren Sie ein benutzerdefiniertes Ticketfeld (Administratorendpunkt).

**Alias:** `update_ticket_field`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `ticket_field_id` | Ganzzahl | Ja | - |
| `ticket_field_fields` | Objekt | Ja | - |

Gemeinsame Schlüssel: „Label“, „Auswahl“.

**Anruf**
```json
{ "ticket_field_id": 50, "ticket_field_fields": { "choices": ["Bug", "Configurazione", "Formazione", "Altro"] } }
```
---

## freshdesk_list_contact_fields <span className="fd-tag">gelesen</span>

Listet alle Kontaktfelder (Standard und benutzerdefiniert) mit internen Namen auf.

**Alias:** `list_contact_fields`

Keine Parameter.

**Antwort**
```json
[
  { "id": 1, "name": "name", "label": "Nome", "type": "default_name" },
  { "id": 9, "name": "cf_reparto", "label": "Reparto", "type": "custom_text" }
]
```
---

## freshdesk_view_contact_field <span className="fd-tag">gelesen</span>

Rufen Sie ein Kontaktfeld für die ID ab.

**Alias:** `view_contact_field`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `contact_field_id` | Ganzzahl | Ja | - |

**Antwort**
```json
{ "id": 9, "name": "cf_reparto", "label": "Reparto", "type": "custom_text" }
```
---

## freshdesk_create_contact_field <span className="fd-tag fd-tag--write">write</span>

Erstellen Sie ein benutzerdefiniertes Kontaktfeld.

**Alias:** `create_contact_field`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `Feld` | Objekt (ContactFieldCreate) | Ja | - |

**Felder von `field`:**

| Feld | Geben Sie | ein Erforderlich | Standard | Notizen |
|---|---|---|---|---|
| `Etikett` | Zeichenfolge | Ja | - | Name der Agentenseite |
| `label_for_customers` | Zeichenfolge | Ja | - | Name der Kundenseite |
| „Typ“ | Zeichenfolge | Ja | - | Einer von: „custom_text“, „custom_paragraph“, „custom_checkbox“, „custom_number“, „custom_dropdown“, „custom_phone_number“, „custom_url“, „custom_date“ |
| `editable_in_signup` | boolescher Wert | Nein | „falsch“ | Wertvoll bei der Anmeldung |
| `Position` | Ganzzahl | Nein | `1` | Feldposition |
| `required_for_agents` | boolescher Wert | Nein | „falsch“ | Obligatorisch für Agenten |
| `customers_can_edit` | boolescher Wert | Nein | „falsch“ | Kann vom Kunden geändert werden |
| `required_for_customers` | boolescher Wert | Nein | „falsch“ | Obligatorisch im Portal |
| `displayed_for_customers` | boolescher Wert | Nein | „falsch“ | Sichtbar im Portal |
| „Entscheidungen“ | Array von Objekten | Nein | `null` | Für Dropdowns: `[{ "value": "Text", "position": 1 }]` |

**Anruf**
```json
{
  "field": {
    "label": "Reparto",
    "label_for_customers": "Il tuo reparto",
    "type": "custom_text",
    "required_for_agents": true
  }
}
```
**Antwort**
```json
{ "id": 12, "name": "cf_reparto", "label": "Reparto", "type": "custom_text" }
```
---

## freshdesk_update_contact_field <span className="fd-tag fd-tag--write">Update</span>

Aktualisieren Sie ein benutzerdefiniertes Kontaktfeld.

**Alias:** `update_contact_field`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `contact_field_id` | Ganzzahl | Ja | - |
| `contact_field_fields` | Objekt | Ja | - |

Gemeinsame Schlüssel: „Label“, „Auswahl“.

**Anruf**
```json
{ "contact_field_id": 12, "contact_field_fields": { "label": "Reparto aziendale" } }
```
---

## freshdesk_list_company_fields <span className="fd-tag">gelesen</span>

Listet alle Firmenfelder (Standard und benutzerdefiniert) mit internen Namen auf.

**Alias:** `list_company_fields`

Keine Parameter.

**Antwort**
```json
[
  { "id": 1, "name": "name", "label": "Nome", "type": "default_name" },
  { "id": 5, "name": "cf_settore", "label": "Settore", "type": "custom_dropdown" }
]
```

