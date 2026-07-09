---
id: agenti
title: Tool agenti Freshdesk
description: Reference dei tool agenti Freshdesk MCP per listare, cercare, leggere, creare e aggiornare agenti e profili operativi del supporto.
sidebar_label: Agenti
---
#Agents

5 outils pour lister, lire, rechercher, créer et mettre à jour les agents.

:::info[Valeurs de référence]
**ticket_scope** : `1` accès global · `2` accès de groupe · `3` accès restreint.
:::

---

## freshdesk_list_agents <span className="fd-tag">lire</span>

Répertorie les agents avec pagination.

**Alias :** `get_agents`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `page` | entier | Non | '1' |
| `par_page` | entier (1–100) | Non | '30' |

**Réponse** - chaque agent a un `id`, `contact` (nom/e-mail), `available`, `occasional`, `ticket_scope`, `group_ids` :
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

## freshdesk_view_agent <span className="fd-tag">lire</span>

Récupérer le détail d'un agent par ID.

**Alias :** `view_agent`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_agent` | entier | Oui | - |

**Répondre**
```json
{
  "id": 123,
  "ticket_scope": 1,
  "group_ids": [12],
  "contact": { "name": "Luca Verdi", "email": "luca.verdi@azienda.it" }
}
```
---

## freshdesk_search_agents <span className="fd-tag">lire</span>

Recherchez des agents par nom ou par e-mail (complétion automatique).

**Alias :** `search_agents`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `requête` | chaîne | Oui | - |

**Appel**
```json
{ "query": "verdi" }
```
**Répondre**
```json
[
  { "id": 123, "contact": { "name": "Luca Verdi", "email": "luca.verdi@azienda.it" } }
]
```
---

## freshdesk_create_agent <span className="fd-tag fd-tag--write">écrire</span>

Créez un agent.

**Alias :** `create_agent`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `agent_fields` | objet | Oui | - |

`agent_fields` doit contenir au moins `email` et `ticket_scope` (1/2/3). Champs courants : `name`, `occasional` (bool), `group_ids` (liste), `role_ids` (liste), `signature` (HTML).

**Appel**
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
**Répondre**
```json
{ "id": 130, "ticket_scope": 2, "group_ids": [12], "contact": { "email": "nuovo.agente@azienda.it" } }
```
Si des champs obligatoires sont manquants :
```json
{ "error": "Campi obbligatori mancanti: servono sia 'email' sia 'ticket_scope'." }
```
---

## freshdesk_update_agent <span className="fd-tag fd-tag--write">mise à jour</span>

Mettre à jour un agent.

**Alias :** `update_agent`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_agent` | entier | Oui | - |
| `agent_fields` | objet | Oui | - |

Clés `agent_fields` communes : `occasional`, `ticket_scope`, `group_ids`, `role_ids`, `signature`.

**Appel**
```json
{ "agent_id": 130, "agent_fields": { "group_ids": [12, 15] } }
```
**Répondre**
```json
{ "id": 130, "group_ids": [12, 15] }
```

