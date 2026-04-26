import { getAllExternalWriting, type ExternalWriting } from './external-writing';
import { getAllPosts, postsPerPage, type Post } from './posts';

export type WritingItem = Post | ExternalWriting;

export function compareWriting(a: WritingItem, b: WritingItem) {
  return b.date.getTime() - a.date.getTime() || a.title.localeCompare(b.title);
}

export function getAllWriting() {
  return [...getAllPosts(), ...getAllExternalWriting()].sort(compareWriting);
}

export function paginateWriting(items: WritingItem[], page: number) {
  const start = (page - 1) * postsPerPage;
  return items.slice(start, start + postsPerPage);
}

export function totalWritingPages(items: WritingItem[]) {
  return Math.max(1, Math.ceil(items.length / postsPerPage));
}
