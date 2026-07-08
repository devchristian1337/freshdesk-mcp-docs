---
id: intro
title: Introduzione a Freshdesk MCP
description: "Panoramica di Freshdesk MCP: cosa fa il server, quali API Freshdesk espone e come usarlo con assistenti AI compatibili MCP."
slug: /intro
---

# Freshdesk MCP

**Freshdesk MCP** è un server [Model Context Protocol](https://modelcontextprotocol.io/) che collega un account [Freshdesk](https://www.freshdesk.com/) a qualsiasi modello AI o client compatibile con MCP. Espone l'API di Freshdesk come un insieme di **tool** e **prompt** invocabili in linguaggio naturale: l'assistente può così leggere e gestire ticket, conversazioni, contatti, aziende, knowledge base e campi custom.

Il server è scritto in Python (FastMCP) con architettura modulare (`core` / `services` / `schemas` / `tools`) e un client HTTP condiviso con gestione del rate limit.

## A cosa serve

Una volta collegato il server, puoi chiedere all'assistente cose come:

- "Mostrami il ticket #12345 e tutta la sua conversazione"
- "Cerca i ticket aperti e urgenti e assegnali al gruppo Supporto"
- "Trova l'azienda Acme e crea un contatto per mario.rossi@acme.it"
- "Aggiungi una nota privata al ticket #12345 con i risultati dell'analisi"
- "Crea un articolo nella knowledge base sulla reimpostazione della password"

Il modello sceglie automaticamente il tool corretto e ne compone i parametri.

## Panoramica delle funzionalità

- **64 tool** con nome canonico `freshdesk_*`, organizzati per dominio.
- **2 prompt guidati** (`create_ticket`, `create_reply`) per assistere il modello nella composizione dei payload.
- **ToolAnnotations** su ogni tool (read / write / update / delete): hint sul comportamento per automazioni più sicure.
- **Multi-tenant via HTTP**: un solo deploy può servire più account Freshdesk, con credenziali fornite per-richiesta.
- **Autenticazione via header** (`X-Freshdesk-Domain` / `X-Freshdesk-Api-Key`) preferita alla query string.
- **Modalità read-only** sui ticket tramite `FRESHDESK_TICKETS_READ_ONLY`.
- **Allegati context-safe**: i metadati sono restituiti di default, il contenuto base64 solo su richiesta e con cap rigidi.
- **Paginazione automatica** del thread delle conversazioni.

## I tool, per dominio

| Modulo | N. tool | Cosa copre |
|---|---|---|
| [Ticket](./reference/tickets.md) | 12 | Lista, ricerca, dettaglio, CRUD, riepiloghi (summary), ticket field |
| [Conversazioni](./reference/conversazioni.md) | 5 | Thread, reply, note, aggiornamento, allegati |
| [Contatti](./reference/contatti.md) | 5 | Lista, dettaglio, ricerca, creazione, aggiornamento |
| [Aziende](./reference/aziende.md) | 5 | Lista, dettaglio, ricerca, creazione, aggiornamento |
| [Agenti](./reference/agenti.md) | 5 | Lista, dettaglio, ricerca, creazione, aggiornamento |
| [Gruppi](./reference/gruppi.md) | 4 | Lista, dettaglio, creazione, aggiornamento |
| [Campi](./reference/campi.md) | 8 | Ticket field, contact field, company field |
| [Risposte predefinite](./reference/risposte-predefinite.md) | 7 | Cartelle e canned response |
| [Knowledge base](./reference/soluzioni.md) | 13 | Categorie, cartelle, articoli + ricerca |
| **Totale** | **64** | + 2 [prompt](./reference/prompts.md) |

## Come è organizzata questa documentazione

- **[Installazione](./installazione.md)** - requisiti, installazione e avvio del server (stdio e HTTP).
- **[Configurazione](./configurazione.md)** - variabili d'ambiente, credenziali Freshdesk ed esempi di configurazione del client MCP.
- **[Reference dei tool](./reference/overview.md)** - ogni tool con parametri, esempio di chiamata e di risposta.
- **[Esempi](./esempi.md)** - flussi d'uso reali che combinano più tool.

:::note[Repository]
Il codice sorgente è su [github.com/devchristian1337/freshdesk-mcp](https://github.com/devchristian1337/freshdesk-mcp). Questa documentazione fa riferimento al repository GitHub: il pacchetto omonimo `freshdesk-mcp` pubblicato su PyPI non è gestito da questo progetto.
:::
