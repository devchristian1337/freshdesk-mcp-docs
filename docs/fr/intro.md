---
id: intro
title: Introduzione a Freshdesk MCP
description: "Panoramica di Freshdesk MCP: cosa fa il server, quali API Freshdesk espone e come usarlo con assistenti AI compatibili MCP."
slug: /intro
---
# MCP Freshdesk

**Freshdesk MCP** est un serveur [Model Context Protocol](https://modelcontextprotocol.io/) qui connecte un compte [Freshdesk](https://www.freshdesk.com/) à n'importe quel modèle ou client d'IA compatible MCP. Il expose l'API Freshdesk sous la forme d'un ensemble d'**outils** et d'**invites** pouvant être invoqués en langage naturel : l'assistant peut ainsi lire et gérer les tickets, les conversations, les contacts, les entreprises, la base de connaissances et les champs personnalisés.

Le serveur est écrit en Python (FastMCP) avec une architecture modulaire (`core` / `services` / `schemas` / `tools`) et un client HTTP partagé avec gestion des limites de débit.

## A quoi ça sert

Une fois le serveur connecté, vous pouvez demander à l'assistant des choses comme :

- "Montrez-moi le ticket n°12345 et toute sa conversation"
- "Rechercher des tickets ouverts et urgents et les affecter au groupe Support"
- "Trouvez la société Acme et créez un contact pour mario.rossi@acme.it"
- "Ajouter une note privée au ticket #12345 avec les résultats de l'analyse"
- "Créez un article de la base de connaissances sur la réinitialisation de votre mot de passe"

Le modèle choisit automatiquement le bon outil et compose ses paramètres.

## Présentation des fonctionnalités

- **124 outils exposés par le serveur MCP** : 64 noms canoniques `freshdesk_*` et 60 alias hérités obsolètes. Les alias sont associés à 59 gestionnaires ; `freshdesk_search_companies` en expose deux.
- **2 invites guidées** (`create_ticket`, `create_reply`) pour aider le modèle à composer les charges utiles.
- **ToolAnnotations** sur chaque outil (lecture/écriture/mise à jour/suppression) : conseils de comportement pour des automatisations plus sûres.
- **Multi-tenant via HTTP** : un seul déploiement peut servir plusieurs comptes Freshdesk, avec des informations d'identification fournies par demande.
- **Authentification via en-tête** (`X-Freshdesk-Domain` / `X-Freshdesk-Api-Key`) préférée à la chaîne de requête.
- Mode **Lecture seule** sur les billets via `FRESHDESK_TICKETS_READ_ONLY`.
- **Pièces jointes contextuelles** : les métadonnées sont renvoyées par défaut, le contenu base64 uniquement sur demande (1 Mo par fichier et 5 Mo au total par défaut).
- **Pagination automatique** du fil de conversation, jusqu'à 50 pages de 100 messages.

## Les outils, par domaine

| Formulaire | N° d'outils | Ce qu'il couvre |
|---|---|---|
| [Billet](./reference/tickets.md) | 12 | Liste, recherche, détail, CRUD, résumé, champ de ticket |
| [Conversations](./reference/conversations.md) | 5 | Sujet, réponse, notes, mise à jour, pièces jointes |
| [Contacts](./référence/contacts.md) | 5 | Liste, détail, recherche, création, mise à jour |
| [Entreprises](./reference/companies.md) | 5 | Liste, détail, recherche, création, mise à jour |
| [Agents](./reference/agenti.md) | 5 | Liste, détail, recherche, création, mise à jour |
| [Groupes](./reference/groups.md) | 4 | Liste, détail, création, mise à jour |
| [Champs](./reference/fields.md) | 8 | Champ ticket, champ contact, champ entreprise |
| [Réponses standardisées](./reference/canned-responses.md) | 7 | Dossiers et réponses standardisées |
| [Base de connaissances](./reference/solutions.md) | 13 | Catégories, dossiers, articles + recherche |
| **Total** | **64** | + 2 [invite](./reference/prompts.md) |

## Comment cette documentation est organisée
- **[Installation](./installation.md)** - configuration requise du serveur, installation et démarrage (stdio et HTTP).
- **[Configuration](./configuration.md)** - variables d'environnement, informations d'identification Freshdesk et exemples de configuration de client MCP.
- **[Tool Reference](./reference/overview.md)** - chaque outil avec paramètres, exemple d'appel et de réponse.
- **[Examples](./examples.md)** - flux d'utilisation réels combinant plusieurs outils.

:::note[Dépôt]
Le code source se trouve sur [github.com/devchristian1337/freshdesk-mcp](https://github.com/devchristian1337/freshdesk-mcp). Cette documentation fait référence au référentiel GitHub : le package du même nom `freshdesk-mcp` publié sur PyPI n'est pas géré par ce projet.
:::
