---
id: intro
title: "Introduction to Freshdesk MCP"
description: "Freshdesk MCP overview: what the server does, what APIs Freshdesk exposes, and how to use it with MCP-compatible AI assistants."
slug: /intro
---

# Freshdesk MCP

**Freshdesk MCP** is a [Model Context Protocol](https://modelcontextprotocol.io/) server that connects a [Freshdesk](https://www.freshdesk.com/) account to any MCP-compatible AI model or client. It exposes the Freshdesk API as a set of **tools** and **prompts** that can be invoked in natural language: the assistant can thus read and manage tickets, conversations, contacts, companies, knowledge base and custom fields.

The server is written in Python (FastMCP) with modular architecture (`core` / `services` / `schemas` / `tools`) and a shared HTTP client with rate limit management.

## What is it for

Once the server is connected, you can ask the assistant things like:

- "Show me ticket #12345 and its entire conversation"
- "Search for open and urgent tickets and assign them to the Support group"
- "Find the Acme company and create a contact for mario.rossi@acme.it"
- "Add a private note to ticket #12345 with analysis results"
- "Create a knowledge base article about resetting your password"

The model automatically chooses the correct tool and composes its parameters.

## Feature overview

- **124 tools exposed by MCP server**: 64 canonical `freshdesk_*` names and 60 legacy aliases deprecated. The aliases are associated with 59 handlers; `freshdesk_search_companies` exposes two of them.
- **2 guided prompts** (`create_ticket`, `create_reply`) to assist the model in composing payloads.
- **ToolAnnotations** on each tool (read / write / update / delete): behavior hints for safer automations.
- **Multi-tenant via HTTP**: a single deployment can serve multiple Freshdesk accounts, with credentials provided per-request.
- **Authentication via header** (`X-Freshdesk-Domain` / `X-Freshdesk-Api-Key`) preferred to query string.
- **Read-only** mode on tickets via `FRESHDESK_TICKETS_READ_ONLY`.
- **Context-safe attachments**: metadata is returned by default, base64 content only on request (1 MiB per file and 5 MiB overall by default).
- **Automatic pagination** of the conversation thread, up to 50 pages of 100 messages.
## The tools, by domain

| Form | No. tools | What it covers |
|---|---|---|
| [Ticket](./reference/tickets.md) | 12 | List, search, detail, CRUD, summary, ticket field |
| [Conversations](./reference/conversazioni.md) | 5 | Thread, reply, notes, update, attachments |
| [Contacts](./reference/contatti.md) | 5 | List, detail, search, creation, update |
| [Companies](./reference/aziende.md) | 5 | List, detail, search, creation, update |
| [Agents](./reference/agenti.md) | 5 | List, detail, search, creation, update |
| [Groups](./reference/gruppi.md) | 4 | List, detail, creation, update |
| [Fields](./reference/fields.md) | 8 | Ticket field, contact field, company field |
| [Canned Responses](./reference/risposte-predefinite.md) | 7 | Folders and canned responses |
| [Knowledge base](./reference/soluzioni.md) | 13 | Categories, folders, articles + search |
| **Total** | **64** | + 2 [prompt](./reference/prompts.md) |

## How this documentation is organized

- **[Installation](./installazione.md)** - server requirements, installation and startup (stdio and HTTP).
- **[Configuration](./configurazione.md)** - environment variables, Freshdesk credentials, and MCP client configuration examples.
- **[Tool Reference](./reference/overview.md)** - each tool with parameters, example call and response.
- **[Examples](./esempi.md)** - real usage flows that combine multiple tools.

:::note[Repository]
The source code is at [github.com/devchristian1337/freshdesk-mcp](https://github.com/devchristian1337/freshdesk-mcp). This documentation refers to the GitHub repository: the package of the same name `freshdesk-mcp` published on PyPI is not managed by this project.
:::
