import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { markdownToHtml } from './markdown';
import { getAllPosts, type Post } from './posts';

const projectsDirectory = path.join(process.cwd(), 'content/projects');

type ProjectFrontMatter = {
  title?: string;
  type?: string;
  summary?: string;
  problem?: string;
  solution?: string;
  impact?: string;
  stack?: string[] | string;
  repository?: string;
  relatedPosts?: string[];
  relatedTags?: string[] | string;
  featured?: boolean;
  order?: number;
};

export type Project = {
  title: string;
  type: 'system' | 'open-source';
  slug: string;
  summary: string;
  problem: string;
  solution: string;
  impact: string;
  stack: string[];
  repository?: string;
  relatedPostSlugs: string[];
  relatedTags: string[];
  featured: boolean;
  order: number;
  content: string;
  url: string;
};

export type RenderedProject = Project & {
  html: string;
  relatedPosts: Post[];
};

let projectsCache: Project[] | undefined;
let projectBySlugCache: Map<string, Project> | undefined;

function normalizeList(value: string[] | string | undefined) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value.map(String).filter(Boolean) : [String(value)].filter(Boolean);
}

function slugFromFilename(filename: string) {
  return path.basename(filename).replace(/\.md$/, '');
}

function projectTypeFromPath(filePath: string, frontMatterType?: string): Project['type'] {
  if (frontMatterType === 'open-source') {
    return 'open-source';
  }

  const relativePath = path.relative(projectsDirectory, filePath);
  const [section] = relativePath.split(path.sep);
  return section === 'open-source' ? 'open-source' : 'system';
}

function readProjectFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return readProjectFiles(entryPath);
    }

    return entry.isFile() && entry.name.endsWith('.md') ? [entryPath] : [];
  });
}

function compareProjects(a: Project, b: Project) {
  return a.order - b.order || a.title.localeCompare(b.title);
}

export function getAllProjects() {
  if (projectsCache) {
    return projectsCache;
  }

  if (!fs.existsSync(projectsDirectory)) {
    projectsCache = [];
    projectBySlugCache = new Map();
    return projectsCache;
  }

  projectsCache = readProjectFiles(projectsDirectory)
    .map((filePath) => {
      const slug = slugFromFilename(filePath);
      const parsed = matter(fs.readFileSync(filePath, 'utf8'));
      const data = parsed.data as ProjectFrontMatter;

      return {
        title: data.title ? String(data.title) : slug,
        type: projectTypeFromPath(filePath, data.type),
        slug,
        summary: data.summary ? String(data.summary) : '',
        problem: data.problem ? String(data.problem) : '',
        solution: data.solution ? String(data.solution) : '',
        impact: data.impact ? String(data.impact) : '',
        stack: normalizeList(data.stack),
        repository: data.repository ? String(data.repository) : undefined,
        relatedPostSlugs: Array.isArray(data.relatedPosts) ? data.relatedPosts.map(String) : [],
        relatedTags: normalizeList(data.relatedTags),
        featured: Boolean(data.featured),
        order: typeof data.order === 'number' ? data.order : 100,
        content: parsed.content.trim(),
        url: `/projects/${slug}/`,
      } satisfies Project;
    })
    .sort(compareProjects);

  projectBySlugCache = new Map(projectsCache.map((project) => [project.slug, project]));
  return projectsCache;
}

export function getFeaturedProjects() {
  return getAllProjects().filter((project) => project.featured);
}

export function getProjectBySlug(slug: string) {
  getAllProjects();
  return projectBySlugCache?.get(slug);
}

export function getPostsForProject(project: Project) {
  const slugs = new Set(project.relatedPostSlugs);
  const tags = new Set(project.relatedTags);
  return getAllPosts().filter(
    (post) => post.project === project.slug || slugs.has(post.slug) || post.tags.some((tag) => tags.has(tag)),
  );
}

export function getProjectForPost(post: Post) {
  if (post.project) {
    return getProjectBySlug(post.project);
  }

  return getAllProjects().find((project) => project.relatedPostSlugs.includes(post.slug));
}

export async function renderProject(project: Project): Promise<RenderedProject> {
  return {
    ...project,
    html: await markdownToHtml(project.content),
    relatedPosts: getPostsForProject(project),
  };
}
