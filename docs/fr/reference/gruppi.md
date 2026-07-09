---
id: gruppi
title: Tool gruppi Freshdesk
description: Reference dei tool gruppi Freshdesk MCP per listare, leggere, creare e aggiornare team, assegnazioni agenti ed escalation.
sidebar_label: Gruppi
---
# groupes

4 outils pour lister, lire, créer et mettre à jour des groupes.

Les groupes Freshdesk sont le lieu où se rencontrent les tickets, les agents et les règles d'affectation. Dans un flux MCP, ils sont principalement utilisés pour deux tâches : lire la structure opérationnelle avant d'attribuer un ticket et tenir les équipes informées lorsque les agents, les files d'attente ou les chemins d'escalade changent. La référence n'inclut que des opérations explicites : aucun outil n'attribue automatiquement des tickets à un groupe sans que le modèle reçoive une charge utile claire.

Pour les automatisations d'IA, il est préférable de toujours commencer par « freshdesk_list_groups » ou « freshdesk_view_group », d'enregistrer l'ID correct, puis d'utiliser cette valeur dans les tickets d'outil. Cela réduit les erreurs dues à des noms similaires, à des groupes en double ou à des équipes défuntes.

---

## freshdesk_list_groups <span className="fd-tag">lire</span>

Répertorie les groupes avec pagination.

**Alias :** `list_groups`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `page` | entier | Non | '1' |
| `par_page` | entier (1–100) | Non | '30' |

**Répondre**
```json
{
  "groups": [
    { "id": 12, "name": "Supporto CCE", "agent_ids": [123, 130] }
  ],
  "pagination": { "current_page": 1, "next_page": null, "prev_page": null, "per_page": 30 }
}
```
---

## freshdesk_view_group <span className="fd-tag">lire</span>

Récupère le détail d'un groupe par ID.

**Alias :** `view_group`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_groupe` | entier | Oui | - |

**Répondre**
```json
{ "id": 12, "name": "Supporto CCE", "description": "Primo livello", "agent_ids": [123, 130] }
```
---

## freshdesk_create_group <span className="fd-tag fd-tag--write">écrire</span>

Créez un groupe.

**Alias :** `create_group`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `groupe` | objet (GroupCreate) | Oui | - |

**Champs du `groupe` :**

| Champ | Tapez | Obligatoire | Par défaut | Remarques |
|---|---|---|---|---|
| `nom` | chaîne | Oui | - | Nom du groupe |
| `description` | chaîne | Non | `null` | Descriptif |
| `agent_ids` | tableau d'entiers | Non | `null` | ID utilisateur des agents |
| `auto_ticket_assign` | entier (0/1) | Non | `0` | Attribution automatique des tickets |
| `escalate_to` | entier | Non | `null` | Utilisateur à qui envoyer l'escalade |
| `non affecté_pour` | chaîne | Non | '30m' | `30m`, `1h`, `2h`, `4h`, `8h`, `12h`, `1j`, `2j`, `3j` |

**Appel**
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
**Répondre**
```json
{ "id": 14, "name": "Supporto CCE", "auto_ticket_assign": 1, "agent_ids": [123, 130] }
```
---

## freshdesk_update_group <span className="fd-tag fd-tag--write">mise à jour</span>

Mettre à jour un groupe. Utilisez le même schéma que pour la création (`name` reste obligatoire dans le schéma).

**Alias :** `update_group`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_groupe` | entier | Oui | - |
| `groupe` | objet (GroupCreate) | Oui | - |

**Appel**
```json
{ "group_id": 14, "group": { "name": "Supporto CCE", "agent_ids": [123, 130, 131] } }
```
**Répondre**
```json
{ "id": 14, "name": "Supporto CCE", "agent_ids": [123, 130, 131] }
```

