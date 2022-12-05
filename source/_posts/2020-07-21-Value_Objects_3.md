---
layout: post
title: "도메인 주도 설계 구현-값 객체(3)"
date: 2020-07-21 09:43 +0900
comments: true
tags : ["Implementing Domain-Driven Design"," 도메인 주도 설계 구현","Value Objects","값 객체"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 도메인 주도 설계 구현

## 값 객체(Value Objects)

### 값 객체의 저장

#### 데이터 모델 누수의 부정적 영향을 거부하라.

값 객체를 데이터 저장소로 저장하는 대부분의 경우는 비정규화된 방식으로 저장된다.
즉 해당 특성은 부모 엔터티 객체와 같은 데이터 베이스 테이블 행에 저장된다.
이는 데이터베이스에서 값을 가지고 오는 과정을 깔끔하게 해주고 영속성 저장소 누수를 막아준다.

도메인 모델 관점 

* 내가 모델링하는 대상의 개념이 도메인 내에 있는가 아니면 속성중의 하나로서 대상을 측정하거나 수량화하거나 설명하는가?
* 도메인 요소를 설명하도록 올바르게 모델링했을 때 이 모델 개념은 앞서 강조했던 값 특성의 대부분을 포함하는가?
* 단순히 하위 데이터 모델이 도메인 모델 객체를 엔터티로서 저장해야 하기 때문에 모델 내에서 엔터티 사용을 고려하고 있지 않은가?
* 도메인 모델이 고유 식별자를 요구하기 때문에 네가 개별 인스턴스를 신경쓰기 때문에 내가 객체의 수명주기에 걸친 변화의 연속성을 관리 해야만 하기 때문에 엔터티를 사용하는가?

만약 위에 응답이 `설명한다, 그렇다, 그렇다, 아니다` 였다면 반드시 값객체를 사용해야 한다.

#### ORM과 단일 값 객체

하이버네이트를 사용해 값 객체의 단일 인스턴스를 저장할 땐 컴포넌트 맵핑 요소를 사용하자

#### ORM과 한 열로 직렬화되는 여러값

여러 값 객체의 컬렉션을 ORM으로 사용해 관계형 데이터베이스로 매

잠재적 단점

* 열 넓이
* 퀴리 해야만 하는경우
* 사용자 지정 유저 타입이 필요한 경우


#### ORM 과 데이터베이스 엔터티로 지원되는 여러값

데이터베이스 엔터티 특성에 관해선 조금의 관심도 두지말고 개념의 값 타입으로 모델링하자

이를 실천하기 위해 계층 슈퍼타입을 사용할수 있다.

#### ORM과 조인 테이블로 지원되는 여러값

값 타입 자체가 데이터 모델 엔터티 특성을 가질 필요 없이 다중값 컬렉션을 조인 테이블에 저장하는 방법을 제공

#### ORM 상태로서의 열거형 객체

자바 열거형 값을 저장하는 문제의 단순한 해답은 해당 테스트 표현을 저장하는 방법


# 참조
-----
* [implementing-domain-driven-design](https://www.oreilly.com/library/view/implementing-domain-driven-design/9780133039900/)
* [Java5EnumUserType](http://community.jboss.org/wiki/Java5EnumUserType)
* [UserTypeforpersistingaTypesafeEnumerationwithaVARCHARcolumn](http://community.jboss.org/wiki/UserTypeforpersistingaTypesafeEnumerationwithaVARCHARcolumn)
