import {Link} from 'react-router';
import clsx from 'clsx';
import Reveal from '../../components/Reveal';
import {usePageMeta} from '../../lib/usePageMeta';
import {siteFor} from '../../site.config';
import {useLocale} from '../../i18n/LocaleProvider';
import type {Locale} from '../../i18n/config';
import {homeContent} from './content';
import styles from './index.module.css';

const registryOps: ('read' | 'write' | 'delete')[][] = [
  ['read', 'write', 'delete'], ['read', 'write'], ['read', 'write'], ['read', 'write'], ['read', 'write'], ['read', 'write'], ['read', 'write'], ['read', 'write'], ['read', 'write'],
];
const registryPaths = ['tickets', 'conversazioni', 'contatti', 'aziende', 'agenti', 'gruppi', 'campi', 'risposte-predefinite', 'soluzioni'];
const registryCounts = [12, 5, 5, 5, 5, 4, 8, 7, 13];

function HandOff({copy}: {copy: ReturnType<typeof homeContentFor>}) {
  return (
    <div className={styles.console} aria-label={copy.requestExample}>
      <div className={styles.consoleBar}><span className={styles.consoleDot} /><span className={styles.consoleTitle}>freshdesk-mcp · session</span><span className={styles.consoleStatus}>{copy.active}</span></div>
      <ol className={styles.rail}>
        <li className={styles.stage}><span className={styles.stageLabel}>{copy.request}</span><p className={styles.prompt}>{copy.requestExample}</p></li>
        <li className={styles.stage}><span className={styles.stageLabel}>{copy.tool}</span><p className={styles.toolCall}><code className={styles.toolName}>freshdesk_get_ticket</code><span className="fd-tag">read</span></p><pre className={styles.snippet}><code>{'{ "ticket_id": 12345, "include": "conversations" }'}</code></pre></li>
        <li className={styles.stage}><span className={styles.stageLabel}>{copy.response}</span><pre className={styles.snippet}><code>{`{\n  "id": 12345,\n  "subject": "${copy.ticketSubject}",\n  "status": 2,\n  "conversations": [ ... ]\n}`}</code></pre></li>
      </ol>
    </div>
  );
}

function homeContentFor(locale: Locale) { return homeContent[locale]; }

export default function Home() {
  const {locale, localize} = useLocale();
  const copy = homeContentFor(locale);
  usePageMeta(copy.title, siteFor(locale).tagline);

  return (
    <main className={styles.home} data-pagefind-body data-pagefind-filter={`locale:${locale}`}>
      <header className={styles.hero}><div className={styles.heroInner}><div className={styles.heroCopy}>
        <p className="fd-eyebrow">MCP server · Freshdesk</p><h1 className={styles.title}>{copy.title}</h1><p className={styles.subtitle}>{copy.subtitle}</p>
        <div className={styles.actions}><Link className="btn btn--primary btn--lg" to={localize('/docs/intro')}>{copy.start}</Link><Link className="btn btn--ghost btn--lg" to={localize('/docs/configurazione')}>{copy.configureClient}</Link></div>
        <ul className={styles.metaRow}><li>64 tools</li><li>2 prompts</li><li>stdio + HTTP</li><li>Python ≥ 3.10</li></ul>
      </div><div className={styles.heroVisual}><HandOff copy={copy} /></div></div></header>

      <section className={styles.section}><Reveal className={styles.sectionHead}><p className="fd-eyebrow">{copy.registryEyebrow}</p><h2 className={styles.sectionTitle}>{copy.registryTitle}</h2></Reveal><Reveal delay={60}><div className={styles.registry}>
        {copy.registry.map((row, index) => <Link key={registryPaths[index]} className={styles.registryRow} to={localize(`/docs/reference/${registryPaths[index]}`)}><span className={styles.registryCount}>{registryCounts[index]}</span><span className={styles.registryLabel}>{row.label}</span><span className={styles.registryOps}>{registryOps[index].map((op) => <span key={op} className={clsx('fd-tag', op === 'write' && 'fd-tag--write', op === 'delete' && 'fd-tag--delete')}>{op}</span>)}</span><span className={styles.registryArrow} aria-hidden="true">→</span></Link>)}
        <Link className={clsx(styles.registryRow, styles.registryTotal)} to={localize('/docs/reference/prompts')}><span className={styles.registryCount}>+2</span><span className={styles.registryLabel}>{copy.registry[0].promptLabel}</span><span className={styles.registryArrow} aria-hidden="true">→</span></Link>
      </div></Reveal></section>

      <section className={clsx(styles.section, styles.sectionAlt)}><Reveal className={styles.sectionHead}><p className="fd-eyebrow">{copy.offerEyebrow}</p><h2 className={styles.sectionTitle}>{copy.offerTitle}</h2></Reveal><div className={styles.featureGrid}>{copy.features.map((feature, index) => <Reveal key={feature.title} delay={index * 50} className={styles.featureCard}><h3 className={styles.featureTitle}>{feature.title}</h3><p className={styles.featureBody}>{feature.body}</p></Reveal>)}</div></section>
      <section className={styles.section}><Reveal className={styles.sectionHead}><p className="fd-eyebrow">{copy.useCasesEyebrow}</p><h2 className={styles.sectionTitle}>{copy.useCasesTitle}</h2></Reveal><div className={styles.featureGrid}>{copy.useCases.map((useCase, index) => <Reveal key={useCase.title} delay={index * 50} className={styles.featureCard}><h3 className={styles.featureTitle}>{useCase.title}</h3><p className={styles.featureBody}>{useCase.body}</p></Reveal>)}</div></section>
      <section className={styles.section}><Reveal className={styles.sectionHead}><p className="fd-eyebrow">{copy.connectionEyebrow}</p><h2 className={styles.sectionTitle}>{copy.connectionTitle}</h2></Reveal><div className={styles.modeGrid}>
        <Reveal className={styles.modeCard}><p className={styles.modeTag}>{copy.localMode}</p><p className={styles.modeText}>{copy.localText}</p><pre className={styles.modeCode}><code><span className={styles.promptSign}>$</span> freshdesk-mcp</code></pre><Link className={styles.modeLink} to={localize('/docs/configurazione')}>{copy.seeConfiguration}</Link></Reveal>
        <Reveal className={styles.modeCard} delay={70}><p className={styles.modeTag}>{copy.remoteMode}</p><p className={styles.modeText}>{copy.remoteText}</p><pre className={styles.modeCode}><code><span className={styles.promptSign}>$</span> MCP_TRANSPORT=http freshdesk-mcp</code></pre><Link className={styles.modeLink} to={localize('/docs/installazione')}>{copy.seeInstallation}</Link></Reveal>
      </div></section>
      <section className={styles.ctaBand}><Reveal className={styles.ctaInner}><h2 className={styles.ctaTitle}>{copy.ctaTitle}</h2><p className={styles.ctaText}>{copy.ctaText}</p><div className={styles.actions}><Link className="btn btn--primary btn--lg" to={localize('/docs/installazione')}>{copy.installServer}</Link><a className={clsx('btn', 'btn--ghost', 'btn--lg', styles.ctaGhost)} href={siteFor(locale).repoUrl} target="_blank" rel="noopener noreferrer">{copy.githubCode}</a></div></Reveal></section>
    </main>
  );
}
