---
layout: post
title: "이펙티브 코틀린 아이템 7: 결과 부족이 발생할 경우 null과 Failure를 사용하라"
date: 2022-08-11 13:34 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(안정성)
## 아이템 7: 결과 부족이 발생할 경우 null과 Failure를 사용하라

함수가 원하는 결과를 만들어 낼 수 없을때 이러한 상황을 처리하는 방법은 크게 두가지가 있다.

* null 또는 실패를 나타내는 sealed 클래스를 리턴한다.
* 예외를 throw 한다

예외는 예외 적인 상황이 발생했을때 사용하는것이 좋다.

* 많은 개발자가 예외가 전파되는 과정을 제대로 추적하지 못한다.
* 코틀린의 모든 예외는 unchecked 예외 이다 따라서 사용자가 예외 처리를 하지 않을수도 있으며 이와 관련된 내용은 문서에도 제대로 드러나지 않는다.
* 예외는 예외적인 상황을 처리하기 위해서 만들어졌으므로 명시적인 테스트 만큼 빠르게 동작하지 않는다.
* try-catch 블록 내부에 코드를 배치하면 컴파일러가 할 수 있는 최적화가 제한 된다.

null 값과 sealed 클래스의 차이점

* null : 추가적인 정보가 필요하지 않을때
* sealed 클래스 : 추가적인 정보가 필요할떄

List에 get, getOrNull, getOrDefault 같은 함수가 있는데

* get은 IndexOutOfBoundsException 에러를 발생시킴
* getOrNull은 null을 리턴
* getOrDefault 특정 값을 리턴

일반적으로 getOrNull 또는 elvis 연산자를 사용하는것이 쉽다.


# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)

