import {isValidElement, useState, type HTMLAttributes, type ReactElement} from 'react';
import {Highlight, themes} from 'prism-react-renderer';
import {useTheme} from '../../theme/ThemeProvider';
import styles from './styles.module.css';

type CodeElementProps = {className?: string; children?: unknown};

/**
 * Sostituisce i <pre> generati da MDX: evidenziazione prism-react-renderer
 * (oneLight/oneDark, come il vecchio tema) + etichetta linguaggio + copia.
 */
export default function CodeBlock(props: HTMLAttributes<HTMLPreElement>) {
  const {theme} = useTheme();
  const [copied, setCopied] = useState(false);

  // MDX produce <pre><code className="language-x">testo</code></pre>.
  const codeEl = isValidElement(props.children)
    ? (props.children as ReactElement<CodeElementProps>)
    : null;
  const rawCode =
    typeof codeEl?.props.children === 'string' ? codeEl.props.children : '';
  const language =
    codeEl?.props.className?.match(/language-([\w-]+)/)?.[1] ?? 'text';
  const code = rawCode.replace(/\n$/, '');

  // Fallback per contenuti non standard: rendi il pre così com'è.
  if (!codeEl) return <pre {...props} />;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard non disponibile (http, permessi): nessun feedback */
    }
  };

  return (
    <figure className={styles.block}>
      <figcaption className={styles.header}>
        <span className={styles.lang}>{language}</span>
        <button
          type="button"
          className={styles.copy}
          onClick={copy}
          aria-label="Copia il codice">
          {copied ? 'Copiato ✓' : 'Copia'}
        </button>
      </figcaption>
      <Highlight
        code={code}
        language={language}
        theme={theme === 'dark' ? themes.oneDark : themes.oneLight}>
        {({className, style, tokens, getLineProps, getTokenProps}) => (
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
        )}
      </Highlight>
    </figure>
  );
}
