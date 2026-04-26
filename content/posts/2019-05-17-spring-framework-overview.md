---
layout: post
title: "spring framework overview"
date: 2019-05-17 10:20 +0900
comments: true
tags : ["spring framework","overview"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### Spring Framework Overview

Spring을 사용하면 Java 엔터프라이즈 애플리케이션을 쉽게 만들 수 있습니다. 
Groovy 및 Kotlin을 JVM에서 대체 언어로 지원하고 응용 프로그램의 필요에 따라 다양한 종류의 아키텍처를 생성 할 수있는 유연성을 통해 기업 환경에서 Java 언어를 수용하는 데 필요한 모든 것을 제공합니다. 
Spring Framework 5.1에서 Spring은 JDK 8+ (Java SE 8+)가 필요하며 JDK 11 LTS에 대해 즉시 사용할 수있는 지원을 제공합니다.

Spring은 다양한 애플리케이션 시나리오를 지원합니다.
대기업에서 애플리케이션은 오랫동안 존재하는 경우가 많으며 개발자가 제어 할 수없는 업그레이드주기를 가진 JDK 및 애플리케이션 서버에서 실행해야합니다. 
다른 것은 클라우드 환경에 서버가 내장 된 단일 파일로 실행될 수 있습니다. 
그러나 다른 서버는 서버가 필요없는 독립 실행 형 응용 프로그램 (일괄 처리 또는 통합 작업 부하 등) 일 수 있습니다.

Spring은 오픈 소스입니다. 다양한 범위의 실제 사용 사례를 기반으로 지속적인 피드백을 제공하는 크고 활동적인 커뮤니티가 있습니다. 
이것은 봄이 오랜 시간 동안 성공적으로 진화하는 것을 도왔습니다.

### "Spring" 이란 뜻

"Spring"이라는 용어는 다른 상황에서 다른 것을 의미합니다. 
이 프로젝트는 스프링 프레임 워크 프로젝트 자체를 가리키는 데 사용할 수 있습니다. 
시간이 흐르면서 다른 Spring 프로젝트가 Spring Framework 위에 구축되었습니다. 
사람들이 "Spring"이라고 말하면 대부분 프로젝트의 전체 제품군을 의미합니다. 
이 참조 문서는 스프링 프레임 워크 자체에 대한 토대에 중점을 둡니다.

스프링 프레임 워크는 여러 개의 모듈로 나뉩니다. 
응용 프로그램은 필요한 모듈을 선택할 수 있습니다. 
핵심은 구성 모델과 종속성 주입 메커니즘을 포함하여 핵심 컨테이너의 모듈입니다. 
그 외에도 Spring Framework는 메시징, 트랜잭션 데이터 및 지속성, 웹 등 다양한 애플리케이션 아키텍처에 대한 기본 지원을 제공합니다. 
또한 Servlet 기반 Spring MVC 웹 프레임 워크와 Spring WebFlux 대응 웹 프레임 워크를 병행하여 포함하고있다.

모듈에 대한 참고 사항 : Spring의 프레임 워크 jar는 JDK 9 모듈 경로 ( "Jigsaw")에 배포 할 수 있습니다. 
Jigsaw 지원 응용 프로그램에서 사용하기 위해 Spring Framework 5 jar에는 jar artifact와는 별도로 안정된 언어 수준 모듈 이름 ( "spring.core", "spring.context"등)을 정의하는 "자동 모듈 이름" (jar는 "."대신 "-"와 동일한 이름 지정 패턴을 따릅니다. 예 : "spring-core"및 "spring-context"). 
물론 Spring의 프레임 워크 jar는 JDK 8과 9+에서 모두 classpath에서 잘 작동합니다.

### Spring Framework 의 역사

Spring은 2003 년 초기 J2EE 사양 의 복잡성에 대한 응답으로 등장했습니다. 
일부는 Java EE와 Spring을 경쟁 대상으로 간주하지만 실제로 Spring은 Java EE를 보완합니다.
Spring 프로그래밍 모델은 Java EE 플랫폼 사양을 포함하지 않습니다. 
오히려 EE 우산에서 엄선 된 개별 사양과 통합됩니다.

* 서블릿 API (JSR 340)
* WebSocket API (JSR 356)
* 동시성 유틸리티 (JSR 236)
* JSON 바인딩 API (JSR 367)
* 빈 검증 (JSR 303)
* JPA (JSR 338)
* JMS (JSR 914)
* 필요한 경우 트랜잭션 조정을위한 JTA / JCA 설정을 제공합니다.

또한 Spring Framework는 Spring Framework에서 제공하는 Spring 고유의 메커니즘 대신 응용 프로그램 개발자가 사용할 수 있는 Dependency Injection (JSR 330) 및 Common Annotations (JSR 250) 사양을 지원합니다.

Spring Framework 5.0부터 Spring은 최소한 Java EE 7 레벨 (예 : Servlet 3.1+, JPA 2.1+)을 필요로하는 동시에 Java EE 8 레벨에서 새로운 API와 즉시 통합 할 수 있어야합니다 (예 : Servlet 4.0, JSON Binding API) 런타임시 발생합니다. 
이렇게하면 Spring이 Tomcat 8 및 9, WebSphere 9 및 JBoss EAP 7과 완벽하게 호환됩니다.

시간이 지남에 따라 애플리케이션 개발에서 Java EE의 역할이 진화되었습니다. 
Java EE 및 Spring 초기에 응용 프로그램은 응용 프로그램 서버에 배포되도록 만들었습니다. 
오늘날 스프링 부트의 도움으로 응용 프로그램은 devops 및 cloud 친화적 인 방식으로 작성되며 Servlet 컨테이너가 임베드되고 변경 사항은 거의 없습니다. 
Spring Framework 5에서 WebFlux 애플리케이션은 서블릿 API를 직접 사용하지 않으며 서블릿 컨테이너가 아닌 서버 (예 : Netty)에서 실행할 수 있습니다.

Spring은 혁신과 발전을 계속하고 있습니다. 
Spring Framework 외에도 Spring Boot, Spring Security, Spring Data, Spring Cloud, Spring Batch 등과 같은 다른 프로젝트가있다. 
각 프로젝트마다 고유 한 소스 코드 저장소, 문제 추적기 및 릴리스 종지가 있음을 기억해야합니다. 
Spring 프로젝트의 전체 목록은 spring.io/projects 를 참조하십시오 .


### 설계원칙

프레임 워크에 대해 배울 때, 프레임 워크가하는 일뿐만 아니라 그 원리에 대해서도 아는 것이 중요합니다. 
Spring Framework의 기본 원칙은 다음과 같습니다.

* 모든 단계에서 선택권을 제공하십시오. 
Spring을 사용하면 가능한 한 늦게 설계 결정을 연기 할 수 있습니다. 
예를 들어 코드를 변경하지 않고 구성을 통해 지속성 공급자를 전환 할 수 있습니다. 
다른 많은 인프라 문제와 써드 파티 API와의 통합에서도 마찬가지입니다.

* 다양한 관점을 수용하십시오. 
Spring은 융통성을 포용하고 어떻게해야 하는지에 대해 강조하지 않습니다. 
다양한 관점에서 다양한 응용 요구를 지원합니다.

* 강력한 이전 버전과의 호환성 유지. 
Spring의 진화는 버전간에 몇 가지 중요한 변경 사항을 강요하기 위해 신중하게 관리되었습니다. 
Spring은 Spring을 사용하는 응용 프로그램과 라이브러리의 유지 관리를 용이하게하기 위해 JDK 버전과 써드 파티 라이브러리를 신중하게 선택한 범위를 지원합니다.

* API 디자인에 대한주의. 
Spring 팀은 직관적이며 많은 버전과 여러 해에 걸친 API를 만드는 데 많은 시간과 노력을 기울이고 있습니다.

* 코드 품질에 대한 높은 기준을 설정하십시오. 
Spring Framework는 의미 있고, 최신의 정확한 javadoc을 강조합니다. 
패키지간에 순환 의존성이없는 깨끗한 코드 구조를 요구할 수있는 프로젝트는 거의 없습니다.

# 참조
-----
* [spring-framework-reference overview](https://docs.spring.io/spring-framework/docs/current/spring-framework-reference/overview.html)


