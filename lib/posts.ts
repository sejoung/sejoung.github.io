import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { markdownToHtml } from './markdown';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const pagesDirectory = path.join(process.cwd(), 'content/pages');
export const siteUrl = 'https://sejoung.github.io';
export const postsPerPage = 10;

export type FrontMatter = {
  layout?: string;
  title?: string;
  date?: string | Date;
  updated?: string | Date;
  comments?: boolean;
  tags?: string[] | string;
  categories?: string[] | string;
  description?: string;
};

export type Post = {
  title: string;
  date: Date;
  updated?: Date;
  slug: string;
  year: string;
  month: string;
  url: string;
  filePath: string;
  excerpt: string;
  content: string;
  readingMinutes: number;
  tags: string[];
  categories: string[];
};

export type RenderedPost = Post & {
  html: string;
};

export type StaticPage = {
  title: string;
  slug: string;
  url: string;
  content: string;
  html: string;
};

function normalizeList(value: FrontMatter['tags']) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  return [String(value)].filter(Boolean);
}

function normalizeDate(value: FrontMatter['date'], fallback: Date) {
  if (!value) {
    return fallback;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

function postSlugFromFilename(filename: string) {
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
}

function dateParts(date: Date) {
  return {
    year: String(date.getFullYear()),
    month: String(date.getMonth() + 1).padStart(2, '0'),
  };
}

function postUrl(year: string, month: string, slug: string) {
  return `/${year}/${month}/${slug}/`;
}

function excerptFrom(content: string) {
  return content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/[#>*_`~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
}

function comparePosts(a: Post, b: Post) {
  return b.date.getTime() - a.date.getTime() || a.title.localeCompare(b.title);
}

export function getAllPosts() {
  const filenames = fs.readdirSync(postsDirectory).filter((filename) => filename.endsWith('.md'));

  return filenames
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = matter(raw);
      const data = parsed.data as FrontMatter;
      const fallbackDate = new Date(`${filename.slice(0, 10)}T00:00:00+09:00`);
      const date = normalizeDate(data.date, fallbackDate);
      const updated = data.updated ? normalizeDate(data.updated, date) : undefined;
      const { year, month } = dateParts(date);
      const slug = postSlugFromFilename(filename);
      const title = data.title ? String(data.title) : slug;
      const content = parsed.content.trim();

      return {
        title,
        date,
        updated,
        slug,
        year,
        month,
        url: postUrl(year, month, slug),
        filePath,
        excerpt: excerptFrom(content),
        content,
        readingMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
        tags: normalizeList(data.tags),
        categories: normalizeList(data.categories),
      } satisfies Post;
    })
    .sort(comparePosts);
}

export function getPostByParams(year: string, month: string, slug: string) {
  return getAllPosts().find((post) => post.year === year && post.month === month && post.slug === slug);
}

export async function renderPost(post: Post): Promise<RenderedPost> {
  return {
    ...post,
    html: await markdownToHtml(post.content),
  };
}

export function paginatePosts(posts: Post[], page: number) {
  const start = (page - 1) * postsPerPage;
  return posts.slice(start, start + postsPerPage);
}

export function totalPages(posts: Post[]) {
  return Math.max(1, Math.ceil(posts.length / postsPerPage));
}

export function getTaxonomy(kind: 'tags' | 'categories') {
  const map = new Map<string, Post[]>();

  for (const post of getAllPosts()) {
    for (const name of post[kind]) {
      const posts = map.get(name) ?? [];
      posts.push(post);
      map.set(name, posts);
    }
  }

  return [...map.entries()]
    .map(([name, posts]) => ({ name, posts: posts.sort(comparePosts) }))
    .sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name));
}

export function getTaxonomyItem(kind: 'tags' | 'categories', name: string) {
  return getTaxonomy(kind).find((item) => item.name === name);
}

export async function getStaticPage(slug: string): Promise<StaticPage | undefined> {
  const filePath = path.join(pagesDirectory, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  const parsed = matter(fs.readFileSync(filePath, 'utf8'));
  const title = parsed.data.title ? String(parsed.data.title) : slug;

  return {
    title,
    slug,
    url: `/${slug}/`,
    content: parsed.content.trim(),
    html: await markdownToHtml(parsed.content.trim()),
  };
}

export function absoluteUrl(url: string) {
  return new URL(url, siteUrl).toString();
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
