---
id: configurazione
title: Configurazione client MCP
description: Configura Freshdesk MCP con variabili d'ambiente, API key, dominio Freshdesk e credenziali per client locali o HTTP multi-tenant.
---
#Configuration

## Identifiants Freshdesk

Deux informations sont nécessaires :

| Informations d'identification | Où est |
|---|---|
| **Domaine** | L'hébergeur complet du compte doit se terminer par « .freshdesk.com » (par exemple « votreentreprise.freshdesk.com »). |
| **Clé API** | Dans Freshdesk : **Paramètres du profil → Clé API**. |

L'authentification auprès de l'API Freshdesk utilise HTTP Basic avec la clé API comme nom d'utilisateur (le mot de passe est toujours la lettre « X », convention Freshdesk). Le domaine est normalisé : tout schéma `https://` et tout chemin sont supprimés et l'hôte doit se terminer par `.freshdesk.com`, sinon l'outil renvoie une erreur.

## Variables d'environnement

| Variables | Objectif | Obligatoire | Par défaut |
|---|---|---|---|
| `FRESHDESK_DOMAIN` | Hôte Freshdesk (`*.freshdesk.com`) | Oui (repli stdio) | - |
| `FRESHDESK_API_KEY` | Clé API Freshdesk | Oui (repli stdio) | - |
| `FRESHDESK_TICKETS_READ_ONLY` | Si « vrai », les mutations du ticket de bloc collant | Non | `faux` |
| `MCP_TRANSPORT` | `stdio` (par défaut) ou `http` | Non | `stdio` |
| `MCP_HTTP_HOST` | Liaison d'hôtes en HTTP | Non | `0.0.0.0` |
| `PORT` | Port HTTP (le chemin de fer l'injecte) | Non | → `FASTMCP_PORT` → `8000` |
| `FASTMCP_PORT` | Port HTTP de secours | Non | « 8 000 » |
| `FASTMCP_STATELESS_HTTP` | Réponse JSON sans état (recommandée en HTTP) | Non | `false` (défini sur `true` au démarrage HTTP) |

Référence du fichier [`.env.example`](https://github.com/devchristian1337/freshdesk-mcp/blob/main/.env.example) :
```bash
# Dominio Freshdesk completo (deve terminare con .freshdesk.com)
FRESHDESK_DOMAIN=tuazienda.freshdesk.com

# API key Freshdesk (Profile settings -> API key). NON committare il valore reale.
FRESHDESK_API_KEY=la_tua_api_key

# Se "true" blocca solo le mutazioni relative ai ticket: ticket, reply, note,
# aggiornamento conversazioni e riepiloghi. Non è una modalità read-only globale.
# Se impostata nell'ambiente del server, non può essere disattivata per richiesta.
FRESHDESK_TICKETS_READ_ONLY=false

# Transport: "stdio" (default) oppure "http".
MCP_TRANSPORT=stdio

# Solo per HTTP: risposta JSON stateless (consigliato per lo scaling).
FASTMCP_STATELESS_HTTP=true
```
## Priorité des informations d'identification

Les informations d'identification sont résolues **par demande** avec cette priorité :

1. **En-têtes HTTP** (recommandé) - ne se retrouvent pas dans les journaux d'accès :
   - `X-Freshdesk-Domaine`
   - `X-Freshdesk-Api-Key`
   - `X-Freshdesk-Tickets-Lecture seule`
2. **Chaîne de requête** (rétrocompatible) :
   - `freshdesk_domain`, `freshdesk_api_key`, `freshdesk_tickets_read_only`
3. **Variables d'environnement** (solution de repli typique pour stdio) :
   - `FRESHDESK_DOMAIN`, `FRESHDESK_API_KEY`, `FRESHDESK_TICKETS_READ_ONLY`

:::avertissement[Sécurité de la clé API]
La clé API transmise dans la **chaîne de requête** peut se retrouver dans les journaux d'accès proxy/ferroviaire et dans l'historique du navigateur. Préférez toujours `X-Freshdesk-*` **en-têtes** ; localement (stdio) utilise des variables d'environnement.
:::

## Client MCP local (stdio)

Pour les clients qui démarrent le serveur localement, ajoutez cette entrée au fichier de configuration client.
Les exemples supposent que la commande `freshdesk-mcp` a été installée à partir de GitHub comme indiqué sur la page [Installation](./installation.md).

### Bureau Claude

Fichier `claude_desktop_config.json` :
```json
{
  "mcpServers": {
    "freshdesk-mcp": {
      "command": "freshdesk-mcp",
      "args": [],
      "env": {
        "FRESHDESK_API_KEY": "la_tua_api_key",
        "FRESHDESK_DOMAIN": "tuazienda.freshdesk.com",
        "FRESHDESK_TICKETS_READ_ONLY": "false"
      }
    }
  }
}
```
### Curseur

Fichier `.cursor/mcp.json` à la racine du projet (ou paramètres globaux) :
```json
{
  "mcpServers": {
    "freshdesk-mcp": {
      "command": "freshdesk-mcp",
      "args": [],
      "env": {
        "FRESHDESK_API_KEY": "la_tua_api_key",
        "FRESHDESK_DOMAIN": "tuazienda.freshdesk.com",
        "FRESHDESK_TICKETS_READ_ONLY": "false"
      }
    }
  }
}
```
Le format est le même pour tout client MCP prenant en charge stdio : remplacez « your_api_key » par votre clé API et « yourcompany.freshdesk.com » par votre domaine.

## Client MCP distant (HTTP)

Pour les clients se connectant à une URL distante (par exemple Claude.ai ou tout client HTTP Streamable), déployez le serveur et connectez-vous au point de terminaison `/mcp`.

### Informations d'identification via la chaîne de requête
```text
https://<tuo-host>/mcp?freshdesk_domain=tuazienda.freshdesk.com&freshdesk_api_key=la_tua_api_key
```
### Informations d'identification via l'en-tête (de préférence)

Si le client vous permet de définir des en-têtes personnalisés :
```text
X-Freshdesk-Domain: tuazienda.freshdesk.com
X-Freshdesk-Api-Key: la_tua_api_key
X-Freshdesk-Tickets-Read-Only: false
```
## Mode lecture seule

Lorsque `FRESHDESK_TICKETS_READ_ONLY=true` est défini dans l'environnement du serveur, le mode est **sticky** : les en-têtes et les chaînes de requête ne peuvent pas le désactiver. Si la variable est « false » ou absente, « X-Freshdesk-Tickets-Read-Only » et « Freshdesk_tickets_read_only » peuvent l'activer sur demande.

Avec le mode activé, les outils suivants renvoient une erreur explicite sans toucher à Freshdesk : `freshdesk_create_ticket`, `freshdesk_update_ticket`, `freshdesk_delete_ticket`, `freshdesk_create_ticket_reply`, `freshdesk_create_ticket_note`, `freshdesk_update_ticket_conversation`, `freshdesk_update_ticket_summary` et `freshdesk_delete_ticket_summary`.
```json
{
  "error": "Operazione bloccata: modalità ticket read-only attiva (freshdesk_tickets_read_only / FRESHDESK_TICKETS_READ_ONLY). Disattivala per poter creare/modificare/eliminare ticket."
}
```
Les opérations de **Lecture** sur les tickets et toutes les opérations sur d'autres objets, y compris les écritures dans les contacts, les entreprises, les agents, les groupes, les champs, les réponses standardisées et les bases de connaissances, restent autorisées.
