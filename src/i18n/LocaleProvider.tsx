import {createContext, useContext, useEffect, type ReactNode} from 'react';
import {Link, type LinkProps} from 'react-router';
import {
  defaultLocale,
  localeInfo,
  localizePath,
  type Locale,
} from './config';

type LocaleContextValue = {
  locale: Locale;
  localize: (path: string) => string;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  localize: (path) => localizePath(defaultLocale, path),
});

export function LocaleProvider({locale, children}: {locale: Locale; children: ReactNode}) {
  useEffect(() => {
    document.documentElement.lang = localeInfo[locale].htmlLang;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{locale, localize: (path) => localizePath(locale, path)}}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}

type LocalizedLinkProps = Omit<LinkProps, 'to'> & {to: string};

/** Link interno che conserva il prefisso della lingua attiva. */
export function LocalizedLink({to, ...props}: LocalizedLinkProps) {
  const {localize} = useLocale();
  return <Link to={localize(to)} {...props} />;
}
