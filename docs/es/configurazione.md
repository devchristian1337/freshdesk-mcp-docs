---
id: configurazione
title: Configurazione client MCP
description: Configura Freshdesk MCP con variabili d'ambiente, API key, dominio Freshdesk e credenziali per client locali o HTTP multi-tenant.
---
# Configuración

## Credenciales de Freshdesk

Se necesitan dos datos:

| Credencial | ¿Dónde está |
|---|---|
| **Dominio** | El host completo de la cuenta debe terminar con `.freshdesk.com` (por ejemplo, `suempresa.freshdesk.com`). |
| **Clave API** | En Freshdesk: **Configuración de perfil → Clave API**. |

La autenticación hacia la API de Freshdesk utiliza HTTP básico con la clave API como nombre de usuario (la contraseña siempre es la letra "X", convención de Freshdesk). El dominio está normalizado: cualquier esquema `https://` y cualquier ruta se eliminan y el host debe terminar con `.freshdesk.com`; de lo contrario, la herramienta devuelve un error.

## Variables de entorno

| Variables | Propósito | Obligatorio | Predeterminado |
|---|---|---|---|
| `FRESHDESK_DOMAIN` | Host de Freshdesk (`*.freshdesk.com`) | Sí (alternativa de stdio) | - |
| `FRESHDESK_API_KEY` | Clave API de Freshdesk | Sí (alternativa de stdio) | - |
| `FRESHDESK_TICKETS_READ_ONLY` | Si es "verdadero", mutaciones de tickets de bloque adhesivo | No | `falso` |
| `MCP_TRANSPORT` | `stdio` (predeterminado) o `http` | No | `stdio` |
| `MCP_HTTP_HOST` | Vinculación de hosts en HTTP | No | `0.0.0.0` |
| `PUERTO` | Puerto HTTP (el ferrocarril lo inyecta) | No | → `FASTMCP_PORT` → `8000` |
| `FASTMCP_PORT` | Puerto HTTP alternativo | No | `8000` |
| `FASTMCP_STATELESS_HTTP` | Respuesta JSON sin estado (recomendado en HTTP) | No | `falso` (establecido en `verdadero` al iniciar HTTP) |

Referencia del archivo [`.env.example`](https://github.com/devchristian1337/freshdesk-mcp/blob/main/.env.example):
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
## Prioridad de credenciales

Las credenciales se resuelven **por solicitud** con esta prioridad:

1. **Encabezados HTTP** (recomendado): no terminen en los registros de acceso:
   - `Dominio-X-Freshdesk`
   - `X-Freshdesk-Api-Key`
   - `X-Freshdesk-Tickets-Solo lectura`
2. **Cadena de consulta** (compatible con versiones anteriores):
   - `freshdesk_domain`, `freshdesk_api_key`, `freshdesk_tickets_read_only`
3. **Variables de entorno** (retroceso típico para stdio):
   - `FRESHDESK_DOMAIN`, `FRESHDESK_API_KEY`, `FRESHDESK_TICKETS_READ_ONLY`

:::advertencia[seguridad de clave API]
La clave API pasada en **cadena de consulta** puede terminar en los registros de acceso de proxy/ferrocarril y en el historial del navegador. Prefiera siempre `X-Freshdesk-*` **encabezados**; localmente (stdio) utiliza variables de entorno.
:::

## Cliente MCP local (stdio)

Para los clientes que inician el servidor localmente, agregue esta entrada al archivo de configuración del cliente.
Los ejemplos suponen que el comando `freshdesk-mcp` se ha instalado desde GitHub como se indica en la página [Instalación](./installation.md).

### Escritorio Claude

Archivo `claude_desktop_config.json`:
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

Archivo `.cursor/mcp.json` en la raíz del proyecto (o configuración global):
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
El formato es el mismo para cualquier cliente MCP que admita stdio: reemplace `your_api_key` con su clave API y `yourcompany.freshdesk.com` con su dominio.

## Cliente MCP remoto (HTTP)

Para los clientes que se conectan a una URL remota (por ejemplo, Claude.ai o cualquier cliente HTTP Streamable), implemente el servidor y conéctese al punto final `/mcp`.

### Credenciales mediante cadena de consulta
```text
https://<tuo-host>/mcp?freshdesk_domain=tuazienda.freshdesk.com&freshdesk_api_key=la_tua_api_key
```
### Credenciales a través del encabezado (preferido)

Si el cliente le permite configurar encabezados personalizados:
```text
X-Freshdesk-Domain: tuazienda.freshdesk.com
X-Freshdesk-Api-Key: la_tua_api_key
X-Freshdesk-Tickets-Read-Only: false
```
## Modo de solo lectura

Cuando se establece `FRESHDESK_TICKETS_READ_ONLY=true` en el entorno del servidor, el modo es **fijo**: los encabezados y las cadenas de consulta no pueden desactivarlo. Si la variable es "false" o está ausente, "X-Freshdesk-Tickets-Read-Only" y "freshdesk_tickets_read_only" pueden habilitarla por solicitud.

Con el modo habilitado, las siguientes herramientas devuelven un error explícito sin tocar Freshdesk: `freshdesk_create_ticket`, `freshdesk_update_ticket`, `freshdesk_delete_ticket`, `freshdesk_create_ticket_reply`, `freshdesk_create_ticket_note`, `freshdesk_update_ticket_conversation`, `freshdesk_update_ticket_summary` y `freshdesk_delete_ticket_summary`.
```json
{
  "error": "Operazione bloccata: modalità ticket read-only attiva (freshdesk_tickets_read_only / FRESHDESK_TICKETS_READ_ONLY). Disattivala per poter creare/modificare/eliminare ticket."
}
```
Las operaciones de **lectura** en tickets y todas las operaciones en otros objetos, incluidas las escrituras en contactos, empresas, agentes, grupos, campos, respuestas predeterminadas y bases de conocimiento, siguen permitidas.
