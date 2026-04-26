---
layout: post
title: "이펙티브 코틀린 아이템 6: 사용자 정의 오류보다는 표준 오류를 사용하라"
date: 2022-08-11 10:34 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(안정성)
## 아이템 6: 사용자 정의 오류보다는 표준 오류를 사용하라

* IllegalArgumentException 과 IllegalStateException 는 require 와 check 를 사용해 throw 할수 있는 예외
* IndexOutOfBoundsException : 인덱스 파라미터 값이 범위를 벗어났다는 것. 일반적으로 컬렉션 또는 배열에서 사용함
* ConcurrentModificationException : 동시 수정을 금지했는데 발생해버림
* UnsupportedOperationException : 사용자가 사용하려고 한 메서드가 현재 객체에서는 사용할수 없다는 것을 나타낸다.
* NoSuchElementException : 사용하려고 했던 요소가 존재하지 않음을 나타낸다.

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)

