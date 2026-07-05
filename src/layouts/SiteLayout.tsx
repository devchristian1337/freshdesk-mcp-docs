import {Outlet, ScrollRestoration} from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchModal from '../components/SearchModal';
import styles from './SiteLayout.module.css';

/** Guscio comune a tutte le pagine: navbar, contenuto, footer, ricerca. */
export default function SiteLayout() {
  return (
    <div className={styles.shell}>
      <Navbar />
      <div className={styles.content}>
        <Outlet />
      </div>
      <Footer />
      <SearchModal />
      <ScrollRestoration />
    </div>
  );
}
