import { Pagination } from '@/components/Pagination';
import { PostList } from '@/components/PostList';
import { getAllPosts, getTaxonomy, paginatePosts, totalPages } from '@/lib/posts';

export default function HomePage() {
  const posts = getAllPosts();
  const tags = getTaxonomy('tags');
  const categories = getTaxonomy('categories');

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">sejoung kim</p>
          <h1>폭간의 기술블로그</h1>
          <p>
            Java, Kotlin, 백엔드 개발, 시스템 설계, 소프트웨어 엔지니어링 학습 기록을
            정리합니다.
          </p>
        </div>
        <div className="stats" aria-label="Blog statistics">
          <div className="stat">
            <strong>{posts.length}</strong>
            <span>Posts</span>
          </div>
          <div className="stat">
            <strong>{categories.length}</strong>
            <span>Categories</span>
          </div>
          <div className="stat">
            <strong>{tags.length}</strong>
            <span>Tags</span>
          </div>
          <div className="stat">
            <strong>{posts[0]?.date.getFullYear() ?? ''}</strong>
            <span>Latest</span>
          </div>
        </div>
      </section>

      <PostList posts={paginatePosts(posts, 1)} />
      <Pagination currentPage={1} totalPages={totalPages(posts)} />
    </>
  );
}
