export const locales = ['en', 'it', 'es', 'de', 'fr'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export type LocaleInfo = {
  code: Locale;
  htmlLang: string;
  ogLocale: string;
  nativeName: string;
};

export const localeInfo: Record<Locale, LocaleInfo> = {
  en: {code: 'en', htmlLang: 'en', ogLocale: 'en_US', nativeName: 'English'},
  it: {code: 'it', htmlLang: 'it', ogLocale: 'it_IT', nativeName: 'Italiano'},
  es: {code: 'es', htmlLang: 'es', ogLocale: 'es_ES', nativeName: 'Español'},
  de: {code: 'de', htmlLang: 'de', ogLocale: 'de_DE', nativeName: 'Deutsch'},
  fr: {code: 'fr', htmlLang: 'fr', ogLocale: 'fr_FR', nativeName: 'Français'},
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Rimuove il prefisso locale, se presente, e restituisce sempre una route assoluta. */
export function stripLocalePrefix(pathname: string): string {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const firstSegment = normalized.split('/')[1];
  if (!isLocale(firstSegment) || firstSegment === defaultLocale) return normalized || '/';
  const rest = normalized.slice(firstSegment.length + 1);
  return rest || '/';
}

/** Costruisce il percorso pubblico della lingua scelta. */
export function localizePath(locale: Locale, pathname: string): string {
  const bare = stripLocalePrefix(pathname);
  return locale === defaultLocale ? bare : `/${locale}${bare === '/' ? '' : bare}`;
}

export function localePath(locale: Locale): string {
  return localizePath(locale, '/');
}
