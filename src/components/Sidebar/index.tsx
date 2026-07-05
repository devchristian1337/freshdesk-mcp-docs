import {useState} from 'react';
import {NavLink} from 'react-router';
import clsx from 'clsx';
import {sidebarSections} from '../../content/docs.config';
import styles from './styles.module.css';

/**
 * Sidebar della documentazione: sezioni sempre visibili (come le categorie
 * collapsed:false di prima). Su mobile diventa un pannello richiudibile.
 */
export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className={styles.nav} aria-label="Documentazione">
      {sidebarSections.map((section, i) => (
        <div key={section.label ?? `sezione-${i}`} className={styles.section}>
          {section.label && <p className={styles.sectionLabel}>{section.label}</p>}
          <ul className={styles.list}>
            {section.items.map((doc) => (
              <li key={doc.id}>
                <NavLink
                  to={`/docs/${doc.id}`}
                  className={({isActive}) =>
                    clsx(styles.link, isActive && styles.linkActive)
                  }
                  onClick={() => setOpen(false)}>
                  {doc.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Interruttore visibile solo su mobile */}
      <button
        type="button"
        className={styles.mobileToggle}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}>
        Indice della documentazione
        <span aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      <div className={clsx(styles.wrap, open && styles.wrapOpen)}>{nav}</div>
    </>
  );
}
