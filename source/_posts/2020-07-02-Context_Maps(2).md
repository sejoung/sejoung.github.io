---
layout: post
title: "도메인 주도 설계 구현-컨텍스트 맵(2)"
date: 2020-07-02 09:09 +0900
comments: true
tags : ["Implementing Domain-Driven Design"," 도메인 주도 설계 구현","컨텍스트 맵"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 도메인 주도 설계 구현

## 컨텍스트 맵

### 컨텍스트 맵이 필수적인 이유

#### 세가지 컨텍스트를 매핑하기

모델의 경우엔 반갑지 않은 방문자 때문에 일반적으로 혼란과 버그를 발생시킨다.
모델러라면 따뜻하게 환영하지만, 질서와 조화를 존중한다는 조건을 지킬 때만 그렇다.

경계에 진입하는 모든 개념은 자신이 갖고 있는 권리를 설명 해야 하며, 내부 영역과 호환되는 특성을 갖고 있어야만 한다.

각 바운드드 컨텍스트의 언어는 모든 모델이 순수하게 유지될 수 있도록 존중 받아야 한다. 이는 DDD 프로젝트에 중요한 약속이다.

신속한 이터레이션을 통해 맵을 수정하려면 사고와 토론이 도움이 된다. 통합지점 방법을 통해 일부 수정이 일어날 수도 있으며,
이는 컨텍스트간의 관계를 통해 묘사된다.

다이어그램에 나타나는 모델의 수직적 근접성은 업스트림 모델 사이의 관계를 명시적으로 나타낸다.

* 오픈 호스트 서비스 : 이 패턴은 바운디드 컨텍스트 클라이언트와 상호작용하는 REST 기반 리소스로 구현할 수 있다.
일반적으로 오픈 호스트 서비스를 RPC API로 생각하지만 메시지 교환을 사용해 구현 할수도 있다.

* 발행된 언어 : 이것을 구현하는 방법이 몇가지 있지만 대게는 xml schema로 구현한다.

* 부패 방지 계층 : 부패 방지 계층의 각타입에 따른 다운스트림 컨텍스트에 도메인 서비스를 정의할 수 있다.



# 참조
-----
* [implementing-domain-driven-design](https://www.oreilly.com/library/view/implementing-domain-driven-design/9780133039900/)

