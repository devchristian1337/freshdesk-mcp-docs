import {useEffect, useRef, useState} from 'react';
import {Link, NavLink} from 'react-router';
import clsx from 'clsx';
import {navbarItems, site} from '../../site.config';
import ThemeToggle from '../ThemeToggle';
import SearchButton from '../SearchModal/SearchButton';
import styles from './styles.module.css';

/** Navbar fissa che si nasconde scendendo e riappare salendo (hideOnScroll). */
export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false); // menu mobile
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Nasconde solo oltre l'altezza della navbar e in discesa.
      setHidden(y > 80 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={clsx(styles.navbar, hidden && !open && styles.hidden)}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} onClick={() => setOpen(false)}>
          <img
            className={styles.brandLogo}
            src="/img/logo.png"
            width={30}
            height={30}
            alt=""
            aria-hidden="true"
          />
          {site.title}
        </Link>

        <nav className={styles.links} aria-label="Navigazione principale">
          {navbarItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to!}
              className={({isActive}) =>
                clsx(styles.link, isActive && styles.linkActive)
              }>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <SearchButton />
          <ThemeToggle />
          <a
            className={styles.github}
            href={site.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Repository GitHub">
            GitHub
          </a>
          <button
            type="button"
            className={styles.burger}
            aria-label={open ? 'Chiudi il menu' : 'Apri il menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}>
            <span aria-hidden="true">{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav className={styles.mobileMenu} aria-label="Navigazione principale (mobile)">
          {navbarItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to!}
              className={({isActive}) =>
                clsx(styles.mobileLink, isActive && styles.linkActive)
              }
              onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          <a
            className={styles.mobileLink}
            href={site.repoUrl}
            target="_blank"
            rel="noopener noreferrer">
            GitHub ↗
          </a>
        </nav>
      )}
    </header>
  );
}
