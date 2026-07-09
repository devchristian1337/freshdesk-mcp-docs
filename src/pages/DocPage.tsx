import {MDXProvider} from '@mdx-js/react';
import DocLayout from '../layouts/DocLayout';
import {mdxComponents} from '../components/MDXComponents';
import {usePageMeta} from '../lib/usePageMeta';
import {docRefOf, type DocId} from '../content/docs.config';
import type {DocModule} from '../content/docs-modules';
import {useLocale} from '../i18n/LocaleProvider';

type DocPageProps = {
  docId: DocId;
  mod: DocModule;
};

/** Renderer generico di un documento markdown dentro il layout docs. */
export default function DocPage({docId, mod}: DocPageProps) {
  const {locale} = useLocale();
  const {default: Content, frontmatter, tableOfContents} = mod;
  usePageMeta(
    docRefOf(locale, docId)?.label ?? frontmatter.title,
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
