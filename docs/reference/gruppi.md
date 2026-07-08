---
id: gruppi
title: Gruppi
description: Reference dei tool sui gruppi Freshdesk.
sidebar_label: Gruppi
---

# Gruppi

4 tool per elencare, leggere, creare e aggiornare i gruppi.

---

## freshdesk_list_groups <span className="fd-tag">read</span>

Elenca i gruppi con paginazione.

**Alias:** `list_groups`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `page` | integer | No | `1` |
| `per_page` | integer (1–100) | No | `30` |

**Risposta**

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

Recupera il dettaglio di un gruppo per ID.

**Alias:** `view_group`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `group_id` | integer | Sì | - |

**Risposta**

```json
{ "id": 12, "name": "Supporto CCE", "description": "Primo livello", "agent_ids": [123, 130] }
```

---

## freshdesk_create_group <span className="fd-tag fd-tag--write">write</span>

Crea un gruppo.

**Alias:** `create_group`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `group` | object (GroupCreate) | Sì | - |

**Campi di `group`:**

| Campo | Tipo | Obbligatorio | Default | Note |
|---|---|---|---|---|
| `name` | string | Sì | - | Nome del gruppo |
| `description` | string | No | `null` | Descrizione |
| `agent_ids` | array di integer | No | `null` | ID utente degli agenti |
| `auto_ticket_assign` | integer (0/1) | No | `0` | Assegnazione automatica dei ticket |
| `escalate_to` | integer | No | `null` | Utente a cui inviare l'escalation |
| `unassigned_for` | string | No | `30m` | `30m`, `1h`, `2h`, `4h`, `8h`, `12h`, `1d`, `2d`, `3d` |

**Chiamata**

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

**Risposta**

```json
{ "id": 14, "name": "Supporto CCE", "auto_ticket_assign": 1, "agent_ids": [123, 130] }
```

---

## freshdesk_update_group <span className="fd-tag fd-tag--write">update</span>

Aggiorna un gruppo. Usa lo stesso schema della creazione (`name` resta obbligatorio nello schema).

**Alias:** `update_group`

| Parametro | Tipo | Obbligatorio | Default |
|---|---|---|---|
| `group_id` | integer | Sì | - |
| `group` | object (GroupCreate) | Sì | - |

**Chiamata**

```json
{ "group_id": 14, "group": { "name": "Supporto CCE", "agent_ids": [123, 130, 131] } }
```

**Risposta**

```json
{ "id": 14, "name": "Supporto CCE", "agent_ids": [123, 130, 131] }
```
