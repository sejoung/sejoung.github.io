# sejoung.github.io

포스트는 `content/posts`에 저장한다.

```text
content/posts/2026-04-26-my-new-post.md
```

파일명은 `YYYY-MM-DD-slug.md` 형식을 사용하고, URL은 기존 블로그 permalink와 동일하게 생성된다.

```text
content/posts/2026-04-26-my-new-post.md
=> /2026/04/my-new-post/
```

이미지는 `public/images`에 저장하고 본문에서는 `/images/example.png` 또는 기존 절대 URL로 참조한다.

```bash
npm run dev
npm run build
```
