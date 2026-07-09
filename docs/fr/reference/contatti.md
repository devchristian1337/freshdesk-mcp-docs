---
id: contatti
title: Tool contatti Freshdesk
description: Reference dei tool contatti Freshdesk MCP per listare, cercare, leggere, creare e aggiornare requester con campi standard e custom.
sidebar_label: Contatti
---
# Contacts

5 outils pour lister, lire, rechercher, créer et mettre à jour des contacts.

---

## freshdesk_list_contacts <span className="fd-tag">lire</span>

Répertoriez les contacts avec une pagination et des filtres facultatifs.

**Alias :** `list_contacts`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `page` | entier | Non | '1' |
| `par_page` | entier (1–100) | Non | '30' |
| `e-mail` | chaîne | Non | `null` |
| `id_entreprise` | entier | Non | `null` |
| `mis à jour_depuis` | chaîne (ISO 8601) | Non | `null` |

**Appel**
```json
{ "company_id": 3001, "per_page": 50 }
```
**Répondre**
```json
{
  "contacts": [
    { "id": 6001, "name": "Mario Rossi", "email": "mario.rossi@acme.it", "company_id": 3001 }
  ],
  "pagination": { "current_page": 1, "next_page": null, "prev_page": null, "per_page": 50 }
}
```
---

## freshdesk_get_contact <span className="fd-tag">lire</span>

Récupérer le détail d'un contact par ID.

**Alias :** `get_contact`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `identifiant_contact` | entier | Oui | - |

**Répondre**
```json
{
  "id": 6001,
  "name": "Mario Rossi",
  "email": "mario.rossi@acme.it",
  "phone": "+39 02 1234567",
  "company_id": 3001,
  "job_title": "IT Manager"
}
```
---

## freshdesk_search_contacts <span className="fd-tag">lire</span>

Rechercher des contacts par nom ou par e-mail (complétion automatique).

**Alias :** `search_contacts`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `requête` | chaîne | Oui | - |

**Appel**
```json
{ "query": "rossi" }
```
**Répondre**
```json
[
  { "id": 6001, "name": "Mario Rossi", "email": "mario.rossi@acme.it" }
]
```
---

## freshdesk_create_contact <span className="fd-tag fd-tag--write">écrire</span>

Créez un nouveau contact.

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `contacter` | objet (ContactCréer) | Oui | - |

**Champs `contact`** - `name` est obligatoire et nécessite **au moins un** de `email`, `phone`, `mobile`, `twitter_id`, `unique_external_id` :

| Champ | Tapez | Obligatoire | Remarques |
|---|---|---|---|
| `nom` | chaîne | Oui | Nom complet |
| `e-mail` | chaîne | Conditionnel | E-mail principal |
| `téléphone` | chaîne | Conditionnel | Téléphone fixe |
| `mobile` | chaîne | Conditionnel | Mobile |
| `twitter_id` | chaîne | Conditionnel | Identifiant Twitter |
| `unique_external_id` | chaîne | Conditionnel | ID externe unique |
| `id_entreprise` | entier | Non | Entreprise à laquelle vous appartenez |
| `titre_travail` | chaîne | Non | Rôle/qualification |
| `description` | chaîne | Non | Notes de contact |
| `champs_personnalisés` | objet | Non | Champs personnalisés |

**Appel**
```json
{
  "contact": {
    "name": "Giulia Bianchi",
    "email": "giulia.bianchi@acme.it",
    "company_id": 3001,
    "job_title": "Responsabile Acquisti"
  }
}
```
**Répondre**
```json
{ "id": 6002, "name": "Giulia Bianchi", "email": "giulia.bianchi@acme.it", "company_id": 3001 }
```
---

## freshdesk_update_contact <span className="fd-tag fd-tag--write">mise à jour</span>

Mettre à jour un contact.

**Alias :** `update_contact`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `identifiant_contact` | entier | Oui | - |
| `contact_fields` | objet | Oui | - |

Clés `contact_fields` communes : `name`, `email`, `phone`, `company_id`, `job_title`, `custom_fields`.

**Appel**
```json
{ "contact_id": 6002, "contact_fields": { "job_title": "Direttore Acquisti" } }
```
**Répondre**
```json
{ "id": 6002, "name": "Giulia Bianchi", "job_title": "Direttore Acquisti" }
```

