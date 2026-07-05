import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import withToc from '@stefanprobst/rehype-extract-toc';
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx';
import remarkAdmonitions from './plugins/remark-admonitions';
import remarkDocLinks from './plugins/remark-doc-links';

export default defineConfig({
  plugins: [
    {
      // MDX deve girare prima di plugin-react. I .md di docs/ sono
      // trattati come MDX (come fa Docusaurus): il JSX inline funziona.
      enforce: 'pre',
      ...mdx({
        // Anche i .md sono MDX (come in Docusaurus): il JSX inline
        // (<span className="fd-tag">) viene interpretato, non scartato.
        format: 'mdx',
        mdxExtensions: ['.md', '.mdx'],
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, {name: 'frontmatter'}],
          remarkGfm,
          remarkDirective,
          remarkAdmonitions,
          remarkDocLinks,
        ],
        rehypePlugins: [
          // rehype-slug usa github-slugger: ancore identiche a Docusaurus.
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: 'append',
              properties: {
                className: ['anchor-link'],
                ariaLabel: 'Link diretto',
                // Fuori dall'indice di ricerca: niente ¶ nei titoli dei risultati.
                dataPagefindIgnore: 'all',
              },
              content: {type: 'text', value: '¶'},
            },
          ],
          // Estrae la TOC e la esporta dal modulo (export tableOfContents).
          withToc,
          [withTocExport, {name: 'tableOfContents'}],
        ],
      }),
    },
    react({include: /\.(jsx|js|mdx|md|tsx|ts)$/}),
  ],
  build: {
    // Deve restare "build": wrangler.jsonc serve gli asset da ./build
    outDir: 'build',
    emptyOutDir: true,
  },
});
