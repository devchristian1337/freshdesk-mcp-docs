---
id: configurazione
title: Configurazione client MCP
description: Configura Freshdesk MCP con variabili d'ambiente, API key, dominio Freshdesk e credenziali per client locali o HTTP multi-tenant.
---
# Konfiguration

## Freshdesk-Anmeldeinformationen

Es werden zwei Informationen benötigt:

| Anmeldeinformationen | Wo ist |
|---|---|
| **Domäne** | Der vollständige Kontohost muss mit „.freshdesk.com“ enden (z. B. „IhrUnternehmen.freshdesk.com“). |
| **API-Schlüssel** | In Freshdesk: **Profileinstellungen → API-Schlüssel**. |

Die Authentifizierung gegenüber der Freshdesk-API verwendet HTTP Basic mit dem API-Schlüssel als Benutzernamen (das Passwort ist immer der Buchstabe „X“, gemäß Freshdesk-Konvention). Die Domäne ist normalisiert: jegliches „https://“-Schema und alle Pfade werden entfernt und der Host muss mit „.freshdesk.com“ enden, andernfalls gibt das Tool einen Fehler zurück.

## Umgebungsvariablen

| Variable | Zweck | Obligatorisch | Standard |
|---|---|---|---|
| `FRESHDESK_DOMAIN` | Freshdesk-Host („*.freshdesk.com“) | Ja (Standard-Fallback) | - |
| `FRESHDESK_API_KEY` | Freshdesk-API-Schlüssel | Ja (Standard-Fallback) | - |
| `FRESHDESK_TICKETS_READ_ONLY` | Wenn „wahr“, Sticky-Block-Ticket-Mutationen | Nein | „falsch“ |
| `MCP_TRANSPORT` | „stdio“ (Standard) oder „http“ | Nein | `stdio` |
| `MCP_HTTP_HOST` | Hosts in HTTP binden | Nein | `0.0.0.0` |
| „HAFEN“ | HTTP-Port (Railway fügt ihn ein) | Nein | → „FASTMCP_PORT“ → „8000“ |
| `FASTMCP_PORT` | Fallback-HTTP-Port | Nein | „8000“ |
| `FASTMCP_STATELESS_HTTP` | Zustandslose JSON-Antwort (empfohlen in HTTP) | Nein | „false“ (beim HTTP-Start auf „true“ gesetzt) ​​|

Datei [`.env.example`](https://github.com/devchristian1337/freshdesk-mcp/blob/main/.env.example) Referenz:
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
## Vorrang der Anmeldeinformationen

Anmeldeinformationen werden **pro Anfrage** mit dieser Priorität aufgelöst:

1. **HTTP-Header** (empfohlen) – landen nicht in Zugriffsprotokollen:
   - „X-Freshdesk-Domain“.
   - „X-Freshdesk-Api-Key“.
   - „X-Freshdesk-Tickets-Read-Only“.
2. **Abfragezeichenfolge** (abwärtskompatibel):
   - „freshdesk_domain“, „freshdesk_api_key“, „freshdesk_tickets_read_only“.
3. **Umgebungsvariablen** (typischer Fallback für stdio):
   - „FRESHDESK_DOMAIN“, „FRESHDESK_API_KEY“, „FRESHDESK_TICKETS_READ_ONLY“.

:::warnung[API-Schlüsselsicherheit]
Der in der **Abfragezeichenfolge** übergebene API-Schlüssel landet möglicherweise in Proxy-/Railway-Zugriffsprotokollen und im Browserverlauf. Bevorzugen Sie immer „X-Freshdesk-*“ **Header**; lokal (stdio) verwendet Umgebungsvariablen.
:::

## Lokaler MCP-Client (stdio)

Für Clients, die den Server lokal starten, fügen Sie diesen Eintrag zur Client-Konfigurationsdatei hinzu.
In den Beispielen wird davon ausgegangen, dass der Befehl „freshdesk-mcp“ von GitHub installiert wurde, wie auf der Seite [Installation](./installation.md) angegeben.

### Claude Desktop

Datei „claude_desktop_config.json“:
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

Datei „.cursor/mcp.json“ im Projektstammverzeichnis (oder in den globalen Einstellungen):
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
Das Format ist für jeden MCP-Client, der stdio unterstützt, dasselbe: Ersetzen Sie „your_api_key“ durch Ihren API-Schlüssel und „yourcompany.freshdesk.com“ durch Ihre Domain.

## Remote-MCP-Client (HTTP)

Für Clients, die eine Verbindung zu einer Remote-URL herstellen (z. B. Claude.ai oder ein beliebiger Streamable-HTTP-Client), stellen Sie den Server bereit und stellen Sie eine Verbindung zum Endpunkt „/mcp“ her.

### Anmeldeinformationen über Abfragezeichenfolge
```text
https://<tuo-host>/mcp?freshdesk_domain=tuazienda.freshdesk.com&freshdesk_api_key=la_tua_api_key
```
### Anmeldeinformationen über Header (bevorzugt)

Wenn der Client das Festlegen benutzerdefinierter Header zulässt:
```text
X-Freshdesk-Domain: tuazienda.freshdesk.com
X-Freshdesk-Api-Key: la_tua_api_key
X-Freshdesk-Tickets-Read-Only: false
```
## Schreibgeschützter Modus

Wenn „FRESHDESK_TICKETS_READ_ONLY=true“ in der Serverumgebung festgelegt ist, ist der Modus **sticky**: Header und Abfragezeichenfolgen können ihn nicht deaktivieren. Wenn die Variable „false“ ist oder nicht vorhanden ist, können „X-Freshdesk-Tickets-Read-Only“ und „freshdesk_tickets_read_only“ sie auf Anfragebasis aktivieren.

Wenn der Modus aktiviert ist, geben die folgenden Tools einen expliziten Fehler zurück, ohne Freshdesk zu berühren: „freshdesk_create_ticket“, „freshdesk_update_ticket“, „freshdesk_delete_ticket“, „freshdesk_create_ticket_reply“, „freshdesk_create_ticket_note“, „freshdesk_update_ticket_conversation“, „freshdesk_update_ticket_summary“ und `freshdesk_delete_ticket_summary`.
```json
{
  "error": "Operazione bloccata: modalità ticket read-only attiva (freshdesk_tickets_read_only / FRESHDESK_TICKETS_READ_ONLY). Disattivala per poter creare/modificare/eliminare ticket."
}
```
**Lesevorgänge** an Tickets und alle Vorgänge an anderen Objekten, einschließlich Schreibvorgängen an Kontakte, Unternehmen, Agenten, Gruppen, Felder, vorgefertigte Antworten und Wissensdatenbanken, bleiben weiterhin zulässig.
