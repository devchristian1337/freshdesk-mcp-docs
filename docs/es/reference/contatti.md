---
id: contatti
title: Tool contatti Freshdesk
description: Reference dei tool contatti Freshdesk MCP per listare, cercare, leggere, creare e aggiornare requester con campi standard e custom.
sidebar_label: Contatti
---
# Contactos

5 herramientas para listar, leer, buscar, crear y actualizar contactos.

---

## Freshdesk_list_contacts <span className="fd-tag">leer</span>

Lista de contactos con paginación y filtros opcionales.

**Alias:** `lista_contactos`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `página` | entero | No | `1` |
| `por_página` | entero (1–100) | No | `30` |
| `correo electrónico` | cadena | No | `nulo` |
| `ID_empresa` | entero | No | `nulo` |
| `actualizado_desde` | cadena (ISO 8601) | No | `nulo` |

**Llamar**
```json
{ "company_id": 3001, "per_page": 50 }
```
**Respuesta**
```json
{
  "contacts": [
    { "id": 6001, "name": "Mario Rossi", "email": "mario.rossi@acme.it", "company_id": 3001 }
  ],
  "pagination": { "current_page": 1, "next_page": null, "prev_page": null, "per_page": 50 }
}
```
---

## Freshdesk_get_contact <span className="fd-tag">leer</span>

Recuperar el detalle de un contacto por ID.

**Alias:** `get_contact`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `id_contacto` | entero | Sí | - |

**Respuesta**
```json
{
  "id": 6001,
  "name": "Mario Rossi",
  "email": "mario.rossi@acme.it",
  "phone": "+39 02 1234567",
  "company_id": 3001,
  "job_title": "IT Manager"
}
```
---

## Freshdesk_search_contacts <span className="fd-tag">leer</span>

Busque contactos por nombre o correo electrónico (autocompletar).

**Alias:** `buscar_contactos`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `consulta` | cadena | Sí | - |

**Llamar**
```json
{ "query": "rossi" }
```
**Respuesta**
```json
[
  { "id": 6001, "name": "Mario Rossi", "email": "mario.rossi@acme.it" }
]
```
---

## Freshdesk_create_contact <span className="fd-tag fd-tag--write">escribir</span>

Crea un nuevo contacto.

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `contacto` | objeto (ContactoCrear) | Sí | - |

**Campos de `contacto`** - `nombre` es obligatorio y requiere **al menos uno** de `correo electrónico`, `teléfono`, `móvil`, `twitter_id`, `unique_external_id`:

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| `nombre` | cadena | Sí | Nombre completo |
| `correo electrónico` | cadena | Condicional | Correo electrónico principal |
| `teléfono` | cadena | Condicional | Teléfono fijo |
| `móvil` | cadena | Condicional | Móvil |
| `twitter_id` | cadena | Condicional | Identificador de Twitter |
| `id_externo_único` | cadena | Condicional | Identificación externa única |
| `ID_empresa` | entero | No | Empresa a la que pertenece |
| `título_trabajo` | cadena | No | Rol/cualificación |
| `descripción` | cadena | No | Notas de contacto |
| `campos_personalizados` | objeto | No | Campos personalizados |

**Llamar**
```json
{
  "contact": {
    "name": "Giulia Bianchi",
    "email": "giulia.bianchi@acme.it",
    "company_id": 3001,
    "job_title": "Responsabile Acquisti"
  }
}
```
**Respuesta**
```json
{ "id": 6002, "name": "Giulia Bianchi", "email": "giulia.bianchi@acme.it", "company_id": 3001 }
```
---

## Freshdesk_update_contact <span className="fd-tag fd-tag--write">actualizar</span>

Actualizar un contacto.

**Alias:** `actualizar_contacto`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `id_contacto` | entero | Sí | - |
| `campos_de_contacto` | objeto | Sí | - |

Claves comunes de `contact_fields`: `nombre`, `email`, `phone`, `company_id`, `job_title`, `custom_fields`.

**Llamar**
```json
{ "contact_id": 6002, "contact_fields": { "job_title": "Direttore Acquisti" } }
```
**Respuesta**
```json
{ "id": 6002, "name": "Giulia Bianchi", "job_title": "Direttore Acquisti" }
```

