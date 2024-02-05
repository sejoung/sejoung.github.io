---
layout: post
title: "클린아키텍쳐-컴포넌트 응집도"
date: 2019-11-04 12:01 +0900
comments: true
tags : ["클린아키텍쳐","Clean Architecture","컴포넌트 응집도"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 컴포넌트 응집도

어떤 클래스는 어떤 컴포넌트에 포함시켜야 할까?

* REP : 재사용/릴리스 등가 원칙
* CCP : 공통 폐쇄 원칙
* CRP : 공통 재사용 원칙

### REP : 재사용/릴리스 등가 원칙

재사용 단위는 릴리스 단위와 같다.

메이븐, 라이닝언, RVM 같은 모듈 관리 도구가 등장한 시기 이 기간에 재사용 가능한 컴포넌트나 
컴포넌트 라이브러리가 엄청나게 많이 만들어졌다.

우리는 이제 소프트웨어 재사용의 시대에 살고있다. 객체지향 모델의 오랜 약속중 하나가 실현 되엇다.

소프트웨어 컴포넌트가 릴리스 절차를 통해 추적 관리 되지 않거나 릴리스 번호가 부여되지 않는다면
해당 컴포넌트를 재사용하고 싶어도 할수도 없고 하지도 않을 것이다.

단일 컴포넌트는 응집성 높은 클래스와 모듈들로 구성되어야 함을 뜻한다.

### CCP : 공통 폐쇄 원칙

동일한 이유로 동일한 시점에 변경되는 클래스는 같은 컴포넌트로 묶어라

이 원칙은 단일책임원칙(SRP)을 컴포넌트 관점에서 다시 쓴 것

대다수의 어플리케어션에서 유지보수성은 재사용성보다 훨씬 중요하다. 
만약 변경을 단일 컴포넌트로 제한 할 수 있다면 해당 컴포넌트만 재배포하면 된다. 
변경된 컴포넌트에 의존하지 않는 다른 컴포넌트는 다시 검증하거나 배포할 필요 없다.

동일한 시점에 동일한 이유로 변경되는 것들을 한대 묶어라. 서로 다른 시점에 다른 이유로 변경되는 것들은 서로 분리하라

### CRP : 공통 재사용 원칙

컴포넌트 사용자들을 필요하지 않는 것에 의존하게 강요하지 말라.

CRP는 어떤 클래스를 한데 묶어도 되는지보다는 어떤 클래스를 한데 묶으면 안되는지를 이야기한다.

#### ISP와의 관계

CRP는 인터페이스 분리 원칙의 포괄적인 버전이다.




# 참조
-----

