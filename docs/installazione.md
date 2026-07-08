---
id: installazione
title: Installazione server MCP
description: Installa Freshdesk MCP da GitHub con uv o pip, avvia il server in stdio o HTTP e prepara deploy Docker o Railway con health check.
---

# Installazione

## Requisiti

- **Python 3.10+**
- Una **API key Freshdesk** (in Freshdesk: **Profile Settings → API Key**)
- [`uv`](https://docs.astral.sh/uv/) consigliato per l'installazione da GitHub (`pip install uv` oppure `brew install uv`)

Dipendenze runtime principali (gestite automaticamente in installazione):

- `mcp[cli] >= 1.3.0` (FastMCP)
- `httpx == 0.28.1`
- `pydantic >= 2.10.6`

## Installazione

### Da GitHub con uv (consigliato)

Installa il comando console direttamente dal repository GitHub:

```bash
uv tool install git+https://github.com/devchristian1337/freshdesk-mcp.git
freshdesk-mcp
```

:::warning[Pacchetto PyPI omonimo]
Il pacchetto `freshdesk-mcp` pubblicato su PyPI non appartiene a questo progetto. Non usare `uvx freshdesk-mcp` o `pip install freshdesk-mcp` per installare questa versione.
:::

### Da GitHub con pip

```bash
pip install git+https://github.com/devchristian1337/freshdesk-mcp.git
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
freshdesk-mcp
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

## Verifica dopo l'installazione

La verifica dipende dal transport scelto. In modalità `stdio`, il segnale più affidabile è il client MCP: dopo aver salvato la configurazione, riavvia il client e controlla che nell'elenco tool compaiano i nomi `freshdesk_*`. Se il client mostra errori di avvio, verifica prima percorso Python, ambiente virtuale e variabili `FRESHDESK_DOMAIN` e `FRESHDESK_API_KEY`.

In modalità HTTP, il controllo minimo è l'endpoint `/health`, che deve restituire un JSON con stato `healthy`. Poi configura il client remoto sull'endpoint `/mcp` e invoca un tool di sola lettura, per esempio la lista dei ticket o dei gruppi. Questo evita test distruttivi durante il primo deploy e conferma insieme rete, autenticazione, routing e permessi Freshdesk.

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
