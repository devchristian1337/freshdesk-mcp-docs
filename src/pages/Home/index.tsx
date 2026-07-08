import type {ReactNode} from 'react';
import {Link} from 'react-router';
import clsx from 'clsx';
import Reveal from '../../components/Reveal';
import {usePageMeta} from '../../lib/usePageMeta';
import {site} from '../../site.config';
import styles from './index.module.css';

/* ------------------------------------------------------------------ Dati */

const FEATURES: {title: string; body: ReactNode}[] = [
  {
    title: '64 tool, naming coerente',
    body: (
      <>
        Ogni operazione ha un nome canonico con prefisso <code>freshdesk_*</code>. I
        vecchi nomi (come <code>get_ticket</code>) restano disponibili come alias
        deprecati: i client già configurati non si rompono.
      </>
    ),
  },
  {
    title: 'Multi-tenant via HTTP',
    body: (
      <>
        Un solo deploy serve più account Freshdesk: le credenziali arrivano
        per-richiesta via header <code>X-Freshdesk-*</code> o query string.
      </>
    ),
  },
  {
    title: 'Modalità read-only',
    body: (
      <>
        <code>FRESHDESK_TICKETS_READ_ONLY=true</code> blocca creazione, modifica ed
        eliminazione dei ticket. La lettura resta sempre consentita.
      </>
    ),
  },
  {
    title: 'Allegati context-safe',
    body: (
      <>
        <code>get_ticket_attachments</code> restituisce di default solo metadati e URL;
        il contenuto base64 si scarica on-demand, con cap di 1&nbsp;MB per file e
        5&nbsp;MB totali.
      </>
    ),
  },
  {
    title: 'Conversazioni complete',
    body: (
      <>
        <code>get_ticket_conversation</code> impagina automaticamente l&apos;intero
        thread: reply pubbliche e note interne, in un&apos;unica risposta.
      </>
    ),
  },
  {
    title: 'ToolAnnotations',
    body: (
      <>
        Ogni tool dichiara il proprio comportamento - read, write, update o delete -
        come hint per automazioni AI più prudenti.
      </>
    ),
  },
];

const USE_CASES: {title: string; body: ReactNode}[] = [
  {
    title: 'Assistenza clienti',
    body: (
      <>
        Recupera ticket, conversazioni e allegati prima di generare una risposta.
        L'assistente può leggere il contesto reale, proporre una reply e mantenere
        tracciabilità sulle operazioni eseguite.
      </>
    ),
  },
  {
    title: 'Operations interne',
    body: (
      <>
        Usa gruppi, agenti, aziende e contatti per collegare richieste, requester e
        team di supporto. Le operazioni di scrittura restano esplicite e separate
        dai tool di sola lettura.
      </>
    ),
  },
  {
    title: 'Knowledge base',
    body: (
      <>
        Cerca articoli esistenti, crea bozze strutturate e aggiorna contenuti
        ricorrenti. Il modello può riusare soluzioni già pubblicate invece di
        riscrivere ogni risposta da zero.
      </>
    ),
  },
];

/** Registro dei domini: conteggi reali, chip = tipi di operazione presenti. */
const REGISTRY: {
  label: string;
  count: number;
  to: string;
  ops: ('read' | 'write' | 'delete')[];
}[] = [
  {label: 'Ticket', count: 12, to: '/docs/reference/tickets', ops: ['read', 'write', 'delete']},
  {label: 'Conversazioni', count: 5, to: '/docs/reference/conversazioni', ops: ['read', 'write']},
  {label: 'Contatti', count: 5, to: '/docs/reference/contatti', ops: ['read', 'write']},
  {label: 'Aziende', count: 5, to: '/docs/reference/aziende', ops: ['read', 'write']},
  {label: 'Agenti', count: 5, to: '/docs/reference/agenti', ops: ['read', 'write']},
  {label: 'Gruppi', count: 4, to: '/docs/reference/gruppi', ops: ['read', 'write']},
  {label: 'Campi', count: 8, to: '/docs/reference/campi', ops: ['read', 'write']},
  {label: 'Risposte predefinite', count: 7, to: '/docs/reference/risposte-predefinite', ops: ['read', 'write']},
  {label: 'Knowledge base', count: 13, to: '/docs/reference/soluzioni', ops: ['read', 'write']},
];

/* ---------------------------------------------------------- Hand-off hero */

/**
 * L'elemento signature: la corsa di una richiesta reale attraverso il server.
 * Tre tappe - richiesta in italiano, tool invocato, risposta JSON - animate
 * in sequenza al load (solo CSS: con prefers-reduced-motion appaiono subito).
 */
function HandOff() {
  return (
    <div className={styles.console} aria-label="Esempio di richiesta gestita dal server">
      <div className={styles.consoleBar}>
        <span className={styles.consoleDot} />
        <span className={styles.consoleTitle}>freshdesk-mcp · sessione</span>
        <span className={styles.consoleStatus}>attivo</span>
      </div>

      <ol className={styles.rail}>
        <li className={clsx(styles.stage, styles.stage1)}>
          <span className={styles.stageLabel}>richiesta</span>
          <p className={styles.prompt}>
            «Mostrami il ticket <strong>#12345</strong> e tutta la sua conversazione»
          </p>
        </li>

        <li className={clsx(styles.stage, styles.stage2)}>
          <span className={styles.stageLabel}>tool</span>
          <p className={styles.toolCall}>
            <code className={styles.toolName}>freshdesk_get_ticket</code>
            <span className="fd-tag">read</span>
          </p>
          <pre className={styles.snippet}>
            <code>{'{ "ticket_id": 12345, "include": "conversations" }'}</code>
          </pre>
        </li>

        <li className={clsx(styles.stage, styles.stage3)}>
          <span className={styles.stageLabel}>risposta</span>
          <pre className={styles.snippet}>
            <code>
              {'{\n'}
              {'  "id": 12345,\n'}
              {'  "subject": "Errore in fase di login",\n'}
              {'  "status": 2,\n'}
              {'  "conversations": [ … ]\n'}
              {'}'}
            </code>
          </pre>
        </li>
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ Pagina */

export default function Home() {
  usePageMeta('64 tool per integrare Freshdesk con AI', site.tagline);

  return (
    <main className={styles.home} data-pagefind-body>
      {/* ------------------------------------------------------------ Hero */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className="fd-eyebrow">Server MCP · Freshdesk</p>
            <h1 className={styles.title}>
              Porta Freshdesk dentro il tuo assistente AI
            </h1>
            <p className={styles.subtitle}>
              <strong>freshdesk-mcp</strong> espone 64 tool e 2 prompt tramite Model
              Context Protocol: ticket, conversazioni, contatti, aziende, knowledge
              base e campi custom, leggibili e modificabili in linguaggio naturale.
            </p>
            <div className={styles.actions}>
              <Link className="btn btn--primary btn--lg" to="/docs/intro">
                Inizia
              </Link>
              <Link className="btn btn--ghost btn--lg" to="/docs/configurazione">
                Configura il client
              </Link>
            </div>
            <ul className={styles.metaRow}>
              <li>64 tool</li>
              <li>2 prompt</li>
              <li>stdio + HTTP</li>
              <li>Python ≥ 3.10</li>
            </ul>
          </div>
          <div className={styles.heroVisual}>
            <HandOff />
          </div>
        </div>
      </header>

      {/* ------------------------------------------------- Registro dei tool */}
      <section className={styles.section}>
        <Reveal className={styles.sectionHead}>
          <p className="fd-eyebrow">Registro</p>
          <h2 className={styles.sectionTitle}>64 tool, organizzati per dominio</h2>
        </Reveal>
        <Reveal delay={60}>
          <div className={styles.registry}>
            {REGISTRY.map((row) => (
              <Link key={row.label} className={styles.registryRow} to={row.to}>
                <span className={styles.registryCount}>{row.count}</span>
                <span className={styles.registryLabel}>{row.label}</span>
                <span className={styles.registryOps}>
                  {row.ops.map((op) => (
                    <span
                      key={op}
                      className={clsx(
                        'fd-tag',
                        op === 'write' && 'fd-tag--write',
                        op === 'delete' && 'fd-tag--delete',
                      )}>
                      {op}
                    </span>
                  ))}
                </span>
                <span className={styles.registryArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
            <Link className={clsx(styles.registryRow, styles.registryTotal)} to="/docs/reference/prompts">
              <span className={styles.registryCount}>+2</span>
              <span className={styles.registryLabel}>
                Prompt guidati <code>create_ticket</code> e <code>create_reply</code>
              </span>
              <span className={styles.registryArrow} aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------ Cosa offre */}
      <section className={clsx(styles.section, styles.sectionAlt)}>
        <Reveal className={styles.sectionHead}>
          <p className="fd-eyebrow">Cosa offre</p>
          <h2 className={styles.sectionTitle}>
            Una superficie completa sull&apos;API di Freshdesk
          </h2>
        </Reveal>
        <div className={styles.featureGrid}>
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 50} className={styles.featureCard}>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureBody}>{f.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- Casi d'uso */}
      <section className={styles.section}>
        <Reveal className={styles.sectionHead}>
          <p className="fd-eyebrow">Quando usarlo</p>
          <h2 className={styles.sectionTitle}>
            Un layer MCP per workflow Freshdesk assistiti dall&apos;AI
          </h2>
        </Reveal>
        <div className={styles.featureGrid}>
          {USE_CASES.map((f, i) => (
            <Reveal key={f.title} delay={i * 50} className={styles.featureCard}>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureBody}>{f.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- Modalita */}
      <section className={styles.section}>
        <Reveal className={styles.sectionHead}>
          <p className="fd-eyebrow">Come si collega</p>
          <h2 className={styles.sectionTitle}>Due modi di eseguirlo</h2>
        </Reveal>
        <div className={styles.modeGrid}>
          <Reveal className={styles.modeCard}>
            <p className={styles.modeTag}>Locale · stdio</p>
            <p className={styles.modeText}>
              Il client avvia il server in locale (Claude Desktop, Cursor, Windsurf).
              Le credenziali stanno nelle variabili d&apos;ambiente.
            </p>
            <pre className={styles.modeCode}>
              <code>
                <span className={styles.promptSign}>$</span> freshdesk-mcp
              </code>
            </pre>
            <Link className={styles.modeLink} to="/docs/configurazione">
              Vedi la configurazione →
            </Link>
          </Reveal>
          <Reveal className={styles.modeCard} delay={70}>
            <p className={styles.modeTag}>Remoto · HTTP</p>
            <p className={styles.modeText}>
              Un deploy (Docker / Railway) servito su <code>/mcp</code>, con health
              check su <code>/health</code>. Le credenziali viaggiano per-richiesta
              via header.
            </p>
            <pre className={styles.modeCode}>
              <code>
                <span className={styles.promptSign}>$</span> MCP_TRANSPORT=http
                freshdesk-mcp
              </code>
            </pre>
            <Link className={styles.modeLink} to="/docs/installazione">
              Vedi l&apos;installazione →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- CTA */}
      <section className={styles.ctaBand}>
        <Reveal className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Pronto a iniziare?</h2>
          <p className={styles.ctaText}>
            Requisiti minimi, una API key Freshdesk e un client MCP. Bastano pochi
            minuti.
          </p>
          <div className={styles.actions}>
            <Link className="btn btn--primary btn--lg" to="/docs/installazione">
              Installa il server
            </Link>
            <a
              className={clsx('btn', 'btn--ghost', 'btn--lg', styles.ctaGhost)}
              href={site.repoUrl}
              target="_blank"
              rel="noopener noreferrer">
              Codice su GitHub
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
