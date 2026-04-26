---
layout: post
title: "아이템 70. 복구할 수 있는 상황에는 검사 예외를, 프로그래밍 오류에는 런타임 예외를 사용하라."
date: 2019-03-19 15:32 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 70. 복구할 수 있는 상황에는 검사 예외를, 프로그래밍 오류에는 런타임 예외를 사용하라.

자바는 throwable 타입으로 3가지가 있는데 하나는 검사 예외(checked exception), 런타임 예외(runtime exception), 에러(error) 이렇게 세가지를 제공한다.

* 호출하는 쪽에서 복구하리라 여겨지는 상황이라면 검사 예외를 사용하라.

* 프로그래밍 오류를 나타낼 때는 런타임 예외를 사용하자

* 에러는 보통 JVM이 자원 부족, 불변식 깨짐등 더이상 수행을 계속 할수 없는 상황 을 나타낸다.
Error를 상속 받아서 하위 클래스를 만드는 일을 자제 하고 throw 문으로 직접 던지는일도 없어야 돤다.(AssertError는 예외)


# 참조
-----
