import {Link} from 'react-router';
import {footerColumns, footerCopyright} from '../../site.config';
import styles from './styles.module.css';

/** Footer a tre colonne su fondo inchiostro. */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className={styles.colTitle}>{col.title}</h3>
              <ul className={styles.list}>
                {col.items.map((item) => (
                  <li key={item.label}>
                    {item.to ? (
                      <Link className={styles.link} to={item.to}>
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        className={styles.link}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer">
                        {item.label} ↗
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className={styles.copyright}>{footerCopyright}</p>
      </div>
    </footer>
  );
}
