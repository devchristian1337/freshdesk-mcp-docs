---
id: installazione
title: Installazione server MCP
description: Installa Freshdesk MCP da GitHub con uv o pip, avvia il server in stdio o HTTP e prepara deploy Docker o Railway con health check.
---
# Installation

## Anforderungen

- **Python 3.10+**
- Ein **Freshdesk-API-Schlüssel** (in Freshdesk: **Profileinstellungen → API-Schlüssel**)
- [`uv`](https://docs.astral.sh/uv/) empfohlen für die Installation von GitHub („pip install uv“ oder „brew install uv“)

Wichtige Laufzeitabhängigkeiten (wird bei der Installation automatisch behandelt):

- `mcp[cli] >= 1.3.0` (FastMCP)
- `httpx == 0.28.1`
- `pydantic >= 2.10.6`

## Installation

### Von GitHub mit UV (empfohlen)

Installieren Sie den Konsolenbefehl direkt aus dem GitHub-Repository:
```bash
uv tool install git+https://github.com/devchristian1337/freshdesk-mcp.git
freshdesk-mcp
```
:::warning[PyPI-Paket mit demselben Namen]
Das auf PyPI veröffentlichte Paket „freshdesk-mcp“ gehört nicht zu diesem Projekt. Verwenden Sie nicht „uvx freshdesk-mcp“ oder „pip install freshdesk-mcp“, um diese Version zu installieren.
:::

### Von GitHub mit pip
```bash
pip install git+https://github.com/devchristian1337/freshdesk-mcp.git
freshdesk-mcp
```
### Aus der Quelle (Entwicklung)
```bash
git clone https://github.com/devchristian1337/freshdesk-mcp.git
cd freshdesk-mcp
pip install -e .
freshdesk-mcp
```
Zum Testen:
```bash
pip install -e ".[dev]"
pytest -q
```
## Starten des Servers

Der Server wird als „freshdesk-mcp“-Konsolenbefehl installiert (Einstiegspunkt „freshdesk_mcp.server:main“). Der **Transport** wird mit der Umgebungsvariablen „MCP_TRANSPORT“ ausgewählt.

### Transport stdio (Standard, lokal)

Dies ist der Modus, der von Clients verwendet wird, die den Server lokal starten (Claude Desktop, Cursor, Windsurf usw.). Anmeldeinformationen werden über Umgebungsvariablen übergeben:
```bash
FRESHDESK_DOMAIN=tuazienda.freshdesk.com \
FRESHDESK_API_KEY=la_tua_api_key \
freshdesk-mcp
```
Normalerweise starten Sie es nicht manuell, sondern vom MCP-Client. Siehe die Seite [Konfiguration](./configurazione.md).

### Transport HTTP (Remote-Server)

Legen Sie „MCP_TRANSPORT=http“ fest, um einen Streamable-HTTP-Endpunkt verfügbar zu machen:
```bash
MCP_TRANSPORT=http freshdesk-mcp
```
Details zum HTTP-Modus:

- MCP-Endpunkt: **`/mcp`**
- Gesundheitsprüfung: **`GET /health`** → `{"status": "healthy", "service": "freshdesk-mcp"}`
- Standardbindung: Host „0.0.0.0“ (Variable „MCP_HTTP_HOST“), Port von „PORT“ → „FASTMCP_PORT“ → „8000“.
- „FASTMCP_STATELESS_HTTP=true“ für die Skalierung empfohlen
```bash
MCP_TRANSPORT=http \
FASTMCP_STATELESS_HTTP=true \
PORT=8000 \
freshdesk-mcp
```
## Nach der Installation prüfen

Die Überprüfung hängt vom gewählten Transportmittel ab. Im „stdio“-Modus ist das zuverlässigste Signal der MCP-Client: Starten Sie nach dem Speichern der Konfiguration den Client neu und prüfen Sie, ob die „freshdesk_*“-Namen in der Tool-Liste angezeigt werden. Wenn der Client Startfehler anzeigt, überprüfen Sie zunächst den Python-Pfad, die virtuelle Umgebung sowie die Variablen „FRESHDESK_DOMAIN“ und „FRESHDESK_API_KEY“.

Im HTTP-Modus ist die minimale Kontrolle der Endpunkt „/health“, der JSON mit dem Status „gesund“ zurückgeben muss. Konfigurieren Sie dann den Remote-Client auf dem Endpunkt „/mcp“ und rufen Sie ein schreibgeschütztes Tool auf, beispielsweise die Ticket- oder Gruppenliste. Dies vermeidet destruktive Tests während der ersten Bereitstellung und bestätigt Netzwerk, Authentifizierung, Routing und Freshdesk-Berechtigungen gemeinsam.

## Mit Docker bereitstellen

Das Repository enthält eine „Docker-Datei“ (Basis „python:3.11-slim“), die für den HTTP-Modus vorkonfiguriert ist:
```dockerfile
ENV MCP_TRANSPORT=http \
    FASTMCP_STATELESS_HTTP=true
EXPOSE 8000
CMD ["freshdesk-mcp"]
```
Erstellen und ausführen:
```bash
docker build -t freshdesk-mcp .
docker run -p 8000:8000 \
  -e FRESHDESK_DOMAIN=tuazienda.freshdesk.com \
  -e FRESHDESK_API_KEY=la_tua_api_key \
  freshdesk-mcp
```
### Eisenbahn

1. Stellen Sie das Repository mithilfe der „Dockerfile“ im Stammverzeichnis bereit.
2. Umgebungsvariablen festlegen:
   - `MCP_TRANSPORT=http`
   - `FASTMCP_STATELESS_HTTP=true`
   - **Nicht** „PORT“ einstellen (Railway fügt es automatisch ein)
3. Legen Sie den Gesundheitsprüfungspfad auf „/health“ fest.

:::tip[Anmeldeinformationen in HTTP]
Im HTTP-Modus können Anmeldeinformationen **pro Anfrage** vom Client bereitgestellt werden (Header oder Abfragezeichenfolge), sodass eine einzelne Bereitstellung mehrere Freshdesk-Konten bedienen kann. Siehe die Seite [Konfiguration](./configurazione.md).
:::
