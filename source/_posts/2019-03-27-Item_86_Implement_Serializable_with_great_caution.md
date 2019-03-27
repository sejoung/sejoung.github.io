---
layout: post
title: "아이템 86. Serializable을 구현할지는 신중히 결정하라."
date: 2019-03-17 15:28 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 86. Serializable을 구현할지는 신중히 결정하라.

Serializable 구현의 문제점

* Serializable을 구현하면 릴리스한 뒤에는 수정하기 어렵다.
* 버그와 보안 구멍이 생길 위험이 높아진다.
* 해당 클래스의 신버전을 릴리스할 때 테스트할 것이 늘어난다는 점이다.

Serializable 구현 여부는 가볍게 결정할 사안이 아니다.

상속용으로 설계된 클래스는 대부분 Serializable을 구현하면 안되며 인터페이스도 대부분 Serializable을 확장해서는 안된다.

내부 클래스는 직렬화를 구현하지 말아야 한다.

단 정적 맴버 클래스는 Serializable을 구현해도 된다.

# 참조
-----



