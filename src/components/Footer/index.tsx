import {useLocation} from 'react-router';
import {ArrowUpRight} from 'lucide-react';
import {footerColumns, footerCopyright, site} from '../../site.config';
import {uiCopy} from '../../i18n/copy';
import {LocalizedLink, useLocale} from '../../i18n/LocaleProvider';
import styles from './styles.module.css';

/**
 * Due chiusure diverse per due lavori diversi:
 *  - in home una riga sola, perché la banda CTA sopra ha già fatto il lavoro
 *    di conversione e un indice di link qui leggerebbe come una sitemap;
 *  - nelle pagine docs le tre colonne, dove servono davvero per navigare.
 */
export default function Footer() {
  const {locale} = useLocale();
  const {pathname} = useLocation();
  const t = uiCopy[locale];
  // Come nel Dock: tolto il prefisso di lingua, la home resta '/'.
  const isHome = (pathname.replace(/^\/(?:it|es|de|fr)(?=\/|$)/, '') || '/') === '/';

  if (isHome) {
    return (
      <footer className={styles.footer}>
        <div className={`${styles.inner} ${styles.innerCompact}`}>
          <p className={styles.copyrightInline}>{footerCopyright(locale)}</p>
          <nav className={styles.inlineLinks} aria-label={t.footerResources}>
            <LocalizedLink className={styles.link} to="/docs/intro">{t.documentation}</LocalizedLink>
            <a className={styles.link} href={site.repoUrl} target="_blank" rel="noopener noreferrer">
              {t.repository}
              <ArrowUpRight className={styles.linkIcon} size={14} aria-hidden="true" />
            </a>
          </nav>
        </div>
      </footer>
    );
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          {footerColumns(locale).map((column) => (
            <div key={column.title}>
              <h3 className={styles.colTitle}>{column.title}</h3>
              <ul className={styles.list}>
                {column.items.map((item) => (
                  <li key={item.label}>
                    {item.to ? (
                      <LocalizedLink className={styles.link} to={item.to}>{item.label}</LocalizedLink>
                    ) : (
                      <a className={styles.link} href={item.href} target="_blank" rel="noopener noreferrer">
                        {item.label}
                        <ArrowUpRight className={styles.linkIcon} size={14} aria-hidden="true" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className={styles.copyright}>{footerCopyright(locale)}</p>
      </div>
    </footer>
  );
}
