---
layout: post
title: "이펙티브 코틀린 아이템 5: 예외를 활용해 코드에 제한을 걸어라."
date: 2022-08-11 10:28 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(안정성)
## 아이템 5: 예외를 활용해 코드에 제한을 걸어라

확실하게 어떤 형태로 동작해야 하는 코드가 있다면 예외를 활용해 제한을 거는것이 좋다.

* require 블록 :  아규먼트를 제한할 수 있다.
* check 블록 : 상태와 관련된 동작을 제한할 수 있다.
* assert 블록 : 어떤것이 true인지 확인할수 있다. test 모드에서만 동작
* return 또는 throw 와 함께 사용하는 Elvis 연산자

require 블록과 check 블록을 통해서 나오면 스마트 캐스팅이 된다. 
이걸 활용한 checkNotNull, requireNotNull을 활용할 수 있다.

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)

