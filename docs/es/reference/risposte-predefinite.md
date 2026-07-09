---
id: risposte-predefinite
title: Tool risposte predefinite
description: Reference dei tool risposte predefinite Freshdesk MCP per cartelle, canned response, contenuti HTML, visibilità e aggiornamenti.
sidebar_label: Risposte predefinite
---
# Respuestas enlatadas

7 herramientas para gestionar respuestas predeterminadas y las carpetas que las contienen.

Las respuestas predeterminadas le permiten estandarizar las comunicaciones recurrentes sin perder el control sobre el texto final enviado al cliente. En Freshdesk MCP, las herramientas separan carpetas y contenidos: primero identifica la carpeta, luego lee o modifica la respuesta predeterminada. Esto resulta útil cuando un asistente de IA necesita proponer una respuesta coherente con los procedimientos internos, las políticas de reembolso, los mensajes de incorporación o las comunicaciones de soporte técnico.

Para evitar cambios no deseados, utilice las herramientas de "lectura" para recuperar el título, el HTML y la visibilidad antes de llamar a una herramienta de "escritura" o "actualización". El campo "visibilidad" rige quién puede usar la respuesta: todos los agentes, solo el propietario o grupos seleccionados.

---

## Freshdesk_list_canned_response_folders <span className="fd-tag">leer</span>

Enumera las carpetas de respuestas predeterminadas.

**Alias:** `list_canned_response_folders`

Sin parámetros.

**Respuesta**
```json
[
  { "id": 201, "name": "Fatturazione", "responses_count": 8 },
  { "id": 202, "name": "Accesso e credenziali", "responses_count": 5 }
]
```
---

## Freshdesk_list_canned_responses <span className="fd-tag">leer</span>

Enumera las respuestas almacenadas contenidas en una carpeta.

**Alias:** `list_canned_responses`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `id_carpeta` | entero | Sí | - |

**Llamar**
```json
{ "folder_id": 201 }
```
**Respuesta**
```json
[
  { "id": 5001, "title": "Conferma rimborso", "folder_id": 201 }
]
```
---

## Freshdesk_view_canned_response <span className="fd-tag">leer</span>

Recupera el detalle de una respuesta almacenada por ID.

**Alias:** `view_canned_response`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `id_respuesta_canned` | entero | Sí | - |

**Respuesta**
```json
{
  "id": 5001,
  "title": "Conferma rimborso",
  "content_html": "<p>Confermiamo l'avvenuto rimborso.</p>",
  "folder_id": 201,
  "visibility": 0
}
```
---

## Freshdesk_create_canned_response <span className="fd-tag fd-tag--write">escribir</span>

Crea una respuesta enlatada.

**Alias:** `create_canned_response`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `respuesta` | objeto (CannedResponseCreate) | Sí | - |

**Campos `Respuesta`:**

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| `título` | cadena | Sí | Título |
| `contenido_html` | cadena | Sí | Contenido HTML |
| `id_carpeta` | entero | Sí | Carpeta de destino |
| `visibilidad` | entero (0–2) | Sí | `0` todos los agentes · `1` personal · `2` grupos seleccionados |
| `id_grupo` | matriz de números enteros | Condicional | Requerido si `visibilidad = 2` |

**Llamar**
```json
{
  "response": {
    "title": "Conferma rimborso",
    "content_html": "<p>Confermiamo l'avvenuto rimborso.</p>",
    "folder_id": 201,
    "visibility": 0
  }
}
```
**Respuesta**
```json
{ "id": 5002, "title": "Conferma rimborso", "folder_id": 201, "visibility": 0 }
```
---

## Freshdesk_update_canned_response <span className="fd-tag fd-tag--write">actualizar</span>

Actualice una respuesta predeterminada.

**Alias:** `update_canned_response`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `id_respuesta_canned` | entero | Sí | - |
| `campos_de_respuesta_enlatados` | objeto | Sí | - |

Claves comunes: `título`, `content_html`, `visibilidad`.

**Llamar**
```json
{ "canned_response_id": 5002, "canned_response_fields": { "title": "Conferma rimborso effettuato" } }
```
---

## Freshdesk_create_canned_response_folder <span className="fd-tag fd-tag--write">escribir</span>

Cree una carpeta de respuestas predeterminadas.

**Alias:** `create_canned_response_folder`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `nombre` | cadena | Sí | - |

**Llamar**
```json
{ "name": "Onboarding" }
```
**Respuesta**
```json
{ "id": 203, "name": "Onboarding" }
```
---

## Freshdesk_update_canned_response_folder <span className="fd-tag fd-tag--write">actualizar</span>

Cambie el nombre de una carpeta de respuestas predeterminadas.

**Alias:** `update_canned_response_folder`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `id_carpeta` | entero | Sí | - |
| `nombre` | cadena | Sí | - |

**Llamar**
```json
{ "folder_id": 203, "name": "Onboarding clienti" }
```

