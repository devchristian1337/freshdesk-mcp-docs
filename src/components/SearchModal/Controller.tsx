import {lazy, Suspense, useEffect, useState} from 'react';
import {OPEN_SEARCH_EVENT} from './events';

const SearchModal = lazy(() => import('./index'));

export default function SearchModalController() {
  const [load, setLoad] = useState(false);
  const [initialOpen, setInitialOpen] = useState(false);

  useEffect(() => {
    if (load) return;

    const openSearch = () => {
      setInitialOpen(true);
      setLoad(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
    };

    window.addEventListener(OPEN_SEARCH_EVENT, openSearch);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, openSearch);
      window.removeEventListener('keydown', onKey);
    };
  }, [load]);

  if (!load) return null;

  return (
    <Suspense fallback={null}>
      <SearchModal initialOpen={initialOpen} />
    </Suspense>
  );
}
