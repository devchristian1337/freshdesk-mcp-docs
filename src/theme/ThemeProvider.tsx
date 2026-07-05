import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggle: () => {},
});

/** Tema iniziale: legge l'attributo impostato dallo script anti-FOUC in index.html. */
function initialTheme(): Theme {
  if (typeof document === 'undefined') return 'light'; // prerender SSG
  return document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light';
}

export function ThemeProvider({children}: {children: ReactNode}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  // Applica il tema al documento e persiste la scelta esplicita.
  const apply = useCallback((next: Theme, persist: boolean) => {
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    if (persist) {
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* storage non disponibile: il tema vale solo per la sessione */
      }
    }
  }, []);

  const toggle = useCallback(() => {
    apply(theme === 'dark' ? 'light' : 'dark', true);
  }, [theme, apply]);

  // Se l'utente non ha mai scelto, segui i cambi di preferenza di sistema.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem('theme');
      } catch {
        /* ignora */
      }
      if (!saved) apply(e.matches ? 'dark' : 'light', false);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [apply]);

  return (
    <ThemeContext.Provider value={{theme, toggle}}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
