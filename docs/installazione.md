---
id: installazione
title: Installazione
description: Requisiti, installazione e avvio del server Freshdesk MCP (stdio e HTTP).
---

# Installazione

## Requisiti

- **Python 3.10+**
- Una **API key Freshdesk** (in Freshdesk: **Profile Settings → API Key**)
- [`uv`](https://docs.astral.sh/uv/) consigliato per l'avvio (`pip install uv` oppure `brew install uv`)

Dipendenze runtime principali (gestite automaticamente in installazione):

- `mcp[cli] >= 1.3.0` (FastMCP)
- `httpx == 0.28.1`
- `pydantic >= 2.10.6`

## Installazione

### Con uv (consigliato)

`uvx` scarica ed esegue il pacchetto in un ambiente isolato, senza installazione esplicita:

```bash
uvx freshdesk-mcp
```

### Con pip

```bash
pip install freshdesk-mcp
freshdesk-mcp
```

### Da sorgente (sviluppo)

```bash
git clone https://github.com/devchristian1337/freshdesk-mcp.git
cd freshdesk-mcp
pip install -e .
freshdesk-mcp
```

Per i test:

```bash
pip install -e ".[dev]"
pytest -q
```

## Avvio del server

Il server è installato come comando console `freshdesk-mcp` (entry point `freshdesk_mcp.server:main`). Il **transport** si sceglie con la variabile d'ambiente `MCP_TRANSPORT`.

### Transport stdio (default, locale)

È la modalità usata dai client che avviano il server in locale (Claude Desktop, Cursor, Windsurf, ecc.). Le credenziali si passano via variabili d'ambiente:

```bash
FRESHDESK_DOMAIN=tuazienda.freshdesk.com \
FRESHDESK_API_KEY=la_tua_api_key \
uvx freshdesk-mcp
```

In genere non lo avvii a mano: è il client MCP a lanciarlo. Vedi la pagina [Configurazione](./configurazione.md).

### Transport HTTP (server remoto)

Imposta `MCP_TRANSPORT=http` per esporre un endpoint Streamable HTTP:

```bash
MCP_TRANSPORT=http freshdesk-mcp
```

Dettagli della modalità HTTP:

- Endpoint MCP: **`/mcp`**
- Health check: **`GET /health`** → `{"status": "healthy", "service": "freshdesk-mcp"}`
- Bind di default: host `0.0.0.0` (variabile `MCP_HTTP_HOST`), porta da `PORT` → `FASTMCP_PORT` → `8000`
- `FASTMCP_STATELESS_HTTP=true` consigliato per lo scaling

```bash
MCP_TRANSPORT=http \
FASTMCP_STATELESS_HTTP=true \
PORT=8000 \
freshdesk-mcp
```

## Deploy con Docker

Il repository include un `Dockerfile` (base `python:3.11-slim`) preconfigurato per la modalità HTTP:

```dockerfile
ENV MCP_TRANSPORT=http \
    FASTMCP_STATELESS_HTTP=true
EXPOSE 8000
CMD ["freshdesk-mcp"]
```

Build ed esecuzione:

```bash
docker build -t freshdesk-mcp .
docker run -p 8000:8000 \
  -e FRESHDESK_DOMAIN=tuazienda.freshdesk.com \
  -e FRESHDESK_API_KEY=la_tua_api_key \
  freshdesk-mcp
```

### Railway

1. Esegui il deploy del repository usando il `Dockerfile` nella root.
2. Imposta le variabili d'ambiente:
   - `MCP_TRANSPORT=http`
   - `FASTMCP_STATELESS_HTTP=true`
   - **Non** impostare `PORT` (Railway lo inietta automaticamente)
3. Imposta il path dell'health check su `/health`.

:::tip[Credenziali in HTTP]
In modalità HTTP le credenziali possono essere fornite **per-richiesta** dal client (header o query string), quindi un solo deploy può servire più account Freshdesk. Vedi la pagina [Configurazione](./configurazione.md).
:::
