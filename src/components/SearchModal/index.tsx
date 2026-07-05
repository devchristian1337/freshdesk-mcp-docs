import {useEffect, useRef, useState} from 'react';
import {OPEN_SEARCH_EVENT} from './SearchButton';
import styles from './styles.module.css';
import '@pagefind/default-ui/css/ui.css';
import './pagefind-overrides.css';

/**
 * Modal di ricerca basato su Pagefind: l'indice viene generato in build
 * (`pagefind --site build`) a partire dall'HTML prerenderizzato.
 * In dev l'indice non esiste: mostriamo un avviso al posto dei risultati.
 */
export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const uiRef = useRef<unknown>(null);

  // Apertura da navbar (evento) e da tastiera (Ctrl/Cmd+K), chiusura con Esc.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // Blocca lo scroll della pagina mentre il modal è aperto.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Istanzia la UI Pagefind alla prima apertura (e la riusa poi).
  useEffect(() => {
    if (!open || uiRef.current || !containerRef.current) return;
    let cancelled = false;
    (async () => {
      try {
        // Verifica che l'indice esista (in dev non c'è).
        const probe = await fetch('/pagefind/pagefind.js', {method: 'HEAD'});
        if (!probe.ok) throw new Error('indice assente');
        const {PagefindUI} = await import('@pagefind/default-ui');
        if (cancelled || !containerRef.current) return;
        uiRef.current = new PagefindUI({
          element: containerRef.current,
          bundlePath: '/pagefind/',
          showImages: false,
          showSubResults: true,
          pageSize: 8,
          translations: {
            placeholder: 'Cerca nella documentazione…',
            clear_search: 'Pulisci',
            load_more: 'Altri risultati',
            zero_results: 'Nessun risultato per «[SEARCH_TERM]»',
            many_results: '[COUNT] risultati per «[SEARCH_TERM]»',
            one_result: 'Un risultato per «[SEARCH_TERM]»',
            searching: 'Ricerca di «[SEARCH_TERM]»…',
          },
        });
      } catch {
        if (!cancelled) setUnavailable(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Porta il focus nel campo di ricerca a ogni apertura.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      containerRef.current
        ?.querySelector<HTMLInputElement>('input[type="text"], input[type="search"]')
        ?.focus();
    }, 60);
    return () => window.clearTimeout(t);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Ricerca nella documentazione">
        <div ref={containerRef} className="fd-search-scope" />
        {unavailable && (
          <p className={styles.devNote}>
            L&apos;indice di ricerca viene generato in build: esegui{' '}
            <code>npm run build</code> e poi <code>npm run preview</code> per provarla.
          </p>
        )}
      </div>
    </div>
  );
}
