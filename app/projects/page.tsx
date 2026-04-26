import type { Metadata } from 'next';
import { ProjectCard } from '@/components/ProjectCard';
import { getAllProjects } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Projects',
  description: '백엔드 시스템, 제작 파이프라인, 공개 도구를 프로젝트 단위로 정리한 아카이브입니다.',
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
        <h1>설계한 시스템과 공개 도구</h1>
        <p className="lead">백엔드 시스템, 제작 파이프라인, 오픈소스 도구를 구분해 작업의 맥락과 결과를 보여줍니다.</p>
      </section>
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Systems</p>
          <h2>문제와 흐름을 구조로 정리한 작업</h2>
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
