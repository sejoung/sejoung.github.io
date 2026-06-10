// giscus(https://giscus.app) 설정.
// categoryId가 비어 있으면 댓글 영역이 렌더링되지 않는다.
// 활성화 절차:
//   1. GitHub 저장소 Settings → General → Features에서 Discussions 활성화
//   2. Discussions에 Announcements 타입의 "Comments" 카테고리 생성
//   3. https://giscus.app 에서 저장소 입력 후 발급되는 data-category-id 값을 categoryId에 입력
export const giscusConfig = {
  repo: 'sejoung/sejoung.github.io',
  repoId: 'MDEwOlJlcG9zaXRvcnk2NTE4NTEwNQ==',
  category: 'Comments',
  categoryId: '',
};

export const commentsEnabled = giscusConfig.categoryId.length > 0;
