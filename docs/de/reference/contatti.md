---
id: contatti
title: Tool contatti Freshdesk
description: Reference dei tool contatti Freshdesk MCP per listare, cercare, leggere, creare e aggiornare requester con campi standard e custom.
sidebar_label: Contatti
---
# Kontakte

5 Tools zum Auflisten, Lesen, Suchen, Erstellen und Aktualisieren von Kontakten.

---

## freshdesk_list_contacts <span className="fd-tag">gelesen</span>

Listen Sie Kontakte mit optionaler Paginierung und Filtern auf.

**Alias:** `list_contacts`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `Seite` | Ganzzahl | Nein | `1` |
| `per_page` | Ganzzahl (1–100) | Nein | `30` |
| „E-Mail“ | Zeichenfolge | Nein | `null` |
| `company_id` | Ganzzahl | Nein | `null` |
| `updated_since` | Zeichenfolge (ISO 8601) | Nein | `null` |

**Anruf**
```json
{ "company_id": 3001, "per_page": 50 }
```
**Antwort**
```json
{
  "contacts": [
    { "id": 6001, "name": "Mario Rossi", "email": "mario.rossi@acme.it", "company_id": 3001 }
  ],
  "pagination": { "current_page": 1, "next_page": null, "prev_page": null, "per_page": 50 }
}
```
---

## freshdesk_get_contact <span className="fd-tag">lesen</span>

Rufen Sie die Details eines Kontakts anhand der ID ab.

**Alias:** `get_contact`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `contact_id` | Ganzzahl | Ja | - |

**Antwort**
```json
{
  "id": 6001,
  "name": "Mario Rossi",
  "email": "mario.rossi@acme.it",
  "phone": "+39 02 1234567",
  "company_id": 3001,
  "job_title": "IT Manager"
}
```
---

## freshdesk_search_contacts <span className="fd-tag">gelesen</span>

Suchen Sie Kontakte nach Namen oder E-Mail (automatische Vervollständigung).

**Alias:** `search_contacts`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `Abfrage` | Zeichenfolge | Ja | - |

**Anruf**
```json
{ "query": "rossi" }
```
**Antwort**
```json
[
  { "id": 6001, "name": "Mario Rossi", "email": "mario.rossi@acme.it" }
]
```
---

## freshdesk_create_contact <span className="fd-tag fd-tag--write">schreiben</span>

Erstellen Sie einen neuen Kontakt.

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `Kontakt` | Objekt (ContactCreate) | Ja | - |

**Kontaktfelder** – „Name“ ist obligatorisch und erfordert **mindestens eines** von „E-Mail“, „Telefon“, „Mobiltelefon“, „Twitter_ID“, „eindeutige_externe_ID“:

| Feld | Geben Sie | ein Erforderlich | Notizen |
|---|---|---|---|
| `Name` | Zeichenfolge | Ja | Vollständiger Name |
| „E-Mail“ | Zeichenfolge | Bedingt | Primäre E-Mail |
| „Telefon“ | Zeichenfolge | Bedingt | Festnetz |
| „mobil“ | Zeichenfolge | Bedingt | Mobil |
| `twitter_id` | Zeichenfolge | Bedingt | Twitter-Handle |
| `unique_external_id` | Zeichenfolge | Bedingt | Eindeutige externe ID |
| `company_id` | Ganzzahl | Nein | Unternehmen, zu dem Sie gehören |
| `job_title` | Zeichenfolge | Nein | Rolle/Qualifikation |
| `Beschreibung` | Zeichenfolge | Nein | Kontaktnotizen |
| `custom_fields` | Objekt | Nein | Benutzerdefinierte Felder |

**Anruf**
```json
{
  "contact": {
    "name": "Giulia Bianchi",
    "email": "giulia.bianchi@acme.it",
    "company_id": 3001,
    "job_title": "Responsabile Acquisti"
  }
}
```
**Antwort**
```json
{ "id": 6002, "name": "Giulia Bianchi", "email": "giulia.bianchi@acme.it", "company_id": 3001 }
```
---

## freshdesk_update_contact <span className="fd-tag fd-tag--write">Update</span>

Aktualisieren Sie einen Kontakt.

**Alias:** `update_contact`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `contact_id` | Ganzzahl | Ja | - |
| `contact_fields` | Objekt | Ja | - |

Allgemeine Schlüssel für „Kontaktfelder“: „Name“, „E-Mail“, „Telefon“, „Firmen-ID“, „Jobtitel“, „benutzerdefinierte_Felder“.

**Anruf**
```json
{ "contact_id": 6002, "contact_fields": { "job_title": "Direttore Acquisti" } }
```
**Antwort**
```json
{ "id": 6002, "name": "Giulia Bianchi", "job_title": "Direttore Acquisti" }
```

