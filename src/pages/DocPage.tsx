import {MDXProvider} from '@mdx-js/react';
import DocLayout from '../layouts/DocLayout';
import {mdxComponents} from '../components/MDXComponents';
import {usePageMeta} from '../lib/usePageMeta';
import {docRefOf} from '../content/docs.config';
import type {DocModule} from '../content/docs-modules';

type DocPageProps = {
  docId: string;
  mod: DocModule;
};

/** Renderer generico di un documento markdown dentro il layout docs. */
export default function DocPage({docId, mod}: DocPageProps) {
  const {default: Content, frontmatter, tableOfContents} = mod;
  usePageMeta(
    frontmatter.title ?? docRefOf(docId)?.label,
    frontmatter.description,
  );

  return (
    <DocLayout docId={docId} toc={tableOfContents}>
      <MDXProvider components={mdxComponents}>
        <Content />
      </MDXProvider>
    </DocLayout>
  );
}
