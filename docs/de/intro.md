---
id: intro
title: Introduzione a Freshdesk MCP
description: "Panoramica di Freshdesk MCP: cosa fa il server, quali API Freshdesk espone e come usarlo con assistenti AI compatibili MCP."
slug: /intro
---
# Freshdesk MCP

**Freshdesk MCP** ist ein [Model Context Protocol](https://modelcontextprotocol.io/)-Server, der ein [Freshdesk](https://www.freshdesk.com/)-Konto mit jedem MCP-kompatiblen KI-Modell oder Client verbindet. Es stellt die Freshdesk-API als eine Reihe von **Tools** und **Eingabeaufforderungen** bereit, die in natürlicher Sprache aufgerufen werden können: Der Assistent kann somit Tickets, Konversationen, Kontakte, Unternehmen, Wissensdatenbanken und benutzerdefinierte Felder lesen und verwalten.

Der Server ist in Python (FastMCP) mit modularer Architektur („core“ / „services“ / „schemas“ / „tools“) und einem gemeinsamen HTTP-Client mit Ratenlimitverwaltung geschrieben.

## Wofür ist es?

Sobald der Server verbunden ist, können Sie den Assistenten fragen wie:

- „Zeigen Sie mir Ticket Nr. 12345 und die gesamte Konversation“
- „Nach offenen und dringenden Tickets suchen und diese der Support-Gruppe zuweisen“
- „Finden Sie die Acme-Firma und erstellen Sie einen Kontakt für mario.rossi@acme.it“
- „Fügen Sie eine private Notiz mit den Analyseergebnissen zu Ticket Nr. 12345 hinzu“
- „Erstellen Sie einen Wissensdatenbankartikel zum Zurücksetzen Ihres Passworts“

Das Modell wählt automatisch das richtige Werkzeug aus und stellt seine Parameter zusammen.

## Funktionsübersicht

- **124 vom MCP-Server bereitgestellte Tools**: 64 kanonische „freshdesk_*“-Namen und 60 Legacy-Aliase veraltet. Die Aliase sind 59 Handlern zugeordnet; „freshdesk_search_companies“ enthüllt zwei davon.
- **2 geführte Eingabeaufforderungen** („create_ticket“, „create_reply“), um das Modell beim Zusammenstellen von Nutzlasten zu unterstützen.
- **ToolAnnotations** zu jedem Tool (Lesen/Schreiben/Aktualisieren/Löschen): Verhaltenshinweise für sicherere Automatisierungen.
- **Multi-Tenant über HTTP**: Eine einzelne Bereitstellung kann mehrere Freshdesk-Konten bedienen, wobei die Anmeldeinformationen pro Anfrage bereitgestellt werden.
- **Authentifizierung über Header** („X-Freshdesk-Domain“ / „X-Freshdesk-Api-Key“) wird der Abfragezeichenfolge vorgezogen.
- **Schreibgeschützter** Modus für Tickets über „FRESHDESK_TICKETS_READ_ONLY“.
- **Kontextsichere Anhänge**: Metadaten werden standardmäßig zurückgegeben, Base64-Inhalte nur auf Anfrage (standardmäßig 1 MiB pro Datei und 5 MiB insgesamt).
- **Automatische Paginierung** des Konversationsthreads, bis zu 50 Seiten mit 100 Nachrichten.

## Die Tools, nach Domäne

| Formular | Nr. Werkzeuge | Was es abdeckt |
|---|---|---|
| [Ticket](./reference/tickets.md) | 12 | Liste, Suche, Detail, CRUD, Zusammenfassung, Ticketfeld |
| [Gespräche](./reference/conversations.md) | 5 | Thread, Antwort, Notizen, Aktualisierung, Anhänge |
| [Kontakte](./reference/contacts.md) | 5 | Auflisten, Detail, Suche, Erstellung, Aktualisierung |
| [Unternehmen](./reference/companies.md) | 5 | Auflisten, Detail, Suche, Erstellung, Aktualisierung |
| [Agenten](./reference/agenti.md) | 5 | Auflisten, Detail, Suche, Erstellung, Aktualisierung |
| [Gruppen](./reference/groups.md) | 4 | Liste, Detail, Erstellung, Aktualisierung |
| [Felder](./reference/fields.md) | 8 | Ticketfeld, Kontaktfeld, Firmenfeld |
| [Vorgefertigte Antworten](./reference/canned-responses.md) | 7 | Ordner und vorgefertigte Antworten |
| [Wissensdatenbank](./reference/solutions.md) | 13 | Kategorien, Ordner, Artikel + Suche |
| **Gesamt** | **64** | + 2 [Eingabeaufforderung](./reference/prompts.md) |

## Wie diese Dokumentation organisiert ist
- **[Installation](./installation.md)** – Serveranforderungen, Installation und Start (stdio und HTTP).
- **[Konfiguration](./configuration.md)** – Umgebungsvariablen, Freshdesk-Anmeldeinformationen und MCP-Client-Konfigurationsbeispiele.
- **[Tool-Referenz](./reference/overview.md)** – jedes Tool mit Parametern, Beispielaufruf und Antwort.
- **[Beispiele](./examples.md)** – echte Nutzungsabläufe, die mehrere Tools kombinieren.

:::note[Repository]
Der Quellcode befindet sich unter [github.com/devchristian1337/freshdesk-mcp](https://github.com/devchristian1337/freshdesk-mcp). Diese Dokumentation bezieht sich auf das GitHub-Repository: Das auf PyPI veröffentlichte gleichnamige Paket „freshdesk-mcp“ wird von diesem Projekt nicht verwaltet.
:::
