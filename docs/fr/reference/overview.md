---
id: overview
title: Reference dei tool MCP
description: "Convenzioni della reference Freshdesk MCP: naming dei tool, alias, ToolAnnotations, risposte, errori, paginazione e parametri."
sidebar_label: Panoramica
---
# Références d'outils

Cette section documente la sortie réelle de `list_tools` et `list_prompts` du serveur : **124 outils** (64 alias canoniques et 60 alias hérités) et **2 invites**, regroupés par domaine. Avant de consulter les différents outils, il convient de connaître les conventions communes.

## Noms et alias

Chaque gestionnaire a un **nom canonique** préfixé par `freshdesk_*` (par exemple `freshdesk_get_ticket`). Pour une compatibilité ascendante avec les clients déjà configurés, 59 gestionnaires exposent un ou plusieurs noms hérités en tant qu'**alias obsolètes** (par exemple `get_ticket`) ; cela fait 60 noms hérités au total, car `freshdesk_search_companies` expose à la fois `search_companies` et `find_company_by_name`. Les alias fonctionnent de manière identique mais leur description incite à utiliser le nom canonique.

Sur les pages suivantes, le nom canonique et les éventuels alias sont indiqués pour chaque outil.

## Annotations d'outils

Chaque outil déclare des annotations, c'est-à-dire des indices sur son comportement (ce sont des suggestions pour les clients, pas des garanties de sécurité). Puisqu'il s'agit toujours d'un service externe, tous les outils ont « openWorldHint = true ».

| Insignes | Signification | Indice |
|---|---|---|
| <span className="fd-tag">lire</span> | Lecture seule | `readOnlyHint : vrai`, `idempotentHint : vrai` |
| <span className="fd-tag fd-tag--write">écrire</span> | Création (non idempotente) | `idempotentHint : faux` |
| <span className="fd-tag fd-tag--write">mise à jour</span> | Mise à jour (idempotente) | `idempotentHint : vrai` |
| <span className="fd-tag fd-tag--delete">supprimer</span> | Opération destructrice | `destructiveHint : vrai` |

Les outils d'**écriture/suppression de tickets** respectent également le [mode lecture seule](../configurazione.md#read-only-mode). Le bloc n'affecte pas les opérations d'écriture sur d'autres ressources Freshdesk.

## Format de réponse

Les outils renvoient des données JSON. Les formes récurrentes sont :

**Liste de pagination** - Les outils `list_*`/`get_*` avec pagination renvoient la ressource plus un bloc `pagination` :
```json
{
  "tickets": [ { "id": 1, "subject": "..." } ],
  "pagination": {
    "current_page": 1,
    "next_page": 2,
    "prev_page": null,
    "per_page": 30
  }
}
```
**Ressource unique** - les outils `view_*`/`get_*` par ID renvoient directement l'objet Freshdesk (un dict), ou une liste brute des points de terminaison qui l'attendent (par exemple `freshdesk_get_ticket_fields`).

**Création/mise à jour de tickets** : les outils de tickets encapsulent le résultat :
```json
{ "success": true, "message": "Ticket creato", "ticket": { "id": 1234 } }
```
## Format d'erreur

En cas de problème, l'outil renvoie un dict avec la clé `error` (et, lorsqu'elle est disponible, `status_code` et `details`) au lieu de lever une exception :
```json
{
  "error": "Descrizione dell'errore",
  "status_code": 404,
  "details": { "errors": [ { "field": "...", "message": "..." } ] }
}
```
Erreurs courantes de validation côté client (avant d'appeler l'API) :

- `"Le numéro de page doit être >= 1."`
- `"par_page doit être compris entre 1 et 100."`
- `"freshdesk_domain doit être un hôte *.freshdesk.com"`
- `"freshdesk_api_key est requis"`

## Pagination

Les outils de liste paginée acceptent « page » (≥ 1) et « par_page » (1 à 100, 30 par défaut). Le bloc `pagination` est reconstruit à partir de l'en-tête HTTP `Link` renvoyé par Freshdesk : `next_page`/`prev_page` sont `null` lorsqu'il n'y a pas de page suivante/précédente. La recherche de tickets utilise uniquement le paramètre « page » et accepte les pages 1 à 10 ; le fil de conversation suit automatiquement les pages jusqu'à un maximum défensif de 50 pages de 100 messages.

## Comment lire les tables de paramètres

Pour chaque outil vous trouverez un tableau avec : **nom** du paramètre, **type**, s'il est **obligatoire** et tout **par défaut**. Les paramètres saisis en tant qu'objets (par exemple `ticket`, `contact`, `group`) correspondent à un schéma structuré dont les champs sont listés sous le tableau.
