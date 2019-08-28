---
layout: post
title: "spring integration"
date: 2019-08-28 15:55 +0900
comments: true
tags : ["spring integration","EIP"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
### spring integration

Spring 프로그래밍 모델을 확장하여 잘 알려진 엔터프라이즈 통합 패턴 을 지원합니다. 
Spring Integration은 Spring 기반 애플리케이션 내에서 경량 메시징을 가능하게하며 선언적 어댑터를 통해 외부 시스템과의 통합을 지원합니다. 
이러한 어댑터는 원격 지원, 메시징 및 스케줄링에 대한 Spring의 지원에 대해보다 높은 수준의 추상화를 제공합니다. 
Spring Integration의 주요 목표는 유지 보수 가능하고 테스트 가능한 코드를 생성하는 데 필수적인 우려를 분리하면서 엔터프라이즈 통합 솔루션을 구축하기위한 간단한 모델을 제공하는 것입니다.

#### 소개

Spring Framework를 사용하면 개발자가 인터페이스를 사용하여 코딩하고 DI (Dependency Injection)를 사용하여 작업을 수행하는 데 필요한 종속성을 POJO (Plain Old Java Object)에 제공 할 수 있습니다. 
Spring Integration은 POJO가 메시징 패러다임을 사용하여 연결되고 개별 컴포넌트가 애플리케이션의 다른 컴포넌트를 인식하지 못하는 경우이 개념을 한 단계 더 발전시킵니다. 
이러한 응용 프로그램은 세분화 된 재사용 가능한 구성 요소를 조합하여 더 높은 수준의 기능을 형성함으로써 구축됩니다. 
신중한 설계를 통해 이러한 흐름을 모듈화하고 훨씬 더 높은 수준에서 재사용 할 수 있습니다.

Spring Integration은 세분화 된 컴포넌트를 함께 연결하는 것 외에도 외부 시스템과 통신하기 위해 다양한 채널 어댑터 및 게이트웨이를 제공합니다. 
채널 어댑터는 단방향 통합 (송수신)에 사용됩니다. 
게이트웨이는 요청 / 응답 시나리오 (인바운드 또는 아웃 바운드)에 사용됩니다. 
어댑터 및 게이트웨이의 전체 목록은 참조 문서를 참조하십시오.

스프링 클라우드 스트림 프로젝트는 스프링 통합을 기반으로하며 스프링 통합은 메시지 구동 마이크로 서비스의 엔진으로 사용됩니다.




# 참조
----- 
* [spring-integration](https://spring.io/projects/spring-integration)
* [Just Spring Integration](https://resources.oreilly.com/examples/0636920022671/)
* [SpringCamp2015_Simple_Integration_Exercise](https://github.com/icednut/SpringCamp2015_Simple_Integration_Exercise)


