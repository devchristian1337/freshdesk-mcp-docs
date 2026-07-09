---
id: gruppi
title: Tool gruppi Freshdesk
description: Reference dei tool gruppi Freshdesk MCP per listare, leggere, creare e aggiornare team, assegnazioni agenti ed escalation.
sidebar_label: Gruppi
---
# Grupos

4 herramientas para listar, leer, crear y actualizar grupos.

Los grupos de Freshdesk son el lugar donde se reúnen los tickets, los agentes y las reglas de asignación. En un flujo de MCP, se utilizan principalmente para dos tareas: leer la estructura operativa antes de asignar un ticket y mantener actualizados a los equipos cuando cambian los agentes, las colas o las rutas de escalada. La referencia incluye solo operaciones explícitas: ninguna herramienta asigna automáticamente tickets a un grupo sin que el modelo reciba una carga útil clara.

Para las automatizaciones de IA, es mejor comenzar siempre desde `freshdesk_list_groups` o `freshdesk_view_group`, guardar la ID correcta y luego usar ese valor en los tickets de herramientas. Esto reduce los errores debidos a nombres similares, grupos duplicados o equipos desaparecidos.

---

## Freshdesk_list_groups <span className="fd-tag">leer</span>

Lista grupos con paginación.

**Alias:** `lista_grupos`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `página` | entero | No | `1` |
| `por_página` | entero (1–100) | No | `30` |

**Respuesta**
```json
{
  "groups": [
    { "id": 12, "name": "Supporto CCE", "agent_ids": [123, 130] }
  ],
  "pagination": { "current_page": 1, "next_page": null, "prev_page": null, "per_page": 30 }
}
```
---

## Freshdesk_view_group <span className="fd-tag">leer</span>

Recupera el detalle de un grupo por ID.

**Alias:** `view_group`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `id_grupo` | entero | Sí | - |

**Respuesta**
```json
{ "id": 12, "name": "Supporto CCE", "description": "Primo livello", "agent_ids": [123, 130] }
```
---

## Freshdesk_create_group <span className="fd-tag fd-tag--write">escribir</span>

Crea un grupo.

**Alias:** `crear_grupo`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `grupo` | objeto(GrupoCrear) | Sí | - |

**Campos de `grupo`:**

| Campo | Tipo | Requerido | Predeterminado | Notas |
|---|---|---|---|---|
| `nombre` | cadena | Sí | - | Nombre del grupo |
| `descripción` | cadena | No | `nulo` | Descripción |
| `id_agente` | matriz de números enteros | No | `nulo` | ID de usuario de agentes |
| `auto_ticket_assign` | entero (0/1) | No | `0` | Asignación automática de billetes |
| `escalar_a` | entero | No | `nulo` | Usuario al que enviar la escalada |
| `unassigned_for` | cadena | No | `30m` | `30m`, `1h`, `2h`, `4h`, `8h`, `12h`, `1d`, `2d`, `3d` |

**Llamar**
```json
{
  "group": {
    "name": "Supporto CCE",
    "description": "Primo livello",
    "agent_ids": [123, 130],
    "auto_ticket_assign": 1
  }
}
```
**Respuesta**
```json
{ "id": 14, "name": "Supporto CCE", "auto_ticket_assign": 1, "agent_ids": [123, 130] }
```
---

## Freshdesk_update_group <span className="fd-tag fd-tag--write">actualizar</span>

Actualizar un grupo. Utilice el mismo esquema que la creación (`nombre` sigue siendo obligatorio en el esquema).

**Alias:** `update_group`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `id_grupo` | entero | Sí | - |
| `grupo` | objeto(GrupoCrear) | Sí | - |

**Llamar**
```json
{ "group_id": 14, "group": { "name": "Supporto CCE", "agent_ids": [123, 130, 131] } }
```
**Respuesta**
```json
{ "id": 14, "name": "Supporto CCE", "agent_ids": [123, 130, 131] }
```

