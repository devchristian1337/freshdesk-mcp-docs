---
id: aziende
title: Tool aziende Freshdesk
description: Reference dei tool aziende Freshdesk MCP per listare, cercare, leggere, creare e aggiornare company, domini e campi account.
sidebar_label: Aziende
---
# Empresas

5 herramientas para listar, leer, buscar, crear y actualizar empresas.

---

## Freshdesk_list_companies <span className="fd-tag">leer</span>

Enumera empresas con paginación.

**Alias:** `lista_empresas`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `página` | entero | No | `1` |
| `por_página` | entero (1–100) | No | `30` |

**Respuesta**
```json
{
  "companies": [
    { "id": 3001, "name": "Acme S.p.A.", "domains": ["acme.it"] }
  ],
  "pagination": { "current_page": 1, "next_page": null, "prev_page": null, "per_page": 30 }
}
```
---

## Freshdesk_view_company <span className="fd-tag">leer</span>

Recuperar el detalle de una empresa por ID.

**Alias:** `view_company`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `ID_empresa` | entero | Sí | - |

**Respuesta**
```json
{
  "id": 3001,
  "name": "Acme S.p.A.",
  "domains": ["acme.it"],
  "industry": "Manifatturiero",
  "account_tier": "Premium"
}
```
---

## Freshdesk_search_companies <span className="fd-tag">leer</span>

Busque empresas por nombre (autocompletar). Fusione las antiguas `search_companies` y `find_company_by_name`.

**Alias:** `buscar_empresas`, `buscar_empresa_por_nombre`

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `consulta` | cadena | Sí | - |

`consulta` es el nombre (incluso parcial) de la empresa que se va a buscar.

**Llamar**
```json
{ "query": "acme" }
```
**Respuesta**
```json
[
  { "id": 3001, "name": "Acme S.p.A." }
]
```
---

## Freshdesk_create_company <span className="fd-tag fd-tag--write">escribir</span>

Crear una nueva empresa.

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `empresa` | objeto(EmpresaCrear) | Sí | - |

**Campos de `empresa`** - `nombre` es obligatorio:

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| `nombre` | cadena | Sí | Nombre único de la empresa |
| `dominios` | matriz de cadenas | No | Dominios de correo electrónico asociados |
| `descripción` | cadena | No | Descripción |
| `notas` | cadena | No | Nota interna |
| `puntuación_salud` | cadena | No | Ex. `Feliz`, `En riesgo` |
| `nivel_cuenta` | cadena | No | Ex. `Premium` |
| `industria` | cadena | No | Sector al que perteneces |
| `campos_personalizados` | objeto | No | Campos personalizados |

**Llamar**
```json
{
  "company": {
    "name": "Acme S.p.A.",
    "domains": ["acme.it"],
    "industry": "Manifatturiero",
    "account_tier": "Premium"
  }
}
```
**Respuesta**
```json
{ "id": 3002, "name": "Acme S.p.A.", "domains": ["acme.it"] }
```
---

## Freshdesk_update_company <span className="fd-tag fd-tag--write">actualizar</span>

Actualizar una empresa. Todos los campos son opcionales; si la carga útil está vacía, se devuelve un error.

| Parámetro | Tipo | Requerido | Predeterminado |
|---|---|---|---|
| `ID_empresa` | entero | Sí | - |
| `empresa` | objeto (CompanyUpdate) | Sí | - |

Campos **`empresa`** (todos opcionales): `nombre`, `dominios`, `descripción`, `nota`, `salud_score`, `account_tier`, `industria`, `custom_fields`.

**Llamar**
```json
{ "company_id": 3002, "company": { "account_tier": "Enterprise" } }
```
**Respuesta**
```json
{ "id": 3002, "name": "Acme S.p.A.", "account_tier": "Enterprise" }
```
Si no se proporciona ningún campo:
```json
{ "error": "Nessun campo fornito per l'aggiornamento dell'azienda." }
```

