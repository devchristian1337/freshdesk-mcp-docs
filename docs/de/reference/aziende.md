---
id: aziende
title: Tool aziende Freshdesk
description: Reference dei tool aziende Freshdesk MCP per listare, cercare, leggere, creare e aggiornare company, domini e campi account.
sidebar_label: Aziende
---
# Unternehmen

5 Tools zum Auflisten, Lesen, Suchen, Erstellen und Aktualisieren von Unternehmen.

---

## freshdesk_list_companies <span className="fd-tag">gelesen</span>

Listet Unternehmen mit Paginierung auf.

**Alias:** `list_companies`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `Seite` | Ganzzahl | Nein | `1` |
| `per_page` | Ganzzahl (1–100) | Nein | `30` |

**Antwort**
```json
{
  "companies": [
    { "id": 3001, "name": "Acme S.p.A.", "domains": ["acme.it"] }
  ],
  "pagination": { "current_page": 1, "next_page": null, "prev_page": null, "per_page": 30 }
}
```
---

## freshdesk_view_company <span className="fd-tag">gelesen</span>

Rufen Sie die Details eines Unternehmens anhand der ID ab.

**Alias:** `view_company`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `company_id` | Ganzzahl | Ja | - |

**Antwort**
```json
{
  "id": 3001,
  "name": "Acme S.p.A.",
  "domains": ["acme.it"],
  "industry": "Manifatturiero",
  "account_tier": "Premium"
}
```
---

## freshdesk_search_companies <span className="fd-tag">gelesen</span>

Suche nach Unternehmen nach Namen (automatische Vervollständigung). Führen Sie die alten „search_companies“ und „find_company_by_name“ zusammen.

**Alias:** „search_companies“, „find_company_by_name“.

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `Abfrage` | Zeichenfolge | Ja | - |

„Abfrage“ ist der Name (auch teilweise) des Unternehmens, nach dem gesucht werden soll.

**Anruf**
```json
{ "query": "acme" }
```
**Antwort**
```json
[
  { "id": 3001, "name": "Acme S.p.A." }
]
```
---

## freshdesk_create_company <span className="fd-tag fd-tag--write">schreiben</span>

Erstellen Sie ein neues Unternehmen.

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| „Unternehmen“ | object(CompanyCreate) | Ja | - |

**Felder von „Firma“** – „Name“ ist erforderlich:

| Feld | Geben Sie | ein Erforderlich | Notizen |
|---|---|---|---|
| `Name` | Zeichenfolge | Ja | Eindeutiger Firmenname |
| `Domänen` | String-Array | Nein | Zugehörige E-Mail-Domänen |
| `Beschreibung` | Zeichenfolge | Nein | Beschreibung |
| `Notizen` | Zeichenfolge | Nein | Interner Hinweis |
| `health_score` | Zeichenfolge | Nein | Ex. „Glücklich“, „Gefährdet“ |
| `account_tier` | Zeichenfolge | Nein | Ex. „Premium“ |
| „Industrie“ | Zeichenfolge | Nein | Sektor, zu dem Sie gehören |
| `custom_fields` | Objekt | Nein | Benutzerdefinierte Felder |

**Anruf**
```json
{
  "company": {
    "name": "Acme S.p.A.",
    "domains": ["acme.it"],
    "industry": "Manifatturiero",
    "account_tier": "Premium"
  }
}
```
**Antwort**
```json
{ "id": 3002, "name": "Acme S.p.A.", "domains": ["acme.it"] }
```
---

## freshdesk_update_company <span className="fd-tag fd-tag--write">Update</span>

Aktualisieren Sie ein Unternehmen. Alle Felder sind optional; Wenn die Nutzlast leer ist, wird ein Fehler zurückgegeben.

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `company_id` | Ganzzahl | Ja | - |
| „Unternehmen“ | Objekt (CompanyUpdate) | Ja | - |

**`Unternehmen`** Felder (alle optional): `Name`, `Domänen`, `Beschreibung`, `Notiz`, `Gesundheitsscore`, `Kontoebene`, `Industrie`, `benutzerdefinierte_Felder`.

**Anruf**
```json
{ "company_id": 3002, "company": { "account_tier": "Enterprise" } }
```
**Antwort**
```json
{ "id": 3002, "name": "Acme S.p.A.", "account_tier": "Enterprise" }
```
Wenn kein Feld bereitgestellt wird:
```json
{ "error": "Nessun campo fornito per l'aggiornamento dell'azienda." }
```

