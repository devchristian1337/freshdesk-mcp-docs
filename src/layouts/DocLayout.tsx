import type {ReactNode} from 'react';
import Sidebar from '../components/Sidebar';
import Toc from '../components/Toc';
import Breadcrumbs from '../components/Breadcrumbs';
import DocPagination from '../components/DocPagination';
import type {DocModule} from '../content/docs-modules';
import styles from './DocLayout.module.css';

type DocLayoutProps = {
  docId: string;
  toc: DocModule['tableOfContents'];
  children: ReactNode;
};

/** Layout a tre colonne delle pagine di documentazione: sidebar / articolo / TOC. */
export default function DocLayout({docId, toc, children}: DocLayoutProps) {
  const isReference = docId.startsWith('reference/');

  return (
    <div className={styles.grid}>
      <aside className={styles.sidebar}>
        <Sidebar />
      </aside>

      <div className={styles.main} key={docId}>
        <Breadcrumbs docId={docId} />
        <article
          className="markdown"
          data-kind={isReference ? 'reference' : undefined}
          data-pagefind-body>
          {children}
        </article>
        <DocPagination docId={docId} />
      </div>

      <aside className={styles.toc}>
        <Toc entries={toc} />
      </aside>
    </div>
  );
}
