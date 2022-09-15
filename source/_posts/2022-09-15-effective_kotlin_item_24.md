---
layout: post
title: "이펙티브 코틀린 아이템 24: 제네렉 타입과 variance 한정자를 활용하라"
date: 2022-09-15 20:24 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(재사용성)
## 아이템 24: 제네렉 타입과 variance 한정자를 활용하라

```kotlin
class Cup<T>
```
위에 코드에서 파라미터 T는 variance 한정자(out 또는 in)이 없으므로 기본적으로 invariant(불공변성) 입니다.
제네릭 타입으로 들어가는 타입들이 서로 관련성이 없다는 의미

```kotlin
fun main(){
    val anys: Cup<Any> = Cup<Int>() // 오류
    val nothings: Cup<Nothing> = Cup<Int>() // 오류
}
```

만약 어떠한 관련성을 원한다면 out 또는 in 이라는 variance 한정자를 붙혀야 된다.

out 은 타입파라미터를 covariant(공변성)로 만든다. A가 B의 서브타입일때 Cup<A> 가 Cup<B>의 서브타입이라는것을 의미

```kotlin
class Cup<out T>
open class Dog
class Puppy: Dog

fun main(){
    val b: Cup<Dog> = Cup<Puppy>() // OK
    val a: Cup<Puppy> = Cup<Dog>() // 오류 
    val anys: Cup<Any> = Cup<Int>() // OK
    val nothings: Cup<Nothing> = Cup<Int>() // 오류
}
```

in 한정자는 반대 의미 in 한정자는 타입 파라미터를 contravariant(반변성)으로 만든다. A가 B의 서브타입일때 Cup<A>가 Cup<B>의 슈퍼타입

```kotlin
class Cup<out T>
open class Dog
class Puppy: Dog

fun main(){
    val b: Cup<Dog> = Cup<Puppy>() // 오류
    val a: Cup<Puppy> = Cup<Dog>() // OK 
    val anys: Cup<Any> = Cup<Int>() // 오류
    val nothings: Cup<Nothing> = Cup<Int>() // OK
}
```

함수 타입은 파라미터 유형과 리턴 타입에 따라서 관계가 달라진다.

* 코틀린 함수의 타입의 모든 파라미터 타입은 contravariant(반공변성)
* 코틀린 함수의 타입의 모든 리턴 타입은 covariant(공변성)
* 함수 타입을 사용할 때는 자동으로 variance 한정자가 사용

(Tin, Tin2) -> Tout

자바의 배열은 covariant(공변성)이다. 이런 특성 때문에 다음과 같은 문제가 발생

```java
Integer[] numbers = {1, 2, 3, 4};
Object[] objs = numbers;
object[2] = "B"; // Runtime에 ArrayStoreException이 발생
```

* 코틀린은 위와 같은 결함을 해결하기 위해 Array를 invariant(무공변성)으로 만들었다. 따라서 Array를 Array등으로 변경할 수 없다.

```kotlin
//선언 부분에 사용
class Box<out T>(val value: T)
val box1: Box<String> = Box("Box")
val box2: Box<Any> = box1
```


```kotlin
class Box<T>(val value: T)
val box1: Box<String> = Box("Box")
// 사용하는 부분에 사용
val box2: Box<out Any> = box1
```

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)
