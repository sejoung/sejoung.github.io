---
layout: post
title: "이펙티브 코틀린 아이템 41: hashCode의 규약을 지켜라"
date: 2023-01-05 21:59 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(클래스설계)
## 아이템 41: hashCode의 규약을 지켜라

### 해시 테이블
* Map, Set : 컬렉션에 요소를 빠르게 추가하고 컬렉션에서 요소를 빠르게 추출해야한다고 할때 사용할 수 있는 자료구조
* Map, Set은 중복 비허용
* 성능을 좋게 만드는 해결 방법 해시 테이블
* 해시 테이블은 각 요소에 숫자를 할당하는 함수가 필요하고 이 함수를 해시함수라고한다
* 같은 요소라면 같은 숫자를 리턴한다.

해시함수의 특징
* 빠르다
* 충돌이 적다

해시함수 
* 해시함수는 각각의 요소에 특정한 숫자를 할당하고 이를 기반으로 요소를 다른 버킷에 넣는다.
* 해시 함수의 기본적인 조건에 의해서 같은 요소는 항상 동일한 버킷에 넣게 된다.

코틀린은 해시 코드를 만들 때 hashCode 함수를 이용한다.

### 가변성과 관련된 문제

* 요소를 추가될 때만 해시 코드를 계산
* 요소가 변경되어도 해시코드는 계산되지 않으며, 배킷 재배치도 이뤄지지 않는다. 따라서 Set과 Map의 키로 mutable 요소를 사용하면 안되고 사용하더라도 요소를 변경해서는 안된다.

```kotlin
data class FullName(
   var name: String,
   var surname: String
)

val person = FullName("Maja", "Markiewicz")
val s = mutableSetOf<FullName>()
s.add(person)
person.surname = "Moskała"

print(person) // FullName(name=Maja, surname=Moskała)
print(person in s) // false
print(s.first() == person) // true
```

### hashCode의 규약
* 어떤 객체를 변경하지 않았다면 hashCode는 여러 번 호출해도 그 결과가 항상 같아야 한다
* eqauls 메서드의 실행 결과로 두 객체가 같다고 나온다면, hashCode 메서드의 호출 결과도 같다고 나와야 한다
* 


# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)
