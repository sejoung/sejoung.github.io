import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const externalWritingDirectory = path.join(process.cwd(), 'content/external-writing');

type ExternalWritingFrontMatter = {
  title?: string;
  date?: string | Date;
  url?: string;
  source?: string;
  excerpt?: string;
  tags?: string[] | string;
  project?: string;
};

export type ExternalWriting = {
  external: true;
  title: string;
  date: Date;
  slug: string;
  url: string;
  source: string;
  excerpt: string;
  tags: string[];
  project: string;
};

let externalWritingCache: ExternalWriting[] | undefined;

function normalizeList(value: ExternalWritingFrontMatter['tags']) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value.map(String).filter(Boolean) : [String(value)].filter(Boolean);
}

function normalizeDate(value: ExternalWritingFrontMatter['date']) {
  if (!value) {
    return new Date(0);
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

function slugFromFilename(filename: string) {
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
}

export function getAllExternalWriting() {
  if (externalWritingCache) {
    return externalWritingCache;
  }

  if (!fs.existsSync(externalWritingDirectory)) {
    externalWritingCache = [];
    return externalWritingCache;
  }

  externalWritingCache = fs
    .readdirSync(externalWritingDirectory)
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => {
      const parsed = matter(fs.readFileSync(path.join(externalWritingDirectory, filename), 'utf8'));
      const data = parsed.data as ExternalWritingFrontMatter;
      const slug = slugFromFilename(filename);

      return {
        external: true,
        title: data.title ? String(data.title) : slug,
        date: normalizeDate(data.date),
        slug,
        url: data.url ? String(data.url) : '#',
        source: data.source ? String(data.source) : 'External',
        excerpt: data.excerpt ? String(data.excerpt) : parsed.content.trim(),
        tags: normalizeList(data.tags),
        project: data.project ? String(data.project) : '',
      } satisfies ExternalWriting;
    });

  return externalWritingCache;
}

export function getExternalWritingForProject(projectSlug: string) {
  return getAllExternalWriting().filter((writing) => writing.project === projectSlug);
}
