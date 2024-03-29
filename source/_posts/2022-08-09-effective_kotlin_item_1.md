---
layout: post
title: "이펙티브 코틀린 아이템 1: 가변성을 제한하라"
date: 2022-08-09 10:00 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(안정성)
## 아이템 1: 가변성을 제한하라

var 나 mutable 객체를 사용하면 상태를 가질수 있다. 상태를 가지는것은 양날의 검이다. 그래서 가변성을 제한하는것을 추천한다.

코틀린은 가변성을 제한하는것이 쉽게 만들어져 있다.

* 읽기 전용 프로퍼티(val)
* 가변 컬렉션과 읽기 전용 컬렉션 구분
* 데이터 클래스의 copy

### 읽기 전용 프로퍼티(val)

읽기 전용 프로퍼티를 선언하면 값으로 선언되며 일반적인 방법으로 변경이 불가능하다.
읽기 전용 프로퍼티가 완전히 변경 불가능한것은 아니며 mutable 객체 값을 담고 있으면 변경이 가능하다.

다른 프로퍼티를 활용하는 게터로도 정의 할수 있다.

### 가변 컬렉션과 읽기 전용 컬렉션 구분

읽기 전용 컬렉션이라고 진짜로 불변하게 만들지 않고 읽기전용으로 설계 했다.
하지만 다운캐스팅은 허용해선 안된다.

### 데이터 클래스의 copy

immutable 객체의 장점

* 한번 정의된 상태가 유지 되므로 코드를 이해하기 쉽다.
* immutable 객체는 공유되어도 충돌이 따로 일어나지 않는다.
* immutable 객체에 대한 참조가 변하지 않으므로 쉽게 캐시할 수 있다.
* immutable 객체는 방버적 복사본을 만들 필요가 없다.
* immutable 객체는 다른 객체를 만들때 활용하기 좋다.
* immutable 객체는 set이나 map의 키로 사용할수 있다.

immutable 객체의 단점은 변경할수 없다라는 단점이 있다. 
변경을 하려고 하면 내부 메소드를 만들어야 되는데 이떄 data 한정자를 활용하면 copy 키워드를 할용할수 있다.


# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)

