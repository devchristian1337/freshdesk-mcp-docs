import {useEffect, useRef, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type RevealProps = {
  children: ReactNode;
  /** Ritardo in ms per scaglionare l'entrata. */
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
};

/**
 * Wrapper di scroll-reveal: entrata calma (fade + slide) quando l'elemento
 * entra nel viewport. Rispetta prefers-reduced-motion mostrando subito il
 * contenuto, e fa il fallback a "visibile" se IntersectionObserver non c'è.
 * Nel prerender SSG parte visibile: niente contenuto nascosto senza JS.
 */
export default function Reveal({
  children,
  delay = 0,
  as = 'div',
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  // Visibile di default (SSG/no-JS); l'effetto lo nasconde e anima solo
  // se l'osservazione è possibile.
  const [state, setState] = useState<'static' | 'hidden' | 'shown'>('static');
  const Tag = as as 'div';

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') return;

    // Se l'elemento è già nel viewport iniziale non animarlo affatto.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) return;

    setState('hidden');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setState('shown');
            observer.unobserve(entry.target);
          }
        });
      },
      {threshold: 0.16, rootMargin: '0px 0px -8% 0px'},
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={clsx(
        state !== 'static' && styles.reveal,
        state === 'shown' && styles.visible,
        className,
      )}
      style={{transitionDelay: `${delay}ms`}}>
      {children}
    </Tag>
  );
}
