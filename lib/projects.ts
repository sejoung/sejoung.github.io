import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { markdownToHtml } from './markdown';
import { getAllPosts, type Post } from './posts';

const projectsDirectory = path.join(process.cwd(), 'content/projects');

type ProjectFrontMatter = {
  title?: string;
  summary?: string;
  problem?: string;
  solution?: string;
  impact?: string;
  stack?: string[] | string;
  relatedPosts?: string[];
  featured?: boolean;
  order?: number;
};

export type Project = {
  title: string;
  slug: string;
  summary: string;
  problem: string;
  solution: string;
  impact: string;
  stack: string[];
  relatedPostSlugs: string[];
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
  return filename.replace(/\.md$/, '');
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

  projectsCache = fs
    .readdirSync(projectsDirectory)
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => {
      const slug = slugFromFilename(filename);
      const parsed = matter(fs.readFileSync(path.join(projectsDirectory, filename), 'utf8'));
      const data = parsed.data as ProjectFrontMatter;

      return {
        title: data.title ? String(data.title) : slug,
        slug,
        summary: data.summary ? String(data.summary) : '',
        problem: data.problem ? String(data.problem) : '',
        solution: data.solution ? String(data.solution) : '',
        impact: data.impact ? String(data.impact) : '',
        stack: normalizeList(data.stack),
        relatedPostSlugs: Array.isArray(data.relatedPosts) ? data.relatedPosts.map(String) : [],
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
  return getAllPosts().filter((post) => post.project === project.slug || slugs.has(post.slug));
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
