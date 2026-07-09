---
id: prompts
title: Prompt MCP Freshdesk
description: Reference dei prompt MCP Freshdesk per guidare il modello nella creazione di ticket e reply con payload corretti e contesto ticket.
sidebar_label: Prompt
---
# Indicaciones

Además de las herramientas, el servidor expone **2 mensajes MCP** (registrados con `@mcp.prompt`). Las indicaciones no llaman a la API directamente: producen un texto guiado que ayuda al modelo a componer correctamente la carga útil, dirigiéndola a las herramientas adecuadas.

Úsalos cuando quieras reducir la ambigüedad en la generación de carga útil. Un mensaje MCP es particularmente útil en clientes que abandonan el modelo para elegir la siguiente herramienta: en lugar de escribir a mano todo el JSON, el mensaje recuerda los campos obligatorios, el formato esperado y las comprobaciones preliminares.

## Flujo recomendado

Para crear tickets, primero recopile el asunto, la descripción, la prioridad, el estado, el canal y el solicitante. Si el ticket utiliza campos personalizados, obtenga los metadatos con `freshdesk_get_field_properties` antes de invocar `freshdesk_create_ticket`. Para obtener respuestas, lea siempre la conversación actualizada con `freshdesk_get_ticket_conversation` y luego genere un cuerpo HTML breve coherente con el tono de las respuestas anteriores.

Las indicaciones no reemplazan las herramientas de seguridad o validación: sirven para darle al modelo un seguimiento operativo repetible. Si un flujo de trabajo requiere aprobación humana, utilice el mensaje para preparar la carga útil y mostrar la acción esperada, luego invoque la herramienta solo después de la confirmación en el cliente.

---

## crear_ticket

Guía la creación de un ticket en Freshdesk.

| Tema | Tipo | Requerido |
|---|---|---|
| `sujeto` | cadena | Sí |
| `descripción` | cadena | Sí |
| `fuente` | cadena | Sí |
| `prioridad` | cadena | Sí |
| `estado` | cadena | Sí |
| `correo electrónico` | cadena | Sí |

El mensaje devuelve una declaración que encapsula los argumentos como carga útil y recuerda al modelo que:

- utilice `freshdesk_get_field_properties()` para conocer los valores permitidos y las claves internas de los campos;
- trate `type` como **campo del sistema** (no personalizado), pasándolo como un campo de nivel superior (en `additional_fields`), no dentro de `custom_fields`.

El texto generado es del tipo:
```text
Crea un ticket in Freshdesk usando questo payload:

{'subject': ..., 'description': ..., 'source': ..., 'priority': ..., 'status': ..., 'email': ...}

Se ti servono informazioni sui campi (valori ammessi o chiavi interne) usa
`freshdesk_get_field_properties()`.
...
```
En sentido descendente, el modelo normalmente invoca [`freshdesk_create_ticket`](./tickets.md#freshdesk_create_ticket-write).

---

## crear_respuesta

Guía la creación de una respuesta en un ticket.

| Tema | Tipo | Requerido |
|---|---|---|
| `ticket_id` | entero | Sí |
| `mensaje_respuesta` | cadena | Sí |

El mensaje devuelve una declaración que encapsula `{ "body": respuesta_message }` y recuerda al modelo que:

- formatear `body` en **HTML**, de forma breve pero contextualmente completa;
- revise primero la conversación del ticket con [`freshdesk_get_ticket_conversation`](./conversazioni.md#freshdesk_get_ticket_conversation-read);
- mantener el tono y el estilo coherentes con las respuestas anteriores.

En sentido descendente, el modelo normalmente invoca [`freshdesk_create_ticket_reply`](./conversazioni.md#freshdesk_create_ticket_reply-write).
```text
Crea una reply per il ticket {ticket_id} in Freshdesk usando questo payload:

{'body': ...}
...
```

