---
id: installazione
title: Installazione server MCP
description: Installa Freshdesk MCP da GitHub con uv o pip, avvia il server in stdio o HTTP e prepara deploy Docker o Railway con health check.
---
# Installation

## Requirements

- **Python 3.10+**
- A **Freshdesk API key** (in Freshdesk: **Profile Settings → API Key**)
- [`uv`](https://docs.astral.sh/uv/) recommended for installation from GitHub (`pip install uv` or `brew install uv`)

Key runtime dependencies (automatically handled in installation):

- `mcp[cli] >= 1.3.0` (FastMCP)
- `httpx == 0.28.1`
- `pydantic >= 2.10.6`

## Installation

### From GitHub with uv (recommended)

Install the console command directly from the GitHub repository:
```bash
uv tool install git+https://github.com/devchristian1337/freshdesk-mcp.git
freshdesk-mcp
```
:::warning[PyPI package of the same name]
The `freshdesk-mcp` package published on PyPI does not belong to this project. Do not use `uvx freshdesk-mcp` or `pip install freshdesk-mcp` to install this version.
:::

### From GitHub with pip
```bash
pip install git+https://github.com/devchristian1337/freshdesk-mcp.git
freshdesk-mcp
```
### From source (development)
```bash
git clone https://github.com/devchristian1337/freshdesk-mcp.git
cd freshdesk-mcp
pip install -e .
freshdesk-mcp
```
For testing:
```bash
pip install -e ".[dev]"
pytest -q
```
## Starting the server

The server is installed as a `freshdesk-mcp` console command (entry point `freshdesk_mcp.server:main`). The **transport** is chosen with the `MCP_TRANSPORT` environment variable.

### Transport stdio (default, local)

It is the mode used by clients that start the server locally (Claude Desktop, Cursor, Windsurf, etc.). Credentials are passed via environment variables:
```bash
FRESHDESK_DOMAIN=tuazienda.freshdesk.com \
FRESHDESK_API_KEY=la_tua_api_key \
freshdesk-mcp
```
Typically you don't launch it by hand - the MCP client launches it. See the [Configuration](./configurazione.md) page.

### Transport HTTP (remote server)

Set `MCP_TRANSPORT=http` to expose a Streamable HTTP endpoint:
```bash
MCP_TRANSPORT=http freshdesk-mcp
```
HTTP mode details:

- MCP endpoint: **`/mcp`**
- Health check: **`GET /health`** → `{"status": "healthy", "service": "freshdesk-mcp"}`
- Default bind: host `0.0.0.0` (variable `MCP_HTTP_HOST`), port from `PORT` → `FASTMCP_PORT` → `8000`
- `FASTMCP_STATELESS_HTTP=true` recommended for scaling
```bash
MCP_TRANSPORT=http \
FASTMCP_STATELESS_HTTP=true \
PORT=8000 \
freshdesk-mcp
```
## Check after installation

The verification depends on the transport chosen. In `stdio` mode, the most reliable signal is the MCP client: after saving the configuration, restart the client and check that the `freshdesk_*` names appear in the tool list. If the client shows startup errors, first check the Python path, virtual environment, and `FRESHDESK_DOMAIN` and `FRESHDESK_API_KEY` variables.

In HTTP mode, the minimal control is the `/health` endpoint, which must return JSON with a `healthy` status. Then configure the remote client on the `/mcp` endpoint and invoke a read-only tool, for example the ticket or group list. This avoids destructive testing during the first deployment and confirms network, authentication, routing and Freshdesk permissions together.

## Deploy with Docker

The repository includes a `Dockerfile` (base `python:3.11-slim`) preconfigured for HTTP mode:
```dockerfile
ENV MCP_TRANSPORT=http \
    FASTMCP_STATELESS_HTTP=true
EXPOSE 8000
CMD ["freshdesk-mcp"]
```
Build and run:
```bash
docker build -t freshdesk-mcp .
docker run -p 8000:8000 \
  -e FRESHDESK_DOMAIN=tuazienda.freshdesk.com \
  -e FRESHDESK_API_KEY=la_tua_api_key \
  freshdesk-mcp
```
### Railway

1. Deploy the repository using the `Dockerfile` in the root.
2. Set environment variables:
   - `MCP_TRANSPORT=http`
   - `FASTMCP_STATELESS_HTTP=true`
   - **Do not** set `PORT` (Railway automatically injects it)
3. Set the health check path to `/health`.

:::tip[Credentials in HTTP]
In HTTP mode, credentials can be provided **per-request** by the client (header or query string), so a single deployment can serve multiple Freshdesk accounts. See the [Configuration](./configurazione.md) page.
:::
