---
id: aziende
title: Tool aziende Freshdesk
description: Reference dei tool aziende Freshdesk MCP per listare, cercare, leggere, creare e aggiornare company, domini e campi account.
sidebar_label: Aziende
---
# Entreprises

5 outils pour répertorier, lire, rechercher, créer et mettre à jour les entreprises.

---

## freshdesk_list_companies <span className="fd-tag">lire</span>

Répertorie les entreprises avec pagination.

**Alias :** `list_companies`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `page` | entier | Non | '1' |
| `par_page` | entier (1–100) | Non | '30' |

**Répondre**
```json
{
  "companies": [
    { "id": 3001, "name": "Acme S.p.A.", "domains": ["acme.it"] }
  ],
  "pagination": { "current_page": 1, "next_page": null, "prev_page": null, "per_page": 30 }
}
```
---

## freshdesk_view_company <span className="fd-tag">lire</span>

Récupérez le détail d'une entreprise par ID.

**Alias :** `view_company`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_entreprise` | entier | Oui | - |

**Répondre**
```json
{
  "id": 3001,
  "name": "Acme S.p.A.",
  "domains": ["acme.it"],
  "industry": "Manifatturiero",
  "account_tier": "Premium"
}
```
---

## freshdesk_search_companies <span className="fd-tag">lire</span>

Recherchez des entreprises par nom (complétion automatique). Fusionnez les anciens « search_companies » et « find_company_by_name ».

**Alias :** `search_companies`, `find_company_by_name`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `requête` | chaîne | Oui | - |

`query` est le nom (même partiel) de l'entreprise à rechercher.

**Appel**
```json
{ "query": "acme" }
```
**Répondre**
```json
[
  { "id": 3001, "name": "Acme S.p.A." }
]
```
---

## freshdesk_create_company <span className="fd-tag fd-tag--write">écrire</span>

Créez une nouvelle entreprise.

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `entreprise` | objet (CompanyCreate) | Oui | - |

**Champs de `société`** - `nom` est requis :

| Champ | Tapez | Obligatoire | Remarques |
|---|---|---|---|
| `nom` | chaîne | Oui | Nom unique de l'entreprise |
| `domaines` | tableau de chaînes | Non | Domaines de messagerie associés |
| `description` | chaîne | Non | Descriptif |
| `notes` | chaîne | Non | Note interne |
| `score_santé` | chaîne | Non | Ex. « Heureux », « À risque » |
| `compte_tier` | chaîne | Non | Ex. « Premium » |
| `industrie` | chaîne | Non | Secteur auquel vous appartenez |
| `champs_personnalisés` | objet | Non | Champs personnalisés |

**Appel**
```json
{
  "company": {
    "name": "Acme S.p.A.",
    "domains": ["acme.it"],
    "industry": "Manifatturiero",
    "account_tier": "Premium"
  }
}
```
**Répondre**
```json
{ "id": 3002, "name": "Acme S.p.A.", "domains": ["acme.it"] }
```
---

## freshdesk_update_company <span className="fd-tag fd-tag--write">mise à jour</span>

Mettre à jour une entreprise. Tous les champs sont facultatifs ; si la charge utile est vide, une erreur est renvoyée.

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_entreprise` | entier | Oui | - |
| `entreprise` | objet (CompanyUpdate) | Oui | - |

**Champs `société`** (tous facultatifs) : `nom`, `domaines`, `description`, `note`, `health_score`, `account_tier`, `industry`, `custom_fields`.

**Appel**
```json
{ "company_id": 3002, "company": { "account_tier": "Enterprise" } }
```
**Répondre**
```json
{ "id": 3002, "name": "Acme S.p.A.", "account_tier": "Enterprise" }
```
Si aucun champ n'est renseigné :
```json
{ "error": "Nessun campo fornito per l'aggiornamento dell'azienda." }
```

