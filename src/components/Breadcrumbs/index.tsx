import {docRefOf, sectionOf, type DocId} from '../../content/docs.config';
import {uiCopy} from '../../i18n/copy';
import {LocalizedLink, useLocale} from '../../i18n/LocaleProvider';
import styles from './styles.module.css';

/** Percorso corrente nella documentazione localizzata. */
export default function Breadcrumbs({docId}: {docId: DocId}) {
  const {locale} = useLocale();
  const t = uiCopy[locale];
  const doc = docRefOf(locale, docId);
  const section = sectionOf(locale, docId);
  if (!doc) return null;

  return (
    <nav className={styles.crumbs} aria-label={t.breadcrumbs}>
      <ol className={styles.list}>
        <li><LocalizedLink to="/" className={styles.link}>{t.home}</LocalizedLink></li>
        {section?.label && <li className={styles.section}>{section.label}</li>}
        <li aria-current="page" className={styles.current}>{doc.label}</li>
      </ol>
    </nav>
  );
}
