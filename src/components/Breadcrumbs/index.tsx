import {Link} from 'react-router';
import {docRefOf, sectionOf} from '../../content/docs.config';
import styles from './styles.module.css';

/** Percorso corrente: Docs / [Categoria] / Pagina. */
export default function Breadcrumbs({docId}: {docId: string}) {
  const doc = docRefOf(docId);
  const section = sectionOf(docId);
  if (!doc) return null;

  return (
    <nav className={styles.crumbs} aria-label="Percorso">
      <ol className={styles.list}>
        <li>
          <Link to="/" className={styles.link}>
            Home
          </Link>
        </li>
        {section?.label && <li className={styles.section}>{section.label}</li>}
        <li aria-current="page" className={styles.current}>
          {doc.label}
        </li>
      </ol>
    </nav>
  );
}
