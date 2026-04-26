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

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Projects</p>
        <h1>시스템으로 바꾼 문제들</h1>
        <p className="lead">각 프로젝트는 문제, 해결 방식, 사용 기술, 관련 글을 함께 보여줍니다.</p>
      </section>
      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard project={project} key={project.slug} />
        ))}
      </div>
    </>
  );
}
