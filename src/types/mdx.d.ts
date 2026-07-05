/**
 * Tipi dei moduli markdown compilati dalla pipeline MDX (vite.config.ts):
 * default export = componente React; named export = frontmatter e TOC.
 */

interface DocFrontmatter {
  id?: string;
  title?: string;
  description?: string;
  sidebar_label?: string;
  slug?: string;
}

interface TocEntry {
  value: string;
  depth: number;
  id?: string;
  children?: TocEntry[];
}

declare module '*.md' {
  import type {ComponentType} from 'react';

  export const frontmatter: DocFrontmatter;
  export const tableOfContents: TocEntry[];

  const MDXContent: ComponentType<{
    components?: Record<string, ComponentType<never> | string>;
  }>;
  export default MDXContent;
}
