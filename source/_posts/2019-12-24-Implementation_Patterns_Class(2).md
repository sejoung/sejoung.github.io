---
layout: post
title: "켄트백의 구현패턴-클래스(2)"
date: 2019-12-24 15:20 +0900
comments: true
tags : ["켄트백의 구현패턴","Implementation Patterns","클래스"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 클래스

### 하위클래스

이 객체는 상위클래스와 같다. 이 부분만 제외 하면... 라고 말하는거와 같다.

하위 클래스의 문제점

* 일단 사용하면 되돌리기 어렵다.
* 하위 클래스를 이해하기 위해서 상위 클래스를 이해해야 한다.
* 하위 클래스가 상위 클래스 세부 구현 특성에 의존할 수 있으므로 상위클래스의 수정이 위험해진다.
* 클래스 상속 계층이 복잡해지면서 이 모등ㄴ 문제가 심화된다.

병렬 클래스 계층을 이용하는 경우 상속에서 치명적인 문제점이 발견된다.

하위클래스를 올바르게 사용하기 위한 키 포인트는 상위클래스 로직을 여러개의 메소드로 잘게 쪼개는 것이다.
이는 하위 클래스를 작성할때 각메소드별로 오버라이드할 수 있게 하기 위해서이다.

### 구현자

다형적 메시지는 여러가지 변형을 수용할 수 있다.

### 내부클래스

작은 전용 클래스(내부 클래스)를 사용하면 클래스 사용에 따른 비용을 지불하지 않으면서도 클래스의 장점을 대부분 취할 수 있다.

생성 클래스의 인스턴스와 완전히 분리된 내부 클래스를 사용하려면 내부 클래스를 static으로 선언하면 된다.

### 인스턴스별 행동

이론상 클래스의 인스턴스들은 모두 같은 로직을 공유한다. 인스턴스 생성후에 인스턴스별 행동을 변화시키지 않는 편이 좋다.

### 조건문

조건문의 장점은 인스턴스 별 행동을 지원하면서도 모든 로직이 하나의 클래스 안에 들어있다는 것이다.
그러나 조건문을 사용하면 인스턴스 행동을 변경하기 위해 해당 클래스 코드를 수정해야 한다.

단순성과 지역성에서 장점이 있지만 광범위하게 사용되는 경우 이러한 장점이 문제가 될 수도 있다.

### 위임

각 인스턴스에서 다른 로직을 수행하도록 하는 다른 방법으로는 위임이 있다.

### 플러그인 선택자

한두개의 메소드만 인스턴스별 행동이 필요하며 모든 로직이 하나의 클래스 안에 들어가도 좋은 경우를 생각하면 
메소드 이름을 필드에 저장해두고 리플렉션으로 호출하는 것도 좋다.

### 익명 내부 클래스

인스턴스별 행동을 위해 자바가 지원하는 다른 기법은 익명 내부 클래스이다.

한곳에서만 사용되는 클래스를 생성해서 일부 메소드를 오버라이드한 후 지역적으로만 사용하는 것이다.
특정 지역에서만 사용되므로 클래스는 이름이 필요 없다.

단점

* 클래스 생성할때 인스턴스에서 사용할 코드가 어떤 것인지 알고 있어야 하고 인스턴스 생성 후에는 수정할 수 없다.
* 별도로 테스트 하기가 어려워서 복잡한 로직에 적합하지 않다
* 클래스 이름을 사용할수 없으므로 클래스 이름을 통해 프로그래머의 의도를 전달할수 없다.

### 라이브러리 클래스

어떤 객체에도 적합하지 않은 기능은 어디에 구현해야 할까? 한가지 방안은 빈 클래스를 하나 만들어 정적 메소드를 구현하는것이다.
라이브러리 클래스는 인스턴스화가 불가능한 라이브러리 메소드만 갖고 있는 클래스다.

클래스는 서로 관련 있는 상태를 묶어 놓은 것이다.

# 참조
-----


