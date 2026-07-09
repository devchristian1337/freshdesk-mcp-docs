import {useState} from 'react';
import {NavLink} from 'react-router';
import clsx from 'clsx';
import {sidebarSections} from '../../content/docs.config';
import {uiCopy} from '../../i18n/copy';
import {useLocale} from '../../i18n/LocaleProvider';
import styles from './styles.module.css';

/** Sidebar della documentazione: sezioni sempre visibili e locale-aware. */
export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const {locale, localize} = useLocale();
  const t = uiCopy[locale];

  const nav = (
    <nav className={styles.nav} aria-label={t.documentation}>
      {sidebarSections(locale).map((section, index) => (
        <div key={section.label ?? `section-${index}`} className={styles.section}>
          {section.label && <p className={styles.sectionLabel}>{section.label}</p>}
          <ul className={styles.list}>
            {section.items.map((doc) => (
              <li key={doc.id}>
                <NavLink
                  to={localize(`/docs/${doc.id}`)}
                  className={({isActive}) => clsx(styles.link, isActive && styles.linkActive)}
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
      <button
        type="button"
        className={styles.mobileToggle}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}>
        {t.docsIndex}
        <span aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      <div className={clsx(styles.wrap, open && styles.wrapOpen)}>{nav}</div>
    </>
  );
}
