---
id: overview
title: Reference dei tool MCP
description: "Convenzioni della reference Freshdesk MCP: naming dei tool, alias, ToolAnnotations, risposte, errori, paginazione e parametri."
sidebar_label: Panoramica
---
# Werkzeugreferenzen

In diesem Abschnitt wird die tatsächliche Ausgabe der „list_tools“ und „list_prompts“ des Servers dokumentiert: **124 Tools** (64 kanonische und 60 Legacy-Aliase) und **2 Eingabeaufforderungen**, gruppiert nach Domäne. Bevor man sich mit den einzelnen Tools auseinandersetzt, lohnt es sich, die gängigen Konventionen zu kennen.

## Benennung und Aliase

Jeder Handler hat einen **kanonischen Namen** mit dem Präfix „freshdesk_*“ (z. B. „freshdesk_get_ticket“). Aus Gründen der Abwärtskompatibilität mit bereits konfigurierten Clients stellen 59-Handler einen oder mehrere Legacy-Namen als **veraltete Aliase** bereit (z. B. „get_ticket“); Das sind insgesamt 60 Legacy-Namen, da „freshdesk_search_companies“ sowohl „search_companies“ als auch „find_company_by_name“ verfügbar macht. Aliase funktionieren identisch, ihre Beschreibung empfiehlt Ihnen jedoch die Verwendung des kanonischen Namens.

Auf den folgenden Seiten werden für jedes Werkzeug der kanonische Name und etwaige Aliase angegeben.

## ToolAnnotations

Jedes Tool deklariert Anmerkungen, d. h. Hinweise auf sein Verhalten (es handelt sich um Vorschläge für Kunden, nicht um Sicherheitsgarantien). Da es sich immer um einen externen Dienst handelt, haben alle Tools „openWorldHint = true“.

| Abzeichen | Bedeutung | Hinweis |
|---|---|---|
| <span className="fd-tag">lesen</span> | Nur lesen | `readOnlyHint: true`, `idempotentHint: true` |
| <span className="fd-tag fd-tag--write">write</span> | Schöpfung (nicht idempotent) | `idempotentHint: false` |
| <span className="fd-tag fd-tag--write">aktualisieren</span> | Update (idempotent) | `idempotentHint: true` |
| <span className="fd-tag fd-tag--delete">löschen</span> | Zerstörerischer Betrieb | `destructiveHint: true` |

Die Tools zum **Schreiben/Löschen von Tickets** berücksichtigen auch den [schreibgeschützten Modus](../configurazione.md#read-only-mode). Die Sperre hat keine Auswirkungen auf Schreibvorgänge auf andere Freshdesk-Ressourcen.

## Antwortformat

Die Tools geben JSON-Daten zurück. Die wiederkehrenden Formen sind:

**Paging-Liste** – `list_*`/`get_*`-Tools mit Paginierung geben die Ressource plus einen `pagination`-Block zurück:
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
**Einzelne Ressource** – die `view_*`/`get_*` by ID-Tools geben das Freshdesk-Objekt (ein Diktat) direkt oder eine Rohliste für Endpunkte zurück, die es erwarten (z. B. `freshdesk_get_ticket_fields`).

**Ticketerstellung/-aktualisierung** – Ticket-Tools fassen das Ergebnis zusammen:
```json
{ "success": true, "message": "Ticket creato", "ticket": { "id": 1234 } }
```
## Fehlerformat

Im Falle eines Problems gibt das Tool ein Diktat mit der Taste „error“ (und, sofern verfügbar, „status_code“ und „details“) zurück, anstatt eine Ausnahme auszulösen:
```json
{
  "error": "Descrizione dell'errore",
  "status_code": 404,
  "details": { "errors": [ { "field": "...", "message": "..." } ] }
}
```
Häufige clientseitige Validierungsfehler (vor dem Aufruf der API):

- „Seitenzahl muss >= 1 sein.“`
- „per_page muss zwischen 1 und 100 liegen.“
- „freshdesk_domain muss ein *.freshdesk.com-Host sein““.
- „freshdesk_api_key ist erforderlich“.

## Paginierung

Seitenlisten-Tools akzeptieren „page“ (≥ 1) und „per_page“ (1–100, Standard 30). Der „Paginierung“-Block wird aus dem von Freshdesk zurückgegebenen „Link“-HTTP-Header rekonstruiert: „next_page“/„prev_page“ sind „null“, wenn es keine nächste/vorherige Seite gibt. Die Ticketsuche verwendet nur den Parameter „Seite“ und akzeptiert die Seiten 1–10; Der Konversationsthread folgt den Seiten automatisch bis zu einem defensiven Maximum von 50 Seiten mit 100 Nachrichten.

## So lesen Sie Parametertabellen

Für jedes Tool finden Sie eine Tabelle mit: **Name** des Parameters, **Typ**, falls er **obligatorisch** ist, und einem beliebigen **Standard**. Als Objekte typisierte Parameter (z. B. „Ticket“, „Kontakt“, „Gruppe“) entsprechen einem strukturierten Schema, dessen Felder unterhalb der Tabelle aufgeführt sind.
