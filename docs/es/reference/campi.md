---
id: campi
title: Tool campi Freshdesk
description: Reference dei tool campi Freshdesk MCP per ticket field, contact field e company field, con lettura, creazione e aggiornamento.
sidebar_label: Campi
---
# Campos

8 herramientas para gestionar campos (estándar y personalizados) de tickets, contactos y empresas. Los campos del ticket se gestionan a través de puntos finales de administración.

---

## Freshdesk_create_ticket_field <span className="fd-tag fd-tag--write">escribir</span>

Cree un campo de ticket personalizado (punto final de administración).

**Alias:** `create_ticket_field`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `ticket_field_fields` | objeto | Sí | - |

`ticket_field_fields` requiere al menos `label` y `type` (por ejemplo, `custom_text`, `custom_dropdown`); para los menús desplegables se incluyen "opciones".

**Llamar**
```json
{
  "ticket_field_fields": {
    "label": "Causa",
    "type": "custom_dropdown",
    "choices": ["Bug", "Configurazione", "Formazione"]
  }
}
```
**Respuesta**
```json
{ "id": 50, "name": "cf_causa", "label": "Causa", "type": "custom_dropdown" }
```
---

## Freshdesk_view_ticket_field <span className="fd-tag">leer</span>

Recuperar un campo de ticket por ID (punto final de administrador).

**Alias:** `view_ticket_field`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `ticket_field_id` | entero | Sí | - |

**Respuesta**
```json
{ "id": 50, "name": "cf_causa", "label": "Causa", "type": "custom_dropdown", "choices": ["Bug", "Configurazione"] }
```
---

## Freshdesk_update_ticket_field <span className="fd-tag fd-tag--write">actualizar</span>

Actualice un campo de ticket personalizado (punto final de administración).

**Alias:** `update_ticket_field`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `ticket_field_id` | entero | Sí | - |
| `ticket_field_fields` | objeto | Sí | - |

Claves comunes: `etiqueta`, `elecciones`.

**Llamar**
```json
{ "ticket_field_id": 50, "ticket_field_fields": { "choices": ["Bug", "Configurazione", "Formazione", "Altro"] } }
```
---

## Freshdesk_list_contact_fields <span className="fd-tag">leer</span>

Enumera todos los campos de contacto (estándar y personalizados) con nombres internos.

**Alias:** `list_contact_fields`

Sin parámetros.

**Respuesta**
```json
[
  { "id": 1, "name": "name", "label": "Nome", "type": "default_name" },
  { "id": 9, "name": "cf_reparto", "label": "Reparto", "type": "custom_text" }
]
```
---

## Freshdesk_view_contact_field <span className="fd-tag">leer</span>

Recupera un campo de contacto para ID.

**Alias:** `view_contact_field`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `contact_field_id` | entero | Sí | - |

**Respuesta**
```json
{ "id": 9, "name": "cf_reparto", "label": "Reparto", "type": "custom_text" }
```
---

## Freshdesk_create_contact_field <span className="fd-tag fd-tag--write">escribir</span>

Crea un campo de contacto personalizado.

**Alias:** `create_contact_field`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `campo` | objeto (ContactFieldCreate) | Sí | - |

**Campos de `campo`:**

| Campo | Tipo | Requerido | Predeterminado | Notas |
|---|---|---|---|---|
| `etiqueta` | cadena | Sí | - | Nombre del lado del agente |
| `etiqueta_para_clientes` | cadena | Sí | - | Nombre del lado del cliente |
| `tipo` | cadena | Sí | - | Uno de: `custom_text`, `custom_paragraph`, `custom_checkbox`, `custom_number`, `custom_dropdown`, `custom_phone_number`, `custom_url`, `custom_date` |
| `editable_in_signup` | booleano | No | `falso` | Valorable al registrarse |
| `posición` | entero | No | `1` | Posición de campo |
| `requerido_para_agentes` | booleano | No | `falso` | Obligatorio para agentes |
| `los clientes_pueden_editar` | booleano | No | `falso` | Puede ser modificado por el cliente |
| `requerido_para_clientes` | booleano | No | `falso` | Obligatorio en el portal |
| `displayed_for_customers` | booleano | No | `falso` | Visible en el portal |
| `opciones` | conjunto de objetos | No | `nulo` | Para menús desplegables: `[{ "valor": "Texto", "posición": 1 }]` |

**Llamar**
```json
{
  "field": {
    "label": "Reparto",
    "label_for_customers": "Il tuo reparto",
    "type": "custom_text",
    "required_for_agents": true
  }
}
```
**Respuesta**
```json
{ "id": 12, "name": "cf_reparto", "label": "Reparto", "type": "custom_text" }
```
---

## Freshdesk_update_contact_field <span className="fd-tag fd-tag--write">actualizar</span>

Actualizar un campo de contacto personalizado.

**Alias:** `update_contact_field`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `contact_field_id` | entero | Sí | - |
| `contact_field_fields` | objeto | Sí | - |

Claves comunes: `etiqueta`, `elecciones`.

**Llamar**
```json
{ "contact_field_id": 12, "contact_field_fields": { "label": "Reparto aziendale" } }
```
---

## Freshdesk_list_company_fields <span className="fd-tag">leer</span>

Enumera todos los campos de la empresa (estándar y personalizados) con nombres internos.

**Alias:** `list_company_fields`

Sin parámetros.

**Respuesta**
```json
[
  { "id": 1, "name": "name", "label": "Nome", "type": "default_name" },
  { "id": 5, "name": "cf_settore", "label": "Settore", "type": "custom_dropdown" }
]
```

