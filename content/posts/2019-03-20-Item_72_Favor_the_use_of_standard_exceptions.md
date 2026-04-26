---
layout: post
title: "아이템 72. 표준 예외를 사용하라."
date: 2019-03-20 09:45 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 72. 표준 예외를 사용하라.

표준 예외는 이미 익숙해서 다른사람이 익히기 쉽다. 그래서 가독성도 좋고

Exception, Throwable, Error, RuntimeException 은 직접 재사용하지 말자

예외    | 주요쓰임
--------|--------|
IllegalArgumentException| 허용되지 않는 값이 인수로 건내졌을때(null이면 NullPointException을 사용)
IllegalStateException| 객체가 메소드를 수행하기 적합하지 않은 상태일때
NullPointException| null을 허용하지 않는 메소드에 null을 건냈을때
IndexOutOfBoundsException| 인덱스 범위가 넘어갔을때
ConcurrentModificationException| 허용하지 않은 동시 수정기 발견되었을때
UnsupportedOperationException| 호출한 메소드를 지원하지 않을때

인수 값이 무엇이든 어차피 실패했을경우는 IllegalStateException 그렇지 않으면 IllegalArgumentException 을 사용한다.


# 참조
-----
