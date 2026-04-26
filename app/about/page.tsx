import type { Metadata } from 'next';
import Link from 'next/link';
import { getAboutPageData } from '@/lib/about';

export const metadata: Metadata = {
  title: 'About',
  description: '제작 과정을 시스템으로 바꾸는 백엔드 엔지니어 김세중의 작업 방식과 관심 영역입니다.',
  alternates: {
    canonical: '/about/',
  },
};

export default function AboutPage() {
  const page = getAboutPageData();

  return (
    <article className="article wide-article about-page">
      <header className="article-header about-hero">
        <p className="eyebrow">About</p>
        <h1 className="article-title">{page.headline}</h1>
        <p className="lead">{page.intro}</p>
      </header>

      <section className="section about-grid">
        <div>
          <p className="eyebrow">{page.workTitle}</p>
          <h2>{page.workSubtitle}</h2>
        </div>
        <div className="about-card-grid">
          {page.work.map((item) => (
            <div className="about-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section about-grid">
        <div>
          <p className="eyebrow">{page.thinkingTitle}</p>
          <h2>{page.thinkingSubtitle}</h2>
        </div>
        <div className="approach-list">
          {page.thinking.map((item) => (
            <div key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section about-grid">
        <div>
          <p className="eyebrow">{page.focusTitle}</p>
          <h2>{page.focusSubtitle}</h2>
        </div>
        <ul className="about-list">
          {page.focus.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="section about-grid">
        <div>
          <p className="eyebrow">{page.proofTitle}</p>
          <h2>{page.proofSubtitle}</h2>
        </div>
        <div className="about-link-grid">
          {page.proof.map((item) =>
            item.external ? (
              <a href={item.href} key={item.href} rel="noreferrer" target="_blank">
                {item.label}
              </a>
            ) : (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ),
          )}
        </div>
      </section>

      <section className="section about-contact">
        <p className="eyebrow">{page.contactTitle}</p>
        <h2>{page.contact}</h2>
        <div className="contact-link-row">
          {page.contactLinks.map((item, index) =>
            item.external ? (
              <a className={index === 0 ? 'button primary' : 'button'} href={item.href} key={item.href} rel="noreferrer" target="_blank">
                {item.label}
              </a>
            ) : (
              <a className={index === 0 ? 'button primary' : 'button'} href={item.href} key={item.href}>
                {item.label}
              </a>
            ),
          )}
        </div>
      </section>
    </article>
  );
}
