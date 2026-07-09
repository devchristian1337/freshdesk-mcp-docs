import {prevNextOf, type DocId} from '../../content/docs.config';
import {uiCopy} from '../../i18n/copy';
import {LocalizedLink, useLocale} from '../../i18n/LocaleProvider';
import styles from './styles.module.css';

/** Navigazione sequenziale tra i documenti nella lingua corrente. */
export default function DocPagination({docId}: {docId: DocId}) {
  const {locale} = useLocale();
  const t = uiCopy[locale];
  const {prev, next} = prevNextOf(locale, docId);
  if (!prev && !next) return null;

  return (
    <nav className={styles.pager} aria-label={t.adjacentPages}>
      {prev ? (
        <LocalizedLink to={`/docs/${prev.id}`} className={styles.card} rel="prev">
          <span className={styles.dir}>← {t.previous}</span>
          <span className={styles.label}>{prev.label}</span>
        </LocalizedLink>
      ) : <span />}
      {next ? (
        <LocalizedLink to={`/docs/${next.id}`} className={`${styles.card} ${styles.cardNext}`} rel="next">
          <span className={styles.dir}>{t.next} →</span>
          <span className={styles.label}>{next.label}</span>
        </LocalizedLink>
      ) : <span />}
    </nav>
  );
}
