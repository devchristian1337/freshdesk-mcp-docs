import {Link} from 'react-router';
import {prevNextOf} from '../../content/docs.config';
import styles from './styles.module.css';

/** Navigazione sequenziale tra i documenti (ordine della sidebar). */
export default function DocPagination({docId}: {docId: string}) {
  const {prev, next} = prevNextOf(docId);
  if (!prev && !next) return null;

  return (
    <nav className={styles.pager} aria-label="Pagine adiacenti">
      {prev ? (
        <Link to={`/docs/${prev.id}`} className={styles.card} rel="prev">
          <span className={styles.dir}>← Precedente</span>
          <span className={styles.label}>{prev.label}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          to={`/docs/${next.id}`}
          className={`${styles.card} ${styles.cardNext}`}
          rel="next">
          <span className={styles.dir}>Successivo →</span>
          <span className={styles.label}>{next.label}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
