import {isValidElement, type HTMLAttributes, type ReactElement} from 'react';
import {Highlight, type PrismTheme} from 'prism-react-renderer';
import {CopyButton} from '@/components/ui/copy-button';
import {ScrollArea} from '@/components/ui/scroll-area';
import styles from './styles.module.css';

type CodeElementProps = {className?: string; children?: unknown};

// I colori restano variabili CSS anziche' valori fissi di oneLight/oneDark:
// lo script nel <head> puo' quindi applicare il tema corretto prima del paint,
// senza aspettare che React idrati il blocco e aggiorni il suo tema Prism.
const codeTheme: PrismTheme = {
  plain: {
    backgroundColor: 'var(--fd-code-background)',
    color: 'var(--fd-code-ink)',
  },
  styles: [
    {types: ['comment', 'prolog', 'cdata'], style: {color: 'var(--fd-code-comment)'}},
    {types: ['doctype', 'punctuation', 'entity'], style: {color: 'var(--fd-code-ink)'}},
    {
      types: ['attr-name', 'class-name', 'maybe-class-name', 'boolean', 'constant', 'number', 'atrule'],
      style: {color: 'var(--fd-code-number)'},
    },
    {types: ['keyword'], style: {color: 'var(--fd-code-keyword)'}},
    {types: ['property', 'tag', 'symbol', 'deleted', 'important'], style: {color: 'var(--fd-code-property)'}},
    {
      types: ['selector', 'string', 'char', 'builtin', 'inserted', 'regex', 'attr-value'],
      style: {color: 'var(--fd-code-string)'},
    },
    {types: ['variable', 'operator', 'function'], style: {color: 'var(--fd-code-function)'}},
    {types: ['url'], style: {color: 'var(--fd-code-url)'}},
    {types: ['deleted'], style: {textDecorationLine: 'line-through'}},
    {types: ['inserted'], style: {textDecorationLine: 'underline'}},
    {types: ['italic'], style: {fontStyle: 'italic'}},
    {types: ['important', 'bold'], style: {fontWeight: 'bold'}},
    {types: ['important'], style: {color: 'var(--fd-code-ink)'}},
  ],
};

/**
 * Sostituisce i <pre> generati da MDX: evidenziazione prism-react-renderer
 * (oneLight/oneDark, come il vecchio tema) + etichetta linguaggio + copia.
 */
export default function CodeBlock(props: HTMLAttributes<HTMLPreElement>) {
  // MDX produce <pre><code className="language-x">testo</code></pre>.
  const codeEl = isValidElement(props.children)
    ? (props.children as ReactElement<CodeElementProps>)
    : null;
  const rawCode =
    typeof codeEl?.props.children === 'string' ? codeEl.props.children : '';
  const language =
    codeEl?.props.className?.match(/language-([\w-]+)/)?.[1] ?? 'text';
  const code = rawCode.replace(/\n$/, '');

  // Fallback per contenuti non standard: rendi il pre cosi com'e.
  if (!codeEl) return <pre {...props} />;

  return (
    <figure className={styles.block}>
      <figcaption className={styles.header}>
        <span className={styles.lang}>{language}</span>
        <CopyButton value={code} size="sm" className={styles.copy} />
      </figcaption>
      <Highlight
        code={code}
        language={language}
        theme={codeTheme}>
        {({className, style, tokens, getLineProps, getTokenProps}) => (
          <ScrollArea
            className={`h-auto w-full ${styles.scrollArea}`}
            scrollbarGutter
            clampContentMinWidth={false}>
            <pre className={`${styles.pre} ${className}`} style={style}>
              <code>
                {tokens.map((line, i) => (
                  <span key={i} {...getLineProps({line})} className={styles.line}>
                    {line.map((token, j) => (
                      <span key={j} {...getTokenProps({token})} />
                    ))}
                    {'\n'}
                  </span>
                ))}
              </code>
            </pre>
          </ScrollArea>
        )}
      </Highlight>
    </figure>
  );
}
