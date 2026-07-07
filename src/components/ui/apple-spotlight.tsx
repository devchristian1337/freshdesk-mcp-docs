import React, {useEffect, useRef} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {ChevronRight, FileText, Search} from 'lucide-react';
import {cn} from '@/lib/utils';

/**
 * Spotlight di ricerca in stile macOS (blob morphing + framer-motion),
 * adattato al design system del sito: colori dai token --fd-* (light/dark),
 * risultati e scorciatoie iniettati dall'esterno (vedi SearchModal).
 */

export interface SpotlightShortcut {
  label: string;
  icon: React.ReactNode;
  link: string;
  external?: boolean;
}

export interface SpotlightResult {
  label: string;
  /** Estratto HTML (Pagefind evidenzia i termini con <mark>). */
  descriptionHtml: string;
  link: string;
}

const SVGFilter = () => {
  return (
    <svg width="0" height="0" aria-hidden="true">
      <filter id="blob">
        <feGaussianBlur stdDeviation="10" in="SourceGraphic" />
        <feColorMatrix
          values="
      1 0 0 0 0
      0 1 0 0 0
      0 0 1 0 0
      0 0 0 18 -9
    "
          result="blob"
        />
        <feBlend in="SourceGraphic" in2="blob" />
      </filter>
    </svg>
  );
};

interface ShortcutButtonProps {
  shortcut: SpotlightShortcut;
  onNavigate: (link: string, external: boolean) => void;
}

const ShortcutButton = ({shortcut, onNavigate}: ShortcutButtonProps) => {
  return (
    <a
      href={shortcut.link}
      target={shortcut.external ? '_blank' : undefined}
      rel={shortcut.external ? 'noopener noreferrer' : undefined}
      aria-label={shortcut.label}
      onClick={(e) => {
        if (!shortcut.external) {
          e.preventDefault();
          onNavigate(shortcut.link, false);
        }
      }}>
      <div className="rounded-full cursor-pointer hover:shadow-lg opacity-40 hover:opacity-100 transition-[opacity,box-shadow] duration-200">
        <div className="size-16 aspect-square flex items-center justify-center">
          {shortcut.icon}
        </div>
      </div>
    </a>
  );
};

interface SpotlightPlaceholderProps {
  text: string;
  className?: string;
}

const SpotlightPlaceholder = ({text, className}: SpotlightPlaceholderProps) => {
  return (
    <motion.div
      layout
      className={cn(
        'absolute text-[var(--fd-ink-3)] flex items-center pointer-events-none z-10',
        className,
      )}>
      <AnimatePresence mode="popLayout">
        <motion.p
          layoutId={`placeholder-${text}`}
          key={`placeholder-${text}`}
          initial={{opacity: 0, y: 10, filter: 'blur(5px)'}}
          animate={{opacity: 1, y: 0, filter: 'blur(0px)'}}
          exit={{opacity: 0, y: -10, filter: 'blur(5px)'}}
          transition={{duration: 0.2, ease: 'easeOut'}}
          // m-0: senza il preflight Tailwind il <p> ha il margine di default
          // del browser e scivolerebbe sotto l'input.
          className="m-0 whitespace-nowrap">
          {text}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
};

interface SpotlightInputProps {
  placeholder: string;
  hidePlaceholder: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholderClassName?: string;
}

const SpotlightInput = ({
  placeholder,
  hidePlaceholder,
  value,
  onChange,
  placeholderClassName,
}: SpotlightInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Porta subito il focus nel campo appena lo Spotlight si apre.
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex items-center w-full justify-start gap-3 px-6 h-16 max-sm:px-5">
      <motion.div layoutId="search-icon" className="text-[var(--fd-ink-2)]">
        <Search />
      </motion.div>
      <div className="min-w-0 flex-1 relative text-2xl max-sm:text-lg">
        {!hidePlaceholder && (
          <SpotlightPlaceholder text={placeholder} className={placeholderClassName} />
        )}

        <motion.input
          ref={inputRef}
          layout="position"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Cerca nella documentazione"
          autoComplete="off"
          spellCheck={false}
          data-no-focus-ring=""
          // border-0/p-0/[font:inherit]: senza preflight l'input tiene
          // bordo, padding e font di default del browser.
          className="w-full bg-transparent outline-none border-0 p-0 [font:inherit] text-[var(--fd-ink)]"
        />
      </div>
      <kbd className="font-[family-name:var(--fd-font-mono)] text-[0.68rem] text-[var(--fd-ink-3)] border border-[var(--fd-line)] rounded px-1.5 py-0.5 max-sm:hidden">
        Esc
      </kbd>
    </div>
  );
};

interface SearchResultCardProps {
  result: SpotlightResult;
  isLast: boolean;
  onNavigate: (link: string, external: boolean) => void;
}

const SearchResultCard = ({result, isLast, onNavigate}: SearchResultCardProps) => {
  return (
    <a
      href={result.link}
      className="overflow-hidden w-full group/card"
      onClick={(e) => {
        e.preventDefault();
        onNavigate(result.link, false);
      }}>
      <div
        className={cn(
          'flex items-center text-[var(--fd-ink)] justify-start hover:bg-[var(--fd-sunken)] gap-3 py-2 px-2 rounded-xl hover:shadow-md w-full',
          isLast && 'rounded-b-3xl',
        )}>
        <div className="size-8 [&_svg]:stroke-[1.5] [&_svg]:size-6 aspect-square flex items-center justify-center text-[var(--fd-ink-2)]">
          <FileText />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="font-medium m-0">{result.label}</p>
          <p
            className="text-xs opacity-60 m-0 line-clamp-2 [&_mark]:bg-transparent [&_mark]:font-semibold [&_mark]:text-[var(--fd-primary-strong)]"
            // Estratto generato da Pagefind sull'HTML del sito stesso.
            dangerouslySetInnerHTML={{__html: result.descriptionHtml}}
          />
        </div>
        <div className="flex-1 flex items-center justify-end opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
          <ChevronRight className="size-6" />
        </div>
      </div>
    </a>
  );
};

interface SearchResultsContainerProps {
  searchResults: SpotlightResult[];
  emptyText: string;
  notice?: React.ReactNode;
  onHover: (index: number | null) => void;
  onNavigate: (link: string, external: boolean) => void;
}

const SearchResultsContainer = ({
  searchResults,
  emptyText,
  notice,
  onHover,
  onNavigate,
}: SearchResultsContainerProps) => {
  return (
    <motion.div
      layout
      onMouseLeave={() => onHover(null)}
      className="px-2 border-t border-[var(--fd-line)] flex flex-col bg-[var(--fd-surface)] max-h-96 overflow-y-auto w-full py-2">
      {notice ? (
        <div className="px-3 py-3 text-sm text-[var(--fd-ink-2)]">{notice}</div>
      ) : searchResults.length === 0 ? (
        <div className="px-3 py-3 text-sm text-[var(--fd-ink-2)]">{emptyText}</div>
      ) : (
        searchResults.map((result, index) => {
          return (
            <motion.div
              key={`search-result-${result.link}-${index}`}
              onMouseEnter={() => onHover(index)}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{
                delay: index * 0.05,
                duration: 0.2,
                ease: 'easeOut',
              }}>
              <SearchResultCard
                result={result}
                isLast={index === searchResults.length - 1}
                onNavigate={onNavigate}
              />
            </motion.div>
          );
        })
      )}
    </motion.div>
  );
};

export interface AppleSpotlightProps {
  isOpen: boolean;
  handleClose: () => void;
  shortcuts?: SpotlightShortcut[];
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  searchResults: SpotlightResult[];
  /** Avviso da mostrare al posto dei risultati (es. indice assente in dev). */
  notice?: React.ReactNode;
  onNavigate: (link: string, external: boolean) => void;
}

const AppleSpotlight = ({
  isOpen,
  handleClose,
  shortcuts = [],
  searchValue,
  onSearchValueChange,
  searchResults,
  notice,
  onNavigate,
}: AppleSpotlightProps) => {
  const [hovered, setHovered] = React.useState(false);
  const [hoveredSearchResult, setHoveredSearchResult] = React.useState<number | null>(
    null,
  );
  const [hoveredShortcut, setHoveredShortcut] = React.useState<number | null>(null);

  // Niente MotionConfig reducedMotion="user": come nella demo originale le
  // animazioni girano anche con "riduci animazioni" attivo nel sistema
  // (scelta esplicita del proprietario del sito).
  return (
    <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            // Niente url(#blob) sull'overlay full-screen: il filtro SVG su
            // tutto il viewport è pesantissimo; il morphing serve solo sul
            // gruppo interno.
            initial={{
              opacity: 0,
              filter: 'blur(20px)',
              scaleX: 1.3,
              scaleY: 1.1,
              y: -10,
            }}
            animate={{
              opacity: 1,
              filter: 'blur(0px)',
              scaleX: 1,
              scaleY: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              filter: 'blur(20px)',
              scaleX: 1.3,
              scaleY: 1.1,
              y: 10,
            }}
            transition={{
              stiffness: 550,
              damping: 50,
              type: 'spring',
            }}
            // Velo scuro: separa lo Spotlight dalla pagina densa di testo
            // sottostante (l'originale fluttuava su un desktop vuoto).
            className="fixed inset-0 z-[200] flex flex-col items-center justify-start pt-[16vh] px-4 bg-black/40"
            onClick={handleClose}>
            <SVGFilter />

            <div
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => {
                setHovered(false);
                setHoveredShortcut(null);
              }}
              onClick={(e) => e.stopPropagation()}
              style={{filter: 'url(#blob)'}}
              className={cn(
                'w-full flex items-center justify-end gap-4 z-20 group',
                '[&>div]:bg-[var(--fd-surface)] [&>div]:text-[var(--fd-ink)] [&>div]:rounded-full [&>div]:backdrop-blur-xl',
                '[&_svg]:size-7 [&_svg]:stroke-[1.4]',
                'max-w-3xl',
              )}>
              <AnimatePresence mode="popLayout">
                <motion.div
                  layoutId="search-input-container"
                  transition={{
                    layout: {
                      duration: 0.5,
                      type: 'spring',
                      bounce: 0.2,
                    },
                  }}
                  style={{
                    borderRadius: '30px',
                  }}
                  className="h-full w-full flex flex-col items-center justify-start z-10 relative shadow-[var(--fd-shadow-pop)] overflow-hidden border border-[var(--fd-line)]">
                  <SpotlightInput
                    placeholder={
                      hoveredShortcut !== null && shortcuts[hoveredShortcut]
                        ? shortcuts[hoveredShortcut].label
                        : hoveredSearchResult !== null && searchResults[hoveredSearchResult]
                          ? searchResults[hoveredSearchResult].label
                          : 'Cerca nella documentazione'
                    }
                    placeholderClassName={
                      hoveredSearchResult !== null
                        ? 'text-[var(--fd-ink)]'
                        : 'text-[var(--fd-ink-3)]'
                    }
                    hidePlaceholder={!(hoveredSearchResult !== null || !searchValue)}
                    value={searchValue}
                    onChange={onSearchValueChange}
                  />

                  {searchValue && (
                    <SearchResultsContainer
                      searchResults={searchResults}
                      emptyText={`Nessun risultato per «${searchValue}»`}
                      notice={notice}
                      onHover={setHoveredSearchResult}
                      onNavigate={onNavigate}
                    />
                  )}
                </motion.div>
                {hovered &&
                  !searchValue &&
                  shortcuts.map((shortcut, index) => (
                    <motion.div
                      key={`shortcut-${shortcut.label}`}
                      onMouseEnter={() => setHoveredShortcut(index)}
                      layout
                      initial={{scale: 0.7, x: -1 * (64 * (index + 1))}}
                      animate={{scale: 1, x: 0}}
                      exit={{
                        scale: 0.7,
                        x:
                          1 *
                          (16 * (shortcuts.length - index - 1) +
                            64 * (shortcuts.length - index - 1)),
                      }}
                      transition={{
                        duration: 0.8,
                        type: 'spring',
                        bounce: 0.2,
                        delay: index * 0.05,
                      }}
                      // max-md:hidden: su touch non c'è hover e i 4 cerchi
                      // (64px l'uno) schiaccerebbero la pill di ricerca.
                      className="rounded-full cursor-pointer max-md:hidden">
                      <ShortcutButton shortcut={shortcut} onNavigate={onNavigate} />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
    </AnimatePresence>
  );
};

export {AppleSpotlight};
