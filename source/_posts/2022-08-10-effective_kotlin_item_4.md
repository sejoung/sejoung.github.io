---
layout: post
title: "이펙티브 코틀린 아이템 4: inferred 타입으로 리턴하지 말라"
date: 2022-08-10 17:10 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린
## 아이템 4: inferred 타입으로 리턴하지 말라

코틀린의 타입 추론은 가장 널리 알려진 코틀린의 특징이다.

타입추론을 사용할 때는 몇 가지 위험한 부분이 있다.
우선 할당 떄 inferred 타입은 정확하게 오른쪽에 있는 피연산자에 맞게 설정된다 절대로 슈퍼 클래스 또는 인터페이스로 설정되지 않는다.

원하는 타입보다 제한된 타입이 설정 되었다면 타입을 명시적으로 지정해서 문제를 해결할수 있다.

```kotlin
open class Animal
class Zebra:Animal()

fun main(){
    // 타입 추론이 Zebra로 된다.
    val zebra = Zebra()
    
    val animal:Animal = Zebra()
}

```

하지만 직접 라이브러리를 조작할수 없는 경우 간단하게 해결할수 없다. 이러한 경우에서 inferred 타입을 노출하면 위험한 일이 발생할수 있다.

타입을 확실하게 지정해야 하는 경우에는 명시적으로 타입을 지정해야 한다는 원칙을 가져야 된다.


# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)

