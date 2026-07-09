---
id: risposte-predefinite
title: Tool risposte predefinite
description: Reference dei tool risposte predefinite Freshdesk MCP per cartelle, canned response, contenuti HTML, visibilità e aggiornamenti.
sidebar_label: Risposte predefinite
---
# Réponses standardisées

7 outils pour gérer les réponses standardisées et les dossiers qui les contiennent.

Les réponses prédéfinies vous permettent de standardiser les communications récurrentes sans perdre le contrôle du texte final envoyé au client. Dans Freshdesk MCP, les outils séparent les dossiers et le contenu : vous identifiez d'abord le dossier, puis vous lisez ou modifiez la réponse standardisée. Ceci est utile lorsqu'un assistant IA doit proposer une réponse cohérente avec les procédures internes, les politiques de remboursement, les messages d'intégration ou les communications d'assistance technique.

Pour éviter les modifications indésirables, utilisez les outils « lecture » pour récupérer le titre, le HTML et la visibilité avant d'appeler un outil « écriture » ou « mise à jour ». Le champ « visibilité » détermine qui peut utiliser la réponse : tous les agents, uniquement le propriétaire ou les groupes sélectionnés.

---

## freshdesk_list_canned_response_folders <span className="fd-tag">lire</span>

Répertorie les dossiers de réponses standardisés.

**Alias :** `list_canned_response_folders`

Aucun paramètre.

**Répondre**
```json
[
  { "id": 201, "name": "Fatturazione", "responses_count": 8 },
  { "id": 202, "name": "Accesso e credenziali", "responses_count": 5 }
]
```
---

## freshdesk_list_canned_responses <span className="fd-tag">lire</span>

Répertorie les réponses standardisées contenues dans un dossier.

**Alias :** `list_canned_responses`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_dossier` | entier | Oui | - |

**Appel**
```json
{ "folder_id": 201 }
```
**Répondre**
```json
[
  { "id": 5001, "title": "Conferma rimborso", "folder_id": 201 }
]
```
---

## freshdesk_view_canned_response <span className="fd-tag">lire</span>

Récupère le détail d’une réponse standardisée par ID.

**Alias :** `view_canned_response`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `canned_response_id` | entier | Oui | - |

**Répondre**
```json
{
  "id": 5001,
  "title": "Conferma rimborso",
  "content_html": "<p>Confermiamo l'avvenuto rimborso.</p>",
  "folder_id": 201,
  "visibility": 0
}
```
---

## freshdesk_create_canned_response <span className="fd-tag fd-tag--write">écrire</span>

Créez une réponse standardisée.

**Alias :** `create_canned_response`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `réponse` | objet (CannedResponseCreate) | Oui | - |

**Champs `Réponse` :**

| Champ | Tapez | Obligatoire | Remarques |
|---|---|---|---|
| `titre` | chaîne | Oui | Titre |
| `content_html` | chaîne | Oui | Contenu HTML |
| `id_dossier` | entier | Oui | Dossier de destination |
| `visibilité` | entier (0–2) | Oui | `0` tous les agents · `1` personnel · `2` groupes sélectionnés |
| `group_ids` | tableau d'entiers | Conditionnel | Obligatoire si `visibilité = 2` |

**Appel**
```json
{
  "response": {
    "title": "Conferma rimborso",
    "content_html": "<p>Confermiamo l'avvenuto rimborso.</p>",
    "folder_id": 201,
    "visibility": 0
  }
}
```
**Répondre**
```json
{ "id": 5002, "title": "Conferma rimborso", "folder_id": 201, "visibility": 0 }
```
---

## freshdesk_update_canned_response <span className="fd-tag fd-tag--write">mise à jour</span>

Mettez à jour une réponse standardisée.

**Alias :** `update_canned_response`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `canned_response_id` | entier | Oui | - |
| `canned_response_fields` | objet | Oui | - |

Clés communes : `titre`, `content_html`, `visibilité`.

**Appel**
```json
{ "canned_response_id": 5002, "canned_response_fields": { "title": "Conferma rimborso effettuato" } }
```
---

## freshdesk_create_canned_response_folder <span className="fd-tag fd-tag--write">écrire</span>

Créez un dossier de réponses standardisé.

**Alias :** `create_canned_response_folder`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `nom` | chaîne | Oui | - |

**Appel**
```json
{ "name": "Onboarding" }
```
**Répondre**
```json
{ "id": 203, "name": "Onboarding" }
```
---

## freshdesk_update_canned_response_folder <span className="fd-tag fd-tag--write">mise à jour</span>

Renommez un dossier de réponses prédéfinies.

**Alias :** `update_canned_response_folder`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_dossier` | entier | Oui | - |
| `nom` | chaîne | Oui | - |

**Appel**
```json
{ "folder_id": 203, "name": "Onboarding clienti" }
```

