---
id: gruppi
title: Tool gruppi Freshdesk
description: Reference dei tool gruppi Freshdesk MCP per listare, leggere, creare e aggiornare team, assegnazioni agenti ed escalation.
sidebar_label: Gruppi
---
# Groups

4 tools to list, read, create and update groups.

Freshdesk Groups are where tickets, agents, and assignment rules meet. In an MCP flow they are mainly used for two tasks: reading the operational structure before assigning a ticket and keeping teams updated when agents, queues or escalation paths change. The reference includes only explicit operations: no tool automatically assigns tickets to a group without the model receiving a clear payload.

For AI automations it is best to always start from `freshdesk_list_groups` or `freshdesk_view_group`, save the correct ID and then use that value in the tool tickets. This reduces errors due to similar names, duplicate groups, or defunct teams.

---

## freshdesk_list_groups <span className="fd-tag">read</span>

Lists groups with pagination.

**Alias:** `list_groups`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `page` | integer | No | `1` |
| `per_page` | integer (1–100) | No | `30` |

**Answer**
```json
{
  "groups": [
    { "id": 12, "name": "Supporto CCE", "agent_ids": [123, 130] }
  ],
  "pagination": { "current_page": 1, "next_page": null, "prev_page": null, "per_page": 30 }
}
```
---

## freshdesk_view_group <span className="fd-tag">read</span>

Retrieves the detail of a group by ID.

**Alias:** `view_group`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `group_id` | integer | Yes | - |

**Answer**
```json
{ "id": 12, "name": "Supporto CCE", "description": "Primo livello", "agent_ids": [123, 130] }
```
---

## freshdesk_create_group <span className="fd-tag fd-tag--write">write</span>

Create a group.

**Alias:** `create_group`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `group` | object(GroupCreate) | Yes | - |

**Fields of `group`:**

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `name` | string | Yes | - | Group name |
| `description` | string | No | `null` | Description |
| `agent_ids` | array of integers | No | `null` | Agents User ID |
| `auto_ticket_assign` | integer (0/1) | No | `0` | Automatic ticket assignment |
| `escalate_to` | integer | No | `null` | User to send escalation to |
| `unassigned_for` | string | No | `30m` | `30m`, `1h`, `2h`, `4h`, `8h`, `12h`, `1d`, `2d`, `3d` |

**Call**
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
**Answer**
```json
{ "id": 14, "name": "Supporto CCE", "auto_ticket_assign": 1, "agent_ids": [123, 130] }
```
---

## freshdesk_update_group <span className="fd-tag fd-tag--write">update</span>

Update a group. Use the same schema as creation (`name` remains required in the schema).

**Alias:** `update_group`

| Parameter | Type | Required | Default |
|---|---|---|---|
| `group_id` | integer | Yes | - |
| `group` | object(GroupCreate) | Yes | - |

**Call**
```json
{ "group_id": 14, "group": { "name": "Supporto CCE", "agent_ids": [123, 130, 131] } }
```
**Answer**
```json
{ "id": 14, "name": "Supporto CCE", "agent_ids": [123, 130, 131] }
```

