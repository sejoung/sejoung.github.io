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
  description?: string;
  project?: string;
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
  project?: string;
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

type TaxonomyItem = {
  name: string;
  posts: Post[];
};

let allPostsCache: Post[] | undefined;
let postByPathCache: Map<string, Post> | undefined;
let tagsCache: TaxonomyItem[] | undefined;
const staticPageCache = new Map<string, Promise<StaticPage | undefined>>();

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
  return filename.replace(/\.md$/, '');
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

// 옛 Jekyll 글 상당수가 본문 첫 줄에 front matter 제목과 동일한 H1을 중복으로 갖고 있다.
// 페이지 헤더가 제목을 이미 렌더링하므로, 제목과 같은 첫 H1만 본문에서 걷어낸다.
function stripLeadingTitleHeading(content: string, title: string) {
  const match = content.match(/^#\s+(.+?)\s*(?:\n+|$)/);
  if (!match) {
    return content;
  }

  const normalize = (value: string) => value.replace(/\s+/g, '');
  return normalize(match[1]) === normalize(title) ? content.slice(match[0].length) : content;
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

function postKey(year: string, month: string, slug: string) {
  return `${year}/${month}/${slug}`;
}

export function getAllPosts() {
  if (allPostsCache) {
    return allPostsCache;
  }

  const filenames = fs.readdirSync(postsDirectory).filter((filename) => filename.endsWith('.md'));

  allPostsCache = filenames
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
      const content = stripLeadingTitleHeading(parsed.content.trim(), title);

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
        project: data.project ? String(data.project) : undefined,
      } satisfies Post;
    })
    .sort(comparePosts);

  postByPathCache = new Map(allPostsCache.map((post) => [postKey(post.year, post.month, post.slug), post]));
  return allPostsCache;
}

export function getPostByParams(year: string, month: string, slug: string) {
  getAllPosts();
  return postByPathCache?.get(postKey(year, month, slug));
}

export function getAdjacentPosts(post: Post) {
  const posts = getAllPosts();
  const index = posts.findIndex((item) => item.url === post.url);

  return {
    newer: index > 0 ? posts[index - 1] : undefined,
    older: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

export function getRelatedPosts(post: Post, limit = 3) {
  if (post.tags.length === 0) {
    return [];
  }

  const tagSet = new Set(post.tags);

  return getAllPosts()
    .filter((item) => item.url !== post.url)
    .map((item) => ({
      post: item,
      score: item.tags.reduce((count, tag) => count + (tagSet.has(tag) ? 1 : 0), 0),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.post.date.getTime() - a.post.date.getTime())
    .slice(0, limit)
    .map((item) => item.post);
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

export function getTaxonomy(kind: 'tags') {
  if (tagsCache) {
    return tagsCache;
  }

  const map = new Map<string, Post[]>();

  for (const post of getAllPosts()) {
    for (const name of post.tags) {
      const posts = map.get(name) ?? [];
      posts.push(post);
      map.set(name, posts);
    }
  }

  const items = [...map.entries()]
    .map(([name, posts]) => ({ name, posts: posts.sort(comparePosts) }))
    .sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name));

  tagsCache = items;

  return tagsCache;
}

export function getTaxonomyItem(kind: 'tags', name: string) {
  return getTaxonomy(kind).find((item) => item.name === name);
}

export async function getStaticPage(slug: string): Promise<StaticPage | undefined> {
  const cached = staticPageCache.get(slug);
  if (cached) {
    return cached;
  }

  const pagePromise = readStaticPage(slug);
  staticPageCache.set(slug, pagePromise);
  return pagePromise;
}

async function readStaticPage(slug: string): Promise<StaticPage | undefined> {
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
