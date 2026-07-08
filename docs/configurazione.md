---
id: configurazione
title: Configurazione
description: Variabili d'ambiente, credenziali Freshdesk e configurazione del client MCP.
---

# Configurazione

## Credenziali Freshdesk

Servono due informazioni:

| Credenziale | Dove si trova |
|---|---|
| **Dominio** | L'host completo dell'account, deve terminare con `.freshdesk.com` (es. `tuazienda.freshdesk.com`). |
| **API key** | In Freshdesk: **Profile Settings → API Key**. |

L'autenticazione verso l'API Freshdesk usa HTTP Basic con la API key come username (la password è sempre la lettera `X`, convenzione Freshdesk). Il dominio viene normalizzato: eventuale schema `https://` ed eventuale path vengono rimossi e l'host deve terminare con `.freshdesk.com`, altrimenti il tool restituisce un errore.

## Variabili d'ambiente

| Variabile | Scopo | Obbligatoria | Default |
|---|---|---|---|
| `FRESHDESK_DOMAIN` | Host Freshdesk (`*.freshdesk.com`) | Sì (fallback stdio) | - |
| `FRESHDESK_API_KEY` | API key Freshdesk | Sì (fallback stdio) | - |
| `FRESHDESK_TICKETS_READ_ONLY` | Se `true`, blocca creazione/modifica/eliminazione dei ticket | No | `false` |
| `MCP_TRANSPORT` | `stdio` (default) oppure `http` | No | `stdio` |
| `MCP_HTTP_HOST` | Host di bind in HTTP | No | `0.0.0.0` |
| `PORT` | Porta HTTP (Railway la inietta) | No | → `FASTMCP_PORT` → `8000` |
| `FASTMCP_PORT` | Porta HTTP di fallback | No | `8000` |
| `FASTMCP_STATELESS_HTTP` | Risposta JSON stateless (consigliata in HTTP) | No | `false` (impostata a `true` all'avvio HTTP) |

File [`.env.example`](https://github.com/devchristian1337/freshdesk-mcp/blob/main/.env.example) di riferimento:

```bash
# Dominio Freshdesk completo (deve terminare con .freshdesk.com)
FRESHDESK_DOMAIN=tuazienda.freshdesk.com

# API key Freshdesk (Profile settings -> API key). NON committare il valore reale.
FRESHDESK_API_KEY=la_tua_api_key

# Se "true" blocca ogni operazione di scrittura/eliminazione sui ticket (sola lettura).
FRESHDESK_TICKETS_READ_ONLY=false

# Transport: "stdio" (default) oppure "http".
MCP_TRANSPORT=stdio

# Solo per HTTP: risposta JSON stateless (consigliato per lo scaling).
FASTMCP_STATELESS_HTTP=true
```

## Precedenza delle credenziali

Le credenziali vengono risolte **per-richiesta** con questa precedenza:

1. **Header HTTP** (consigliati) - non finiscono negli access log:
   - `X-Freshdesk-Domain`
   - `X-Freshdesk-Api-Key`
   - `X-Freshdesk-Tickets-Read-Only`
2. **Query string** (retrocompatibile):
   - `freshdesk_domain`, `freshdesk_api_key`, `freshdesk_tickets_read_only`
3. **Variabili d'ambiente** (fallback tipico per stdio):
   - `FRESHDESK_DOMAIN`, `FRESHDESK_API_KEY`, `FRESHDESK_TICKETS_READ_ONLY`

:::warning[Sicurezza della API key]
La API key passata in **query string** può finire negli access log di proxy/Railway e nella cronologia del browser. Preferisci sempre gli **header** `X-Freshdesk-*`; in locale (stdio) usa le variabili d'ambiente.
:::

## Client MCP locale (stdio)

Per i client che avviano il server in locale, aggiungi questa voce al file di configurazione del client.

### Claude Desktop

File `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "freshdesk-mcp": {
      "command": "uvx",
      "args": ["freshdesk-mcp"],
      "env": {
        "FRESHDESK_API_KEY": "la_tua_api_key",
        "FRESHDESK_DOMAIN": "tuazienda.freshdesk.com",
        "FRESHDESK_TICKETS_READ_ONLY": "false"
      }
    }
  }
}
```

### Cursor

File `.cursor/mcp.json` nella root del progetto (o nelle impostazioni globali):

```json
{
  "mcpServers": {
    "freshdesk-mcp": {
      "command": "uvx",
      "args": ["freshdesk-mcp"],
      "env": {
        "FRESHDESK_API_KEY": "la_tua_api_key",
        "FRESHDESK_DOMAIN": "tuazienda.freshdesk.com",
        "FRESHDESK_TICKETS_READ_ONLY": "false"
      }
    }
  }
}
```

Il formato è lo stesso per qualunque client MCP che supporti stdio: sostituisci `la_tua_api_key` con la tua API key e `tuazienda.freshdesk.com` con il tuo dominio.

## Client MCP remoto (HTTP)

Per i client che si collegano a un URL remoto (es. Claude.ai o qualunque client Streamable HTTP), esegui il deploy del server e collegati all'endpoint `/mcp`.

### Credenziali via query string

```text
https://<tuo-host>/mcp?freshdesk_domain=tuazienda.freshdesk.com&freshdesk_api_key=la_tua_api_key
```

### Credenziali via header (preferite)

Se il client consente di impostare header personalizzati:

```text
X-Freshdesk-Domain: tuazienda.freshdesk.com
X-Freshdesk-Api-Key: la_tua_api_key
X-Freshdesk-Tickets-Read-Only: false
```

## Modalità read-only

Quando `FRESHDESK_TICKETS_READ_ONLY` (o l'header `X-Freshdesk-Tickets-Read-Only`) è attiva, i tool di scrittura sui ticket (`freshdesk_create_ticket`, `freshdesk_update_ticket`, `freshdesk_delete_ticket`, le reply/note e i summary) restituiscono un errore esplicito senza toccare Freshdesk:

```json
{
  "error": "Operazione bloccata: modalità ticket read-only attiva (freshdesk_tickets_read_only / FRESHDESK_TICKETS_READ_ONLY). Disattivala per poter creare/modificare/eliminare ticket."
}
```

Le operazioni di **lettura** sui ticket e tutte le operazioni sugli altri oggetti (contatti, aziende, agenti, ecc.) restano consentite.
