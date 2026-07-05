import {useTheme} from '../../theme/ThemeProvider';
import styles from './styles.module.css';

/** Interruttore chiaro/scuro: icona sole/luna, etichetta per screen reader. */
export default function ThemeToggle() {
  const {theme, toggle} = useTheme();
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={dark ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
      title={dark ? 'Tema chiaro' : 'Tema scuro'}>
      {dark ? (
        // Sole
        <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
          <circle cx="12" cy="12" r="4.4" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <line x1="12" y1="2.5" x2="12" y2="5" />
            <line x1="12" y1="19" x2="12" y2="21.5" />
            <line x1="2.5" y1="12" x2="5" y2="12" />
            <line x1="19" y1="12" x2="21.5" y2="12" />
            <line x1="5.3" y1="5.3" x2="7" y2="7" />
            <line x1="17" y1="17" x2="18.7" y2="18.7" />
            <line x1="5.3" y1="18.7" x2="7" y2="17" />
            <line x1="17" y1="7" x2="18.7" y2="5.3" />
          </g>
        </svg>
      ) : (
        // Luna
        <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
          <path
            d="M20.4 14.4A8.5 8.5 0 0 1 9.6 3.6a8.5 8.5 0 1 0 10.8 10.8Z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
}
