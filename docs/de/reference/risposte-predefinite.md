---
id: risposte-predefinite
title: Tool risposte predefinite
description: Reference dei tool risposte predefinite Freshdesk MCP per cartelle, canned response, contenuti HTML, visibilità e aggiornamenti.
sidebar_label: Risposte predefinite
---
# Vorgefertigte Antworten

7 Tools zum Verwalten vorgefertigter Antworten und der Ordner, in denen sie enthalten sind.

Mit vorgefertigten Antworten können Sie wiederkehrende Kommunikation standardisieren, ohne die Kontrolle über den endgültigen Text zu verlieren, der an den Kunden gesendet wird. In Freshdesk MCP trennen die Tools Ordner und Inhalte: Zuerst identifizieren Sie den Ordner, dann lesen oder ändern Sie die vorgefertigte Antwort. Dies ist nützlich, wenn ein KI-Assistent eine Antwort vorschlagen muss, die mit internen Verfahren, Rückerstattungsrichtlinien, Onboarding-Nachrichten oder Mitteilungen des technischen Supports übereinstimmt.

Um unerwünschte Änderungen zu vermeiden, verwenden Sie die „Lese“-Tools, um Titel, HTML und Sichtbarkeit abzurufen, bevor Sie ein „Schreib“- oder „Aktualisierungs“-Tool aufrufen. Das Feld „Sichtbarkeit“ legt fest, wer die Antwort verwenden kann: alle Agenten, nur der Eigentümer oder ausgewählte Gruppen.

---

## freshdesk_list_canned_response_folders <span className="fd-tag">gelesen</span>

Listet die vorgefertigten Antwortordner auf.

**Alias:** `list_canned_response_folders`

Keine Parameter.

**Antwort**
```json
[
  { "id": 201, "name": "Fatturazione", "responses_count": 8 },
  { "id": 202, "name": "Accesso e credenziali", "responses_count": 5 }
]
```
---

## freshdesk_list_canned_responses <span className="fd-tag">gelesen</span>

Listet die in einem Ordner enthaltenen vorgefertigten Antworten auf.

**Alias:** `list_canned_responses`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `folder_id` | Ganzzahl | Ja | - |

**Anruf**
```json
{ "folder_id": 201 }
```
**Antwort**
```json
[
  { "id": 5001, "title": "Conferma rimborso", "folder_id": 201 }
]
```
---

## freshdesk_view_canned_response <span className="fd-tag">lesen</span>

Ruft die Details einer vorgefertigten Antwort nach ID ab.

**Alias:** `view_canned_response`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `canned_response_id` | Ganzzahl | Ja | - |

**Antwort**
```json
{
  "id": 5001,
  "title": "Conferma rimborso",
  "content_html": "<p>Confermiamo l'avvenuto rimborso.</p>",
  "folder_id": 201,
  "visibility": 0
}
```
---

## freshdesk_create_canned_response <span className="fd-tag fd-tag--write">write</span>

Erstellen Sie eine vorgefertigte Antwort.

**Alias:** `create_canned_response`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| „Antwort“ | Objekt (CannedResponseCreate) | Ja | - |

**`Antwort`-Felder:**

| Feld | Geben Sie | ein Erforderlich | Notizen |
|---|---|---|---|
| `Titel` | Zeichenfolge | Ja | Titel |
| `content_html` | Zeichenfolge | Ja | HTML-Inhalt |
| `folder_id` | Ganzzahl | Ja | Zielordner |
| „Sichtbarkeit“ | Ganzzahl (0–2) | Ja | „0“ alle Agenten · „1“ persönlich · „2“ ausgewählte Gruppen |
| `group_ids` | Array von ganzen Zahlen | Bedingt | Erforderlich, wenn „Sichtbarkeit = 2“ |

**Anruf**
```json
{
  "response": {
    "title": "Conferma rimborso",
    "content_html": "<p>Confermiamo l'avvenuto rimborso.</p>",
    "folder_id": 201,
    "visibility": 0
  }
}
```
**Antwort**
```json
{ "id": 5002, "title": "Conferma rimborso", "folder_id": 201, "visibility": 0 }
```
---

## freshdesk_update_canned_response <span className="fd-tag fd-tag--write">Update</span>

Aktualisieren Sie eine vorgefertigte Antwort.

**Alias:** `update_canned_response`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `canned_response_id` | Ganzzahl | Ja | - |
| `canned_response_fields` | Objekt | Ja | - |

Gemeinsame Schlüssel: „title“, „content_html“, „visibility“.

**Anruf**
```json
{ "canned_response_id": 5002, "canned_response_fields": { "title": "Conferma rimborso effettuato" } }
```
---

## freshdesk_create_canned_response_folder <span className="fd-tag fd-tag--write">write</span>

Erstellen Sie einen vorgefertigten Antwortordner.

**Alias:** `create_canned_response_folder`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `Name` | Zeichenfolge | Ja | - |

**Anruf**
```json
{ "name": "Onboarding" }
```
**Antwort**
```json
{ "id": 203, "name": "Onboarding" }
```
---

## freshdesk_update_canned_response_folder <span className="fd-tag fd-tag--write">Update</span>

Benennen Sie einen vorgefertigten Antwortordner um.

**Alias:** `update_canned_response_folder`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `folder_id` | Ganzzahl | Ja | - |
| `Name` | Zeichenfolge | Ja | - |

**Anruf**
```json
{ "folder_id": 203, "name": "Onboarding clienti" }
```

