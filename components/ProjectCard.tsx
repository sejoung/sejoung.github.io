import Link from 'next/link';
import type { Project } from '@/lib/projects';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <div className="project-card-header">
        <p className="eyebrow">System</p>
        <h2>
          <Link href={project.url}>{project.title}</Link>
        </h2>
      </div>
      <p className="project-summary">{project.summary}</p>
      <dl className="project-facts">
        <div>
          <dt>Problem</dt>
          <dd>{project.problem}</dd>
        </div>
        <div>
          <dt>System</dt>
          <dd>{project.solution}</dd>
        </div>
        <div>
          <dt>Impact</dt>
          <dd>{project.impact}</dd>
        </div>
      </dl>
      {project.stack.length > 0 ? (
        <div className="tags">
          {project.stack.map((item) => (
            <span className="tag" key={item}>
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
