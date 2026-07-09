---
id: conversazioni
title: Tool conversazioni Freshdesk
description: Reference dei tool conversazioni Freshdesk MCP per leggere thread, creare reply o note, aggiornare messaggi e gestire allegati ticket.
sidebar_label: Conversazioni
---
# conversations

5 outils pour le fil de conversation d'un ticket : lecture complète, réponses publiques, notes internes, édition d'un message et de pièces jointes.

---

## freshdesk_get_ticket_conversation <span className="fd-tag">lire</span>

Récupère l’intégralité du fil de conversation d’un ticket, en paginant automatiquement toutes les pages.

**Alias :** `get_ticket_conversation`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_ticket` | entier | Oui | - |

**Réponse** - liste des messages (réponses publiques et notes privées) ; chacun avec `body`/`body_text`, `user_id`, `private` (vrai pour les notes internes), `incoming`, `created_at` et toutes les `pièces jointes` :
```json
[
  {
    "id": 7001,
    "user_id": 6001,
    "private": false,
    "incoming": true,
    "body_text": "Non riesco ad accedere al portale.",
    "created_at": "2026-06-09T08:31:00Z",
    "attachments": []
  },
  {
    "id": 7002,
    "user_id": 123,
    "private": true,
    "incoming": false,
    "body_text": "Verificare credenziali SSO del cliente.",
    "created_at": "2026-06-09T09:02:00Z"
  }
]
```
:::caution[Taille du contexte]
Sur les tickets comportant de nombreux échanges, les corps HTML peuvent être longs : l'outil renvoie quand même toutes les pages.
:::

---

## freshdesk_create_ticket_reply <span className="fd-tag fd-tag--write">écrire</span>

Envoyer une réponse publique (visible par le client) sur un ticket. Soumis au [mode lecture seule](../configuration.md#read-only-mode).

**Alias :** `create_ticket_reply`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_ticket` | entier | Oui | - |
| `corps` | chaîne (HTML) | Oui | - |

**Appel**
```json
{ "ticket_id": 12345, "body": "<p>Abbiamo reimpostato il suo accesso, può riprovare.</p>" }
```
**Réponse** - l'objet de conversation créé :
```json
{ "id": 7003, "ticket_id": 12345, "private": false, "body": "<p>Abbiamo reimpostato il suo accesso, può riprovare.</p>" }
```
---

## freshdesk_create_ticket_note <span className="fd-tag fd-tag--write">écrire</span>

Ajoute une note privée (interne, non visible par le client) à un ticket. Soumis au [mode lecture seule](../configuration.md#read-only-mode).

**Alias :** `create_ticket_note`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_ticket` | entier | Oui | - |
| `corps` | chaîne (HTML) | Oui | - |

**Appel**
```json
{ "ticket_id": 12345, "body": "<p>Cliente ricontattato telefonicamente, problema confermato.</p>" }
```
**Répondre**
```json
{ "id": 7004, "ticket_id": 12345, "private": true, "body": "<p>Cliente ricontattato telefonicamente, problema confermato.</p>" }
```
---

## freshdesk_update_ticket_conversation <span className="fd-tag fd-tag--write">mise à jour</span>

Mettez à jour le corps d'une conversation existante (réponse ou note). Soumis au [mode lecture seule](../configuration.md#read-only-mode).

**Alias :** `update_ticket_conversation`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_conversation` | entier | Oui | - |
| `corps` | chaîne (HTML) | Oui | - |

:::notes
`conversation_id` est l'ID du message, pas le ticket.
:::

**Appel**
```json
{ "conversation_id": 7004, "body": "<p>Nota aggiornata con l'esito della verifica.</p>" }
```
---

## freshdesk_get_ticket_attachments <span className="fd-tag">lire</span>

Répertorie les pièces jointes et les images en ligne d'un ticket et de ses conversations. Par défaut, il renvoie **uniquement les métadonnées** pour éviter de saturer le contexte.

**Alias :** `get_ticket_attachments`

| Paramètre | Tapez | Obligatoire | Par défaut |
|---|---|---|---|
| `id_ticket` | entier | Oui | - |
| `include_content` | booléen | Non | `faux` |
| `max_total_bytes` | entier | Non | `5242880` (5 Mo) |

Avec `include_content=true` `data_base64` est également ajouté, avec des limites strictes : **max 1 Mo par fichier** et `max_total_bytes` au total (5 Mo par défaut). Les fichiers dépassant le budget sont marqués « tronqués : vrai » et « attachement_url » doit être utilisé.

**Appel**
```json
{ "ticket_id": 12345, "include_content": false }
```
**Répondre**
```json
{
  "attachments": [
    {
      "source": "ticket",
      "type": "file",
      "name": "schermata.png",
      "content_type": "image/png",
      "size": 84213,
      "attachment_url": "https://tuazienda.freshdesk.com/helpdesk/attachments/123"
    },
    {
      "source": "conversation",
      "type": "inline_image",
      "name": "inline-1.png",
      "attachment_url": "https://tuazienda.freshdesk.com/helpdesk/attachments/124"
    }
  ],
  "summary": "Trovati 1 allegati file e 1 immagini inline",
  "include_content": false
}
```

