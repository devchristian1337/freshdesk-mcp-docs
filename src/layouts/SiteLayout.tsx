import {useLayoutEffect} from 'react';
import {Outlet, useLocation, useNavigationType} from 'react-router';
import Dock from '../components/Dock';
import Footer from '../components/Footer';
import SearchModalController from '../components/SearchModal/Controller';
import styles from './SiteLayout.module.css';

/**
 * Il sito e' prerenderizzato: al refresh il browser puo' quindi ripristinare
 * la posizione di scroll prima del paint. ScrollRestoration di React Router,
 * invece, la ripristina solo dopo l'hydration e rende visibile lo scorrimento
 * dalla cima della pagina. Per le sole navigazioni interne manteniamo il
 * comportamento atteso di apertura in alto (o sull'ancora richiesta).
 */
function ScrollOnNavigation() {
  const {hash, pathname} = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    // POP copre il primo caricamento, refresh, indietro e avanti: lascia che
    // sia il browser a usare la sua posizione gia' disponibile.
    if (navigationType === 'POP') return;

    if (hash) {
      document
        .getElementById(decodeURIComponent(hash.slice(1)))
        ?.scrollIntoView({behavior: 'smooth'});
      return;
    }

    // Il comportamento esplicito auto non eredita lo smooth scroll globale.
    window.scrollTo({top: 0, left: 0, behavior: 'auto'});
  }, [hash, navigationType, pathname]);

  return null;
}

/** Guscio comune a tutte le pagine: contenuto, footer, dock e ricerca. */
export default function SiteLayout() {
  return (
    <div className={styles.shell}>
      <Dock />
      <div className={styles.content}>
        <Outlet />
      </div>
      <Footer />
      <SearchModalController />
      <ScrollOnNavigation />
    </div>
  );
}
