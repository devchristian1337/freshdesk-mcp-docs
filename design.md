# Design — Freshdesk MCP

Sistema di design bloccato per questo sito. Ogni redesign di pagina legge
questo file prima di emettere codice. Non rigenerarlo per pagina: quando il
sistema deve crescere, si estende o si emenda **qui**.

La tesi del sistema è **"console operativa"**: il sito è la superficie di
lettura di un server MCP, non una brochure. Carta tecnica, inchiostro blu,
un solo colore interattivo, e il colore semantico usato **solo** per portare
informazione — mai per decorare.

---

## Genre

`modern-minimal` — dev tool + API reference.

Override di genere attivi (da `slop-test.md`): è ammessa la carta bianca pura
(`--fd-surface: #ffffff`) e sono ammessi neutri a croma bassa. Tutto il resto
dei gate vale pieno.

---

## Macrostructure family

- **Marketing** — `11 · Catalogue`. Una sola pagina (`/` ×5 lingue).
  Testata corta senza display type, poi una superficie d'inventario continua
  divisa da bande-etichetta. Knob di variazione: numero di bande, contenuto
  della colonna nota.
- **Content** — `02 · Long Document`. 75 pagine docs + 404.
  Due varianti: *guida* (prosa continua) e *reference* (`data-kind="reference"`,
  ritmo più stretto sui blocchi-tool). Knob: densità del ritmo verticale.
- **App** — nessuna. Questo sito non ha superficie applicativa. Se un giorno
  ne avrà una, va aggiunta qui prima di costruirla.

### Archetipi

| Ruolo | Scelta | Note |
|---|---|---|
| Nav | `N5 Floating pill` (variante bottom-anchored) | il dock. Unico su tutto il sito |
| Section head | `S2 Hanging` | titolo sopra il contenuto, colonna singola, nessuna regola |
| Feature block | `F3 Tabular spec sheet` | la superficie catalogo della home |
| Footer marketing | `Ft2 Inline` | una riga: copyright + due link |
| Footer content | `Ft3 Index columns` | tre colonne, ammesso perché è una root docs vera |

**Vietati su questo sito**: `S1 Left-margin numbered` (gate 54 — tag a sinistra
e titolo a destra), card-in-card, chrome ridisegnato di browser/finestra/IDE.

---

## Theme

Palette autoriale, **non** un tema di catalogo. I valori vivono in
[`src/styles/tokens.css`](src/styles/tokens.css); qui sono annotati in OKLCH
per la portabilità.

### Light

| Token | hex | OKLCH |
|---|---|---|
| `--fd-paper` | `#f6f7f4` | `oklch(97.5% 0.004 121.6)` |
| `--fd-surface` | `#ffffff` | `oklch(100% 0 0)` |
| `--fd-sunken` | `#eef0eb` | `oklch(95.2% 0.007 124.4)` |
| `--fd-ink` | `#17222b` | `oklch(24.6% 0.023 243.6)` |
| `--fd-ink-2` | `#51616d` | `oklch(48.4% 0.028 240.6)` |
| `--fd-ink-3` | `#5c6b75` | `oklch(51.9% 0.024 237.2)` |
| `--fd-line` | `#dce1dd` | `oklch(90.5% 0.008 151.9)` |
| `--fd-line-strong` | `#c3ccc5` | `oklch(83.6% 0.014 152.6)` |
| `--fd-primary` | `#0e7c46` | `oklch(51.7% 0.125 154.5)` |
| `--fd-primary-strong` | `#0a5c34` | `oklch(41.9% 0.099 155.2)` |
| `--fd-primary-tint` | `#e2f0e7` | `oklch(94.2% 0.019 157.9)` |

### Dark

| Token | hex | OKLCH |
|---|---|---|
| `--fd-paper` | `#10161c` | `oklch(19.7% 0.015 248.6)` |
| `--fd-surface` | `#18212a` | `oklch(24.3% 0.022 248.7)` |
| `--fd-sunken` | `#0b1015` | `oklch(17.0% 0.013 248.6)` |
| `--fd-ink` | `#e8ece9` | `oklch(93.9% 0.006 153.8)` |
| `--fd-ink-2` | `#98a6b0` | `oklch(71.7% 0.022 238.8)` |
| `--fd-line` | `#29343e` | `oklch(31.9% 0.023 246.0)` |
| `--fd-primary` | `#35c77b` | `oklch(73.6% 0.164 155.3)` |

### Semantici — solo informazione, mai decorazione

Rispecchiano le `ToolAnnotations` del server. Il colore **è** il dato.

| Token | light | dark | Significato |
|---|---|---|---|
| `--fd-read` | `oklch(50.9% 0.105 235.2)` | `oklch(69.2% 0.106 229.1)` | lettura |
| `--fd-write` | `oklch(52.1% 0.139 49.4)` | `oklch(72.3% 0.137 64.2)` | scrittura |
| `--fd-delete` | `oklch(50.1% 0.178 28.7)` | `oklch(65.6% 0.156 26.4)` | eliminazione |

### Chiusura di pagina — elevazione, non colore

**Regola: la chiusura non ha un colore proprio, ha una quota.** Nessun fondo
scuro fisso, nessun fondo in tinta. Il gradino è identico nei due temi:

| Superficie | Token | Light | Dark |
|---|---|---|---|
| Corpo pagina | `--fd-paper` | 97.5% | 19.7% |
| CTA di chiusura (solo home) | `--fd-surface` | 100% — rialzata | 24.3% — rialzata |
| Footer (tutte le pagine) | `--fd-sunken` | 95.2% — incassato | 17.0% — incassato |

Perché non un fondo colorato: un blocco nero in tema chiaro è uno slab piombato
in fondo a una pagina di carta, e una banda in tinta piena diventa invadente in
tema scuro, dove la stessa tinta pesa molto di più. L'elevazione dice la stessa
cosa — *questa è la fine della pagina* — senza dipendere dal tema.

Il verde resta **solo sul bottone primario**: nell'intera chiusura è l'unica
cosa colorata, ed è esattamente la cosa su cui si deve cliccare.

### Disciplina dell'accento

Il verde interattivo sta **sotto il 5% di area per viewport**. Se una schermata
ne ha di più, è la schermata a essere sbagliata. Il verde significa una cosa
sola: *puoi agire qui*. Non è mai fondale, mai titolo pieno, mai bordo
decorativo.

---

## Typography

- **Display**: `--fd-font-display` — peso 700, `font-style: normal`
- **Body**: `--fd-font-body` — peso 400
- **Mono**: `--fd-font-mono` — peso 600 sulle etichette

**Il vero accoppiamento di questo sito è sans + mono, non due sans.** Display e
body sono due tagli ottici della stessa superfamiglia e fuori da Windows
ricadono entrambi su `system-ui`: su quelle piattaforme i titoli non hanno una
faccia propria. La seconda voce reale è quindi il **mono**, e porta tutto ciò
che è identificatore o etichetta:

- eyebrow di sezione e bande-etichetta
- chip `read` / `write` / `delete`
- `th` delle tabelle
- H2 delle pagine reference (sono nomi di tool: identificatori)
- conteggi del registro e riga meta

Chi tocca il sito deve rispettare questo contratto: **testo corrente = sans,
identificatore = mono.** È la distinzione che regge la tipografia qui.

Token di distinzione display, da usare invece di improvvisare caso per caso:
`--fd-display-weight` · `--fd-display-weight-strong` · `--fd-display-tracking`
· `--fd-display-tracking-tight` · `--fd-display-leading` · `--fd-label-tracking`.

**Titoli sempre romani.** Nessun corsivo sulla faccia, nessuna parola isolata in
corsivo dentro un titolo dritto. L'enfasi la portano peso e colore d'accento.

**Misura.** Testo corrente vincolato a 68 ch (`p`, `li`). Tabelle, blocchi di
codice e immagini restano a piena larghezza di colonna: la misura si applica
alla prosa, non al contenitore.

---

## Spacing

Scala 4 pt, nominata, in `tokens.css`. Le pagine usano **solo** token.

`--fd-space-3xs` 4 · `2xs` 8 · `xs` 12 · `sm` 16 · `md` 20 (gutter standard)
· `lg` 24 · `xl` 32 · `2xl` 48 · `3xl` 64 · `4xl` 96

Il ritmo verticale non è uniforme: le superfici dense stanno strette, la
chiusura respira.

---

## Motion

- Easing: `--fd-ease-out` `cubic-bezier(0.22, 1, 0.36, 1)` · `--fd-ease-in` ·
  `--fd-ease-in-out`. **Mai** l'`ease` di default del browser.
- Durate: `--fd-dur-instant` 120ms · `--fd-dur-short` 180ms · `--fd-dur-med`
  240ms · `--fd-dur-long` 600ms.
- **Una sola entrata orchestrata per pagina.** Non una per sezione.
- Reduced-motion: opacità sola, e le animazioni infinite si fermano.
- Si animano `transform` e `opacity`. Mai proprietà di layout.

---

## Microinteractions

- **Un solo segnale di hover per elemento.** Bordo *oppure* tint di riga
  *oppure* colore. Mai due, mai tre. Il `translateY` sopravvive solo su
  `:active`, dov'è risposta alla pressione e non decorazione.
- Successo silenzioso. Nessun toast celebrativo.
- Tooltip: 800 ms su hover, 0 ms su focus.
- **Il focus ring non si anima mai.** Appare istantaneo.
- Nessuna animazione infinita sopra la piega.

---

## CTA voice

- **Primario** `.btn--primary`: pieno verde, `--fd-radius-sm`, peso 600,
  `white-space: nowrap`. Copy: verbo + oggetto (*"Installa il server"*), mai
  *"Scopri di più"*.
- **Secondario** `.btn--ghost`: bordo `--fd-line-strong`, fondo trasparente.
- Un'etichetta cliccabile **non va mai a capo**. Se non ci sta, si accorcia il
  testo — non si manda a capo.
- Stati obbligatori su ogni controllo: default · hover · `:focus-visible` ·
  `:active` · `:disabled` · `[aria-busy]`.

---

## Per-page allowances

- **Marketing**: può usare enrichment fino a Tier B (CSS art / SVG a mano).
  Nessun mockup fotografico inventato.
- **Content**: sola tipografia. Nessun enrichment.
- **Ovunque**: vietato il chrome ridisegnato (finte barre browser, finti
  telefoni, finte finestre di codice con i pallini). Una figura di codice si
  incornicia con una regola + etichetta mono, non con una finta title bar.

---

## Cosa le pagine DEVONO condividere

- Il wordmark `freshdesk-mcp` in mono.
- Il verde come unico colore interattivo, sotto il 5% di area.
- Il contratto sans/mono descritto sopra.
- La voce dei CTA (forma, raggio, ritmo del padding).
- Il dock come unica navigazione.
- Il vocabolario dei chip semantici `.fd-tag` — **i nomi delle classi sono un
  contratto con i file in `docs/` e non vanno rinominati.**

## Cosa le pagine POSSONO variare

- La macrostruttura dentro la famiglia del proprio tipo.
- La densità del ritmo verticale.
- Il footer: `Ft2` in marketing, `Ft3` nelle docs.

---

## Vincoli responsive — pavimento, non lista dei desideri

Verificato a 320 / 375 / 414 / 768 px a ogni emissione.

- `overflow-x: clip` su `html` **e** `body`. Mai `hidden`.
- Nessun testo cliccabile su due righe.
- Le tracce di griglia usano `minmax(0, 1fr)`, mai `1fr` nudo.
- I titoli display hanno `overflow-wrap: anywhere; min-width: 0`.
- Le testate di sezione collassano a una colonna.

---

## Exports

### tokens.css

Il file autoritativo è [`src/styles/tokens.css`](src/styles/tokens.css) in hex —
è quello che il sito carica. Il blocco qui sotto è la versione OKLCH portabile.

```css
:root {
  --color-paper:      oklch(97.5% 0.004 121.6);
  --color-paper-2:    oklch(95.2% 0.007 124.4);
  --color-surface:    oklch(100% 0 0);
  --color-ink:        oklch(24.6% 0.023 243.6);
  --color-ink-2:      oklch(48.4% 0.028 240.6);
  --color-rule:       oklch(90.5% 0.008 151.9);
  --color-accent:     oklch(51.7% 0.125 154.5);
  --color-accent-ink: oklch(100% 0 0);
  --color-focus:      oklch(51.7% 0.125 154.5);

  --color-read:       oklch(50.9% 0.105 235.2);
  --color-write:      oklch(52.1% 0.139 49.4);
  --color-delete:     oklch(50.1% 0.178 28.7);

  --font-display: 'Segoe UI Variable Display', 'Segoe UI', system-ui, sans-serif;
  --font-body:    'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif;
  --font-outlier: ui-monospace, 'Cascadia Code', Consolas, monospace;

  --space-3xs: 0.25rem; --space-2xs: 0.5rem;  --space-xs:  0.75rem;
  --space-sm:  1rem;    --space-md:  1.25rem; --space-lg:  1.5rem;
  --space-xl:  2rem;    --space-2xl: 3rem;    --space-3xl: 4rem;
  --space-4xl: 6rem;

  --ease-out:    cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in:     cubic-bezier(0.64, 0, 0.78, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-instant: 120ms; --dur-short: 180ms;
  --dur-med:     240ms; --dur-long:  600ms;

  --radius-card: 8px; --radius-input: 6px; --radius-pill: 999px;
}
```

### Tailwind v4 `@theme`

```css
@theme {
  --color-paper:   oklch(97.5% 0.004 121.6);
  --color-ink:     oklch(24.6% 0.023 243.6);
  --color-accent:  oklch(51.7% 0.125 154.5);
  --color-read:    oklch(50.9% 0.105 235.2);
  --color-write:   oklch(52.1% 0.139 49.4);
  --color-delete:  oklch(50.1% 0.178 28.7);
  --font-display:  'Segoe UI Variable Display', system-ui, sans-serif;
  --font-body:     'Segoe UI Variable Text', system-ui, sans-serif;
  --font-mono:     ui-monospace, 'Cascadia Code', monospace;
  --spacing-md:    1.25rem;
  --ease-out:      cubic-bezier(0.22, 1, 0.36, 1);
}
```

### DTCG `tokens.json`

```json
{
  "color": {
    "paper":  { "$value": "oklch(97.5% 0.004 121.6)", "$type": "color" },
    "ink":    { "$value": "oklch(24.6% 0.023 243.6)", "$type": "color" },
    "accent": { "$value": "oklch(51.7% 0.125 154.5)", "$type": "color" },
    "read":   { "$value": "oklch(50.9% 0.105 235.2)", "$type": "color" },
    "write":  { "$value": "oklch(52.1% 0.139 49.4)",  "$type": "color" },
    "delete": { "$value": "oklch(50.1% 0.178 28.7)",  "$type": "color" }
  },
  "font": {
    "display": { "$value": "Segoe UI Variable Display", "$type": "fontFamily" },
    "body":    { "$value": "Segoe UI Variable Text",    "$type": "fontFamily" },
    "mono":    { "$value": "ui-monospace",              "$type": "fontFamily" }
  },
  "space": {
    "md": { "$value": "1.25rem", "$type": "dimension" },
    "xl": { "$value": "2rem",    "$type": "dimension" }
  }
}
```

### shadcn/ui CSS variables

```css
:root {
  --background:         97.5% 0.004 121.6;
  --foreground:         24.6% 0.023 243.6;
  --primary:            51.7% 0.125 154.5;
  --primary-foreground: 100%  0     0;
  --muted:              95.2% 0.007 124.4;
  --muted-foreground:   48.4% 0.028 240.6;
  --border:             90.5% 0.008 151.9;
  --input:              90.5% 0.008 151.9;
  --ring:               51.7% 0.125 154.5;
  --radius:             8px;
}
```
