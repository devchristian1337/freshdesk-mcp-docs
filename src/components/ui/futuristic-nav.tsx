import React, {useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';

/**
 * LumaBar: dock di navigazione flottante in basso (glassmorphism), adattata
 * al design system del sito (token --fd-*). La voce attiva è indicata da
 * colore + puntino che scorre (niente glow sfumato); il dock scivola fuori
 * dallo schermo quando `hidden` è true (scroll verso il basso o Spotlight
 * aperto). Il cablaggio di sito sta in components/Dock.
 */

export interface DockItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  /** Se presente la voce è un link esterno (nuova scheda). */
  href?: string;
}

interface LumaBarProps {
  items: DockItem[];
  /** Indice della voce evidenziata (null = nessuna). */
  activeIndex: number | null;
  onSelect: (index: number) => void;
  /** True = il dock scivola fuori dallo schermo (verso il basso). */
  hidden?: boolean;
}

const buttonClasses =
  'flex items-center justify-center w-11 h-11 max-sm:w-9 max-sm:h-9 ' +
  '[&_svg]:size-5 max-sm:[&_svg]:size-[18px] ' +
  'text-[var(--fd-ink-2)] hover:text-[var(--fd-primary)] relative z-10 ' +
  'bg-transparent border-0 p-0 cursor-pointer transition-colors duration-200';

const LumaBar = ({items, activeIndex, onSelect, hidden = false}: LumaBarProps) => {
  // Pallino indicatore: elemento UNICO che scivola sotto la voce attiva.
  // Misuriamo il centro della voce e animiamo `left` con una molla: così lo
  // spostamento è sempre fluido (niente smonta/rimonta per voce).
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [dotLeft, setDotLeft] = useState<number | null>(null);

  useEffect(() => {
    const measure = () => {
      const el = activeIndex !== null ? itemRefs.current[activeIndex] : null;
      setDotLeft(el ? el.offsetLeft + el.offsetWidth / 2 : null);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeIndex, items.length]);

  return (
    <motion.div
      data-dock-hidden={hidden || undefined}
      className="fixed bottom-5 max-sm:bottom-3 left-1/2 -translate-x-1/2 z-50"
      initial={false}
      animate={{y: hidden ? 140 : 0, opacity: hidden ? 0 : 1}}
      transition={{type: 'spring', stiffness: 400, damping: 34}}>
      <nav
        aria-label="Navigazione principale"
        className="relative flex items-center justify-center gap-3 max-sm:gap-1 bg-[var(--fd-surface)]/75 backdrop-blur-2xl rounded-full px-4 py-2 max-sm:px-2.5 max-sm:py-1.5 shadow-[var(--fd-shadow-pop)] border border-[var(--fd-line)]">
        {/* Pallino della voce attiva: scivola verso la voce cliccata. */}
        <motion.span
          aria-hidden="true"
          className="absolute bottom-[3px] w-1 h-1 rounded-full bg-[var(--fd-primary)] -translate-x-1/2 pointer-events-none"
          initial={false}
          animate={{left: dotLeft ?? '50%', opacity: dotLeft === null ? 0 : 1}}
          transition={{type: 'spring', stiffness: 400, damping: 28}}
        />
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const motionProps = {
            whileHover: {scale: 1.15},
            animate: {scale: isActive ? 1.25 : 1},
            // Molla poco smorzata: la voce appena attivata fa un piccolo
            // "pop" elastico oltre la scala finale.
            transition: {type: 'spring', stiffness: 500, damping: 15} as const,
          };
          return (
            <motion.div
              key={item.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="relative flex flex-col items-center group">
              {item.href ? (
                <motion.a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  {...motionProps}
                  className={buttonClasses}>
                  {item.icon}
                </motion.a>
              ) : (
                <motion.button
                  type="button"
                  onClick={() => onSelect(index)}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  {...motionProps}
                  className={buttonClasses}
                  style={{color: isActive ? 'var(--fd-primary)' : undefined}}>
                  {item.icon}
                </motion.button>
              )}

              {/* Tooltip sopra il dock */}
              <span className="absolute bottom-full mb-2 px-2 py-1 text-xs rounded-md bg-[var(--fd-ink)] text-[var(--fd-paper)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.label}
              </span>
            </motion.div>
          );
        })}
      </nav>
    </motion.div>
  );
};

export default LumaBar;
