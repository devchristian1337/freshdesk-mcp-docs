---
id: campi
title: Tool campi Freshdesk
description: Reference dei tool campi Freshdesk MCP per ticket field, contact field e company field, con lettura, creazione e aggiornamento.
sidebar_label: Campi
---
# Champs

8 outils pour gérer les champs (standards et personnalisés) des tickets, contacts et entreprises. Les champs de ticket sont gérés via les points de terminaison d'administration.

---

## freshdesk_create_ticket_field <span className="fd-tag fd-tag--write">écrire</span>

Créez un champ de ticket personnalisé (point de terminaison administrateur).

**Alias :** `create_ticket_field`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `ticket_field_fields` | objet | Oui | - |

`ticket_field_fields` nécessite au moins `label` et `type` (par exemple `custom_text`, `custom_dropdown`) ; pour les listes déroulantes, incluez les « choix ».

**Appel**
```json
{
  "ticket_field_fields": {
    "label": "Causa",
    "type": "custom_dropdown",
    "choices": ["Bug", "Configurazione", "Formazione"]
  }
}
```
**Répondre**
```json
{ "id": 50, "name": "cf_causa", "label": "Causa", "type": "custom_dropdown" }
```
---

## freshdesk_view_ticket_field <span className="fd-tag">lire</span>

Récupérez un champ de ticket par ID (point de terminaison administrateur).

**Alias :** `view_ticket_field`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `ticket_field_id` | entier | Oui | - |

**Répondre**
```json
{ "id": 50, "name": "cf_causa", "label": "Causa", "type": "custom_dropdown", "choices": ["Bug", "Configurazione"] }
```
---

## freshdesk_update_ticket_field <span className="fd-tag fd-tag--write">mise à jour</span>

Mettez à jour un champ de ticket personnalisé (point de terminaison administrateur).

**Alias :** `update_ticket_field`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `ticket_field_id` | entier | Oui | - |
| `ticket_field_fields` | objet | Oui | - |

Clés communes : `label`, `choices`.

**Appel**
```json
{ "ticket_field_id": 50, "ticket_field_fields": { "choices": ["Bug", "Configurazione", "Formazione", "Altro"] } }
```
---

## freshdesk_list_contact_fields <span className="fd-tag">lire</span>

Répertorie tous les champs de contact (standard et personnalisés) avec des noms internes.

**Alias :** `list_contact_fields`

Aucun paramètre.

**Répondre**
```json
[
  { "id": 1, "name": "name", "label": "Nome", "type": "default_name" },
  { "id": 9, "name": "cf_reparto", "label": "Reparto", "type": "custom_text" }
]
```
---

## freshdesk_view_contact_field <span className="fd-tag">lire</span>

Récupérez un champ de contact pour l'ID.

**Alias :** `view_contact_field`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `contact_field_id` | entier | Oui | - |

**Répondre**
```json
{ "id": 9, "name": "cf_reparto", "label": "Reparto", "type": "custom_text" }
```
---

## freshdesk_create_contact_field <span className="fd-tag fd-tag--write">écrire</span>

Créez un champ de contact personnalisé.

**Alias :** `create_contact_field`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `champ` | objet (ContactFieldCreate) | Oui | - |

**Champs de `field` :**

| Champ | Tapez | Obligatoire | Par défaut | Remarques |
|---|---|---|---|---|
| `étiquette` | chaîne | Oui | - | Nom du côté de l'agent |
| `label_for_customers` | chaîne | Oui | - | Nom côté client |
| `type` | chaîne | Oui | - | L'un des suivants : `custom_text`, `custom_paragraph`, `custom_checkbox`, `custom_number`, `custom_dropdown`, `custom_phone_number`, `custom_url`, `custom_date` |
| `editable_in_signup` | booléen | Non | `faux` | Valable lors de l'inscription |
| `position` | entier | Non | '1' | Poste sur le terrain |
| `required_for_agents` | booléen | Non | `faux` | Obligatoire pour les agents |
| `clients_can_edit` | booléen | Non | `faux` | Peut être modifié par le client |
| `required_for_customers` | booléen | Non | `faux` | Obligatoire dans le portail |
| `displayed_for_customers` | booléen | Non | `faux` | Visible dans le portail |
| `choix` | tableau d'objets | Non | `null` | Pour les listes déroulantes : `[{ "value": "Text", "position": 1 }]` |

**Appel**
```json
{
  "field": {
    "label": "Reparto",
    "label_for_customers": "Il tuo reparto",
    "type": "custom_text",
    "required_for_agents": true
  }
}
```
**Répondre**
```json
{ "id": 12, "name": "cf_reparto", "label": "Reparto", "type": "custom_text" }
```
---

## freshdesk_update_contact_field <span className="fd-tag fd-tag--write">mettre à jour</span>

Mettez à jour un champ de contact personnalisé.

**Alias :** `update_contact_field`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `contact_field_id` | entier | Oui | - |
| `contact_field_fields` | objet | Oui | - |

Clés communes : `label`, `choices`.

**Appel**
```json
{ "contact_field_id": 12, "contact_field_fields": { "label": "Reparto aziendale" } }
```
---

## freshdesk_list_company_fields <span className="fd-tag">lire</span>

Répertorie tous les champs de l'entreprise (standard et personnalisés) avec des noms internes.

**Alias :** `list_company_fields`

Aucun paramètre.

**Répondre**
```json
[
  { "id": 1, "name": "name", "label": "Nome", "type": "default_name" },
  { "id": 5, "name": "cf_settore", "label": "Settore", "type": "custom_dropdown" }
]
```

