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
    <article className="article wide-article" data-pagefind-body>
      <header className="article-header">
        <p className="eyebrow">{rendered.type === 'open-source' ? 'Open Source Project' : 'Project'}</p>
        <h1 className="article-title">{rendered.title}</h1>
        <p className="lead">{rendered.summary}</p>
        <div className="tags">
          {rendered.stack.map((item) => (
            <span className="tag" key={item}>
              {item}
            </span>
          ))}
        </div>
        {rendered.repository || rendered.links.length > 0 ? (
          <div className="hero-actions">
            {rendered.links.map((link, index) => (
              <a
                className={index === 0 ? 'button primary' : 'button'}
                href={link.href}
                key={link.href}
                rel={link.external ? 'noreferrer' : undefined}
                target={link.external ? '_blank' : undefined}
              >
                {link.label}
              </a>
            ))}
            {rendered.repository ? (
              <a className={rendered.links.length > 0 ? 'button' : 'button primary'} href={rendered.repository} rel="noreferrer" target="_blank">
                View on GitHub
              </a>
            ) : null}
          </div>
        ) : null}
      </header>

      <section className="project-detail-grid">
        <div>
          <h2>Problem</h2>
          <p>{rendered.problem}</p>
        </div>
        <div>
          <h2>Approach</h2>
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
            <div>
              <p className="eyebrow">Related Writing</p>
              <h2>이 프로젝트와 연결된 기록</h2>
            </div>
            <Link href="/writing/">All writing</Link>
          </div>
          <PostList posts={relatedWriting} />
        </section>
      ) : null}
    </article>
  );
}
