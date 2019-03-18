---
layout: post
title: "아이템 68. 일반적으로 통용되는 명명 규칙을 따르라."
date: 2019-03-18 17:06 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 68. 일반적으로 통용되는 명명 규칙을 따르라.

자바는 명명규칙이 잘 정의 되 있으며 자바언어 명세에 나타나 있다 명세에 따르는 명명규칙을 따라라.

#### 패키지와 모듈 이름

1. 조직의 인터넷 도메인 이름을 역순으로 사용한다.(com.google, com.naver)
1. 예외 적으로 표준 라이브러리와 선택적 패키지들은 각각 java와 javax로 시작한다.
1. 패키지 이름의 나머지는 해당 패키지를 설명하는 하나 이상의 요소로 이루어짐 8자이하의 짧은 단어로 표현

#### 클래스와 인터페이스(열거 타입과 애너테이션을 포함)

1. 클래스와 인터페이스의 이름은 하나 이상의 단어로 이뤄지며 각단어는 대문자로 시작
1. 단어를 줄여쓰지 않도록 한다.

#### 매서드와 필드

1. 첫글자를 소문자로 쓴다는 점만 빼면 클래스 명명규칙과 같다.

1. 객체를 반환하는 메서드 이름은 보통 toType 형태로 짓는다

#### 상수 필드

상수필드를 구성하는 모든 단어는 대문자로 단어사이에는 `_` 로 구분한다.

#### 지역변수

약어를 써도 좋다.

#### 타입 매개변수

보통 한문자로 표현

1. 임의의 타입 : T
1. 컬렉션 원소 : E
1. 맵의 키와 값 : K 와 V
1. 예외 : X
1. 매서드의 반환 타입 : R
1. 그외에 임의 타입의 시퀀스 : T, U, V 혹은 T1, T2, T3

#### 객체를 생성할 수 없는 클래스(정적 팩토리 패턴)

복수형 명사



# 참조
-----
* [jls-6](https://docs.oracle.com/javase/specs/jls/se7/html/jls-6.html)
* [JavaBeans(TM) Specification](https://download.oracle.com/otndocs/jcp/7224-javabeans-1.01-fr-spec-oth-JSpec/)
* [아이템 4. 인스턴스화를 막으려면 private 생성자를 사용하라](https://sejoung.github.io/2018/11/2018-11-13-Enforce_noninstantiability_with_a_private_constructor/)
* [아이템 6. 불필요한 객체생성을 피하라](https://sejoung.github.io/2018/11/2018-11-19-Avoid_creating_unnecessary_objects/)
* [아이템 1. 생성자 대신 정적 팩토리 매소드 패턴(static factory method) 사용을 고려 해라](https://sejoung.github.io/2018/11/2018-11-05-static_factory_method/)

