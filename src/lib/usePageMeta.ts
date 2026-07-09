import {useEffect} from 'react';
import {siteFor} from '../site.config';
import {useLocale} from '../i18n/LocaleProvider';

/**
 * Aggiorna titolo e description del documento alla navigazione client.
 * In build i meta della prima risposta sono iniettati staticamente
 * dal prerender (scripts/prerender.mjs): qui gestiamo solo i cambi rotta.
 */
export function usePageMeta(title?: string, description?: string) {
  const {locale} = useLocale();
  const site = siteFor(locale);
  useEffect(() => {
    document.title = title ? `${title} | ${site.title}` : site.title;
    if (description) {
      const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (meta) meta.content = description;
    }
  }, [title, description, site]);
}
