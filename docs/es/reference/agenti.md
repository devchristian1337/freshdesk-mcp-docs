---
id: agenti
title: Tool agenti Freshdesk
description: Reference dei tool agenti Freshdesk MCP per listare, cercare, leggere, creare e aggiornare agenti e profili operativi del supporto.
sidebar_label: Agenti
---
# Agentes

5 herramientas para listar, leer, buscar, crear y actualizar agentes.

:::info[Valores de referencia]
**ticket_scope**: `1` acceso global · `2` acceso grupal · `3` acceso restringido.
:::

---

## Freshdesk_list_agents <span className="fd-tag">leer</span>

Enumera agentes con paginación.

**Alias:** `get_agents`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `página` | entero | No | `1` |
| `por_página` | entero (1–100) | No | `30` |

**Respuesta** - cada agente tiene `id`, `contacto` (nombre/correo electrónico), `disponible`, `ocasional`, `ticket_scope`, `group_ids`:
```json
{
  "agents": [
    {
      "id": 123,
      "available": true,
      "occasional": false,
      "ticket_scope": 1,
      "group_ids": [12],
      "contact": { "name": "Luca Verdi", "email": "luca.verdi@azienda.it" }
    }
  ],
  "pagination": { "current_page": 1, "next_page": null, "prev_page": null, "per_page": 30 }
}
```
---

## Freshdesk_view_agent <span className="fd-tag">leer</span>

Recuperar el detalle de un agente por ID.

**Alias:** `view_agent`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `id_agente` | entero | Sí | - |

**Respuesta**
```json
{
  "id": 123,
  "ticket_scope": 1,
  "group_ids": [12],
  "contact": { "name": "Luca Verdi", "email": "luca.verdi@azienda.it" }
}
```
---

## Freshdesk_search_agents <span className="fd-tag">leer</span>

Busque agentes por nombre o correo electrónico (autocompletar).

**Alias:** `agentes_de_búsqueda`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `consulta` | cadena | Sí | - |

**Llamar**
```json
{ "query": "verdi" }
```
**Respuesta**
```json
[
  { "id": 123, "contact": { "name": "Luca Verdi", "email": "luca.verdi@azienda.it" } }
]
```
---

## Freshdesk_create_agent <span className="fd-tag fd-tag--write">escribir</span>

Crea un agente.

**Alias:** `create_agent`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `campos_agente` | objeto | Sí | - |

`agent_fields` debe contener al menos `email` y `ticket_scope` (1/2/3). Campos comunes: `nombre`, `ocasional` (bool), `group_ids` (lista), `role_ids` (lista), `firma` (HTML).

**Llamar**
```json
{
  "agent_fields": {
    "email": "nuovo.agente@azienda.it",
    "ticket_scope": 2,
    "group_ids": [12],
    "occasional": false
  }
}
```
**Respuesta**
```json
{ "id": 130, "ticket_scope": 2, "group_ids": [12], "contact": { "email": "nuovo.agente@azienda.it" } }
```
Si faltan campos obligatorios:
```json
{ "error": "Campi obbligatori mancanti: servono sia 'email' sia 'ticket_scope'." }
```
---

## Freshdesk_update_agent <span className="fd-tag fd-tag--write">actualizar</span>

Actualizar un agente.

**Alias:** `update_agent`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `id_agente` | entero | Sí | - |
| `campos_agente` | objeto | Sí | - |

Claves comunes de `agent_fields`: `occasional`, `ticket_scope`, `group_ids`, `role_ids`, `signature`.

**Llamar**
```json
{ "agent_id": 130, "agent_fields": { "group_ids": [12, 15] } }
```
**Respuesta**
```json
{ "id": 130, "group_ids": [12, 15] }
```

