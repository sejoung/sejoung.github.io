---
layout: post
title: "이펙티브 코틀린 아이템 37: 데이터 집합표현에 data 한정자를 사용하라"
date: 2023-01-02 21:47 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(클래스설계)
## 아이템 37: 데이터 집합표현에 data 한정자를 사용하라

떄로는 데이터를 한번에 전달해야 되는데 이럴때는 data 한정자를 사용해서 class를 만들면 좋다

* toString
* equals와 hashcode
* copy : immutable 클래스를 만들때 유용하다.
* compoentN : 위치 기반 클래스 해체를 할수 있게 도와준다.

### 위치 기반 해체
#### 장점

* 변수명을 원하는대로 지정할수 있다.

#### 단점

* 위치를 잘못 지정하면 잘못 해체된다.
* 해체 할때 생성자의 프로퍼티 명과 동일하게 해주는게 좋다 IDE의 경고 메시지를 받을수 있다.
* 값을 하나만 갖는 데이터 클래스는 해체하지 말자 읽는사람에게 혼동을 줄수 있다

### 튜플 대신 데이터 클래스 사용하기

Pair 와 Triple은 코틀린에 마지막 남은 튜플

데이터 클래스가 튜플보다 항상 나아서 사라짐

튜플의 사용 용도
* 값에 간단하게 이름을 붙일때
* 미리 알수 없는 집합을 표현할때

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)
