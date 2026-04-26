import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PostList } from '@/components/PostList';
import { getExternalWritingForProject } from '@/lib/external-writing';
import { absoluteUrl } from '@/lib/posts';
import { getAllProjects, getProjectBySlug, renderProject } from '@/lib/projects';
import { compareWriting } from '@/lib/writing';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjects().map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: project.url,
    },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: absoluteUrl(project.url),
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const rendered = await renderProject(project);
  const relatedWriting = [...rendered.relatedPosts, ...getExternalWritingForProject(project.slug)].sort(compareWriting);

  return (
    <article className="article wide-article">
      <header className="article-header">
        <p className="eyebrow">Project</p>
        <h1 className="article-title">{rendered.title}</h1>
        <p className="lead">{rendered.summary}</p>
        <div className="tags">
          {rendered.stack.map((item) => (
            <span className="tag" key={item}>
              {item}
            </span>
          ))}
        </div>
      </header>

      <section className="project-detail-grid">
        <div>
          <h2>Problem</h2>
          <p>{rendered.problem}</p>
        </div>
        <div>
          <h2>System</h2>
          <p>{rendered.solution}</p>
        </div>
        <div>
          <h2>Impact</h2>
          <p>{rendered.impact}</p>
        </div>
      </section>

      <div className="content" dangerouslySetInnerHTML={{ __html: rendered.html }} />

      {relatedWriting.length > 0 ? (
        <section className="section">
          <div className="section-heading">
            <p className="eyebrow">Related Writing</p>
            <h2>이 시스템과 연결된 기록</h2>
            <Link href="/writing/">All writing</Link>
          </div>
          <PostList posts={relatedWriting} />
        </section>
      ) : null}
    </article>
  );
}
