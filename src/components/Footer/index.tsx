import {footerColumns, footerCopyright} from '../../site.config';
import {LocalizedLink, useLocale} from '../../i18n/LocaleProvider';
import styles from './styles.module.css';

/** Footer a tre colonne con link nella lingua corrente. */
export default function Footer() {
  const {locale} = useLocale();
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
                        {item.label} ↗
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
