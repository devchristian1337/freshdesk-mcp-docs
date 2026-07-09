import {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router';
import {Menu} from '@base-ui/react/menu';
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
  const {pathname, search} = useLocation();
  const navigate = useNavigate();
  const {locale} = useLocale();
  const t = uiCopy[locale];

  const changeLanguage = (next: Locale) => {
    if (next !== locale) navigate(`${localizePath(next, pathname)}${search}`);
  };

  return (
    <div className="relative flex flex-col items-center group">
      <Menu.Root>
        <Menu.Trigger
          aria-label={t.language}
          className="flex items-center justify-center w-11 h-11 max-sm:w-9 max-sm:h-9 [&_svg]:size-5 max-sm:[&_svg]:size-[18px] text-[var(--fd-ink-2)] hover:text-[var(--fd-primary)] relative z-10 bg-transparent border-0 p-0 cursor-pointer transition-[color,transform] duration-200 hover:scale-110 active:scale-[0.98]">
          <Globe2 />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner side="top" align="center" sideOffset={12} className="z-[60]">
            <Menu.Popup className="w-max select-none rounded-[var(--fd-radius)] border border-[var(--fd-line)] bg-[var(--fd-surface)] p-1.5 shadow-[var(--fd-shadow-pop)] outline-none">
              <Menu.RadioGroup value={locale} onValueChange={(value) => changeLanguage(value as Locale)}>
                {locales.map((candidate) => (
                  <Menu.RadioItem
                    key={candidate}
                    value={candidate}
                    closeOnClick
                    label={localeInfo[candidate].nativeName}
                    className="flex w-full cursor-pointer select-none items-center justify-start gap-2 rounded-[var(--fd-radius-sm)] px-3 py-2 text-sm text-[var(--fd-ink)] outline-none data-[highlighted]:bg-[var(--fd-primary-tint)] data-[highlighted]:text-[var(--fd-primary-strong)]">
                    {localeInfo[candidate].nativeName}
                    <Menu.RadioItemIndicator className="text-[var(--fd-primary)]">
                      <Check size={16} strokeWidth={2} />
                    </Menu.RadioItemIndicator>
                  </Menu.RadioItem>
                ))}
              </Menu.RadioGroup>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      <span className="absolute bottom-full mb-2 px-2 py-1 text-xs rounded-md bg-[var(--fd-ink)] text-[var(--fd-paper)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {t.language}
      </span>
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
