import React, {useEffect, useRef, useState, type ReactNode} from 'react';
import styles from './styles.module.css';

type RevealProps = {
  children: ReactNode;
  /** Ritardo in ms per scaglionare l'entrata. */
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
};

/**
 * Wrapper di scroll-reveal: entrata calma (fade + slide) quando l'elemento
 * entra nel viewport. Rispetta prefers-reduced-motion mostrando subito il
 * contenuto, e fa il fallback a "visibile" se IntersectionObserver non c'è.
 */
export default function Reveal({
  children,
  delay = 0,
  as = 'div',
  className,
}: RevealProps): JSX.Element {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const Tag = as as any;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
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
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.visible : ''} ${className ?? ''}`}
      style={{transitionDelay: `${delay}ms`}}>
      {children}
    </Tag>
  );
}
