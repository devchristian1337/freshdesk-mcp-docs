---
id: agenti
title: Tool agenti Freshdesk
description: Reference dei tool agenti Freshdesk MCP per listare, cercare, leggere, creare e aggiornare agenti e profili operativi del supporto.
sidebar_label: Agenti
---
# Agenten

5 Tools zum Auflisten, Lesen, Suchen, Erstellen und Aktualisieren von Agenten.

:::info[Referenzwerte]
**ticket_scope**: „1“ globaler Zugriff · „2“ Gruppenzugriff · „3“ eingeschränkter Zugriff.
:::

---

## freshdesk_list_agents <span className="fd-tag">lesen</span>

Listet Agenten mit Paginierung auf.

**Alias:** `get_agents`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `Seite` | Ganzzahl | Nein | `1` |
| `per_page` | Ganzzahl (1–100) | Nein | `30` |

**Antwort** – jeder Agent hat „id“, „Kontakt“ (Name/E-Mail), „verfügbar“, „gelegentlich“, „ticket_scope“, „group_ids“:
```json
{
  "agents": [
    {
      "id": 123,
      "available": true,
      "occasional": false,
      "ticket_scope": 1,
      "group_ids": [12],
      "contact": { "name": "Luca Verdi", "email": "luca.verdi@azienda.it" }
    }
  ],
  "pagination": { "current_page": 1, "next_page": null, "prev_page": null, "per_page": 30 }
}
```
---

## freshdesk_view_agent <span className="fd-tag">lesen</span>

Rufen Sie die Details eines Agenten nach ID ab.

**Alias:** `view_agent`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `agent_id` | Ganzzahl | Ja | - |

**Antwort**
```json
{
  "id": 123,
  "ticket_scope": 1,
  "group_ids": [12],
  "contact": { "name": "Luca Verdi", "email": "luca.verdi@azienda.it" }
}
```
---

## freshdesk_search_agents <span className="fd-tag">lesen</span>

Suchen Sie nach Agenten anhand des Namens oder der E-Mail-Adresse (automatische Vervollständigung).

**Alias:** `search_agents`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `Abfrage` | Zeichenfolge | Ja | - |

**Anruf**
```json
{ "query": "verdi" }
```
**Antwort**
```json
[
  { "id": 123, "contact": { "name": "Luca Verdi", "email": "luca.verdi@azienda.it" } }
]
```
---

## freshdesk_create_agent <span className="fd-tag fd-tag--write">write</span>

Erstellen Sie einen Agenten.

**Alias:** `create_agent`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `agent_fields` | Objekt | Ja | - |

„agent_fields“ muss mindestens „email“ und „ticket_scope“ (1/2/3) enthalten. Gemeinsame Felder: „Name“, „Gelegenheit“ (Bool), „Gruppen-IDs“ (Liste), „Rollen-IDs“ (Liste), „Signatur“ (HTML).

**Anruf**
```json
{
  "agent_fields": {
    "email": "nuovo.agente@azienda.it",
    "ticket_scope": 2,
    "group_ids": [12],
    "occasional": false
  }
}
```
**Antwort**
```json
{ "id": 130, "ticket_scope": 2, "group_ids": [12], "contact": { "email": "nuovo.agente@azienda.it" } }
```
Falls Pflichtfelder fehlen:
```json
{ "error": "Campi obbligatori mancanti: servono sia 'email' sia 'ticket_scope'." }
```
---

## freshdesk_update_agent <span className="fd-tag fd-tag--write">Update</span>

Aktualisieren Sie einen Agenten.

**Alias:** `update_agent`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `agent_id` | Ganzzahl | Ja | - |
| `agent_fields` | Objekt | Ja | - |

Allgemeine „agent_fields“-Schlüssel: „occasional“, „ticket_scope“, „group_ids“, „role_ids“, „signature“.

**Anruf**
```json
{ "agent_id": 130, "agent_fields": { "group_ids": [12, 15] } }
```
**Antwort**
```json
{ "id": 130, "group_ids": [12, 15] }
```

