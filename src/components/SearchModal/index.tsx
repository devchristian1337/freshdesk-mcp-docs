import {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router';
import {BookOpen, Braces, Terminal} from 'lucide-react';
import {GitHubIcon} from '../ui/github-icon';
import {AppleSpotlight, type SpotlightResult, type SpotlightShortcut} from '../ui/apple-spotlight';
import {site} from '../../site.config';
import {OPEN_SEARCH_EVENT, SEARCH_STATE_EVENT} from './events';
import {uiCopy} from '../../i18n/copy';
import {useLocale} from '../../i18n/LocaleProvider';

type PagefindApi = {
  init: () => Promise<void>;
  debouncedSearch: (
    term: string,
    options?: {filters?: Record<string, string | string[]>},
    debounceMs?: number,
  ) => Promise<{results: PagefindRawResult[]} | null>;
};

type PagefindRawResult = {
  id: string;
  data: () => Promise<{url: string; excerpt: string; meta: {title?: string}}>;
};

const MAX_RESULTS = 8;
const PAGEFIND_URL = '/pagefind/pagefind.js';

function normalizeUrl(url: string): string {
  return url.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '') || '/';
}

type SearchModalProps = {initialOpen?: boolean};

/** Spotlight locale-aware: Pagefind riceve sempre il filtro della lingua attiva. */
export default function SearchModal({initialOpen = false}: SearchModalProps) {
  const [open, setOpen] = useState(initialOpen);
  const [unavailable, setUnavailable] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SpotlightResult[]>([]);
  const pagefindRef = useRef<PagefindApi | null>(null);
  const searchSeq = useRef(0);
  const navigate = useNavigate();
  const {locale, localize} = useLocale();
  const t = uiCopy[locale];

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      } else if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(SEARCH_STATE_EVENT, {detail: {open}}));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open || pagefindRef.current || unavailable) return;
    let cancelled = false;
    (async () => {
      try {
        const probe = await fetch(PAGEFIND_URL, {method: 'HEAD'});
        if (!probe.ok || !(probe.headers.get('content-type') ?? '').includes('javascript')) {
          throw new Error('missing Pagefind index');
        }
        const pagefind = (await import(/* @vite-ignore */ PAGEFIND_URL)) as PagefindApi;
        await pagefind.init();
        if (!cancelled) pagefindRef.current = pagefind;
      } catch {
        if (!cancelled) setUnavailable(true);
      }
    })();
    return () => { cancelled = true; };
  }, [open, unavailable]);

  useEffect(() => {
    const pagefind = pagefindRef.current;
    if (!query || !pagefind) {
      setResults([]);
      return;
    }
    const sequence = ++searchSeq.current;
    (async () => {
      const search = await pagefind.debouncedSearch(query, {filters: {locale}}, 250);
      if (!search || sequence !== searchSeq.current) return;
      const data = await Promise.all(search.results.slice(0, MAX_RESULTS).map((result) => result.data()));
      if (sequence !== searchSeq.current) return;
      setResults(data.map((result) => ({
        label: result.meta.title ?? t.untitled,
        descriptionHtml: result.excerpt,
        link: normalizeUrl(result.url),
      })));
    })();
  }, [locale, query, t.untitled]);

  const handleNavigate = useCallback((link: string, external: boolean) => {
    setOpen(false);
    if (external) window.open(link, '_blank', 'noopener,noreferrer');
    else navigate(link);
  }, [navigate]);

  const shortcuts: SpotlightShortcut[] = [
    {label: t.documentation, icon: <BookOpen />, link: localize('/docs/intro')},
    {label: t.reference, icon: <Braces />, link: localize('/docs/reference/overview')},
    {label: t.examples, icon: <Terminal />, link: localize('/docs/esempi')},
    {label: 'GitHub', icon: <GitHubIcon size={28} />, link: site.repoUrl, external: true},
  ];

  return (
    <AppleSpotlight
      isOpen={open}
      handleClose={() => setOpen(false)}
      shortcuts={shortcuts}
      searchValue={query}
      onSearchValueChange={setQuery}
      searchResults={results}
      notice={unavailable ? <>{t.searchUnavailable} <code>npm run build</code> e poi <code>npm run preview</code>.</> : undefined}
      onNavigate={handleNavigate}
    />
  );
}
