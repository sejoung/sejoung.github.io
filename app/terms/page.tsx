import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStaticPage } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Terms',
  alternates: {
    canonical: '/terms/',
  },
};

export default async function TermsPage() {
  const page = await getStaticPage('terms');

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
