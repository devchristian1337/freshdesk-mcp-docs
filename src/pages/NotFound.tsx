import {Link} from 'react-router';
import {usePageMeta} from '../lib/usePageMeta';
import styles from './NotFound.module.css';

/** Pagina 404 — servita anche come build/404.html da Cloudflare. */
export default function NotFound() {
  usePageMeta('Pagina non trovata');

  return (
    <main className={styles.wrap}>
      <p className="fd-eyebrow">Errore · 404</p>
      <h1 className={styles.title}>Pagina non trovata</h1>
      <p className={styles.text}>
        L&apos;indirizzo richiesto non esiste o è stato spostato. Riparti
        dall&apos;introduzione o dalla reference dei tool.
      </p>
      <div className={styles.actions}>
        <Link className="btn btn--primary" to="/docs/intro">
          Vai all&apos;introduzione
        </Link>
        <Link className="btn btn--ghost" to="/docs/reference/overview">
          Reference dei tool
        </Link>
      </div>
    </main>
  );
}
