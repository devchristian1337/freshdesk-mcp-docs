---
id: gruppi
title: Tool gruppi Freshdesk
description: Reference dei tool gruppi Freshdesk MCP per listare, leggere, creare e aggiornare team, assegnazioni agenti ed escalation.
sidebar_label: Gruppi
---
# Gruppen

4 Tools zum Auflisten, Lesen, Erstellen und Aktualisieren von Gruppen.

In Freshdesk-Gruppen treffen sich Tickets, Agenten und Zuweisungsregeln. In einem MCP-Flow werden sie hauptsächlich für zwei Aufgaben verwendet: Lesen der Betriebsstruktur vor der Zuweisung eines Tickets und Halten von Teams auf dem Laufenden, wenn sich Agenten, Warteschlangen oder Eskalationspfade ändern. Die Referenz umfasst nur explizite Vorgänge: Kein Tool weist Tickets automatisch einer Gruppe zu, ohne dass das Modell eine eindeutige Nutzlast erhält.

Für KI-Automatisierungen ist es am besten, immer mit „freshdesk_list_groups“ oder „freshdesk_view_group“ zu beginnen, die richtige ID zu speichern und diesen Wert dann in den Tool-Tickets zu verwenden. Dies reduziert Fehler aufgrund ähnlicher Namen, doppelter Gruppen oder nicht mehr existierender Teams.

---

## freshdesk_list_groups <span className="fd-tag">lesen</span>

Listet Gruppen mit Paginierung auf.

**Alias:** `list_groups`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `Seite` | Ganzzahl | Nein | `1` |
| `per_page` | Ganzzahl (1–100) | Nein | `30` |

**Antwort**
```json
{
  "groups": [
    { "id": 12, "name": "Supporto CCE", "agent_ids": [123, 130] }
  ],
  "pagination": { "current_page": 1, "next_page": null, "prev_page": null, "per_page": 30 }
}
```
---

## freshdesk_view_group <span className="fd-tag">lesen</span>

Ruft die Details einer Gruppe nach ID ab.

**Alias:** `view_group`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `group_id` | Ganzzahl | Ja | - |

**Antwort**
```json
{ "id": 12, "name": "Supporto CCE", "description": "Primo livello", "agent_ids": [123, 130] }
```
---

## freshdesk_create_group <span className="fd-tag fd-tag--write">write</span>

Erstellen Sie eine Gruppe.

**Alias:** `create_group`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `Gruppe` | object(GroupCreate) | Ja | - |

**Felder von „Gruppe“:**

| Feld | Geben Sie | ein Erforderlich | Standard | Notizen |
|---|---|---|---|---|
| `Name` | Zeichenfolge | Ja | - | Gruppenname |
| `Beschreibung` | Zeichenfolge | Nein | `null` | Beschreibung |
| `agent_ids` | Array von ganzen Zahlen | Nein | `null` | Benutzer-ID des Agenten |
| `auto_ticket_assign` | ganze Zahl (0/1) | Nein | `0` | Automatische Ticketzuordnung |
| `escalate_to` | Ganzzahl | Nein | `null` | Benutzer, der eine Eskalation an | senden soll
| `unassigned_for` | Zeichenfolge | Nein | `30m` | „30m“, „1h“, „2h“, „4h“, „8h“, „12h“, „1d“, „2d“, „3d“ |

**Anruf**
```json
{
  "group": {
    "name": "Supporto CCE",
    "description": "Primo livello",
    "agent_ids": [123, 130],
    "auto_ticket_assign": 1
  }
}
```
**Antwort**
```json
{ "id": 14, "name": "Supporto CCE", "auto_ticket_assign": 1, "agent_ids": [123, 130] }
```
---

## freshdesk_update_group <span className="fd-tag fd-tag--write">Update</span>

Aktualisieren Sie eine Gruppe. Verwenden Sie dasselbe Schema wie bei der Erstellung („Name“ bleibt im Schema erforderlich).

**Alias:** `update_group`

| Parameter | Geben Sie | ein Erforderlich | Standard |
|---|---|---|---|
| `group_id` | Ganzzahl | Ja | - |
| `Gruppe` | object(GroupCreate) | Ja | - |

**Anruf**
```json
{ "group_id": 14, "group": { "name": "Supporto CCE", "agent_ids": [123, 130, 131] } }
```
**Antwort**
```json
{ "id": 14, "name": "Supporto CCE", "agent_ids": [123, 130, 131] }
```

