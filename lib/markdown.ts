import fs from 'node:fs';
import path from 'node:path';
import { imageSize } from 'image-size';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

const publicDirectory = path.join(process.cwd(), 'public');
const siteOrigin = 'https://sejoung.github.io';
const imageDimensionsCache = new Map<string, { width: number; height: number } | null>();

function localImagePath(src: string) {
  if (src.startsWith(`${siteOrigin}/`)) {
    return path.join(publicDirectory, src.slice(siteOrigin.length + 1));
  }
  if (src.startsWith('/') && !src.startsWith('//')) {
    return path.join(publicDirectory, src.slice(1));
  }
  return null;
}

function measureImage(src: string) {
  if (imageDimensionsCache.has(src)) {
    return imageDimensionsCache.get(src) ?? null;
  }

  let dimensions: { width: number; height: number } | null = null;
  const filePath = localImagePath(src);
  if (filePath && fs.existsSync(filePath)) {
    try {
      const { width, height } = imageSize(fs.readFileSync(filePath));
      if (width && height) {
        dimensions = { width, height };
      }
    } catch {
      dimensions = null;
    }
  }

  imageDimensionsCache.set(src, dimensions);
  return dimensions;
}

function rehypeImageDimensions() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'img' || typeof node.properties?.src !== 'string') {
        return;
      }
      if (node.properties.width || node.properties.height) {
        return;
      }
      const dimensions = measureImage(node.properties.src);
      if (dimensions) {
        node.properties.width = dimensions.width;
        node.properties.height = dimensions.height;
      }
      node.properties.loading = 'lazy';
      node.properties.decoding = 'async';
    });
  };
}

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
  .use(rehypeImageDimensions)
  .use(rehypeHighlight)
  .use(rehypeStringify, { allowDangerousHtml: true });

export async function markdownToHtml(markdown: string) {
  const result = await processor.process(markdown);
  return result.toString();
}

export interface TocEntry {
  id: string;
  text: string;
  depth: 2 | 3;
}

const headingPattern = /<h([23])[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;

function decodeEntities(text: string) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x26;/g, '&');
}

export function extractToc(html: string): TocEntry[] {
  const entries: TocEntry[] = [];
  for (const match of html.matchAll(headingPattern)) {
    const text = decodeEntities(match[3].replace(/<[^>]+>/g, '').trim());
    if (text) {
      entries.push({
        id: match[2],
        text,
        depth: Number(match[1]) as 2 | 3,
      });
    }
  }
  return entries;
}
