---
id: prompts
title: Prompt MCP Freshdesk
description: Reference dei prompt MCP Freshdesk per guidare il modello nella creazione di ticket e reply con payload corretti e contesto ticket.
sidebar_label: Prompt
---
# Invites

En plus des outils, le serveur expose **2 invites MCP** (enregistrées avec `@mcp.prompt`). Les invites n'appellent pas directement l'API : elles produisent un texte guidé qui aide le modèle à composer correctement la charge utile, en la dirigeant vers les bons outils.

Utilisez-les lorsque vous souhaitez réduire l'ambiguïté dans la génération de charge utile. Une invite MCP est particulièrement utile pour les clients qui quittent le modèle pour choisir l'outil suivant : au lieu d'écrire manuellement tout le JSON, l'invite mémorise les champs obligatoires, le format attendu et les vérifications préliminaires.

## Débit recommandé

Pour créer des tickets, collectez d’abord le sujet, la description, la priorité, le statut, le canal et le demandeur. Si le ticket utilise des champs personnalisés, récupérez les métadonnées avec `freshdesk_get_field_properties` avant d'appeler `freshdesk_create_ticket`. Pour les réponses, lisez toujours la conversation mise à jour avec `freshdesk_get_ticket_conversation`, puis générez un court corps HTML cohérent avec le ton des réponses précédentes.

Les invites ne remplacent pas les outils de sécurité ou de validation : elles servent à donner au modèle une trace opérationnelle reproductible. Si un flux de travail nécessite l'approbation humaine, utilisez l'invite pour préparer la charge utile et afficher l'action attendue, puis appelez l'outil uniquement après confirmation dans le client.

---

## créer_ticket

Guide la création d’un ticket dans Freshdesk.

| Sujet | Tapez | Obligatoire |
|---|---|---|
| `sujet` | chaîne | Oui |
| `description` | chaîne | Oui |
| `source` | chaîne | Oui |
| `priorité` | chaîne | Oui |
| `statut` | chaîne | Oui |
| `e-mail` | chaîne | Oui |

L'invite renvoie une instruction qui encapsule les arguments sous forme de charge utile et rappelle au modèle :

- utilisez `freshdesk_get_field_properties()` pour connaître les valeurs autorisées et les clés internes des champs ;
- traiter `type` comme un **champ système** (non personnalisé), en le passant comme un champ de niveau supérieur (dans `additional_fields`), pas à l'intérieur de `custom_fields`.

Le texte généré est du type :
```text
Crea un ticket in Freshdesk usando questo payload:

{'subject': ..., 'description': ..., 'source': ..., 'priority': ..., 'status': ..., 'email': ...}

Se ti servono informazioni sui campi (valori ammessi o chiavi interne) usa
`freshdesk_get_field_properties()`.
...
```
En aval, le modèle invoque généralement [`freshdesk_create_ticket`](./tickets.md#freshdesk_create_ticket-write).

---

## create_reply

Guide la création d’une réponse sur un ticket.

| Sujet | Tapez | Obligatoire |
|---|---|---|
| `id_ticket` | entier | Oui |
| `réponse_message` | chaîne | Oui |

L'invite renvoie une instruction qui encapsule `{ "body":answer_message }` et rappelle au modèle de :

- formater `body` en **HTML**, de manière courte mais contextuellement complète ;
- examinez d'abord la conversation du ticket avec [`freshdesk_get_ticket_conversation`](./conversazioni.md#freshdesk_get_ticket_conversation-read) ;
- garder un ton et un style cohérents avec les réponses précédentes.

En aval, le modèle invoque généralement [`freshdesk_create_ticket_reply`](./conversazioni.md#freshdesk_create_ticket_reply-write).
```text
Crea una reply per il ticket {ticket_id} in Freshdesk usando questo payload:

{'body': ...}
...
```

