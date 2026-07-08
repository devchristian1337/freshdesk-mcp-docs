---
id: overview
title: Panoramica della reference
description: Convenzioni di naming, annotations, formato delle risposte e degli errori.
sidebar_label: Panoramica
---

# Reference dei tool

Questa sezione documenta tutti i **64 tool** e i **2 prompt** del server, raggruppati per dominio. Prima di consultare i singoli tool, vale la pena conoscere le convenzioni comuni.

## Naming e alias

Ogni tool ha un **nome canonico** con prefisso `freshdesk_*` (es. `freshdesk_get_ticket`). Per retrocompatibilità con i client già configurati, molti tool espongono anche il **vecchio nome** come **alias deprecato** (es. `get_ticket`). Gli alias funzionano in modo identico ma la loro descrizione invita a usare il nome canonico.

Nelle pagine seguenti, per ogni tool sono indicati il nome canonico e gli eventuali alias.

## ToolAnnotations

Ogni tool dichiara delle annotations, cioè hint sul suo comportamento (sono suggerimenti per i client, non garanzie di sicurezza). Trattandosi sempre di un servizio esterno, tutti i tool hanno `openWorldHint = true`.

| Badge | Significato | Hint |
|---|---|---|
| <span className="fd-tag">read</span> | Sola lettura | `readOnlyHint: true`, `idempotentHint: true` |
| <span className="fd-tag fd-tag--write">write</span> | Creazione (non idempotente) | `idempotentHint: false` |
| <span className="fd-tag fd-tag--write">update</span> | Aggiornamento (idempotente) | `idempotentHint: true` |
| <span className="fd-tag fd-tag--delete">delete</span> | Operazione distruttiva | `destructiveHint: true` |

I tool di **scrittura/eliminazione sui ticket** rispettano inoltre la [modalità read-only](../configurazione.md#modalità-read-only).

## Formato delle risposte

I tool restituiscono dati JSON. Le forme ricorrenti sono:

**Lista paginata** - i tool `list_*`/`get_*` con paginazione restituiscono la risorsa più un blocco `pagination`:

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

**Risorsa singola** - i tool `view_*`/`get_*` per ID restituiscono direttamente l'oggetto Freshdesk (un dict), oppure una lista grezza per gli endpoint che la prevedono (es. `freshdesk_get_ticket_fields`).

**Creazione/aggiornamento di ticket** - i tool sui ticket incapsulano l'esito:

```json
{ "success": true, "message": "Ticket creato", "ticket": { "id": 1234 } }
```

## Formato degli errori

In caso di problema, il tool restituisce un dict con la chiave `error` (e, quando disponibili, `status_code` e `details`) invece di sollevare un'eccezione:

```json
{
  "error": "Descrizione dell'errore",
  "status_code": 404,
  "details": { "errors": [ { "field": "...", "message": "..." } ] }
}
```

Errori comuni di validazione lato client (prima della chiamata all'API):

- `"Il numero di pagina deve essere >= 1."`
- `"per_page deve essere compreso tra 1 e 100."`
- `"freshdesk_domain must be a *.freshdesk.com host"`
- `"freshdesk_api_key is required"`

## Paginazione

I tool con paginazione accettano `page` (≥ 1) e `per_page` (1–100, default 30). Il blocco `pagination` viene ricostruito a partire dall'header HTTP `Link` restituito da Freshdesk: `next_page`/`prev_page` valgono `null` quando non c'è una pagina successiva/precedente.

## Come leggere le tabelle dei parametri

Per ogni tool trovi una tabella con: **nome** del parametro, **tipo**, se è **obbligatorio** e l'eventuale **default**. I parametri tipati come oggetto (es. `ticket`, `contact`, `group`) corrispondono a uno schema strutturato i cui campi sono elencati sotto la tabella.
