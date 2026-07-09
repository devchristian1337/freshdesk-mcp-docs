---
id: configurazione
title: Configurazione client MCP
description: Configura Freshdesk MCP con variabili d'ambiente, API key, dominio Freshdesk e credenziali per client locali o HTTP multi-tenant.
---
# Configuration

## Freshdesk credentials

Two pieces of information are needed:

| Credential | Where is |
|---|---|
| **Domain** | The full account host must end with `.freshdesk.com` (e.g. `yourcompany.freshdesk.com`). |
| **API key** | In Freshdesk: **Profile Settings → API Key**. |

Authentication towards the Freshdesk API uses HTTP Basic with the API key as the username (the password is always the letter `X`, Freshdesk convention). The domain is normalized: any `https://` scheme and any path are removed and the host must end with `.freshdesk.com`, otherwise the tool returns an error.

## Environment variables

| Variable | Purpose | Mandatory | Default |
|---|---|---|---|
| `FRESHDESK_DOMAIN` | Freshdesk Host (`*.freshdesk.com`) | Yes (stdio fallback) | - |
| `FRESHDESK_API_KEY` | Freshdesk API key | Yes (stdio fallback) | - |
| `FRESHDESK_TICKETS_READ_ONLY` | If `true`, sticky block ticket mutations | No | `false` |
| `MCP_TRANSPORT` | `stdio` (default) or `http` | No | `stdio` |
| `MCP_HTTP_HOST` | Binding hosts in HTTP | No | `0.0.0.0` |
| `PORT` | HTTP port (Railway injects it) | No | → `FASTMCP_PORT` → `8000` |
| `FASTMCP_PORT` | Fallback HTTP Port | No | `8000` |
| `FASTMCP_STATELESS_HTTP` | Stateless JSON response (recommended in HTTP) | No | `false` (set to `true` on HTTP startup) |

File [`.env.example`](https://github.com/devchristian1337/freshdesk-mcp/blob/main/.env.example) reference:
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
## Credential precedence

Credentials are resolved **per-request** with this precedence:

1. **HTTP headers** (recommended) - do not end up in access logs:
   - `X-Freshdesk-Domain`
   - `X-Freshdesk-Api-Key`
   - `X-Freshdesk-Tickets-Read-Only`
2. **Query string** (backwards compatible):
   - `freshdesk_domain`, `freshdesk_api_key`, `freshdesk_tickets_read_only`
3. **Environment variables** (typical fallback for stdio):
   - `FRESHDESK_DOMAIN`, `FRESHDESK_API_KEY`, `FRESHDESK_TICKETS_READ_ONLY`

:::warning[API key security]
The API key passed in **query string** may end up in proxy/Railway access logs and browser history. Always prefer `X-Freshdesk-*` **headers**; locally (stdio) uses environment variables.
:::

## Local MCP client (stdio)

For clients that start the server locally, add this entry to the client configuration file.
The examples assume that the `freshdesk-mcp` command has been installed from GitHub as indicated on the [Installation](./installation.md) page.

### Claude Desktop

`claude_desktop_config.json` file:
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
### Cursor

`.cursor/mcp.json` file in the project root (or global settings):
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
The format is the same for any MCP client that supports stdio: replace `your_api_key` with your API key and `yourcompany.freshdesk.com` with your domain.

## Remote MCP Client (HTTP)

For clients connecting to a remote URL (e.g. Claude.ai or any Streamable HTTP client), deploy the server and connect to the `/mcp` endpoint.

### Credentials via query string
```text
https://<tuo-host>/mcp?freshdesk_domain=tuazienda.freshdesk.com&freshdesk_api_key=la_tua_api_key
```
### Credentials via header (preferred)

If the client allows you to set custom headers:
```text
X-Freshdesk-Domain: tuazienda.freshdesk.com
X-Freshdesk-Api-Key: la_tua_api_key
X-Freshdesk-Tickets-Read-Only: false
```
## Read-only mode

When `FRESHDESK_TICKETS_READ_ONLY=true` is set in the server environment, the mode is **sticky**: headers and query strings cannot turn it off. If the variable is `false` or absent, `X-Freshdesk-Tickets-Read-Only` and `freshdesk_tickets_read_only` can enable it on a per-request basis.

With mode enabled, the following tools return an explicit error without touching Freshdesk: `freshdesk_create_ticket`, `freshdesk_update_ticket`, `freshdesk_delete_ticket`, `freshdesk_create_ticket_reply`, `freshdesk_create_ticket_note`, `freshdesk_update_ticket_conversation`, `freshdesk_update_ticket_summary` and `freshdesk_delete_ticket_summary`.
```json
{
  "error": "Operazione bloccata: modalità ticket read-only attiva (freshdesk_tickets_read_only / FRESHDESK_TICKETS_READ_ONLY). Disattivala per poter creare/modificare/eliminare ticket."
}
```
**Read** operations on tickets and all operations on other objects, including writes to contacts, companies, agents, groups, fields, canned responses, and knowledge bases, remain permitted.
