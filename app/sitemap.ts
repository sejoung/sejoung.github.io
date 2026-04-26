import type { MetadataRoute } from 'next';
import { absoluteUrl, getAllPosts, getTaxonomy } from '@/lib/posts';
import { getAllProjects } from '@/lib/projects';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: absoluteUrl(post.url),
    lastModified: post.updated ?? post.date,
  }));

  const projects = getAllProjects().map((project) => ({
    url: absoluteUrl(project.url),
    lastModified: new Date(),
  }));

  const staticRoutes = ['/', '/projects/', '/writing/', '/archives/', '/categories/', '/tags/', '/about/', '/contact/', '/terms/', '/privacy/'].map(
    (route) => ({
      url: absoluteUrl(route),
      lastModified: new Date(),
    }),
  );

  const taxonomies = [...getTaxonomy('tags').map((item) => `/tags/${encodeURIComponent(item.name)}/`), ...getTaxonomy('categories').map((item) => `/categories/${encodeURIComponent(item.name)}/`)].map(
    (route) => ({
      url: absoluteUrl(route),
      lastModified: new Date(),
    }),
  );

  return [...staticRoutes, ...projects, ...taxonomies, ...posts];
}
