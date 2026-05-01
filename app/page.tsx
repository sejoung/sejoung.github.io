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
          <p className="eyebrow">Systems & Pipelines</p>
          <h1>백엔드 시스템과 제작 파이프라인을 설계해 온 엔지니어</h1>
          <p>
            여러 산업에서 백엔드 시스템을 설계하고 운영해왔고, 지금은 웹툰 제작 과정의
            반복 문제를 파이프라인과 자동화 도구로 정리하고 있습니다. 이곳은 문제, 해결 방식,
            결과를 연결해 기록하는 개인 아카이브입니다.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/projects/">
              View Projects
            </Link>
            <Link className="button" href="/writing/">
              Read Writing
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
            <p className="eyebrow">Featured Projects</p>
            <h2>프로젝트가 맥락을 만들고, 글이 증거가 됩니다.</h2>
          </div>
          <Link href="/projects/">All projects</Link>
        </div>
        <div className="featured-project-groups">
          <div className="featured-project-group">
            <div className="featured-project-heading">
              <h3>Systems</h3>
              <Link href="/projects/">More Systems</Link>
            </div>
            <div className="project-grid">
              {featuredSystems.map((project) => (
                <ProjectCard project={project} key={project.slug} />
              ))}
            </div>
          </div>
          <div className="featured-project-group">
            <div className="featured-project-heading">
              <h3>Open Source Tools</h3>
              <Link href="/projects/">More Tools</Link>
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
            <p className="eyebrow">Selected Writing</p>
            <h2>최근 작업 노트</h2>
          </div>
          <Link href="/writing/">All writing</Link>
        </div>
        <PostList posts={paginateWriting(writing, 1)} />
      </section>

      <section className="section approach-grid">
        <div>
          <p className="eyebrow">Approach</p>
          <h2>문제를 코드로 옮기기 전에 흐름과 경계를 먼저 봅니다.</h2>
        </div>
        <div className="approach-list">
          <div>
            <strong>흐름을 먼저 모델링합니다</strong>
            <span>기능 목록보다 입력·출력·상태·실패 지점을 먼저 정리합니다.</span>
          </div>
          <div>
            <strong>반복되는 경계를 찾습니다</strong>
            <span>사람이 매번 판단하는 지점을 도구와 파이프라인으로 옮깁니다.</span>
          </div>
          <div>
            <strong>글과 시스템을 잇습니다</strong>
            <span>작업 기록을 프로젝트 맥락과 연결해 판단의 이력을 남깁니다.</span>
          </div>
        </div>
      </section>
    </>
  );
}
