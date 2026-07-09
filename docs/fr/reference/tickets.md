---
id: tickets
title: Tool ticket Freshdesk
description: Reference dei tool ticket Freshdesk MCP per lista, ricerca, dettaglio, creazione, aggiornamento, delete, riepiloghi e ticket field.
sidebar_label: Ticket
---
# Billets

12 outils pour lister, rechercher, lire, créer, mettre à jour et supprimer des tickets, ainsi que des résumés et des propriétés des champs du ticket.

:::info[Valeurs de référence]
Plusieurs outils utilisent les valeurs internes de Freshdesk :

- **source** : `1` e-mail · `2` portail · `3` téléphone · `7` chat · `9` widget de commentaires · `10` e-mail sortant
- **priorité** : `1` faible · `2` moyenne · `3` élevée · `4` urgente
- **statut** : `2` ouvert · `3` en attente · `4` résolu · `5` fermé
:::

---

## freshdesk_get_ticket_fields <span className="fd-tag">lire</span>

Répertorie les champs de ticket configurés (standard et personnalisés) avec leurs valeurs autorisées. Utile avant de créer/mettre à jour des tickets avec des champs personnalisés.

**Alias :** `get_ticket_fields`

Aucun paramètre.

**Réponse** - liste des champs avec `name` (clé interne), `label`, `type` et, pour les listes déroulantes, `choices` :
```json
[
  { "id": 1, "name": "status", "label": "Status", "type": "default_status" },
  { "id": 7, "name": "cf_causa", "label": "Causa", "type": "custom_dropdown",
    "choices": ["Bug", "Configurazione", "Formazione"] }
]
```
---

## freshdesk_get_tickets <span className="fd-tag">lire</span>

Répertoriez les billets avec une pagination simple. Pour filtrer, utilisez `freshdesk_list_tickets` ; pour les requêtes texte, utilisez `freshdesk_search_tickets`.

**Alias :** `get_tickets`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `page` | entier | Non | '1' |
| `par_page` | entier (1–100) | Non | '30' |
| `include_full` | booléen | Non | `faux` |

Par défaut, chaque ticket contient uniquement les champs essentiels de la liste et tous les « custom_fields » remplis. Définissez « include_full=true » pour recevoir la charge utile complète de chaque ticket.

**Appel**
```json
{ "page": 1, "per_page": 30 }
```
**Répondre**
```json
{
  "tickets": [
    { "id": 101, "subject": "Errore in fase di login", "status": 2, "priority": 3 }
  ],
  "pagination": { "current_page": 1, "next_page": 2, "prev_page": null, "per_page": 30 }
}
```
---

## freshdesk_list_tickets <span className="fd-tag">lire</span>

Répertoriez les tickets en appliquant les filtres natifs du point de terminaison `GET /tickets`.

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `nom_filtre` | chaîne | Non | `null` |
| `requester_id` | entier | Non | `null` |
| `id_entreprise` | entier | Non | `null` |
| `mis à jour_depuis` | chaîne (ISO 8601) | Non | `null` |
| `order_by` | chaîne | Non | `null` |
| `type_ordre` | chaîne | Non | `null` |
| `page` | entier | Non | '1' |
| `par_page` | entier (1–100) | Non | '30' |
| `include_full` | booléen | Non | `faux` |

- `filter_name` : `new_and_my_open`, `watching`, `spam`, `supprimé`.
- `order_by` : `created_at`, `due_by`, `updated_at`, `status`.
- `order_type` : `asc`, `desc`.
- `include_full` : renvoie la charge utile complète de chaque ticket ; par défaut le serveur projette les champs essentiels de la liste.

**Appel**
```json
{
  "filter_name": "new_and_my_open",
  "updated_since": "2026-01-01T00:00:00Z",
  "order_by": "updated_at",
  "order_type": "desc"
}
```
**Répondre**
```json
{
  "tickets": [
    { "id": 240, "subject": "Richiesta nuova utenza", "status": 3, "updated_at": "2026-06-10T09:12:00Z" }
  ],
  "pagination": { "current_page": 1, "next_page": null, "prev_page": null, "per_page": 30 }
}
```
---

## freshdesk_get_ticket <span className="fd-tag">lire</span>

Récupérez un seul ticket, avec la possibilité d’intégrer les données associées.

**Alias :** `get_ticket`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_ticket` | entier | Oui | - |
| `inclure` | chaîne | Non | `null` |

`include` accepte les valeurs séparées par des virgules : `conversations`, `requester`, `company`, `stats`.

**Appel**
```json
{ "ticket_id": 12345, "include": "conversations,requester" }
```
**Réponse** - l'objet ticket (avec les sections requises dans `include`) :
```json
{
  "id": 12345,
  "subject": "Errore in fase di login",
  "status": 2,
  "priority": 3,
  "requester_id": 6001,
  "group_id": 12,
  "tags": ["login", "urgente"],
  "created_at": "2026-06-09T08:30:00Z",
  "updated_at": "2026-06-10T11:05:00Z"
}
```
---

## freshdesk_search_tickets <span className="fd-tag">lire</span>

Recherchez des tickets via des filtres structurés dans le point de terminaison « /search/tickets ». Le serveur construit le Freshdesk DSL, combine les filtres avec « AND » et gère les devis et le formatage de la date. Il n'y a pas de recherche en texte intégral sur « sujet » ou « description » ; pour filtrer par entreprise ou demandeur, utilisez `freshdesk_list_tickets` avec `company_id` ou `requester_id`.

**Alias :** `search_tickets`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `statut` | entier | Non | `null` |
| `priorité` | entier | Non | `null` |
| `id_agent` | entier | Non | `null` |
| `id_groupe` | entier | Non | `null` |
| `type_ticket` | chaîne | Non | `null` |
| `balise` | chaîne | Non | `null` |
| `créé_après` | chaîne (`aaaa-mm-jj`) | Non | `null` |
| `créé_avant` | chaîne (`aaaa-mm-jj`) | Non | `null` |
| `mis à jour_après` | chaîne (`aaaa-mm-jj`) | Non | `null` |
| `mis à jour_avant` | chaîne (`aaaa-mm-jj`) | Non | `null` |
| `champs_personnalisés` | objet | Non | `null` |
| `requête` | chaîne (DSL avancé) | Non | `null` |
| `page` | entier (1–10) | Non | '1' |
| `include_full` | booléen | Non | `faux` |

Fournissez au moins un filtre structuré ou une « requête » DSL valide. « query » est un fragment DSL avancé, pas du texte libre ; s'il est utilisé avec des filtres, il est combiné avec eux via « ET ». Dans `custom_fields` le préfixe `cf_` est automatiquement ajouté s'il est manquant.

**Appel**
```json
{ "status": 2, "priority": 4, "group_id": 15, "updated_after": "2026-01-01" }
```
**Réponse** – Résultat de recherche Freshdesk :
```json
{
  "results": [
    { "id": 980, "subject": "Sistema irraggiungibile", "status": 2, "priority": 4 }
  ],
  "total": 1
}
```
---

## freshdesk_create_ticket <span className="fd-tag fd-tag--write">écrire</span>

Créez un ticket. Soumis au [mode lecture seule](../configuration.md#read-only-mode).

**Alias :** `create_ticket`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `sujet` | chaîne | Oui | - |
| `description` | chaîne (HTML) | Oui | - |
| `source` | entier (source) | Oui | - |
| `priorité` | entier (priorité) | Oui | - |
| `statut` | entier (statut) | Oui | - |
| `e-mail` | chaîne | Conditionnel | `null` |
| `requester_id` | entier | Conditionnel | `null` |
| `champs_personnalisés` | objet | Non | `null` |
| `champs_supplémentaires` | objet | Non | `null` |

Au moins un des éléments « email » et « requester_id » est requis. `additional_fields` collecte d'autres champs de niveau supérieur (par exemple `{"type": "Question", "group_id": 123}`).

**Appel**
```json
{
  "subject": "Problema di fatturazione",
  "description": "<p>Il cliente segnala un importo errato.</p>",
  "source": 2,
  "priority": 3,
  "status": 2,
  "email": "cliente@acme.it",
  "additional_fields": { "type": "Question", "group_id": 12 }
}
```
**Répondre**
```json
{ "success": true, "message": "Ticket creato", "ticket": { "id": 12346, "subject": "Problema di fatturazione" } }
```
En cas d'erreur de validation :
```json
{ "success": false, "error": "Errore di validazione: [{'field': 'email', 'message': '...'}]" }
```
---

## freshdesk_update_ticket <span className="fd-tag fd-tag--write">mise à jour</span>

Mettre à jour les champs d'un ticket. Soumis au [mode lecture seule](../configuration.md#read-only-mode).

**Alias :** `update_ticket`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_ticket` | entier | Oui | - |
| `ticket_fields` | objet | Oui | - |

Clés `ticket_fields` communes : `status` (2–5), `priority` (1–4), `group_id`, `responder_id` (agent de soumission), `type`, `tags` (liste), `custom_fields` (dict).

**Appel**
```json
{
  "ticket_id": 12345,
  "ticket_fields": { "status": 4, "responder_id": 123, "custom_fields": { "cf_causa": "Bug" } }
}
```
**Répondre**
```json
{ "success": true, "message": "Ticket aggiornato", "ticket": { "id": 12345, "status": 4 } }
```
---

## freshdesk_delete_ticket <span className="fd-tag fd-tag--delete">supprimer</span>

Supprimer (mettre dans la corbeille) un ticket. Opération destructrice, soumise au [mode lecture seule](../configurazione.md#read-only-mode).

**Alias :** `delete_ticket`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_ticket` | entier | Oui | - |

**Appel**
```json
{ "ticket_id": 12345 }
```
**Répondre**
```json
{ "success": true, "message": "Ticket eliminato" }
```
---

## freshdesk_view_ticket_summary <span className="fd-tag">lire</span>

Récupère le résumé d’un ticket.

**Alias :** `view_ticket_summary`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_ticket` | entier | Oui | - |

**Répondre**
```json
{ "id": 55, "ticket_id": 12345, "body": "Cliente con importo errato; in attesa di verifica." }
```
---

## freshdesk_update_ticket_summary <span className="fd-tag fd-tag--write">mise à jour</span>

Créez ou mettez à jour un récapitulatif de ticket. Soumis au [mode lecture seule](../configuration.md#read-only-mode).

**Alias :** `update_ticket_summary`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_ticket` | entier | Oui | - |
| `corps` | chaîne | Oui | - |

**Appel**
```json
{ "ticket_id": 12345, "body": "Verificato l'importo: emessa nota di credito." }
```
---

## freshdesk_delete_ticket_summary <span className="fd-tag fd-tag--delete">supprimer</span>

Supprimer un récapitulatif de ticket. Opération destructrice, soumise au [mode lecture seule](../configurazione.md#read-only-mode).

**Alias :** `delete_ticket_summary`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_ticket` | entier | Oui | - |

**Répondre**
```json
{ "success": true, "message": "Riepilogo del ticket eliminato" }
```
---

## freshdesk_get_field_properties <span className="fd-tag">lire</span>

Récupère les propriétés d’un champ de ticket spécifique par nom interne.

**Alias :** `get_field_properties`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `nom_champ` | chaîne | Oui | - |

Le nom du « type » est automatiquement mappé au champ système « ticket_type ».

**Appel**
```json
{ "field_name": "priority" }
```
**Réponse** - l'objet de champ correspondant (ou "null" s'il n'est pas trouvé) :
```json
{
  "id": 3,
  "name": "priority",
  "label": "Priority",
  "type": "default_priority",
  "choices": { "Low": 1, "Medium": 2, "High": 3, "Urgent": 4 }
}
```

