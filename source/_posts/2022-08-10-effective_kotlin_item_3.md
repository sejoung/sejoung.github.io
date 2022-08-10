---
layout: post
title: "이펙티브 코틀린 아이템 3: 최대한 플랫폼 타입을 사용하지 말라"
date: 2022-08-10 14:50 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린
## 아이템 3: 최대한 플랫폼 타입을 사용하지 말라

코틀린에서는 null-safety 메커니즘을 사용해 NPE는 거의 찾아 보기 힘들다.

코틀린에서 자바 코드를 사용할때 @Nullable 어노테이션이 붙어 있으면 String?으로 
변경하고 @NotNull 이면 String으로 선언하면 되는데 아무 어노테이션이 없으면 어떻게 해야 되나?

보수적으로 null을 허용할수 있기 때문에 String? 이렇게 다루는게 맞을것이다.

코틀린에서는 자바 등의 다른 프로그래밍 언어에서 넘어온 타입들을 특수하게 다루는데
이러한 타입을 플랫폼 타입이라고 부른다.

플랫폼 타입은 String! 처럼 ! 기호를 붙혀서 표기한다.  
이 표기법은 코드에서 명시적으로 사용할수 없다


# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)

