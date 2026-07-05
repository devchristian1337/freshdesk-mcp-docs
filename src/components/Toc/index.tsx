import {useEffect, useState} from 'react';
import clsx from 'clsx';
import type {DocModule} from '../../content/docs-modules';
import styles from './styles.module.css';

type TocEntry = DocModule['tableOfContents'][number];

/** Appiattisce l'albero della TOC tenendo solo h2 e h3. */
function flatten(entries: TocEntry[], out: TocEntry[] = []): TocEntry[] {
  for (const e of entries) {
    if (e.depth >= 2 && e.depth <= 3 && e.id) out.push(e);
    if (e.children) flatten(e.children, out);
  }
  return out;
}

/**
 * "In questa pagina": indice dei titoli con evidenziazione della sezione
 * corrente durante lo scroll (IntersectionObserver sui heading).
 */
export default function Toc({entries}: {entries: TocEntry[]}) {
  const items = flatten(entries);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;
    const headings = items
      .map((i) => document.getElementById(i.id!))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (observed) => {
        // Il primo heading visibile nella fascia alta della finestra vince.
        const visible = observed
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {rootMargin: '-70px 0px -70% 0px'},
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
    // items dipende solo dal documento corrente
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  if (items.length === 0) return null;

  return (
    <nav className={styles.toc} aria-label="Indice della pagina">
      <p className={styles.title}>In questa pagina</p>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={clsx(
                styles.link,
                item.depth === 3 && styles.linkNested,
                activeId === item.id && styles.linkActive,
              )}>
              {item.value}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
