import {useEffect} from 'react';
import {site} from '../site.config';

/**
 * Aggiorna titolo e description del documento alla navigazione client.
 * In build i meta della prima risposta sono iniettati staticamente
 * dal prerender (scripts/prerender.mjs): qui gestiamo solo i cambi rotta.
 */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${site.title}` : site.title;
    if (description) {
      const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (meta) meta.content = description;
    }
  }, [title, description]);
}
