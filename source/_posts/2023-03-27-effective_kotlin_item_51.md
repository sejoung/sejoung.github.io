---
layout: post
title: "아이템 51: 성능이 중요한 부분에는 기본 자료형 배열을 사용하라"
date: 2023-03-27 21:42 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(효율성)
## 아이템 51: 성능이 중요한 부분에는 기본 자료형 배열을 사용하라

기본 자료형의 특징
* 가볍다 -> 일반적인 객체와 다르게 추가적으로 포함되는것이 없기 때문
* 빠르다 -> 값에 접근할 때 추가비용이 들지 않는다

일반적으로 array보다 list나 set을 사용하는 것이 좋다 하지만 기본 자료형 컬렉션을 굉장히 많이 보유해야 하는 경우에는
성능을 높이고 메모리 사용량을 줄일 수 있도록 array를 사용하는 것이 좋다

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)
