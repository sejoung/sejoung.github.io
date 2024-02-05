---
layout: post
title: "도메인 주도 설계 구현-값 객체(1)"
date: 2020-07-16 10:28 +0900
comments: true
tags : ["Implementing Domain-Driven Design"," 도메인 주도 설계 구현","Value Objects","값 객체"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 도메인 주도 설계 구현

## 값 객체(Value Objects)

종종 엔터티에 관한 고민의 그늘에 가려지긴 하지만 값 객체란 DDD의 필수적인 구성 요소이다.

```
값의 이점

* 측정하고 수량화하거나 설명해주는 값 타입은 생성, 테스트, 사용, 최적화, 유지 관리가 더 쉽다.

```


가능한 위치 에서 엔터티 대신 값 객체를 사용해 모델링하도록 노력해야 한다
심지어 도메인 개념이 엔터티로 모델링돼야 할때도 엔터티의 설계는 자식 엔터티의 컨테이너보다는 값의 컨테이너로 동작하는 쪽으로 기울어야 한다.

값이란 단순히 필요에 따라 오가며 손상을 일으키지 않고 해롭지도 않은 대상일 뿐이다.

```
모델 요소의 특성에만 신경을 쓰고 있다면 이를 값 객체로 분리하라. 값 객체가 담을 특성의 의미를 표현하고 그에 관한 기능도 부여하자.
값 객체를 변경 불가능한 것으로 취급하자 식별자는 부여하지 말고 엔터티를 유지할 때 필요한 설계 복잡성을 피하도록 하자

```

### 값의 특징

가장 먼저 도메인 개념을 값 객체로 모델링할 땐 유비쿼터스 언어를 확실히 활용하자. 이를 반드시 달성해야 하는 
가장 중요한 원칙이자 특징으로 여기자.

개념을 값으로 나타낼지 결정할때 반드시 다음과 같은 특징을 대부분 포함해야 한다.

* 도메인 내의 어떤 대상을 측정하고 수량화하고 설명한다.
* 불변성이 유지될 수 있다.
* 관련 특성을 모은 필수 단위로 개념적 전체를 모델링한다.
* 측정이나 설명이 변경될 땐 완벽히 대체 가능하다.
* 다른 값과 등가성을 사용해 비교할 수 있다.
* 협력자에게 부작용이 없는 행동을 제공한다.

#### 측정, 수량화, 설명

모델 내의 진정한 값 객체가 있다면 이는 여러분이 알고 있든 그렇지 않든 간에 도메인 안에 있지 않다.
대신 이는 도메인 내에 있는 어떤 대상을 측정하고 수량화하고 설명하는 개념이다.

#### 불변성

값인 객체는 일단 생성되면 변경할 수 없다. 인스턴스화 자체가 객체의 불변성을 보장하지 않는다.

```

지금 설계하고 있는 객체가 자신의 행동으로 변경돼야 한다고 생각한다면 그 필요성을 스스로 질문해보라.
값을 반드시 변경해야 한다면 대신할 대상을 할용하는 편이 어떨까?
가능한상황에 이접근법을 사용하면 설계를 단순하게 해준다.

```

#### 개념적 전체

값 객체는 하나 이상의 개별적 트성을 가질 수 있으며 각 특성은 서로 연관돼 있다.
특성을 개별적으로 사용한다면 응집력 있는 의미를 제공하지 못한다.

값 클래스의 생성자는 개념적 전체의 효과성에 영향을 미친다. 우린 값이 한번의 오퍼레이션으로 생성됨을 보장해줄 값 클래스의 생성자가 필요하다.

#### 대체성

불변값의 변하지 않는 상태가 현재의 전체 값을 올바르게 나타내고 있는 이상 엔터티는 반드시 해당 값 구조를 가져야 한다.
만약 상태가 올바르지 않은 상황이 왔다면 현재의 전체를 올바르게 나타내는 새로운 값으로 전체 값을 완전히 대체 해야 한다.

#### 값 등가성

값 객체 인스턴스를 또 다른 인스턴스와 비교할 땐 객체 등가성 테스트가 사용된다.
등가성은 두 객체의 타입과 특성을 비교해서 결정된다.

#### 부작용이 없는 행동

객체의 메소드는 부작용이 없는 합수로 설계할 수 있다.
함수란 고유의 상태를 변경하지 않고 출력을 만들어 내는 객체 오퍼레이션을 말한다.

# 참조
-----
* [implementing-domain-driven-design](https://www.oreilly.com/library/view/implementing-domain-driven-design/9780133039900/)

