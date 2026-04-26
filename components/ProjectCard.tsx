import Link from 'next/link';
import type { Project } from '@/lib/projects';

export function ProjectCard({ project }: { project: Project }) {
  const label = project.type === 'open-source' ? 'Open Source' : 'System';

  return (
    <article className="flex min-h-[420px] flex-col rounded-lg border border-[#26313d] bg-gradient-to-b from-[#151f2b] to-[#111821] p-[18px]">
      <div className="project-card-header">
        <p className="eyebrow">{label}</p>
        <h2 className="text-[25px] leading-tight">
          <Link className="no-underline" href={project.url}>{project.title}</Link>
        </h2>
      </div>
      <p className="my-4 text-[#93a1b2]">{project.summary}</p>
      <dl className="grid gap-3">
        <div className="border-t border-[#26313d] pt-3">
          <dt className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#68d4c2]">Problem</dt>
          <dd className="mt-1">{project.problem}</dd>
        </div>
        <div className="border-t border-[#26313d] pt-3">
          <dt className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#68d4c2]">System</dt>
          <dd className="mt-1">{project.solution}</dd>
        </div>
        <div className="border-t border-[#26313d] pt-3">
          <dt className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#68d4c2]">Impact</dt>
          <dd className="mt-1">{project.impact}</dd>
        </div>
      </dl>
      {project.stack.length > 0 ? (
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          {project.stack.map((item) => (
            <span className="inline-flex min-h-7 items-center rounded-full bg-[#17342f] px-2.5 py-0.5 text-[13px] text-[#68d4c2]" key={item}>
              {item}
            </span>
          ))}
        </div>
      ) : null}
      {project.repository ? (
        <a className="mt-3.5 self-start text-sm text-[#68d4c2] no-underline" href={project.repository} rel="noreferrer" target="_blank">
          GitHub
        </a>
      ) : null}
    </article>
  );
}
