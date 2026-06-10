import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: 'wrap',
  })
  .use(rehypeExternalLinks, {
    target: '_blank',
    rel: ['noreferrer'],
  })
  .use(rehypeHighlight)
  .use(rehypeStringify, { allowDangerousHtml: true });

export async function markdownToHtml(markdown: string) {
  const result = await processor.process(markdown);
  return result.toString();
}
