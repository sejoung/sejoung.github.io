---
layout: post
title: "켄트백의 구현패턴-컬렉션(2)"
date: 2020-01-10 17:59 +0900
comments: true
tags : ["켄트백의 구현패턴","Implementation Patterns","컬렉션"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 컬렉션

### 구현

구현 클래스를 구현을 선택할때 요소

* 성능
* 컬렉션의 크기

#### Collection

Collection 인터페이스에 기본 구현 클래스는 ArrayList 이다.
ArrayList의 성능상 문제가 될만한 부분은 contains와 이 메소드를 이용하는 다른 메소드들이 있다.

성능이 문제가 된다면 HashSet으로 바꾸는것을 고려해봐라


#### List

List 인터페이스는 Collection에서 예측가능한 원소 사이의 순서를 부여
List의 흔히 사용하는 두가지 구현 ArrayList 와 LinkedList 이다.

#### Set

많이 사용되는 Set 인터페이스의 구현에는 HashSet, LinkedHashSet, TreeSet 세가지가 있다.
원소간에 순서를 보장하고 싶다면 LinkedHashSet을 사용하라.

#### Map

Map 구현은 Set구현과 비슷한 패턴을 보인다. HashMap이 가장 빠르고 단순하다.

### Collections

Collections는 다른 인터페이스에 넣기 적절하지 않는 기능을 모아 놓은 유틸 클래스다.

#### 검색

indexOf 연산에 걸리는 시간은 리스트의 크기에 비래한다.

#### 정렬

리스트 원소간에 순서를 바꾸는 연산을 제공한다.

#### 수정 불가능한 컬렉션

수정불가능한 컬렉션을 만들수 있는 기능을 제공한다.

#### 단일 원소 컬렉션

하나의 원소를 전달해야 하지만 컬렉션 인터페이스를 사용해야 하는경우 메소드를 제공한다.

#### 무원소 컬렉션

수정할수 없는 무원소 컬렉션을 생성할수 있다.

### 컬렉션 확장

컬렉션과 같은 행위를 지원하기 위해 컬렉션을 확장하는것은 몇가지 문제가 있다.

* 컬렉션에서 제공하는 많은 연산들이 클라이언트 측에 부적절할 수있다.
* 소중한 자원인 상속을 망쳐놓을수도 있다. 때에 따라 상속 보다 위임을 사용을 해라




# 참조
-----


