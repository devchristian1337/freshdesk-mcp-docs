import styles from './styles.module.css';

/**
 * Bottone di ricerca nella navbar. Apre il modal emettendo un evento
 * globale: il modal (montato nel layout) è in ascolto.
 */
export const OPEN_SEARCH_EVENT = 'fd:search:open';

export default function SearchButton() {
  return (
    <button
      type="button"
      className={styles.searchButton}
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT))}
      aria-label="Cerca nella documentazione">
      <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
        <circle
          cx="10.5"
          cy="10.5"
          r="6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="15.5"
          y1="15.5"
          x2="21"
          y2="21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className={styles.searchLabel}>Cerca</span>
      <kbd className={styles.searchKbd}>Ctrl K</kbd>
    </button>
  );
}
