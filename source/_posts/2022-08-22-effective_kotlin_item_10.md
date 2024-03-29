---
layout: post
title: "이펙티브 코틀린 아이템 10: 단위 테스트를 만들어라"
date: 2022-08-22 18:30 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(안정성)
## 아이템 10: 단위 테스트를 만들어라

지금 까지 코드를 안전하게 만드는 방법에 대해 이야기 했다 
코드를 안전하게 만드는 가장 좋은 방법은 다양한 테스트를 해보는것이다.

단위 테스트의 일반적인 내용

* 일반적인 유즈케이스(happy path) 
* 일반적인 오류케이스 와 잠재적 문제
* 에지 케이스와 잘못된 아규먼트

단위 테스트의 장점

* 테스트가 잘 된 요소는 신뢰할 수 있습니다.
* 테스트가 잘 만들어저 있으면 리팩터링하는 것이 두렵지 않습니다.
* 수동으로 테스트 하는 것보다 단위 테스트로 확인하는게 빠릅니다.
* 빠른속도의 피드백 루프가 만들어 지므로 전체적인 개발속도가 올라갑니다.

단위 테스트의 단점

* 단위 테스트를 만드는 데 시간이 걸린다.
* 테스트를 활용할 수 있게 코드를 조정해야 한다.
* 좋은 단위 테스트를 만드는 작업이 꽤 어렵다. 


# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)

