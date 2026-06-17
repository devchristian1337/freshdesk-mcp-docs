import React, {type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Reveal from '@site/src/components/Reveal';
import styles from './index.module.css';

const FEATURES: {title: string; body: ReactNode; wide?: boolean}[] = [
  {
    title: '64 tool, naming coerente',
    wide: true,
    body: (
      <>
        Ogni operazione ha un nome canonico con prefisso <code>freshdesk_*</code>. I
        vecchi nomi (come <code>get_ticket</code> o <code>find_company_by_name</code>)
        restano disponibili come alias deprecati, così i client già configurati non si
        rompono.
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
        Ogni tool dichiara il proprio comportamento — read, write, update o delete —
        come hint per automazioni AI più prudenti.
      </>
    ),
  },
];

const CATEGORIES: {label: string; count: number; to: string}[] = [
  {label: 'Ticket', count: 12, to: '/docs/reference/tickets'},
  {label: 'Conversazioni', count: 5, to: '/docs/reference/conversazioni'},
  {label: 'Contatti', count: 5, to: '/docs/reference/contatti'},
  {label: 'Aziende', count: 5, to: '/docs/reference/aziende'},
  {label: 'Agenti', count: 5, to: '/docs/reference/agenti'},
  {label: 'Gruppi', count: 4, to: '/docs/reference/gruppi'},
  {label: 'Campi', count: 8, to: '/docs/reference/campi'},
  {label: 'Risposte predefinite', count: 7, to: '/docs/reference/risposte-predefinite'},
  {label: 'Knowledge base', count: 13, to: '/docs/reference/soluzioni'},
];

function ConfigWindow(): JSX.Element {
  return (
    <div className={styles.window} aria-hidden="true">
      <div className={styles.windowBar}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.windowTitle}>claude_desktop_config.json</span>
      </div>
      <pre className={styles.code}>
        <code>
          <span className={styles.p}>{'{'}</span>
          {'\n  '}
          <span className={styles.k}>&quot;mcpServers&quot;</span>
          <span className={styles.p}>: {'{'}</span>
          {'\n    '}
          <span className={styles.k}>&quot;freshdesk-mcp&quot;</span>
          <span className={styles.p}>: {'{'}</span>
          {'\n      '}
          <span className={styles.k}>&quot;command&quot;</span>
          <span className={styles.p}>: </span>
          <span className={styles.s}>&quot;uvx&quot;</span>
          <span className={styles.p}>,</span>
          {'\n      '}
          <span className={styles.k}>&quot;args&quot;</span>
          <span className={styles.p}>: [</span>
          <span className={styles.s}>&quot;freshdesk-mcp&quot;</span>
          <span className={styles.p}>],</span>
          {'\n      '}
          <span className={styles.k}>&quot;env&quot;</span>
          <span className={styles.p}>: {'{'}</span>
          {'\n        '}
          <span className={styles.k}>&quot;FRESHDESK_DOMAIN&quot;</span>
          <span className={styles.p}>: </span>
          <span className={styles.s}>&quot;tuazienda.freshdesk.com&quot;</span>
          <span className={styles.p}>,</span>
          {'\n        '}
          <span className={styles.k}>&quot;FRESHDESK_API_KEY&quot;</span>
          <span className={styles.p}>: </span>
          <span className={styles.s}>&quot;la_tua_api_key&quot;</span>
          {'\n      '}
          <span className={styles.p}>{'}'}</span>
          {'\n    '}
          <span className={styles.p}>{'}'}</span>
          {'\n  '}
          <span className={styles.p}>{'}'}</span>
          {'\n'}
          <span className={styles.p}>{'}'}</span>
        </code>
      </pre>
    </div>
  );
}

function Hero(): JSX.Element {
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Server MCP · Freshdesk</span>
          <h1 className={styles.title}>
            Porta Freshdesk dentro
            <br />
            il tuo assistente AI
          </h1>
          <p className={styles.subtitle}>
            <strong>freshdesk-mcp</strong> espone 64 tool e 2 prompt tramite Model
            Context Protocol: ticket, conversazioni, contatti, aziende, knowledge base
            e campi custom, leggibili e modificabili in linguaggio naturale.
          </p>
          <div className={styles.actions}>
            <Link className="button button--primary button--lg" to="/docs/intro">
              Inizia
            </Link>
            <Link className="button button--outline button--lg" to="/docs/configurazione">
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
        <Reveal className={styles.heroVisual} delay={120}>
          <ConfigWindow />
        </Reveal>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title="Documentazione" description={siteConfig.tagline}>
      <main>
        <Hero />

        <section className={styles.section}>
          <Reveal className={styles.sectionHead}>
            <span className={styles.kicker}>Cosa offre</span>
            <h2 className={styles.sectionTitle}>
              Una superficie completa sull&apos;API di Freshdesk
            </h2>
          </Reveal>
          <div className={styles.featureGrid}>
            {FEATURES.map((f, i) => (
              <Reveal
                key={f.title}
                delay={i * 60}
                className={`${styles.featureCard} ${f.wide ? styles.featureWide : ''}`}>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureBody}>{f.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <Reveal className={styles.sectionHead}>
            <span className={styles.kicker}>Come si collega</span>
            <h2 className={styles.sectionTitle}>Due modi di eseguirlo</h2>
          </Reveal>
          <div className={styles.modeGrid}>
            <Reveal className={styles.modeCard}>
              <div className={styles.modeTag}>Locale · stdio</div>
              <p className={styles.modeText}>
                Il client avvia il server in locale (Claude Desktop, Cursor, Windsurf).
                Le credenziali stanno nelle variabili d&apos;ambiente.
              </p>
              <pre className={styles.modeCode}>
                <code>uvx freshdesk-mcp</code>
              </pre>
              <Link className={styles.modeLink} to="/docs/configurazione">
                Vedi la configurazione →
              </Link>
            </Reveal>
            <Reveal className={styles.modeCard} delay={80}>
              <div className={styles.modeTag}>Remoto · HTTP</div>
              <p className={styles.modeText}>
                Un deploy (Docker / Railway) servito su <code>/mcp</code>, con health
                check su <code>/health</code>. Le credenziali viaggiano per-richiesta via
                header.
              </p>
              <pre className={styles.modeCode}>
                <code>MCP_TRANSPORT=http freshdesk-mcp</code>
              </pre>
              <Link className={styles.modeLink} to="/docs/installazione">
                Vedi l&apos;installazione →
              </Link>
            </Reveal>
          </div>
        </section>

        <section className={styles.section}>
          <Reveal className={styles.sectionHead}>
            <span className={styles.kicker}>Reference</span>
            <h2 className={styles.sectionTitle}>64 tool, organizzati per dominio</h2>
          </Reveal>
          <div className={styles.catGrid}>
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.label} delay={i * 40}>
                <Link className={styles.catCard} to={c.to}>
                  <span className={styles.catCount}>{c.count}</span>
                  <span className={styles.catLabel}>{c.label}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <section className={styles.ctaBand}>
          <Reveal className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Pronto a iniziare?</h2>
            <p className={styles.ctaText}>
              Requisiti minimi, una API key Freshdesk e un client MCP. Bastano pochi
              minuti.
            </p>
            <div className={styles.actions}>
              <Link
                className="button button--primary button--lg"
                to="/docs/installazione">
                Installa il server
              </Link>
              <Link
                className="button button--outline button--lg"
                href="https://github.com/devchristian1337/freshdesk-mcp">
                Codice su GitHub
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
    </Layout>
  );
}
