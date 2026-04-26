import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStaticPage } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Contact',
  alternates: {
    canonical: '/contact/',
  },
};

export default async function ContactPage() {
  const page = await getStaticPage('contact');

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
