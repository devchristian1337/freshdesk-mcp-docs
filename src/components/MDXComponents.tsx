import type {AnchorHTMLAttributes} from 'react';
import {Link} from 'react-router';
import CodeBlock from './CodeBlock';

/**
 * Mappa dei componenti passata a MDXProvider: code block evidenziati
 * e link interni gestiti dal router (navigazione SPA senza reload).
 */

function MdxLink({href = '', children, ...rest}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  // Route interne → react-router; ancore e URL esterni → <a> normale.
  if (href.startsWith('/')) {
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    );
  }
  const external = /^[a-z][\w+.-]*:/i.test(href);
  return (
    <a
      href={href}
      {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
      {...rest}>
      {children}
    </a>
  );
}

export const mdxComponents = {
  pre: CodeBlock,
  a: MdxLink,
};
