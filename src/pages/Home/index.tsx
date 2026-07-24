import {Link} from 'react-router';
import clsx from 'clsx';
import {ArrowRight} from 'lucide-react';
import {usePageMeta} from '../../lib/usePageMeta';
import {siteFor} from '../../site.config';
import {useLocale} from '../../i18n/LocaleProvider';
import type {Locale} from '../../i18n/config';
import {homeContent} from './content';
import styles from './index.module.css';

/**
 * Home - macrostruttura Catalogue (vedi design.md).
 * Testata corta senza display type, poi UNA superficie d'inventario continua
 * divisa da bande-etichetta. Non ci sono sezioni con titolo: le bande sono il
 * linguaggio dei divisori.
 */

/* Dati del registro: non traducibili, sono identificatori. Il nome di tool per
   dominio e' quello canonico realmente esposto dal server, non un esempio
   inventato - la colonna mono deve portare un dato vero. */
const registry: {
  path: string;
  count: number;
  probe: string;
  ops: ('read' | 'write' | 'delete')[];
}[] = [
  {path: 'tickets', count: 12, probe: 'freshdesk_get_ticket', ops: ['read', 'write', 'delete']},
  {path: 'conversazioni', count: 5, probe: 'freshdesk_get_ticket_conversation', ops: ['read', 'write']},
  {path: 'contatti', count: 5, probe: 'freshdesk_list_contacts', ops: ['read', 'write']},
  {path: 'aziende', count: 5, probe: 'freshdesk_search_companies', ops: ['read', 'write']},
  {path: 'agenti', count: 5, probe: 'freshdesk_list_agents', ops: ['read', 'write']},
  {path: 'gruppi', count: 4, probe: 'freshdesk_list_groups', ops: ['read', 'write']},
  {path: 'campi', count: 8, probe: 'freshdesk_get_ticket_fields', ops: ['read', 'write']},
  {path: 'risposte-predefinite', count: 7, probe: 'freshdesk_list_canned_responses', ops: ['read', 'write']},
  {path: 'soluzioni', count: 13, probe: 'freshdesk_search_solution_articles', ops: ['read', 'write']},
];

const TOTAL_TOOLS = registry.reduce((sum, row) => sum + row.count, 0);

function homeContentFor(locale: Locale) {
  return homeContent[locale];
}

/** Banda-etichetta: divisore della superficie catalogo, non testata di sezione. */
function Band({label, count}: {label: string; count: string}) {
  return (
    <div className={styles.band}>
      <span className={styles.bandLabel}>{label}</span>
      <span className={styles.bandCount}>{count}</span>
    </div>
  );
}

/* Cornice tipografica: regola + etichetta mono. Nessuna finta barra di
   finestra - il browser dell'utente e' gia' chrome. */
function HandOff({copy}: {copy: ReturnType<typeof homeContentFor>}) {
  return (
    <figure className={styles.console} aria-label={copy.requestExample}>
      <figcaption className={styles.consoleBar}>
        <span className={styles.consoleTitle}>freshdesk-mcp · session</span>
        <span className={styles.consoleStatus}>{copy.active}</span>
      </figcaption>
      <ol className={styles.rail}>
        <li className={styles.stage}>
          <span className={styles.stageLabel}>{copy.request}</span>
          <p className={styles.prompt}>{copy.requestExample}</p>
        </li>
        <li className={styles.stage}>
          <span className={styles.stageLabel}>{copy.tool}</span>
          <p className={styles.toolCall}>
            <code className={styles.toolName}>freshdesk_get_ticket</code>
            <span className="fd-tag">read</span>
          </p>
          <pre className={styles.snippet}><code>{'{ "ticket_id": 12345, "include": "conversations" }'}</code></pre>
        </li>
        <li className={styles.stage}>
          <span className={styles.stageLabel}>{copy.response}</span>
          <pre className={styles.snippet}><code>{`{\n  "id": 12345,\n  "subject": "${copy.ticketSubject}",\n  "status": 2,\n  "conversations": [ ... ]\n}`}</code></pre>
        </li>
      </ol>
    </figure>
  );
}

export default function Home() {
  const {locale, localize} = useLocale();
  const copy = homeContentFor(locale);
  usePageMeta(copy.title, siteFor(locale).tagline);

  return (
    <main className={styles.home} data-pagefind-body data-pagefind-filter={`locale:${locale}`}>
      {/* Testata: wordmark + tagline. Nessun display gigante - il macro
          Catalogue vuole che l'inventario sia il protagonista. */}
      <header className={styles.masthead}>
        <div className={styles.mastheadInner}>
          <div className={styles.mastheadCopy}>
            <p className={styles.wordmark}>freshdesk-mcp</p>
            <h1 className={styles.tagline}>{copy.title}</h1>
            <p className={styles.subtitle}>{copy.subtitle}</p>
            <div className={styles.actions}>
              <Link className="btn btn--primary btn--lg" to={localize('/docs/intro')}>{copy.start}</Link>
              <Link className="btn btn--ghost btn--lg" to={localize('/docs/configurazione')}>{copy.configureClient}</Link>
            </div>
            <ul className={styles.metaRow}>
              <li>{TOTAL_TOOLS} tools</li><li>2 prompts</li><li>stdio + HTTP</li><li>Python ≥ 3.10</li>
            </ul>
          </div>
          <div className={styles.mastheadVisual}><HandOff copy={copy} /></div>
        </div>
      </header>

      {/* Superficie catalogo: una sola tabella continua, tre bande che restano
          in vista mentre scorrono le loro righe. Nessun reveal: il macro
          Catalogue prescrive "Reveal: none" e la pagina e' semplicemente li'. */}
      <section className={styles.catalogue}>
        <Band label={copy.bandReference} count={`${TOTAL_TOOLS} tools · 2 prompts`} />

        {registry.map((row, index) => (
          <Link key={row.path} className={styles.row} to={localize(`/docs/reference/${row.path}`)}>
            <span className={styles.rowCount}>{row.count}</span>
            <span className={styles.rowName}>{copy.registry[index].label}</span>
            <code className={styles.rowProbe}>{row.probe}</code>
            <span className={styles.rowOps}>
              {row.ops.map((op) => (
                <span key={op} className={clsx('fd-tag', op === 'write' && 'fd-tag--write', op === 'delete' && 'fd-tag--delete')}>{op}</span>
              ))}
            </span>
            <span className={styles.rowGo}><ArrowRight size={16} aria-hidden="true" /></span>
          </Link>
        ))}

        <Link className={clsx(styles.row, styles.rowPrompts)} to={localize('/docs/reference/prompts')}>
          <span className={styles.rowCount}>+2</span>
          <span className={styles.rowName}>{copy.registry[0].promptLabel}</span>
          <code className={styles.rowProbe}>create_ticket · create_reply</code>
          <span className={styles.rowOps} />
          <span className={styles.rowGo}><ArrowRight size={16} aria-hidden="true" /></span>
        </Link>

        <Band label={copy.bandFeatures} count={String(copy.features.length)} />

        {copy.features.map((feature) => (
          <div key={feature.title} className={clsx(styles.row, styles.rowStatic)}>
            <span className={styles.rowCount} aria-hidden="true">·</span>
            <h2 className={styles.rowName}>{feature.title}</h2>
            <p className={styles.rowNote}>{feature.body}</p>
          </div>
        ))}

        <Band label={copy.bandRunning} count="2" />

        <Link className={styles.row} to={localize('/docs/configurazione')}>
          <span className={styles.rowCount} aria-hidden="true">·</span>
          <span className={styles.rowName}>{copy.localMode}</span>
          <p className={styles.rowNote}>{copy.localText}</p>
          <code className={styles.rowCode}><span className={styles.promptSign}>$</span>freshdesk-mcp</code>
          <span className={styles.rowGo}><ArrowRight size={16} aria-hidden="true" /></span>
        </Link>
        <Link className={styles.row} to={localize('/docs/installazione')}>
          <span className={styles.rowCount} aria-hidden="true">·</span>
          <span className={styles.rowName}>{copy.remoteMode}</span>
          <p className={styles.rowNote}>{copy.remoteText}</p>
          <code className={styles.rowCode}><span className={styles.promptSign}>$</span>MCP_TRANSPORT=http freshdesk-mcp</code>
          <span className={styles.rowGo}><ArrowRight size={16} aria-hidden="true" /></span>
        </Link>
      </section>

      <section className={styles.ctaBand}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>{copy.ctaTitle}</h2>
          <p className={styles.ctaText}>{copy.ctaText}</p>
          <div className={styles.actions}>
            <Link className="btn btn--primary btn--lg" to={localize('/docs/installazione')}>{copy.installServer}</Link>
            <a className="btn btn--ghost btn--lg" href={siteFor(locale).repoUrl} target="_blank" rel="noopener noreferrer">{copy.githubCode}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
