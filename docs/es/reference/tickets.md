---
id: tickets
title: Tool ticket Freshdesk
description: Reference dei tool ticket Freshdesk MCP per lista, ricerca, dettaglio, creazione, aggiornamento, delete, riepiloghi e ticket field.
sidebar_label: Ticket
---
# Entradas

12 herramientas para enumerar, buscar, leer, crear, actualizar y eliminar tickets, así como resúmenes y propiedades de campos de tickets.

:::info[Valores de referencia]
Varias herramientas utilizan los valores internos de Freshdesk:

- **fuente**: `1` correo electrónico · `2` portal · `3` teléfono · `7` chat · `9` widget de comentarios · `10` correo electrónico saliente
- **prioridad**: `1` baja · `2` media · `3` alta · `4` urgente
- **estado**: `2` abierto · `3` pendiente · `4` resuelto · `5` cerrado
:::

---

## Freshdesk_get_ticket_fields <span className="fd-tag">leer</span>

Enumera los campos de ticket configurados (estándar y personalizados) con sus valores permitidos. Útil antes de crear/actualizar tickets con campos personalizados.

**Alias:** `get_ticket_fields`

Sin parámetros.

**Respuesta** - lista de campos con `nombre` (clave interna), `etiqueta`, `tipo` y, para menús desplegables, `opciones`:
```json
[
  { "id": 1, "name": "status", "label": "Status", "type": "default_status" },
  { "id": 7, "name": "cf_causa", "label": "Causa", "type": "custom_dropdown",
    "choices": ["Bug", "Configurazione", "Formazione"] }
]
```
---

## Freshdesk_get_tickets <span className="fd-tag">leer</span>

Lista de tickets con paginación simple. Para filtrar utilice `freshdesk_list_tickets`; para consultas de texto utilice `freshdesk_search_tickets`.

**Alias:** `get_tickets`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `página` | entero | No | `1` |
| `por_página` | entero (1–100) | No | `30` |
| `incluir_completo` | booleano | No | `falso` |

De forma predeterminada, cada ticket contiene solo los campos esenciales para la lista y cualquier `custom_fields` completado. Configure `include_full=true` para recibir la carga útil completa de cada ticket.

**Llamar**
```json
{ "page": 1, "per_page": 30 }
```
**Respuesta**
```json
{
  "tickets": [
    { "id": 101, "subject": "Errore in fase di login", "status": 2, "priority": 3 }
  ],
  "pagination": { "current_page": 1, "next_page": 2, "prev_page": null, "per_page": 30 }
}
```
---

## Freshdesk_list_tickets <span className="fd-tag">leer</span>

Enumere los tickets aplicando los filtros nativos del punto final `GET /tickets`.

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `nombre_filtro` | cadena | No | `nulo` |
| `id_solicitante` | entero | No | `nulo` |
| `ID_empresa` | entero | No | `nulo` |
| `actualizado_desde` | cadena (ISO 8601) | No | `nulo` |
| `ordenar_por` | cadena | No | `nulo` |
| `tipo_pedido` | cadena | No | `nulo` |
| `página` | entero | No | `1` |
| `por_página` | entero (1–100) | No | `30` |
| `incluir_completo` | booleano | No | `falso` |

- `nombre_filtro`: `nuevo_y_mi_abierto`, `viendo`, `spam`, `eliminado`.
- `order_by`: `creado_en`, `debido_por`, `actualizado_en`, `estado`.
- `tipo_pedido`: `asc`, `desc`.
- `include_full`: devuelve la carga útil completa de cada ticket; De forma predeterminada, el servidor proyecta los campos esenciales para la lista.

**Llamar**
```json
{
  "filter_name": "new_and_my_open",
  "updated_since": "2026-01-01T00:00:00Z",
  "order_by": "updated_at",
  "order_type": "desc"
}
```
**Respuesta**
```json
{
  "tickets": [
    { "id": 240, "subject": "Richiesta nuova utenza", "status": 3, "updated_at": "2026-06-10T09:12:00Z" }
  ],
  "pagination": { "current_page": 1, "next_page": null, "prev_page": null, "per_page": 30 }
}
```
---

## Freshdesk_get_ticket <span className="fd-tag">leer</span>

Recupere un único ticket, con la capacidad de incorporar datos relacionados.

**Alias:** `get_ticket`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `ticket_id` | entero | Sí | - |
| `incluir` | cadena | No | `nulo` |

`include` acepta valores separados por comas: `conversaciones`, `solicitante`, `empresa`, `estadísticas`.

**Llamar**
```json
{ "ticket_id": 12345, "include": "conversations,requester" }
```
**Respuesta**: el objeto del ticket (con las secciones requeridas en "incluir"):
```json
{
  "id": 12345,
  "subject": "Errore in fase di login",
  "status": 2,
  "priority": 3,
  "requester_id": 6001,
  "group_id": 12,
  "tags": ["login", "urgente"],
  "created_at": "2026-06-09T08:30:00Z",
  "updated_at": "2026-06-10T11:05:00Z"
}
```
---

## Freshdesk_search_tickets <span className="fd-tag">leer</span>

Busque tickets a través de filtros estructurados en el punto final `/search/tickets`. El servidor crea Freshdesk DSL, combina filtros con "AND" y maneja las citas y el formato de fechas. No hay búsqueda de texto completo sobre "tema" o "descripción"; para filtrar por empresa o solicitante, utilice `freshdesk_list_tickets` con `company_id` o `requester_id`.

**Alias:** `buscar_tickets`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `estado` | entero | No | `nulo` |
| `prioridad` | entero | No | `nulo` |
| `id_agente` | entero | No | `nulo` |
| `id_grupo` | entero | No | `nulo` |
| `tipo_ticket` | cadena | No | `nulo` |
| `etiqueta` | cadena | No | `nulo` |
| `creado_después` | cadena (`aaaa-mm-dd`) | No | `nulo` |
| `creado_antes` | cadena (`aaaa-mm-dd`) | No | `nulo` |
| `actualizado_después` | cadena (`aaaa-mm-dd`) | No | `nulo` |
| `actualizado_antes` | cadena (`aaaa-mm-dd`) | No | `nulo` |
| `campos_personalizados` | objeto | No | `nulo` |
| `consulta` | cadena (DSL avanzado) | No | `nulo` |
| `página` | entero (1–10) | No | `1` |
| `incluir_completo` | booleano | No | `falso` |

Proporcione al menos un filtro estructurado o una "consulta" DSL válida. `query` es un fragmento DSL avanzado, no texto libre; si se usa junto con filtros, se combina con ellos mediante "Y". En `custom_fields`, el prefijo `cf_` se agrega automáticamente si falta.

**Llamar**
```json
{ "status": 2, "priority": 4, "group_id": 15, "updated_after": "2026-01-01" }
```
**Respuesta** - Resultado de la búsqueda de Freshdesk:
```json
{
  "results": [
    { "id": 980, "subject": "Sistema irraggiungibile", "status": 2, "priority": 4 }
  ],
  "total": 1
}
```
---

## Freshdesk_create_ticket <span className="fd-tag fd-tag--write">escribir</span>

Crea un billete. Sujeto a [modo de solo lectura](../configuration.md#read-only-mode).

**Alias:** `create_ticket`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `sujeto` | cadena | Sí | - |
| `descripción` | cadena (HTML) | Sí | - |
| `fuente` | entero (fuente) | Sí | - |
| `prioridad` | entero (prioridad) | Sí | - |
| `estado` | entero (estado) | Sí | - |
| `correo electrónico` | cadena | Condicional | `nulo` |
| `id_solicitante` | entero | Condicional | `nulo` |
| `campos_personalizados` | objeto | No | `nulo` |
| `campos_adicionales` | objeto | No | `nulo` |

Se requiere al menos uno de "correo electrónico" y "requester_id". `additional_fields` recopila otros campos de nivel superior (por ejemplo, `{"type": "Question", "group_id": 123}`).

**Llamar**
```json
{
  "subject": "Problema di fatturazione",
  "description": "<p>Il cliente segnala un importo errato.</p>",
  "source": 2,
  "priority": 3,
  "status": 2,
  "email": "cliente@acme.it",
  "additional_fields": { "type": "Question", "group_id": 12 }
}
```
**Respuesta**
```json
{ "success": true, "message": "Ticket creato", "ticket": { "id": 12346, "subject": "Problema di fatturazione" } }
```
En caso de error de validación:
```json
{ "success": false, "error": "Errore di validazione: [{'field': 'email', 'message': '...'}]" }
```
---

## Freshdesk_update_ticket <span className="fd-tag fd-tag--write">actualizar</span>

Actualiza los campos de un ticket. Sujeto a [modo de solo lectura](../configuration.md#read-only-mode).

**Alias:** `update_ticket`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `ticket_id` | entero | Sí | - |
| `campos_ticket` | objeto | Sí | - |

Claves comunes de `ticket_fields`: `status` (2–5), `prioridad` (1–4), `group_id`, `responder_id` (enviar agente), `type`, `tags` (lista), `custom_fields` (dict).

**Llamar**
```json
{
  "ticket_id": 12345,
  "ticket_fields": { "status": 4, "responder_id": 123, "custom_fields": { "cf_causa": "Bug" } }
}
```
**Respuesta**
```json
{ "success": true, "message": "Ticket aggiornato", "ticket": { "id": 12345, "status": 4 } }
```
---

## Freshdesk_delete_ticket <span className="fd-tag fd-tag--delete">eliminar</span>

Eliminar (mover a la papelera) un ticket. Operación destructiva, sujeta al [modo de solo lectura](../configurazione.md#read-only-mode).

**Alias:** `delete_ticket`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `ticket_id` | entero | Sí | - |

**Llamar**
```json
{ "ticket_id": 12345 }
```
**Respuesta**
```json
{ "success": true, "message": "Ticket eliminato" }
```
---

## Freshdesk_view_ticket_summary <span className="fd-tag">leer</span>

Recupera el resumen de un ticket.

**Alias:** `view_ticket_summary`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `ticket_id` | entero | Sí | - |

**Respuesta**
```json
{ "id": 55, "ticket_id": 12345, "body": "Cliente con importo errato; in attesa di verifica." }
```
---

## Freshdesk_update_ticket_summary <span className="fd-tag fd-tag--write">actualizar</span>

Cree o actualice un resumen de ticket. Sujeto a [modo de solo lectura](../configuration.md#read-only-mode).

**Alias:** `update_ticket_summary`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `ticket_id` | entero | Sí | - |
| `cuerpo` | cadena | Sí | - |

**Llamar**
```json
{ "ticket_id": 12345, "body": "Verificato l'importo: emessa nota di credito." }
```
---

## Freshdesk_delete_ticket_summary <span className="fd-tag fd-tag--delete">eliminar</span>

Eliminar un resumen de ticket. Operación destructiva, sujeta al [modo de solo lectura](../configurazione.md#read-only-mode).

**Alias:** `delete_ticket_summary`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `ticket_id` | entero | Sí | - |

**Respuesta**
```json
{ "success": true, "message": "Riepilogo del ticket eliminato" }
```
---

## Freshdesk_get_field_properties <span className="fd-tag">leer</span>

Recupera las propiedades de un campo de ticket específico por nombre interno.

**Alias:** `get_field_properties`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `nombre_campo` | cadena | Sí | - |

El nombre del `tipo` se asigna automáticamente al campo del sistema `ticket_type`.

**Llamar**
```json
{ "field_name": "priority" }
```
**Respuesta** - el objeto de campo coincidente (o "nulo" si no se encuentra):
```json
{
  "id": 3,
  "name": "priority",
  "label": "Priority",
  "type": "default_priority",
  "choices": { "Low": 1, "Medium": 2, "High": 3, "Urgent": 4 }
}
```

