---
layout: post
title: "아이템 74. 매서드가 던지는 모든 예외를 문서화 하라."
date: 2019-03-22 09:20 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 74. 매서드가 던지는 모든 예외를 문서화 하라.

검사 예외는 항상 따로따로 선언하고, 각 예외가 발생하는 상황을 자바독의 @throws 태그를 사용하여 정확하게 문서화 하자.

비검사 예외는 메서드 선언의 throws 목록에 넣지 말자.(비검사 예외도 문서화는 해야 된다.)

한클래스에 정의된 많은 메서드가 같은 이유로 예외를 던진다면 그예외를 각각에 메서드가 아닌 클래스 설명에 추가하는 방법도 있다. 


# 참조
-----
* [아이템 56. 공개된 API 요소에는 항상 문서화 주석을 작성하라.](https://sejoung.github.io/2019/02/2019-02-25-Write_doc_comments_for_all_exposed_API_elements/)
