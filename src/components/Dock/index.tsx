import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import {useLocation, useNavigate} from 'react-router';
import {BookOpen, Check, Globe2, Home, Moon, Search, Sun, Terminal} from 'lucide-react';
import LumaBar, {type DockItem} from '../ui/futuristic-nav';
import {GitHubIcon} from '../ui/github-icon';
import {useTheme} from '../../theme/ThemeProvider';
import {site} from '../../site.config';
import {OPEN_SEARCH_EVENT, SEARCH_STATE_EVENT} from '../SearchModal/events';
import {localeInfo, locales, localizePath, type Locale} from '../../i18n/config';
import {useLocale} from '../../i18n/LocaleProvider';
import {uiCopy} from '../../i18n/copy';

/**
 * Dock di navigazione del sito (sostituisce la navbar classica): voci di
 * route + azioni (ricerca Spotlight, cambio tema) + link GitHub. La voce
 * evidenziata deriva dalla route corrente.
 */

type RouteItem = DockItem & {to?: string; action?: 'search' | 'theme'};

function LanguageMenu() {
  const {pathname, search, hash} = useLocation();
  const navigate = useNavigate();
  const {locale} = useLocale();
  const t = uiCopy[locale];
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState(false);
  const selectedIndex = locales.indexOf(locale);

  const changeLanguage = (next: Locale) => {
    setOpen(false);
    if (next !== locale) navigate(`${localizePath(next, pathname)}${search}${hash}`);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const focusOption = (index: number) => {
    optionRefs.current[index]?.focus();
  };

  const openMenu = (focusIndex = selectedIndex) => {
    setOpen(true);
    requestAnimationFrame(() => focusOption(focusIndex));
  };

  const closeMenu = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu(event.key === 'ArrowUp' ? locales.length - 1 : selectedIndex);
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      closeMenu(true);
    }
  };

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const currentIndex = optionRefs.current.findIndex(
      (option) => option === document.activeElement,
    );

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      const nextIndex = (currentIndex + direction + locales.length) % locales.length;
      focusOption(nextIndex);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      focusOption(event.key === 'Home' ? 0 : locales.length - 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
    } else if (event.key === 'Tab') {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleScroll = () => setOpen(false);

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname, search, hash]);

  return (
    <div
      ref={rootRef}
      className="relative flex w-11 h-11 max-sm:w-9 max-sm:h-9 items-center justify-center">
      <button
        ref={triggerRef}
        type="button"
        aria-label={`${t.language}: ${localeInfo[locale].nativeName}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => (open ? closeMenu(true) : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        className={`relative flex h-full w-full items-center justify-center rounded-full border-0 bg-transparent p-0 group cursor-pointer transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--fd-primary)] focus-visible:outline-offset-2 ${
          open
            ? 'text-[var(--fd-primary)]'
            : 'text-[var(--fd-ink-2)] hover:text-[var(--fd-primary)]'
        }`}>
        <Globe2 aria-hidden="true" className="size-5 max-sm:size-[18px]" />
        <span
          aria-hidden="true"
          className={`absolute bottom-full mb-2 px-2 py-1 text-xs rounded-md bg-[var(--fd-ink)] text-[var(--fd-paper)] whitespace-nowrap pointer-events-none transition-opacity ${
            open
              ? 'invisible opacity-0'
              : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
          }`}>
          {t.language}
        </span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t.language}
          aria-orientation="vertical"
          onKeyDown={handleMenuKeyDown}
          className="absolute bottom-[calc(100%+0.75rem)] right-0 z-[60] w-44 rounded-xl border border-[var(--fd-line)] bg-[var(--fd-surface)] p-1.5 shadow-[var(--fd-shadow-pop)]">
          <span
            aria-hidden="true"
            className="absolute -bottom-1.5 right-3 -z-10 size-3 rotate-45 border-b border-r border-[var(--fd-line)] bg-[var(--fd-surface)]"
          />
          <span
            aria-hidden="true"
            className="block px-2.5 pb-1.5 pt-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--fd-ink-3)]">
            {t.language}
          </span>
          {locales.map((candidate, index) => {
            const selected = candidate === locale;
            return (
              <button
                key={candidate}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                tabIndex={-1}
                onClick={() => changeLanguage(candidate)}
                className={`flex min-h-11 w-full items-center gap-3 rounded-lg border-0 px-2.5 py-2 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--fd-primary)] focus-visible:outline-offset-[-2px] ${
                  selected
                    ? 'bg-[var(--fd-primary-tint)] text-[var(--fd-primary-strong)]'
                    : 'bg-transparent text-[var(--fd-ink-2)] hover:bg-[var(--fd-sunken)] hover:text-[var(--fd-ink)]'
                }`}>
                <span
                  aria-hidden="true"
                  className="w-5 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.08em] opacity-70">
                  {candidate}
                </span>
                <span className="flex-1 font-medium">{localeInfo[candidate].nativeName}</span>
                <Check
                  aria-hidden="true"
                  className={`size-4 text-[var(--fd-primary)] ${selected ? 'opacity-100' : 'opacity-0'}`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Dock() {
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const {theme, toggle} = useTheme();
  const {locale, localize} = useLocale();
  const t = uiCopy[locale];
  const dark = theme === 'dark';

  // Nascosto scrollando in basso (riappare salendo), come la vecchia navbar
  // ma verso il basso; nascosto anche mentre lo Spotlight è aperto.
  const [scrollHidden, setScrollHidden] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrollHidden(y > 80 && y > lastY.current);
      lastY.current = y;
    };
    const onSearchState = (e: Event) => {
      setSearchOpen(Boolean((e as CustomEvent<{open: boolean}>).detail?.open));
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener(SEARCH_STATE_EVENT, onSearchState);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener(SEARCH_STATE_EVENT, onSearchState);
    };
  }, []);

  const items: RouteItem[] = [
    {id: 'home', icon: <Home />, label: t.home, to: '/'},
    {id: 'docs', icon: <BookOpen />, label: t.documentation, to: '/docs/intro'},
    {id: 'esempi', icon: <Terminal />, label: t.examples, to: '/docs/esempi'},
    {id: 'search', icon: <Search />, label: t.searchLabel, action: 'search'},
    {
      id: 'theme',
      icon: dark ? <Sun /> : <Moon />,
      label: dark ? t.lightTheme : t.darkTheme,
      action: 'theme',
    },
    {id: 'github', icon: <GitHubIcon size={24} />, label: 'GitHub', href: site.repoUrl},
  ];

  // La voce attiva segue la route: le azioni non "restano" mai attive.
  const localPath = pathname.replace(/^\/(?:it|es|de|fr)(?=\/|$)/, '') || '/';
  const activeIndex = localPath === '/'
    ? 0
    : localPath === '/docs/esempi'
      ? 2
      : localPath.startsWith('/docs')
        ? 1
        : null;

  const handleSelect = (index: number) => {
    const item = items[index];
    if (item.action === 'search') {
      window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT));
    } else if (item.action === 'theme') {
      toggle();
    } else if (item.to) {
      navigate(localize(item.to));
    }
  };

  return (
    <LumaBar
      items={items}
      activeIndex={activeIndex}
      onSelect={handleSelect}
      hidden={scrollHidden || searchOpen}
      extra={<LanguageMenu />}
      extraAfterIndex={4}
    />
  );
}
