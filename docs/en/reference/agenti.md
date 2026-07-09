---
id: agenti
title: Tool agenti Freshdesk
description: Reference dei tool agenti Freshdesk MCP per listare, cercare, leggere, creare e aggiornare agenti e profili operativi del supporto.
sidebar_label: Agenti
---
# Agents

5 tools to list, read, search, create and update agents.

:::info[Reference values]
**ticket_scope**: `1` global access · `2` group access · `3` restricted access.
:::

---

## freshdesk_list_agents <span className="fd-tag">read</span>

Lists agents with pagination.

**Alias:** `get_agents`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `page` | integer | No | `1` |
| `per_page` | integer (1–100) | No | `30` |

**Answer** - each agent has `id`, `contact` (name/email), `available`, `occasional`, `ticket_scope`, `group_ids`:
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

## freshdesk_view_agent <span className="fd-tag">read</span>

Retrieve the detail of an agent by ID.

**Alias:** `view_agent`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `agent_id` | integer | Yes | - |

**Answer**
```json
{
  "id": 123,
  "ticket_scope": 1,
  "group_ids": [12],
  "contact": { "name": "Luca Verdi", "email": "luca.verdi@azienda.it" }
}
```
---

## freshdesk_search_agents <span className="fd-tag">read</span>

Search for agents by name or email (autocomplete).

**Alias:** `search_agents`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `query` | string | Yes | - |

**Call**
```json
{ "query": "verdi" }
```
**Answer**
```json
[
  { "id": 123, "contact": { "name": "Luca Verdi", "email": "luca.verdi@azienda.it" } }
]
```
---

## freshdesk_create_agent <span className="fd-tag fd-tag--write">write</span>

Create an agent.

**Alias:** `create_agent`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `agent_fields` | object | Yes | - |

`agent_fields` must contain at least `email` and `ticket_scope` (1/2/3). Common fields: `name`, `occasional` (bool), `group_ids` (list), `role_ids` (list), `signature` (HTML).

**Call**
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
**Answer**
```json
{ "id": 130, "ticket_scope": 2, "group_ids": [12], "contact": { "email": "nuovo.agente@azienda.it" } }
```
If mandatory fields are missing:
```json
{ "error": "Campi obbligatori mancanti: servono sia 'email' sia 'ticket_scope'." }
```
---

## freshdesk_update_agent <span className="fd-tag fd-tag--write">update</span>

Update an agent.

**Alias:** `update_agent`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `agent_id` | integer | Yes | - |
| `agent_fields` | object | Yes | - |

Common `agent_fields` keys: `occasional`, `ticket_scope`, `group_ids`, `role_ids`, `signature`.

**Call**
```json
{ "agent_id": 130, "agent_fields": { "group_ids": [12, 15] } }
```
**Answer**
```json
{ "id": 130, "group_ids": [12, 15] }
```

