---
id: overview
title: Reference dei tool MCP
description: "Convenzioni della reference Freshdesk MCP: naming dei tool, alias, ToolAnnotations, risposte, errori, paginazione e parametri."
sidebar_label: Panoramica
---
# Tool references

This section documents the actual output of the server's `list_tools` and `list_prompts`: **124 tools** (64 canonical and 60 legacy aliases) and **2 prompts**, grouped by domain. Before consulting the individual tools, it is worth knowing the common conventions.

## Naming and aliases

Each handler has a **canonical name** prefixed with `freshdesk_*` (e.g. `freshdesk_get_ticket`). For backwards compatibility with already configured clients, 59 handlers expose one or more legacy names as **deprecated aliases** (e.g. `get_ticket`); that's 60 legacy names in total, because `freshdesk_search_companies` exposes both `search_companies` and `find_company_by_name`. Aliases work identically but their description encourages you to use the canonical name.

On the following pages, the canonical name and any aliases are indicated for each tool.

## ToolAnnotations

Each tool declares annotations, i.e. hints on its behavior (they are suggestions for clients, not security guarantees). Since this is always an external service, all tools have `openWorldHint = true`.

| Badges | Meaning | Hint |
|---|---|---|
| <span className="fd-tag">read</span> | Read only | `readOnlyHint: true`, `idempotentHint: true` |
| <span className="fd-tag fd-tag--write">write</span> | Creation (non-idempotent) | `idempotentHint: false` |
| <span className="fd-tag fd-tag--write">update</span> | Update (idempotent) | `idempotentHint: true` |
| <span className="fd-tag fd-tag--delete">delete</span> | Destructive Operation | `destructiveHint: true` |

The **writing/deleting tickets** tools also respect the [read-only mode](../configurazione.md#read-only-mode). The block does not affect write operations to other Freshdesk resources.

## Response format

The tools return JSON data. The recurring forms are:

**Paging List** - `list_*`/`get_*` tools with pagination return the resource plus a `pagination` block:
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
**Single resource** - the `view_*`/`get_*` by ID tools return the Freshdesk object (a dict) directly, or a raw list for endpoints that expect it (e.g. `freshdesk_get_ticket_fields`).

**Ticket creation/update** - ticket tools encapsulate the outcome:
```json
{ "success": true, "message": "Ticket creato", "ticket": { "id": 1234 } }
```
## Error format

In case of a problem, the tool returns a dict with the `error` key (and, when available, `status_code` and `details`) instead of raising an exception:
```json
{
  "error": "Descrizione dell'errore",
  "status_code": 404,
  "details": { "errors": [ { "field": "...", "message": "..." } ] }
}
```
Common client-side validation errors (before calling the API):

- `"Page number must be >= 1."`
- `"per_page must be between 1 and 100."`
- `"freshdesk_domain must be a *.freshdesk.com host"`
- `"freshdesk_api_key is required"`

## Pagination

Paged list tools accept `page` (≥ 1) and `per_page` (1–100, default 30). The `pagination` block is reconstructed from the `Link` HTTP header returned by Freshdesk: `next_page`/`prev_page` are `null` when there is no next/previous page. The ticket search uses only the `page` parameter and accepts pages 1–10; the conversation thread follows pages automatically up to a defensive maximum of 50 pages of 100 messages.

## How to read parameter tables

For each tool you will find a table with: **name** of the parameter, **type**, if it is **mandatory** and any **default**. Parameters typed as objects (e.g. `ticket`, `contact`, `group`) correspond to a structured schema whose fields are listed below the table.
