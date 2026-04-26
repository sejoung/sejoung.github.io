import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const aboutPath = path.join(process.cwd(), 'content/pages/about.md');

type AboutCard = {
  title: string;
  description: string;
};

type AboutLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const contactLinks = [
  { label: 'Email', href: 'mailto:sejoung@gmail.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sanaes', external: true },
  { label: 'GitHub', href: 'https://github.com/sejoung', external: true },
];

type AboutFrontMatter = {
  title?: string;
  headline?: string;
  intro?: string;
  workTitle?: string;
  workSubtitle?: string;
  work?: AboutCard[];
  thinkingTitle?: string;
  thinkingSubtitle?: string;
  thinking?: AboutCard[];
  focusTitle?: string;
  focusSubtitle?: string;
  focus?: string[];
  proofTitle?: string;
  proofSubtitle?: string;
  proof?: AboutLink[];
  contactTitle?: string;
  contact?: string;
  contactLinks?: AboutLink[];
};

export type AboutPageData = Required<
  Pick<
    AboutFrontMatter,
    | 'title'
    | 'headline'
    | 'intro'
    | 'workTitle'
    | 'workSubtitle'
    | 'thinkingTitle'
    | 'thinkingSubtitle'
    | 'focusTitle'
    | 'focusSubtitle'
    | 'proofTitle'
    | 'proofSubtitle'
    | 'contactTitle'
    | 'contact'
  >
> & {
  work: AboutCard[];
  thinking: AboutCard[];
  focus: string[];
  proof: AboutLink[];
  contactLinks: AboutLink[];
};

let aboutCache: AboutPageData | undefined;

export function getAboutPageData() {
  if (aboutCache) {
    return aboutCache;
  }

  const parsed = matter(fs.readFileSync(aboutPath, 'utf8'));
  const data = parsed.data as AboutFrontMatter;

  aboutCache = {
    title: data.title ? String(data.title) : 'About',
    headline: data.headline ? String(data.headline) : '',
    intro: data.intro ? String(data.intro) : '',
    workTitle: data.workTitle ? String(data.workTitle) : '',
    workSubtitle: data.workSubtitle ? String(data.workSubtitle) : '',
    work: Array.isArray(data.work) ? data.work : [],
    thinkingTitle: data.thinkingTitle ? String(data.thinkingTitle) : '',
    thinkingSubtitle: data.thinkingSubtitle ? String(data.thinkingSubtitle) : '',
    thinking: Array.isArray(data.thinking) ? data.thinking : [],
    focusTitle: data.focusTitle ? String(data.focusTitle) : '',
    focusSubtitle: data.focusSubtitle ? String(data.focusSubtitle) : '',
    focus: Array.isArray(data.focus) ? data.focus.map(String) : [],
    proofTitle: data.proofTitle ? String(data.proofTitle) : '',
    proofSubtitle: data.proofSubtitle ? String(data.proofSubtitle) : '',
    proof: Array.isArray(data.proof) ? data.proof : [],
    contactTitle: data.contactTitle ? String(data.contactTitle) : '',
    contact: data.contact ? String(data.contact) : '',
    contactLinks: Array.isArray(data.contactLinks) ? data.contactLinks : contactLinks,
  };

  return aboutCache;
}
