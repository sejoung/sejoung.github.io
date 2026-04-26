import type { Metadata } from 'next';
import Link from 'next/link';
import { getCuratedTagGroups } from '@/lib/curated-tags';

export const metadata: Metadata = {
  title: 'Tags',
  alternates: {
    canonical: '/tags/',
  },
};

export default function TagsPage() {
  const groups = getCuratedTagGroups();

  return (
    <>
      <h1>Tags</h1>
      <p className="lead">프로젝트와 문제 해결 기록을 설명하는 핵심 신호만 모았습니다.</p>
      <div className="tag-group-grid">
        {groups.map((group) => (
          <section className="tag-group" key={group.title}>
            <div>
              <h2>{group.title}</h2>
              <p>{group.description}</p>
            </div>
            <div className="taxonomy-grid compact">
              {group.tags.map((tag) => (
                <Link className="taxonomy-link" href={tag.url} key={tag.name}>
                  <span>{tag.name}</span>
                  <span className="taxonomy-count">{tag.count}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
