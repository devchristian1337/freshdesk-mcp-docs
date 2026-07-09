---
id: installazione
title: Installazione server MCP
description: Installa Freshdesk MCP da GitHub con uv o pip, avvia il server in stdio o HTTP e prepara deploy Docker o Railway con health check.
---
#Installation

## Exigences

- **Python 3.10+**
- Une **clé API Freshdesk** (dans Freshdesk : **Paramètres du profil → Clé API**)
- [`uv`](https://docs.astral.sh/uv/) recommandé pour l'installation depuis GitHub (`pip install uv` ou `brew install uv`)

Dépendances clés d'exécution (gérées automatiquement lors de l'installation) :

- `mcp[cli] >= 1.3.0` (FastMCP)
- `httpx == 0.28.1`
- `pydantique >= 2.10.6`

##Installation

### Depuis GitHub avec uv (recommandé)

Installez la commande console directement depuis le dépôt GitHub :
```bash
uv tool install git+https://github.com/devchristian1337/freshdesk-mcp.git
freshdesk-mcp
```
:::warning[Package PyPI du même nom]
Le package `freshdesk-mcp` publié sur PyPI n'appartient pas à ce projet. N'utilisez pas `uvx freshdesk-mcp` ou `pip install freshdesk-mcp` pour installer cette version.
:::

### Depuis GitHub avec pip
```bash
pip install git+https://github.com/devchristian1337/freshdesk-mcp.git
freshdesk-mcp
```
### Depuis la source (développement)
```bash
git clone https://github.com/devchristian1337/freshdesk-mcp.git
cd freshdesk-mcp
pip install -e .
freshdesk-mcp
```
Pour tester :
```bash
pip install -e ".[dev]"
pytest -q
```
## Démarrage du serveur

Le serveur est installé en tant que commande de console `freshdesk-mcp` (point d'entrée `freshdesk_mcp.server:main`). Le **transport** est choisi avec la variable d'environnement `MCP_TRANSPORT`.

### Station de transport (par défaut, local)

C'est le mode utilisé par les clients qui démarrent le serveur localement (Claude Desktop, Cursor, Windsurf, etc.). Les informations d'identification sont transmises via des variables d'environnement :
```bash
FRESHDESK_DOMAIN=tuazienda.freshdesk.com \
FRESHDESK_API_KEY=la_tua_api_key \
freshdesk-mcp
```
En règle générale, vous ne le lancez pas manuellement : le client MCP le lance. Voir la page [Configuration](./configurazione.md).

### Transport HTTP (serveur distant)

Définissez `MCP_TRANSPORT=http` pour exposer un point de terminaison HTTP Streamable :
```bash
MCP_TRANSPORT=http freshdesk-mcp
```
Détails du mode HTTP :

- Point de terminaison MCP : **`/mcp`**
- Bilan de santé : **`GET /health`** → `{"status": "healthy", "service": "freshdesk-mcp"}`
- Liaison par défaut : hôte `0.0.0.0` (variable `MCP_HTTP_HOST`), port de `PORT` → `FASTMCP_PORT` → `8000`
- `FASTMCP_STATELESS_HTTP=true` recommandé pour la mise à l'échelle
```bash
MCP_TRANSPORT=http \
FASTMCP_STATELESS_HTTP=true \
PORT=8000 \
freshdesk-mcp
```
## Vérifiez après l'installation

La vérification dépend du transport choisi. En mode `stdio`, le signal le plus fiable est le client MCP : après avoir enregistré la configuration, redémarrez le client et vérifiez que les noms `freshdesk_*` apparaissent dans la liste des outils. Si le client affiche des erreurs de démarrage, vérifiez d'abord le chemin Python, l'environnement virtuel et les variables `FRESHDESK_DOMAIN` et `FRESHDESK_API_KEY`.

En mode HTTP, le contrôle minimal est le point de terminaison « /health », qui doit renvoyer JSON avec un statut « sain ». Configurez ensuite le client distant sur le point de terminaison `/mcp` et appelez un outil en lecture seule, par exemple le ticket ou la liste de groupes. Cela évite les tests destructifs lors du premier déploiement et confirme ensemble les autorisations réseau, authentification, routage et Freshdesk.

## Déployer avec Docker

Le référentiel comprend un `Dockerfile` (base `python:3.11-slim`) préconfiguré pour le mode HTTP :
```dockerfile
ENV MCP_TRANSPORT=http \
    FASTMCP_STATELESS_HTTP=true
EXPOSE 8000
CMD ["freshdesk-mcp"]
```
Construisez et exécutez :
```bash
docker build -t freshdesk-mcp .
docker run -p 8000:8000 \
  -e FRESHDESK_DOMAIN=tuazienda.freshdesk.com \
  -e FRESHDESK_API_KEY=la_tua_api_key \
  freshdesk-mcp
```
### Chemin de fer

1. Déployez le référentiel en utilisant le « Dockerfile » à la racine.
2. Définissez les variables d'environnement :
   - `MCP_TRANSPORT=http`
   - `FASTMCP_STATELESS_HTTP=true`
   - **Ne pas** définir `PORT` (le chemin de fer l'injecte automatiquement)
3. Définissez le chemin de la vérification de l'état sur « /health ».

:::tip[Identifiants en HTTP]
En mode HTTP, les informations d'identification peuvent être fournies **par requête** par le client (en-tête ou chaîne de requête), de sorte qu'un seul déploiement peut servir plusieurs comptes Freshdesk. Voir la page [Configuration](./configurazione.md).
:::
