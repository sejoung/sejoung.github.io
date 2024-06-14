---
layout: post
title: "도메인 주도 설계 구현-도메인 이벤트(3)"
date: 2020-07-28 14:52 +0900
comments: true
tags : ["Implementing Domain-Driven Design"," 도메인 주도 설계 구현","Domain Events","도메인 이벤트"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 도메인 주도 설계 구현

## 도메인 이벤트(Domain Events)

### 도메인 모델에서 이벤트 발행하기

#### 구독자

어떤 컴포넌트가 도메인 이벤트에 구독자를 등록하는가? 일반적으로 애플리케이션 서비스에서 등록이 
이뤄지며 때론 도메인 서비스에서도 등록할 수 있다.

헥사고날 아키텍처를 사용할 땐 애플리케이션 서비스가 도메인 모델의 직접적인 클라이언트이기 때문에
래플리케이션 서비스는 발행자가 애그리게잇에서 이벤트 생성 행동을 실행하기 전에 구독자를 등록할 수 있는 이상적인 위치다.

구독자는 또 다른 애그리게잇 인스턴스를 가져와서 변경을 유발하는 커멘드 행동을 수행해선 안 된다.

```

이벤트 핸들러가 무엇을 수행하는지 주의하자

애플리케이션 서비스가 트랜잭선을 통제한다는 점을 기억하자. 
이벤트 알림을 두 번째 애그리게잇 인스턴스를 수정하기 위해 사용하지 말자.
이는 트랜잭션당 하나의 애그리게잇 인스턴스만 수정해야 하는 가장 중요한 원칙을 깬다.

```

### 뉴스를 원격 바운디드 컨텍스트로 전파하기

원격 바운디드 컨텍스트가 바운디드 컨텍스트에서 일어난 이벤트에 관해 알도록 하는 방법은 여러가지가 있다.
어떤 형태로든 메시징 가능해야 하고 엔터프라이즈 메시징 메커니즘이 필요하다.

수많은 메시징 컴포넌트(엑티브 MQ, 카프카, 래빗 MQ)와 REST 리소스에 기반해 직접 메시징 형태를 만들 수도 있다. 
이는 모두는 발행-구독의 범주 안에 속하며 다양한 측면에서 각자의 장단점을 갖고 있다.

#### 메시징 인프라의 일관성

최종 일관성에 관해 나눈 이야기를 생각해보면 메시징 솔루션에서 적어도 두가지 매커니즘은 항상 
서로 일관성을 유지해야 한다는 점이 놀라울수도 있다.

어떻게 모델과 이벤트 영속성의 일관성을 달성할 수 있을까?

1. 도메인 모델과 메시징 인프라가 같은 영속성 저장소를 공유한다. 
이는 모델의 변경과 새로운 메시지의 삽입이 같은 로컬 트랜잭션하에 커밋되도록 해준다.

2. 도메인 모델의 영속성 저장소와 메시징 영속성 저장소가 글로벌 XA 트랜잭션하에 제어된다. 
이는 모델과 메시징 저장소를 서로 분리할 수 있다는 장점이 있다.

3. 도메인 모델을 저장하기 위해 사용하는 영속성 저장소에 이벤트를 위한 특별한 저장 영역을 생성한다.
이를 이벤트 저장소라고 한다.

#### 자치 서비스와 시스템

도메인 이벤트를 사용하면 어떤 수의 엔터프라이즈 시스템이든 자치 서비스와 시스템으로 설계할수가 있다.

RPC는 의존성을 갖고 있는 시스템의 성공에 영향을 미친다. 
이는 주어진 시스템이 의존하는 RPC API를 가진 시스템의 수가 증가할때 마다 위험이 배가 된다.

다른 시스템을 호출하는 대신 비동기적 메시징을 사용해 시스템 사이에서 높은 수준의 독립성을 달성하자.

#### 지연 시간 허용

메시지를 수신할 때 오래 소요될 수도 있는 지연 시간이 문제를 유발하진 않을까? 분명히 이는 신중하게 고려되어야 한다.
모든 도메인에서 일관성에 다다르는 시간의 범위가 반드시 필수적이라고 가정해선 안된다.


# 참조
-----
* [implementing-domain-driven-design](https://www.oreilly.com/library/view/implementing-domain-driven-design/9780133039900/)
