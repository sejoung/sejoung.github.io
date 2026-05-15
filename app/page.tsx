import Link from 'next/link';
import { PostList } from '@/components/PostList';
import { ProjectCard } from '@/components/ProjectCard';
import { getCuratedTagCount } from '@/lib/curated-tags';
import { getAllProjects, getFeaturedProjects } from '@/lib/projects';
import { getAllWriting, paginateWriting } from '@/lib/writing';

export default function HomePage() {
  const writing = getAllWriting();
  const projects = getAllProjects();
  const signalCount = getCuratedTagCount();
  const featuredSystems = getFeaturedProjects({ type: 'system', limit: 3 });
  const featuredOpenSource = getFeaturedProjects({ type: 'open-source', limit: 3 });

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Work Notes</p>
          <h1>시스템을 만들며 남긴 기록</h1>
          <p>
            백엔드 시스템, 제작 파이프라인, 자동화 도구를 만들며 정리한 개인 아카이브입니다.
            오래 남길 만한 작업 기록과 기술 노트를 한곳에 모읍니다.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/projects/">
              Projects
            </Link>
            <Link className="button" href="/writing/">
              Writing
            </Link>
          </div>
        </div>
        <div className="stats" aria-label="Blog statistics">
          <Link className="stat" href="/projects/">
            <strong>{projects.length}</strong>
            <span>Projects</span>
          </Link>
          <Link className="stat" href="/writing/">
            <strong>{writing.length}</strong>
            <span>Records</span>
          </Link>
          <Link className="stat" href="/tags/">
            <strong>{signalCount}</strong>
            <span>Topics</span>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Projects</p>
            <h2>최근 정리한 작업</h2>
          </div>
          <Link href="/projects/">전체 보기</Link>
        </div>
        <div className="featured-project-groups">
          <div className="featured-project-group">
            <div className="featured-project-heading">
              <h3>Systems</h3>
              <Link href="/projects/">더 보기</Link>
            </div>
            <div className="project-grid">
              {featuredSystems.map((project) => (
                <ProjectCard project={project} key={project.slug} />
              ))}
            </div>
          </div>
          <div className="featured-project-group">
            <div className="featured-project-heading">
              <h3>Open Source</h3>
              <Link href="/projects/">더 보기</Link>
            </div>
            <div className="project-grid">
              {featuredOpenSource.map((project) => (
                <ProjectCard project={project} key={project.slug} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Writing</p>
            <h2>최근 작업 노트</h2>
          </div>
          <Link href="/writing/">전체 보기</Link>
        </div>
        <PostList posts={paginateWriting(writing, 1)} />
      </section>

      <section className="section approach-grid">
        <div>
          <p className="eyebrow">Notes</p>
          <h2>자주 남기는 기준</h2>
        </div>
        <div className="approach-list">
          <div>
            <strong>흐름을 먼저 봅니다</strong>
            <span>기능 목록보다 입력·출력·상태·실패 지점을 먼저 정리합니다.</span>
          </div>
          <div>
            <strong>반복되는 일을 줄입니다</strong>
            <span>사람이 매번 판단하는 지점을 도구와 파이프라인으로 옮깁니다.</span>
          </div>
          <div>
            <strong>판단의 이유를 남깁니다</strong>
            <span>작업 기록을 프로젝트 맥락과 연결해 판단의 이력을 남깁니다.</span>
          </div>
        </div>
      </section>
    </>
  );
}
