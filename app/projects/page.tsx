import type { Metadata } from 'next';
import { ProjectCard } from '@/components/ProjectCard';
import { getAllProjects } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Projects',
  description: '문제 해결과 시스템 설계를 프로젝트 단위로 정리한 아카이브입니다.',
  alternates: {
    canonical: '/projects/',
  },
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const systems = projects.filter((project) => project.type === 'system');
  const openSource = projects.filter((project) => project.type === 'open-source');

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Projects</p>
        <h1>시스템으로 바꾼 문제들</h1>
        <p className="lead">큰 시스템 경험과 공개한 도구를 분리해 문제 해결의 결과물을 한눈에 보여줍니다.</p>
      </section>
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Systems</p>
          <h2>문제와 흐름을 구조로 바꾼 작업</h2>
        </div>
        <div className="project-grid">
          {systems.map((project) => (
            <ProjectCard project={project} key={project.slug} />
          ))}
        </div>
      </section>
      {openSource.length > 0 ? (
        <section className="section">
          <div className="section-heading">
            <p className="eyebrow">Open Source Tools</p>
            <h2>반복 작업을 공개 도구로 정리한 결과물</h2>
          </div>
          <div className="project-grid">
            {openSource.map((project) => (
              <ProjectCard project={project} key={project.slug} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
