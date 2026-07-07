import {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router';
import {BookOpen, Braces, Terminal} from 'lucide-react';
import {GitHubIcon} from '../ui/github-icon';
import {
  AppleSpotlight,
  type SpotlightResult,
  type SpotlightShortcut,
} from '../ui/apple-spotlight';
import {site} from '../../site.config';

/** Evento globale che apre lo Spotlight (usato dal Dock). */
export const OPEN_SEARCH_EVENT = 'fd:search:open';

/** Evento con lo stato aperto/chiuso dello Spotlight (il Dock si nasconde). */
export const SEARCH_STATE_EVENT = 'fd:search:state';

/**
 * Ricerca del sito in stile Spotlight: l'input interroga l'API JS di
 * Pagefind, il cui indice viene generato in build (`pagefind --site build`)
 * dall'HTML prerenderizzato. In dev l'indice non esiste: mostriamo un
 * avviso al posto dei risultati.
 */

/** Sottoinsieme dell'API JS di Pagefind che usiamo. */
type PagefindApi = {
  init: () => Promise<void>;
  debouncedSearch: (
    term: string,
    options?: Record<string, unknown>,
    debounceMs?: number,
  ) => Promise<{results: PagefindRawResult[]} | null>;
};

type PagefindRawResult = {
  id: string;
  data: () => Promise<{
    url: string;
    excerpt: string;
    meta: {title?: string};
  }>;
};

const MAX_RESULTS = 8;

/* Percorso servito dallo static hosting: esiste solo dopo la build
   (costante non-letterale così né Vite né TS provano a risolverlo). */
const PAGEFIND_URL = '/pagefind/pagefind.js';

/** Gli URL di Pagefind puntano all'HTML statico: riportali a path di route. */
function normalizeUrl(url: string): string {
  return url
    .replace(/index\.html$/, '')
    .replace(/\.html$/, '')
    .replace(/\/$/, '') || '/';
}

const SHORTCUTS: SpotlightShortcut[] = [
  {label: 'Documentazione', icon: <BookOpen />, link: '/docs/intro'},
  {label: 'Reference', icon: <Braces />, link: '/docs/reference/overview'},
  {label: 'Esempi', icon: <Terminal />, link: '/docs/esempi'},
  {label: 'GitHub', icon: <GitHubIcon size={28} />, link: site.repoUrl, external: true},
];

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SpotlightResult[]>([]);
  const pagefindRef = useRef<PagefindApi | null>(null);
  const searchSeq = useRef(0);
  const navigate = useNavigate();

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

  // Notifica lo stato al resto dell'app (il Dock si nasconde quando aperto).
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(SEARCH_STATE_EVENT, {detail: {open}}));
  }, [open]);

  // Blocca lo scroll della pagina mentre lo Spotlight è aperto.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Reset della query a ogni apertura.
  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  // Carica Pagefind alla prima apertura (e riusa l'istanza poi).
  useEffect(() => {
    if (!open || pagefindRef.current || unavailable) return;
    let cancelled = false;
    (async () => {
      try {
        const probe = await fetch(PAGEFIND_URL, {method: 'HEAD'});
        // In dev il fallback SPA risponde 200 con HTML: senza il check sul
        // content-type l'import fallirebbe con un 404 rumoroso in console.
        const type = probe.headers.get('content-type') ?? '';
        if (!probe.ok || !type.includes('javascript')) {
          throw new Error('indice assente');
        }
        const pagefind = (await import(
          /* @vite-ignore */ PAGEFIND_URL
        )) as PagefindApi;
        await pagefind.init();
        if (!cancelled) pagefindRef.current = pagefind;
      } catch {
        if (!cancelled) setUnavailable(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, unavailable]);

  // Interroga Pagefind a ogni cambio di query (debounce interno a Pagefind).
  useEffect(() => {
    const pagefind = pagefindRef.current;
    if (!query || !pagefind) {
      setResults([]);
      return;
    }
    const seq = ++searchSeq.current;
    (async () => {
      const search = await pagefind.debouncedSearch(query, {}, 250);
      // null = ricerca superata da una più recente.
      if (!search || seq !== searchSeq.current) return;
      const data = await Promise.all(
        search.results.slice(0, MAX_RESULTS).map((r) => r.data()),
      );
      if (seq !== searchSeq.current) return;
      setResults(
        data.map((d) => ({
          label: d.meta.title ?? 'Senza titolo',
          descriptionHtml: d.excerpt,
          link: normalizeUrl(d.url),
        })),
      );
    })();
  }, [query]);

  const handleNavigate = useCallback(
    (link: string, external: boolean) => {
      setOpen(false);
      if (external) {
        window.open(link, '_blank', 'noopener,noreferrer');
      } else {
        navigate(link);
      }
    },
    [navigate],
  );

  return (
    <AppleSpotlight
      isOpen={open}
      handleClose={() => setOpen(false)}
      shortcuts={SHORTCUTS}
      searchValue={query}
      onSearchValueChange={setQuery}
      searchResults={results}
      notice={
        unavailable ? (
          <>
            L&apos;indice di ricerca viene generato in build: esegui{' '}
            <code>npm run build</code> e poi <code>npm run preview</code> per
            provarla.
          </>
        ) : undefined
      }
      onNavigate={handleNavigate}
    />
  );
}
