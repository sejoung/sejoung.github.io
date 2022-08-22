---
layout: post
title: "이펙티브 코틀린 아이템 8: 적절하게 null을 처리하라"
date: 2022-08-12 13:05 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(안정성)
## 아이템 8: 적절하게 null을 처리하라

null 은 값이 부족하다(lack of value)는 것을 나타낸다.

* String.toIntOrNull() String을 Int로 적절하게 변환할수 없을때 null을 반환
* Iterable<T>.firstOrNull(() -> Boolean) 주어진 조건에 맞는 요소가 없는경우 null을 반환

이처럼 null은 최대한 명확한 의미를 갖는것이 좋다.

nullable 의 처리 방법

* ?. 스마트 캐스팅 Elvis 연산자 등을 활용해서 처리
* 오류를 throw 한다.
* 함수 또는 프로퍼티를 리팩터링해서 nullable 타입이 나오지 않게 한다.

### null 안전하게 처리 하기

* 안전 호출(safe call)

```kotlin

printer?.print()

```

* 스마트 캐스팅

```kotlin
if (printer != null) printer.print()
```

위에 2가지 방법을 제일 많이 사용

* Elvis 연산자
```kotlin

printer?.name ?: "Unnamed"

```

* 방어적 프로그래밍 : 모든 가능성을 올바른 방식으로 처리하는것
* 공격적 프로그래밍 : 예상하지 못한 상황이 발생했을 때, 이러한 문제를 개발자에게 알려서 수정하게 만드는것

### 오류 throw 하기

문제가 발생할 경우에는 개발자에게 오류를 강제로 발생 시켜주는것이 좋다.

오류는 (null 일 경우) throw, !!, requireNotNull, checkNotNull 등을 활용할수 있다.

### not-null assertion(!!)과 관련된 문제

nullable을 처리 하는 가장 간단한 방법은 !!를 사용하는것 만약 null이면 NPE 예외가 발생한다.

!!은 사용하기 쉽지만 좋은 해결 방법은 아니다. 

단점 

* 어떤 설명도 없고 제네릭 예외가 발생 한다.
* 코드가 너무 짧고 너무 사용하기 쉽다 보니 남용하는 문제가 있다.
* 지금은 확실히 null이 아니라고 생각하지만 미래에 확실한것이 아니다.

일반적으로 !! 연산자 사용을 피해야 한다. 대부분의 팀이 !! 연산자를 아에 사용하지 못하게 하는 정책을 갖고 있다.

### 의미 없는 nullability 피하기

nullability는 어떻게든 적절하게 처리해야 하므로 추가 비용이 발생한다.
따라서 필요한 경우가 아니면 nullability 자체를 피하는것이 좋다.

nullability 피하는 방법

* 클래스에서 nullability에 따라 여러 함수를 만드는 방법 (get, getOrNull)
* 어떤 값이 클래스 생성 이후에 확실하게 설정된다는 보장이 있다면 lateinit 과 notNull 델리게이트를 사용해라
* 빈 컬렉션 대신 null을 리턴하지 마세요 null은 컬렉션 자체가 없다는것 요소가 부족하다는것은 빈컬렉션을 사용해라
* nullable enum과 None enum 값은 완전히 다른 의미 이다.


### lateinit 프로퍼티와 nonNull 델리게이트

클래스가 생성중에 초기화할수 없는 프로퍼티를 가지는 것은 자주있는 일은 아니지만 분명히 존재하는 일이다.

나중에 속성을 초기화 할수 있는 lateinit 한정자를 사용하는것이 좋다. 만약 초기화 전에 값을 사용하려고 하면 예외가 발생된다.

lateinit VS nullable 

* !! 연산자로 언팩 하지 않아도 된다.
* 이후에 어떤 의미를 나타내기 위해서 null을 사용하고 싶을때 nullable로 만들 수도 있다.
* 프로퍼티가 초기화된 이후에는 초기화되지 않은 상태로 돌아갈 수 없다.


# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)

