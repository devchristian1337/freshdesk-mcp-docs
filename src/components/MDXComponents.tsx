import type {AnchorHTMLAttributes} from 'react';
import {useLocation} from 'react-router';
import CodeBlock from './CodeBlock';
import {stripLocalePrefix} from '../i18n/config';
import {LocalizedLink} from '../i18n/LocaleProvider';

const translatedDocSlugs: Record<string, string> = {
  introduction: 'intro', installation: 'installazione', configuration: 'configurazione', examples: 'esempi',
  conversations: 'conversazioni', contacts: 'contatti', companies: 'aziende', agents: 'agenti', groups: 'gruppi',
  fields: 'campi', 'canned-responses': 'risposte-predefinite', solutions: 'soluzioni', tickets: 'tickets', overview: 'overview', prompts: 'prompts',
  'référence': 'reference', referencia: 'reference', referenz: 'reference',
};

function normalizeDocSegments(path: string): string {
  const segments = path.split('/').map((segment) => {
    const decoded = decodeURIComponent(segment);
    return translatedDocSlugs[decoded] ?? segment;
  });
  return segments.join('/');
}

function normalizedDocPath(href: string, pathname: string): string | undefined {
  const [hrefPath] = href.split('#');
  const compiledLocalePath = hrefPath.match(/^\/docs\/(?:en|it|es|de|fr)(\/.*)?$/);
  if (compiledLocalePath) {
    return normalizeDocSegments(`/docs${compiledLocalePath[1] ?? ''}`);
  }
  if (!href.includes('.md')) return undefined;
  const base = pathname.replace(/\/[^/]*$/, '/') || '/';
  const resolved = new URL(href, `https://freshdesk-mcp.local${base}`);
  const path = stripLocalePrefix(resolved.pathname).replace(/\.md$/, '');
  return normalizeDocSegments(path);
}

/** Mappa MDX: blocchi di codice e link interni, inclusi i .md tradotti. */
function MdxLink({href = '', children, ...rest}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const {pathname} = useLocation();
  const markdownPath = normalizedDocPath(href, pathname);
  if (href.startsWith('/') || markdownPath) {
    return <LocalizedLink to={markdownPath ?? href} {...rest}>{children}</LocalizedLink>;
  }
  const external = /^[a-z][\w+.-]*:/i.test(href);
  return <a href={href} {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})} {...rest}>{children}</a>;
}

export const mdxComponents = {pre: CodeBlock, a: MdxLink};
