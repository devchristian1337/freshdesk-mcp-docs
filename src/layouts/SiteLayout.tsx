import {Outlet, ScrollRestoration} from 'react-router';
import Dock from '../components/Dock';
import Footer from '../components/Footer';
import SearchModal from '../components/SearchModal';
import styles from './SiteLayout.module.css';

/** Guscio comune a tutte le pagine: contenuto, footer, dock e ricerca. */
export default function SiteLayout() {
  return (
    <div className={styles.shell}>
      <Dock />
      <div className={styles.content}>
        <Outlet />
      </div>
      <Footer />
      <SearchModal />
      <ScrollRestoration />
    </div>
  );
}
