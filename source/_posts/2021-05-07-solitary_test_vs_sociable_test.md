---
layout: post
title: "단위 테스트(UnitTest)"
date: 2021-05-07 22:38 +0900
comments: true
tags : ["Solitary","UnitTest","Sociable","classicist", "mockist", "commit suite"]
categories : ["testing"]
sitemap :
changefreq : daily
priority : 1.0
--->
# 단위 테스트(UnitTest)

## 단위 테스트의 공통요소
* 단위 테스트가 소프트웨어 시스템의 작은 부분에 초점을 맞춘 저수준이라는 개념
* 단위 테스트는 일반적으로 프로그래머가 일반 도구를 사용하여 작성
* 단위 테스트는 다른 종류의 테스트보다 훨씬 빠를 것으로 예상

사람마다 다른 단위의 범위를 가지고 있다. 객체지향설계에서는 클래스를 하나의 단위로 취급하는 경향이 있으며,
절차적 또는 기능적 접근 방식은 단일 기능을 하나의 단위로 간주 할 수 있다. 그러나 실제로는 상황마다 틀리다.

여기서 solitary test(단독적 테스트) 이냐 sociable test(사회적인,사교적인 테스트)이냐 여부 이다.

## solitary vs sociable
* solitary test : TestDouble(Dummy, Fake, Stubs, Spies, Mocks)을 사용해서 상호작용이 있는 유닛,클래스(?) 등을 완벽하게 분리시킨 채 테스트
* sociable test : 의존성이 있는 다른 코드들과 함께 테스트

여기서 classicist는 sociable test를 선호하고 mockist는 solitary test를 선호 한다.

classicist 도 데이터베이스 또는 파일 시스템과 같은 외부 리소스와의 모든 협력은 double을 사용해야한다고 주장한다.

## speed

단위 테스트의 일반적인 속성은 프로그래머가 직접 수행하는 작은 범위, 빠른 속도로 프로그래밍 할 때 매우 자주 실행할 수 있음을 의미한다.

commit suite: 모든 단위 테스트를 포함 하는 것이 일반적

Kent Beck의 경험에 의해 commit suite는 10분 이내로 실행되어야 한다.

그러나 진짜 요점은 테스트 스위트가 충분히 자주 실행되는 것을 힘들어하지 않도록 충분히 빠르게 실행되어야한다는 것

# 참고자료
* [martinfowler UnitTest](https://martinfowler.com/bliki/UnitTest.html)
