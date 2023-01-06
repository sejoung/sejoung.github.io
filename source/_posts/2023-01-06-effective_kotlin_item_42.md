---
layout: post
title: "이펙티브 코틀린 아이템 42: compareTo의 규약을 지켜라"
date: 2023-01-06 22:58 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(클래스설계)
## 아이템 42: compareTo의 규약을 지켜라

compareTo는 Any에 있는 메소드가 아니라 부등식으로 변환되는 연산자이다.

* 비대칭적 동작: a≥b 이고 b≥a 라면 a==b이다.
* 연속적 동작: a≥b 이고 b≥c라면 a≥c이다.
* 코넥스적 동작(connex relation): a≥b 또는 b≥a 중에 적어도 하나는 반드시 항상 true여야 한다. 관계가 없다면 고전적 정렬 알고리즘(퀵, 삽입)을 사용할 수 없고, 위상 정렬만 사용할 수 있다.

### compareTo를 따로 정의해야 할까?

일반적으로는 거의 없다. sortedBy(단일 키), sortedWith(여러 키)로 정렬할 수 있기 때문이다.

### compareTo 구현하기

* compareTo를 구현할 때 유용하게 활용할 수 있는 톱레벨 함수가 있음
* 두 값을 단순하게 비교하기만 한다면, compareValues 함수를 다움과 같이 활용

```kotlin
class User(
    val name: String,
    val surname: String
): Comparable<User> {
    override fun compareTo(other: User): Int = compareValues(surname, other.surname)
}
```

함수가 다음 값을 리턴해야 한다는 것을 기억
* 0: 리시버와 other 가 같온 경우
* 양수: 리시버가 other 보다 큰 경우
* 음수: 리시버가 other 보다 작은 경우

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)
