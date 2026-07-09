---
id: overview
title: Reference dei tool MCP
description: "Convenzioni della reference Freshdesk MCP: naming dei tool, alias, ToolAnnotations, risposte, errori, paginazione e parametri."
sidebar_label: Panoramica
---
# Referencias de herramientas

Esta sección documenta el resultado real de `list_tools` y `list_prompts` del servidor: **124 herramientas** (64 alias canónicos y 60 heredados) y **2 mensajes**, agrupados por dominio. Antes de consultar las herramientas individuales, conviene conocer las convenciones comunes.

## Nombres y alias

Cada controlador tiene un **nombre canónico** con el prefijo `freshdesk_*` (por ejemplo, `freshdesk_get_ticket`). Para compatibilidad con clientes ya configurados, 59 controladores exponen uno o más nombres heredados como **alias obsoletos** (por ejemplo, `get_ticket`); son 60 nombres heredados en total, porque `freshdesk_search_companies` expone tanto `search_companies` como `find_company_by_name`. Los alias funcionan de manera idéntica, pero su descripción le anima a utilizar el nombre canónico.

En las páginas siguientes, se indica el nombre canónico y los alias de cada herramienta.

## Anotaciones de herramientas

Cada herramienta declara anotaciones, es decir, sugerencias sobre su comportamiento (son sugerencias para los clientes, no garantías de seguridad). Dado que este es siempre un servicio externo, todas las herramientas tienen "openWorldHint = true".

| Insignias | Significado | Sugerencia |
|---|---|---|
| <span className="fd-tag">leer</span> | Sólo lectura | `readOnlyHint: verdadero`, `idempotentHint: verdadero` |
| <span className="fd-tag fd-tag--write">escribir</span> | Creación (no idempotente) | `idempotentPista: falso` |
| <span className="fd-tag fd-tag--write">actualizar</span> | Actualización (idempotente) | `idempotentPista: verdadero` |
| <span className="fd-tag fd-tag--delete">eliminar</span> | Operación Destructiva | `sugerencia destructiva: verdadero` |

Las herramientas de **escribir/eliminar tickets** también respetan el [modo de solo lectura](../configurazione.md#read-only-mode). El bloqueo no afecta las operaciones de escritura en otros recursos de Freshdesk.

## Formato de respuesta

Las herramientas devuelven datos JSON. Las formas recurrentes son:

**Lista de paginación** - Las herramientas `list_*`/`get_*` con paginación devuelven el recurso más un bloque `paginación`:
```json
{
  "tickets": [ { "id": 1, "subject": "..." } ],
  "pagination": {
    "current_page": 1,
    "next_page": 2,
    "prev_page": null,
    "per_page": 30
  }
}
```
**Recurso único**: las herramientas `view_*`/`get_*` mediante ID devuelven el objeto Freshdesk (un dict) directamente o una lista sin formato para los puntos finales que lo esperan (por ejemplo, `freshdesk_get_ticket_fields`).

**Creación/actualización de tickets**: las herramientas de tickets resumen el resultado:
```json
{ "success": true, "message": "Ticket creato", "ticket": { "id": 1234 } }
```
## Formato de error

En caso de un problema, la herramienta devuelve un dictado con la clave `error` (y, cuando esté disponible, `status_code` y `details`) en lugar de generar una excepción:
```json
{
  "error": "Descrizione dell'errore",
  "status_code": 404,
  "details": { "errors": [ { "field": "...", "message": "..." } ] }
}
```
Errores comunes de validación del lado del cliente (antes de llamar a la API):

- `"El número de página debe ser >= 1."`
- `"por_página debe estar entre 1 y 100."`
- `"freshdesk_domain debe ser un host *.freshdesk.com"`
- `"Se requiere Freshdesk_api_key"`

## Paginación

Las herramientas de lista paginada aceptan `página` (≥ 1) y `por_página` (1–100, valor predeterminado 30). El bloque `paginación` se reconstruye a partir del encabezado HTTP `Enlace` devuelto por Freshdesk: `next_page`/`prev_page` son `null` cuando no hay una página siguiente/anterior. La búsqueda de tickets utiliza únicamente el parámetro "página" y acepta las páginas 1 a 10; el hilo de conversación sigue páginas automáticamente hasta un máximo defensivo de 50 páginas de 100 mensajes.

## Cómo leer tablas de parámetros

Para cada herramienta encontrarás una tabla con: **nombre** del parámetro, **tipo**, si es **obligatorio** y cualquier **predeterminado**. Los parámetros escritos como objetos (por ejemplo, "ticket", "contacto", "grupo") corresponden a un esquema estructurado cuyos campos se enumeran debajo de la tabla.
