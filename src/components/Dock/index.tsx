import {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router';
import {BookOpen, Braces, Home, Moon, Search, Sun, Terminal} from 'lucide-react';
import LumaBar, {type DockItem} from '../ui/futuristic-nav';
import {GitHubIcon} from '../ui/github-icon';
import {useTheme} from '../../theme/ThemeProvider';
import {site} from '../../site.config';
import {OPEN_SEARCH_EVENT, SEARCH_STATE_EVENT} from '../SearchModal/events';

/**
 * Dock di navigazione del sito (sostituisce la navbar classica): voci di
 * route + azioni (ricerca Spotlight, cambio tema) + link GitHub. La voce
 * evidenziata deriva dalla route corrente.
 */

type RouteItem = DockItem & {to?: string; action?: 'search' | 'theme'};

export default function Dock() {
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const {theme, toggle} = useTheme();
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
    {id: 'home', icon: <Home />, label: 'Home', to: '/'},
    {id: 'docs', icon: <BookOpen />, label: 'Documentazione', to: '/docs/intro'},
    {id: 'reference', icon: <Braces />, label: 'Reference', to: '/docs/reference/overview'},
    {id: 'esempi', icon: <Terminal />, label: 'Esempi', to: '/docs/esempi'},
    {id: 'search', icon: <Search />, label: 'Cerca (Ctrl+K)', action: 'search'},
    {
      id: 'theme',
      icon: dark ? <Sun /> : <Moon />,
      label: dark ? 'Tema chiaro' : 'Tema scuro',
      action: 'theme',
    },
    {id: 'github', icon: <GitHubIcon size={24} />, label: 'GitHub', href: site.repoUrl},
  ];

  // La voce attiva segue la route: le azioni non "restano" mai attive.
  const activeIndex = pathname === '/'
    ? 0
    : pathname.startsWith('/docs/reference')
      ? 2
      : pathname === '/docs/esempi'
        ? 3
        : pathname.startsWith('/docs')
          ? 1
          : null;

  const handleSelect = (index: number) => {
    const item = items[index];
    if (item.action === 'search') {
      window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT));
    } else if (item.action === 'theme') {
      toggle();
    } else if (item.to) {
      navigate(item.to);
    }
  };

  return (
    <LumaBar
      items={items}
      activeIndex={activeIndex}
      onSelect={handleSelect}
      hidden={scrollHidden || searchOpen}
    />
  );
}
