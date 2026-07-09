---
id: intro
title: Introduzione a Freshdesk MCP
description: "Panoramica di Freshdesk MCP: cosa fa il server, quali API Freshdesk espone e come usarlo con assistenti AI compatibili MCP."
slug: /intro
---
# Freshdesk MCP

**Freshdesk MCP** es un servidor [Protocolo de contexto de modelo](https://modelcontextprotocol.io/) que conecta una cuenta de [Freshdesk](https://www.freshdesk.com/) a cualquier modelo o cliente de IA compatible con MCP. Expone la API de Freshdesk como un conjunto de **herramientas** y **mensajes** que se pueden invocar en lenguaje natural: el asistente puede así leer y gestionar tickets, conversaciones, contactos, empresas, base de conocimientos y campos personalizados.

El servidor está escrito en Python (FastMCP) con arquitectura modular (`core` / `services` / `schemas` / `tools`) y un cliente HTTP compartido con gestión de límite de velocidad.

## ¿Para qué sirve?

Una vez que el servidor esté conectado, podrás preguntarle al asistente cosas como:

- "Muéstrame el ticket #12345 y su conversación completa"
- "Buscar tickets abiertos y urgentes y asignarlos al grupo de Soporte"
- "Buscar la empresa Acme y crear un contacto para mario.rossi@acme.it"
- "Agregar una nota privada al ticket #12345 con los resultados del análisis"
- "Cree un artículo en la base de conocimientos sobre cómo restablecer su contraseña"

El modelo elige automáticamente la herramienta correcta y compone sus parámetros.

## Descripción general de funciones

- **124 herramientas expuestas por el servidor MCP**: 64 nombres canónicos `freshdesk_*` y 60 alias heredados están en desuso. Los alias están asociados con 59 controladores; `freshdesk_search_companies` expone dos de ellos.
- **2 indicaciones guiadas** (`create_ticket`, `create_reply`) para ayudar al modelo a componer cargas útiles.
- **ToolAnnotations** en cada herramienta (leer/escribir/actualizar/eliminar): sugerencias de comportamiento para automatizaciones más seguras.
- **Multiinquilino a través de HTTP**: una única implementación puede atender varias cuentas de Freshdesk, con credenciales proporcionadas por solicitud.
- **Autenticación mediante encabezado** (`X-Freshdesk-Domain` / `X-Freshdesk-Api-Key`) preferida a la cadena de consulta.
- Modo **Solo lectura** en tickets a través de `FRESHDESK_TICKETS_READ_ONLY`.
- **Adjuntos seguros para el contexto**: los metadatos se devuelven de forma predeterminada, el contenido base64 solo se solicita (1 MiB por archivo y 5 MiB en total de forma predeterminada).
- **Paginación automática** del hilo de conversación, hasta 50 páginas de 100 mensajes.

## Las herramientas, por dominio

| Formulario | Nº de herramientas | Qué cubre |
|---|---|---|
| [Boleto](./reference/tickets.md) | 12 | Lista, búsqueda, detalle, CRUD, resumen, campo ticket |
| [Conversaciones](./reference/conversations.md) | 5 | Hilo, respuesta, notas, actualización, archivos adjuntos |
| [Contactos](./reference/contacts.md) | 5 | Listar, detalle, buscar, crear, actualizar |
| [Empresas](./reference/companies.md) | 5 | Listar, detalle, buscar, crear, actualizar |
| [Agentes](./reference/agenti.md) | 5 | Listar, detalle, buscar, crear, actualizar |
| [Grupos](./reference/groups.md) | 4 | Listado, detalle, creación, actualización |
| [Campos](./reference/fields.md) | 8 | Campo ticket, campo contacto, campo empresa |
| [Respuestas almacenadas](./reference/canned-responses.md) | 7 | Carpetas y respuestas almacenadas |
| [Base de conocimientos](./reference/solutions.md) | 13 | Categorías, carpetas, artículos + buscar |
| **Totales** | **64** | + 2 [mensaje](./reference/prompts.md) |

## Cómo está organizada esta documentación
- **[Instalación](./installation.md)** - requisitos del servidor, instalación y arranque (stdio y HTTP).
- **[Configuración](./configuration.md)**: variables de entorno, credenciales de Freshdesk y ejemplos de configuración del cliente MCP.
- **[Referencia de herramienta](./reference/overview.md)**: cada herramienta con parámetros, ejemplo de llamada y respuesta.
- **[Ejemplos](./examples.md)** - flujos de uso reales que combinan múltiples herramientas.

:::nota[Repositorio]
El código fuente está en [github.com/devchristian1337/freshdesk-mcp](https://github.com/devchristian1337/freshdesk-mcp). Esta documentación hace referencia al repositorio de GitHub: el paquete del mismo nombre `freshdesk-mcp` publicado en PyPI no es administrado por este proyecto.
:::
