---
layout: post
title: "클린코드(Emergence)"
date: 2019-05-17 09:13 +0900
comments: true
tags : ["클린코드","cleancode"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 클린코드

### Emergence(드러나다, 창발성)

켄트백의 간단한 설계규칙 4가지

* 모든 테스트를 실행한다.
* 중복을 없엔다.
* 프로그래머의 의도를 표현한다.
* 클래스와 매소드 수를 최소로 줄인다.

#### 간단한 설계규칙 : 모든 테스트를 실행하라.

문서로는 시스템을 완벽하게 설계했지만 시스템이 의도한대로 돌아가는지 검증할 방법이 없다면 문서에 투자한 가치를 인정 받기 어렵다.

다행이도 테스트가 쉬운 시스템을 만들려고 애쓰면 설계 품질이 덩달아 좋아진다.
크기가 작고 목적하나만 수행하는 클래스가 나온다. SRP를 준수하는 클래스는 테스트 하기 쉬우니깐

테스트 케이스가 많을수록 개발자는 테스트가 쉽도록 클래스를 작성한다.

결합도가 높으면 테스트 케이스를 작성하기 어렵다.
놀랍게도 테스트 케이스를 만들고 계속 돌려라 라고 하는 간단하고 단순한 규칙을 따르면 시스템은 낮은 결합도와 높은 응집력이라는 객체 지향 방법론이 지향하는 목표를 저절로 달성한다.

#### 간단한 설계규칙 : 리팩토링

테스트 케이스를 모두 작성했다면 이제 코드와 클래스를 정리해도 괜찮다.

이때는 설계 품질을 높이는 기법이라면 무엇이든 적용해도 괜찮다.
코드를 정리 하면서 시스템이 깨질 걱정이 없다 테스트 케이스가 있으니깐

#### 중복을 없애라.

깔끔한 시스템을 만들려면 단 몇줄이라도 중복을 제거하겠다는 의지가 필요하다.
작은 사용은 시스템 복잡도를 극적으로 줄여 준다.

#### 표현하라.

소프트웨어의 비용의 대부분은 장기적인 유지보수에 들어간다.

* 좋은이름을 선택한다.
* 함수와 클래스 크기를 가능한 줄인다.
* 표준 명칭을 사용한다.
* 단위 테스트 케이스를 꼼꼼히 작성한다.

#### 클래스와 메소드 수를 최소로 줄여라

중복을 제거하고, 의도를 표현하고, SRP를 준수한다는 기본적인 개념도 극단으로 치달으면 득보다 실이 된다.

예로는 클래스마다 무조건 인터페이스를 생성하라고 요구하는 구현 표준이 좋은 예다.

#### 결론

경험을 대신할 단순한 개발 기법이 있을까? 당연히 없다. 이장에서 나온것은 저자들은 수십년동안 쌓은 경험의 정수다.

# 참조
-----



