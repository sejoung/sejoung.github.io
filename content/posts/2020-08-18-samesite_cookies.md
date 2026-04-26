---
layout: post
title: "크롬에서 SameSite 속성 disable"
date: 2020-08-18 18:00 +0900
comments: true
tags : ["chromium","Chrome","구글 크롬","크롬","쿠키","SameSite"]
categories : ["chromium"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 크롬에서 SameSite 속성 disable

Chrome 84 버전 이상부터는 SameSite 속성이 없는 쿠키는 디폴트값을 SameSite=Lax 로 처리하는데 쿠키를 자사 컨텍스트 로만 제한함

위에 내용으로 일부 쿠키를 사용하는 사이트들이 제한이 걸리는데 해당 부분의 기능을 disable 처리하는 법을 알아보자

브라우져 창에 

```
chrome://flags/
```

위에 주소를 입력

검색창에 `samesite` 를 검색하면 3가지 기능이 나오는데 disabled로 수정처리 하고 재시작하면 기존대로 동작이 된다.


# 참조
-----
* [samesite-cookie-recipes](https://web.dev/samesite-cookie-recipes)
* [chromium same-site](https://www.chromium.org/updates/same-site/test-debug)
