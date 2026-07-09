---
id: installazione
title: Installazione server MCP
description: Installa Freshdesk MCP da GitHub con uv o pip, avvia il server in stdio o HTTP e prepara deploy Docker o Railway con health check.
---
# Instalación

## Requisitos

- **Python 3.10+**
- Una **Clave API de Freshdesk** (en Freshdesk: **Configuración de perfil → Clave API**)
- [`uv`](https://docs.astral.sh/uv/) recomendado para instalación desde GitHub (`pip install uv` o `brew install uv`)

Dependencias clave del tiempo de ejecución (manejadas automáticamente en la instalación):

- `mcp[cli] >= 1.3.0` (FastMCP)
-`httpx == 0.28.1`
- `pydantic >= 2.10.6`

## Instalación

### Desde GitHub con uv (recomendado)

Instale el comando de la consola directamente desde el repositorio de GitHub:
```bash
uv tool install git+https://github.com/devchristian1337/freshdesk-mcp.git
freshdesk-mcp
```
:::advertencia[paquete PyPI del mismo nombre]
El paquete `freshdesk-mcp` publicado en PyPI no pertenece a este proyecto. No utilice `uvx Freshdesk-mcp` o `pip install Freshdesk-mcp` para instalar esta versión.
:::

### Desde GitHub con pip
```bash
pip install git+https://github.com/devchristian1337/freshdesk-mcp.git
freshdesk-mcp
```
### De la fuente (desarrollo)
```bash
git clone https://github.com/devchristian1337/freshdesk-mcp.git
cd freshdesk-mcp
pip install -e .
freshdesk-mcp
```
Para pruebas:
```bash
pip install -e ".[dev]"
pytest -q
```
## Iniciando el servidor

El servidor se instala como un comando de consola `freshdesk-mcp` (punto de entrada `freshdesk_mcp.server:main`). El **transporte** se elige con la variable de entorno `MCP_TRANSPORT`.

### Transporte stdio (predeterminado, local)

Es el modo utilizado por los clientes que inician el servidor localmente (Claude Desktop, Cursor, Windsurf, etc.). Las credenciales se pasan a través de variables de entorno:
```bash
FRESHDESK_DOMAIN=tuazienda.freshdesk.com \
FRESHDESK_API_KEY=la_tua_api_key \
freshdesk-mcp
```
Normalmente no lo inicia manualmente: lo inicia el cliente MCP. Consulte la página [Configuración](./configurazione.md).

### Transporte HTTP (servidor remoto)

Configure `MCP_TRANSPORT=http` para exponer un punto final HTTP que se puede transmitir:
```bash
MCP_TRANSPORT=http freshdesk-mcp
```
Detalles del modo HTTP:

- Punto final MCP: **`/mcp`**
- Comprobación de estado: **`GET /health`** → `{"status": "healthy", "service": "freshdesk-mcp"}`
- Enlace predeterminado: host `0.0.0.0` (variable `MCP_HTTP_HOST`), puerto desde `PORT` → `FASTMCP_PORT` → `8000`
- `FASTMCP_STATELESS_HTTP=true` recomendado para escalar
```bash
MCP_TRANSPORT=http \
FASTMCP_STATELESS_HTTP=true \
PORT=8000 \
freshdesk-mcp
```
## Verificar después de la instalación

La verificación depende del transporte elegido. En el modo `stdio`, la señal más confiable es el cliente MCP: después de guardar la configuración, reinicie el cliente y verifique que los nombres `freshdesk_*` aparezcan en la lista de herramientas. Si el cliente muestra errores de inicio, primero verifique la ruta de Python, el entorno virtual y las variables `FRESHDESK_DOMAIN` y `FRESHDESK_API_KEY`.

En el modo HTTP, el control mínimo es el punto final `/health`, que debe devolver JSON con un estado `healthy`. Luego configure el cliente remoto en el punto final `/mcp` e invoque una herramienta de solo lectura, por ejemplo el ticket o la lista de grupos. Esto evita pruebas destructivas durante la primera implementación y confirma la red, la autenticación, el enrutamiento y los permisos de Freshdesk en conjunto.

## Implementar con Docker

El repositorio incluye un `Dockerfile` (base `python:3.11-slim`) preconfigurado para el modo HTTP:
```dockerfile
ENV MCP_TRANSPORT=http \
    FASTMCP_STATELESS_HTTP=true
EXPOSE 8000
CMD ["freshdesk-mcp"]
```
Construir y ejecutar:
```bash
docker build -t freshdesk-mcp .
docker run -p 8000:8000 \
  -e FRESHDESK_DOMAIN=tuazienda.freshdesk.com \
  -e FRESHDESK_API_KEY=la_tua_api_key \
  freshdesk-mcp
```
### Ferrocarril

1. Implemente el repositorio utilizando `Dockerfile` en la raíz.
2. Establecer variables de entorno:
   -`MCP_TRANSPORT=http`
   - `FASTMCP_STATELESS_HTTP=verdadero`
   - **No** configurar `PORT` (el ferrocarril lo inyecta automáticamente)
3. Establezca la ruta de verificación de estado en `/health`.

:::consejo[Credenciales en HTTP]
En el modo HTTP, el cliente puede proporcionar las credenciales **por solicitud** (encabezado o cadena de consulta), por lo que una sola implementación puede servir a varias cuentas de Freshdesk. Consulte la página [Configuración](./configurazione.md).
:::
