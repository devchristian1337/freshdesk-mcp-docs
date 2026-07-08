---
id: agenti
title: Tool agenti Freshdesk
description: Reference dei tool agenti Freshdesk MCP per listare, cercare, leggere, creare e aggiornare agenti e profili operativi del supporto.
sidebar_label: Agenti
---

# Agenti

5 tool per elencare, leggere, cercare, creare e aggiornare gli agenti.

:::info[Valori di riferimento]
**ticket_scope**: `1` global access · `2` group access · `3` restricted access.
:::

---

## freshdesk_list_agents <span className="fd-tag">read</span>

Elenca gli agenti con paginazione.

**Alias:** `get_agents`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `page` | integer | No | `1` |
| `per_page` | integer (1–100) | No | `30` |

**Risposta** - ogni agente ha `id`, `contact` (name/email), `available`, `occasional`, `ticket_scope`, `group_ids`:

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

Recupera il dettaglio di un agente per ID.

**Alias:** `view_agent`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `agent_id` | integer | Sì | - |

**Risposta**

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

Cerca agenti per nome o email (autocomplete).

**Alias:** `search_agents`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `query` | string | Sì | - |

**Chiamata**

```json
{ "query": "verdi" }
```

**Risposta**

```json
[
  { "id": 123, "contact": { "name": "Luca Verdi", "email": "luca.verdi@azienda.it" } }
]
```

---

## freshdesk_create_agent <span className="fd-tag fd-tag--write">write</span>

Crea un agente.

**Alias:** `create_agent`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `agent_fields` | object | Sì | - |

`agent_fields` deve contenere almeno `email` e `ticket_scope` (1/2/3). Campi comuni: `name`, `occasional` (bool), `group_ids` (lista), `role_ids` (lista), `signature` (HTML).

**Chiamata**

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

**Risposta**

```json
{ "id": 130, "ticket_scope": 2, "group_ids": [12], "contact": { "email": "nuovo.agente@azienda.it" } }
```

Se mancano i campi obbligatori:

```json
{ "error": "Campi obbligatori mancanti: servono sia 'email' sia 'ticket_scope'." }
```

---

## freshdesk_update_agent <span className="fd-tag fd-tag--write">update</span>

Aggiorna un agente.

**Alias:** `update_agent`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `agent_id` | integer | Sì | - |
| `agent_fields` | object | Sì | - |

Chiavi comuni di `agent_fields`: `occasional`, `ticket_scope`, `group_ids`, `role_ids`, `signature`.

**Chiamata**

```json
{ "agent_id": 130, "agent_fields": { "group_ids": [12, 15] } }
```

**Risposta**

```json
{ "id": 130, "group_ids": [12, 15] }
```
