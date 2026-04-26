import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStaticPage } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'About',
  alternates: {
    canonical: '/about/',
  },
};

export default async function AboutPage() {
  const page = await getStaticPage('about');

  if (!page) {
    notFound();
  }

  return (
    <article className="article">
      <header className="article-header">
        <h1 className="article-title">{page.title}</h1>
      </header>
      <div className="content" dangerouslySetInnerHTML={{ __html: page.html }} />
    </article>
  );
}
