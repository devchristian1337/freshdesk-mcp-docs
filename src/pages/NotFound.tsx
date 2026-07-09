import {usePageMeta} from '../lib/usePageMeta';
import {uiCopy} from '../i18n/copy';
import {LocalizedLink, useLocale} from '../i18n/LocaleProvider';
import styles from './NotFound.module.css';

/** Pagina 404 nel contesto della lingua attiva. */
export default function NotFound() {
  const {locale} = useLocale();
  const t = uiCopy[locale];
  usePageMeta(t.notFoundTitle);

  return (
    <main className={styles.wrap}>
      <p className="fd-eyebrow">404</p>
      <h1 className={styles.title}>{t.notFoundTitle}</h1>
      <p className={styles.text}>{t.notFoundText}</p>
      <div className={styles.actions}>
        <LocalizedLink className="btn btn--primary" to="/docs/intro">{t.goToIntro}</LocalizedLink>
        <LocalizedLink className="btn btn--ghost" to="/docs/reference/overview">{t.footerReference}</LocalizedLink>
      </div>
    </main>
  );
}
