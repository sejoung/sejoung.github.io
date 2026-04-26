import { getTaxonomy } from './posts';

type CuratedTag = {
  name: string;
  count: number;
  url: string;
};

export type CuratedTagGroup = {
  title: string;
  description: string;
  tags: CuratedTag[];
};

type CuratedTagSpec = Omit<CuratedTagGroup, 'tags'> & {
  tags: string[];
};

const curatedTagSpecs = [
  {
    title: 'Production Pipeline',
    description: '웹툰 제작, Unreal, 에디터 자동화처럼 제작 과정을 시스템으로 바꾸는 기록',
    tags: ['unreal', '언리얼', 'python', 'Python', 'Stable Diffusion', 'LORA', 'Lora', 'CUDA'],
  },
  {
    title: 'Backend Architecture',
    description: '서비스 경계, 데이터 흐름, 운영 가능한 백엔드 구조를 다룬 기록',
    tags: ['spring', 'java', 'kotlin', 'docker', 'kubernetes', 'Kubernetes', 'k8s', 'kafka', 'Kafka', 'redis', 'mssql'],
  },
  {
    title: 'System Design Notes',
    description: '복잡한 시스템을 읽고 설계 원칙으로 정리한 독서와 설계 메모',
    tags: ['Clean Architecture', '클린아키텍쳐', 'Implementing Domain-Driven Design', 'Designing Data Intensive Applications', '단위 테스트', 'JEP'],
  },
] satisfies CuratedTagSpec[];

export function getCuratedTagGroups() {
  const taxonomy = new Map(getTaxonomy('tags').map((tag) => [tag.name, tag.posts.length]));

  return curatedTagSpecs
    .map((group) => ({
      ...group,
      tags: group.tags
        .map((name) => {
          const count = taxonomy.get(name);
          return count ? { name, count, url: `/tags/${encodeURIComponent(name)}/` } : undefined;
        })
        .filter((tag): tag is CuratedTag => Boolean(tag)),
    }))
    .filter((group) => group.tags.length > 0);
}

export function getCuratedTagCount() {
  return new Set(getCuratedTagGroups().flatMap((group) => group.tags.map((tag) => tag.name))).size;
}
