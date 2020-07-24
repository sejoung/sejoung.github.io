---
layout: post
title: "도메인 주도 설계 구현-도메인 이벤트"
date: 2020-07-24 17:59 +0900
comments: true
tags : ["Implementing Domain-Driven Design"," 도메인 주도 설계 구현","Domain Events","도메인 이벤트"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 도메인 주도 설계 구현

## 도메인 이벤트(Domain Events)

도메인이 발생한 사건을 위해 도메인 이벤트를 사용하자. 이벤트는 아주 강력한 모델링 도구이다.

일단 도메인 이벤트를 사용하는 법을 알고 나면 여러분은 이에 중독돼서 어떻게 여지껏 도메인 이벤트 없이 살아 왔는지 의아 해질 것이다.

### 언제 그리고 왜 도메인 이벤트를 사용할까?

도메인 이벤트는 도메인 모델을 완벽히 지원하며 도메인에서 일어난 어떤 사건을 나타낸다.

이벤트가 로컬 시스템이든 외부 시스템이든 관심이 있는 대상으로 전달됐을 땐 보통 결과적 일관성을 위해 사용된다.

이는 글로벌 트랜젝션(두단계 커밋)의 필요성을 제거하고 애그리게잇의 규칙을 지원한다.



# 참조
-----
* [implementing-domain-driven-design](https://www.oreilly.com/library/view/implementing-domain-driven-design/9780133039900/)

