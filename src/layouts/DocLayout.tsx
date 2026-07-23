import type {ReactNode} from 'react';
import Sidebar from '../components/Sidebar';
import Toc from '../components/Toc';
import Breadcrumbs from '../components/Breadcrumbs';
import DocPagination from '../components/DocPagination';
import type {DocModule} from '../content/docs-modules';
import type {DocId} from '../content/docs.config';
import {useLocale} from '../i18n/LocaleProvider';
import styles from './DocLayout.module.css';

type DocLayoutProps = {
  docId: DocId;
  toc: DocModule['tableOfContents'];
  children: ReactNode;
};

/** Layout a tre colonne delle pagine di documentazione: sidebar / articolo / TOC. */
export default function DocLayout({docId, toc, children}: DocLayoutProps) {
  const {locale} = useLocale();
  const isReference = docId.startsWith('reference/');

  return (
    <div className={styles.grid} data-pagefind-filter={`locale:${locale}`}>
      <aside className={styles.sidebar}>
        <Sidebar />
      </aside>

      <main className={styles.main} key={docId}>
        <Breadcrumbs docId={docId} />
        <article
          className="markdown"
          data-kind={isReference ? 'reference' : undefined}
          data-pagefind-body>
          {children}
        </article>
        <DocPagination docId={docId} />
      </main>

      <aside className={styles.toc}>
        <Toc entries={toc} />
      </aside>
    </div>
  );
}
