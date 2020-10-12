---
layout: post
title: "도메인 주도 설계 구현-도메인 이벤트(4)"
date: 2020-08-03 10:30 +0900
comments: true
tags : ["Implementing Domain-Driven Design"," 도메인 주도 설계 구현","Domain Events","도메인 이벤트"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 도메인 주도 설계 구현

## 도메인 이벤트(Domain Events)

### 이벤트 저장소

한 바운디드 컨텍스트에 모든 도메인 이벤트를 하나의 저장소에 유지 관리할때 장점

1. 이벤트 저장소를 큐를 사용해 메시징 인프라를 통해 모든 도메인 이벤트를 발행한다.
2. 폴링 중인 클라이언트에게 REST 기반 이벤트 알림을 전달하기 위해 같은 이벤트 저장소를 사용할수 있다.
3. 모델에서 실행됐던 모든 커맨드 결과 내역을 살펴보자 이는 모델 뿐만 아니라 클라이언트의 버그를 추적할 때도 도움이 된다.
4. 트렌드 파악과 예측을 비롯한 다양한 비즈니스 분석에 데이터를 활용하자.
5. 리파지토리에서 애그리게잇 인스턴스를 가져올 땐 이벤트를 사용해서 그 상태를 재구성하자.
6. 앞의 항목에 해당하는 애플리케이션에서는 애그리게잇에서 일어난 변경의 묶음을 원상태로 되돌리자.


이벤트 저장소를 생성하는 이유에 따라 그 특성이 결정된다.

### 저장된 이벤트의 전달을 위한 아키텍처 스타일

이벤트를 사용할수 있도록 해주는 두가지 스타일

1. 클라이언트가 쿼리한 레스트풀 리소스를 사용한다.
2. 미들웨어 메시징 제품의 토픽/익스체인지를 통해 메시지를 발송한다.

#### 레스프풀 리소스로서 알람 발행하기

이벤트 알람의 REST 스타일은 발행-구독의 기본 전제를 따르는 환경에서 사용될때 가장 잘 작동한다.

* 기본적으로 알림은 임의의 수의 폴링 소비자에게로 펼쳐져 전달된다. 
푸쉬모델이 아닌 폴모델을 사용하지만 근본적으로 발행-구독 패턴을 따르게 된다.

* 하나 이상의 소비자가 특정 순서에 맞춰 수행되는 여러 테스크 집합을 가져오기 위해 
여러 생산자로부터 리소스를 풀링해야 하는 상황에서 레스트풀 접근법은 고통을 수반한다.

#### 메시징 미들웨어를 통한 알림 발행

메시징 시스템은 여러분의 기호에 맞춰 굉장히 쉽게 발행-구독과 큐를 지원할 수 있도록 해준다.
메시징 시스템은 두경우 모두에서 푸쉬 모델을 사용해 등록된 구독자나 리스너로 이벤트 알림 메시지를 발송한다.

각 구독자는 자신만의 시간 범위에 맞춰서 메시지를 처리할 책임을 수행하며 자신의 모델에 필요한 모든 도메인 행동이 올바를게 전달되도록 보장한다.
우린 단순히 메시징 메커니즘이 전달을 보장토록 할 뿐이다.


```
멱등한 오퍼레이션(idempotent operation)

먹등한 오퍼레이션은 같은 오퍼레이션이 두번 이상 수행되어도 한번만 수행했을때와 같은 결과에 이르는 동작을 의미한다.

```


도메인 객체의 멱등성이 가능한 옵션이 아니라면 그대신 구독자/수신자 자체를 멱등할게 설계 할수도 있다.




# 참조
-----
* [implementing-domain-driven-design](https://www.oreilly.com/library/view/implementing-domain-driven-design/9780133039900/)
* [Addressing Doubts about REST](https://www.infoq.com/articles/tilkov-rest-doubts/)