import Link from 'next/link';
import { PostList } from '@/components/PostList';
import { ProjectCard } from '@/components/ProjectCard';
import { getFeaturedProjects } from '@/lib/projects';
import { getAllPosts, getTaxonomy, paginatePosts } from '@/lib/posts';

export default function HomePage() {
  const posts = getAllPosts();
  const tags = getTaxonomy('tags');
  const categories = getTaxonomy('categories');
  const featuredProjects = getFeaturedProjects();

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">System Archive</p>
          <h1>제작 과정을 시스템으로 바꾸는 엔지니어</h1>
          <p>
            다양한 산업에서 백엔드 시스템을 설계해왔고, 지금은 웹툰 제작 파이프라인과
            자동화 시스템을 만들고 있습니다. 이곳은 문제, 해결 방식, 결과를 연결해 기록하는
            개인 아카이브입니다.
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
          <div className="stat">
            <strong>{featuredProjects.length}</strong>
            <span>Systems</span>
          </div>
          <div className="stat">
            <strong>{posts.length}</strong>
            <span>Records</span>
          </div>
          <div className="stat">
            <strong>{categories.length}</strong>
            <span>Domains</span>
          </div>
          <div className="stat">
            <strong>{tags.length}</strong>
            <span>Signals</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Featured Projects</p>
          <h2>프로젝트가 맥락을 만들고, 글이 증거가 됩니다.</h2>
          <Link href="/projects/">All projects</Link>
        </div>
        <div className="project-grid">
          {featuredProjects.map((project) => (
            <ProjectCard project={project} key={project.slug} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Selected Writing</p>
          <h2>최근 문제 해결 기록</h2>
          <Link href="/writing/">All writing</Link>
        </div>
        <PostList posts={paginatePosts(posts, 1)} />
      </section>

      <section className="section approach-grid">
        <div>
          <p className="eyebrow">Approach</p>
          <h2>문제를 코드보다 먼저 구조로 봅니다.</h2>
        </div>
        <div className="approach-list">
          <div>
            <strong>Model the workflow</strong>
            <span>작업 흐름과 상태를 먼저 모델링합니다.</span>
          </div>
          <div>
            <strong>Find repeatable boundaries</strong>
            <span>반복 가능한 경계를 찾아 자동화 단위로 나눕니다.</span>
          </div>
          <div>
            <strong>Connect records to systems</strong>
            <span>글을 프로젝트 맥락과 연결해 판단의 이력을 남깁니다.</span>
          </div>
        </div>
      </section>
    </>
  );
}
