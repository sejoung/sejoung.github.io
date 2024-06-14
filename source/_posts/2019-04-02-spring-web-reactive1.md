---
layout: post
title: "Web on Reactive Stack(Spring WebFlux 개요)"
date: 2019-04-02 09:57 +0900
comments: true
tags : ["Web on Reactive Stack","Spring WebFlux"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
# Web on Reactive Stack

이 부분에서는 Netty, Undertow 및 Servlet 3.1+ 컨테이너와 같은 비 차단 서버에서 실행하기 위해 Reactive Streams API를 기반으로 만들어진 리 액티브 스택 웹 응용 프로그램에 대한 지원을 다룹니다 . 
개별 챕터에서는 Spring WebFlux 프레임 워크, 반응 형 WebClient, 테스트 지원 및 반응 라이브러리를 다룹니다.
서블릿 스택 웹 응용 프로그램을 참조 서블릿 스택 웹.


## Spring WebFlux

Spring Framework, Spring Web MVC에 포함 된 원래의 웹 프레임 워크는 Servlet API 및 Servlet 컨테이너 용으로 제작되었습니다. 
reactive-stack 웹 프레임 워크 인 Spring WebFlux는 나중에 버전 5.0에 추가되었습니다. 
그것은 완전히 비 차단이며 Reactive Streams back pressure를 지원 하며 Netty, Undertow 및 Servlet 3.1+ 컨테이너와 같은 서버에서 실행됩니다.

두 웹 프레임 워크는 소스 모듈 ( spring-webmvc 및 spring-webflux ) 의 이름을 미러링 하고 Spring Framework에서 나란히 공존합니다. 
각 모듈은 선택 사항입니다. 
응용 프로그램은 하나 또는 다른 모듈을 사용할 수도 있고 경우에 따라 둘 모두를 사용할 수도 있습니다 (예 : 반응이있는 Spring MVC 컨트롤러) WebClient.

### 개요

Spring WebFlux가 왜 만들어 졌습니까?

대답의 일부는 비 블로킹 웹 스택이 소수의 스레드로 동시성을 처리하고 하드웨어 자원을 적게 사용하여 스케일링해야한다는 것입니다. 
Servlet 3.1은 non-blocking I/O를위한 API를 제공합니다. 
그러나 이를 사용하면 계약이 동기식 ( Filter, Servlet) 또는 블로킹 ( getParameter, getPart) 인 나머지 Servlet API에서 멀어집니다. 
이것은 새로운 공통 API가 모든 비 차단 런타임에 대한 토대로 역할을 할 동기였습니다. 
이는 비동기식 비 차단 공간에 잘 구축 된 서버 (예 : Netty) 때문에 중요합니다.

대답의 다른 부분은 함수형 프로그래밍입니다. 
Java 5에서 주석을 추가하면 주석이 달린 REST 컨트롤러 또는 유닛 테스트와 같은 기회가 창출되는 것과 마찬가지로 Java 8에서 람다식이 추가되어 Java의 기능적 API에 대한 기회가 창출되었습니다. 
이 비 차단 응용 프로그램과 계속 스타일의 API (에 의해 대중화로의 이익입니다 CompletableFuture및 ReactiveX 비동기 로직의 선언적 구성을 허용). 
프로그래밍 모델 레벨에서 Java 8은 Spring WebFlux가 주석이 달린 컨트롤러와 함께 기능 웹 엔드 포인트를 제공 할 수있게했습니다.

#### Reactive의 정의

우리는 "non-blocking"과 "functional"을 다루었지만 반응 적 의미는 무엇입니까?

"반응 적"이라는 용어는 I / O 이벤트에 반응하는 네트워크 구성 요소, 마우스 이벤트에 반응하는 UI 컨트롤러 및 기타와 같은 변화에 대응하여 만들어진 프로그래밍 모델을 의미합니다. 
이러한 의미에서 비 차단은 반응하지 않습니다. 
왜냐하면 차단되는 대신 작업이 완료되거나 데이터를 사용할 수있게되면서 알림에 반응하는 모드가되기 때문입니다.

또한 Spring 팀이 "반응 적"이라고 부르는 또 다른 중요한 메커니즘이 있습니다. 
이것은 비 차단 백압입니다. 
동기식, 필수 코드에서 블로킹 호출은 발신자를 기다리게하는 자연스러운 배압 역할을합니다. 
논 블로킹 코드에서는 이벤트 발생률을 제어하여 빠른 제작자가 대상을 압도하지 않도록하는 것이 중요합니다.

Reactive Streams는 자바 9에서 채택 된 작은 사양으로, 비동기 구성 요소와 배압 사이의 상호 작용을 정의합니다. 
예를 들어 게시자 역할을하는 데이터 저장소 는 구독자 역할을하는 HTTP 서버 가 응답에 쓸 수 있는 데이터를 생성 할 수 있습니다. 
리 액티브 스트림의 주요 목적은 구독자가 게시자가 데이터를 만드는 속도 또는 속도를 제어 할 수있게하는 것입니다.

#### Reactive API

리 액티브 스트림은 상호 운용성에 중요한 역할을합니다. 
라이브러리 및 인프라 구성 요소는 관심의 대상이지만 응용 프로그램 API는 덜 유용하기 때문에 응용 프로그램 API로서 유용하지는 않습니다. 
애플리케이션은 비동기 로직을 ​​작성하기 위해 더 높은 수준의 풍부하고 기능이 풍부한 API를 필요로합니다. 
Java 8 StreamAPI 와 유사 하지만 콜렉션뿐입니다. 
이것은 반응 라이브러리가 수행하는 역할입니다.

Reactor 는 Spring WebFlux에서 선택할 수있는 반응 형 라이브러리입니다. 
이것은 제공 Mono하고 Flux0..1 (데이터 시퀀스에서 작동하는 API 유형 Mono) 및 0..N ( FluxReactiveX의 정렬 연산자 풍부한 통해) 연산자 어휘 . 
Reactor는 Reactive Streams 라이브러리이므로 모든 운영자가 비 차단 백압을 지원합니다. 
Reactor는 서버 측 Java에 중점을 둡니다. Spring과 긴밀히 협력하여 개발되었습니다.

WebFlux는 Reactor를 핵심 종속성으로 요구하지만 Reactive Streams를 통해 다른 대응 라이브러리와 상호 운용됩니다. 
일반적으로 WebFlux API는 Publisher 입력을 일반 입력으로 받아들이고 이를 내부적으로 Reactor 유형으로 변환하여 사용하고 Flux또는 Mono출력을 반환합니다. 
따라서 임의 Publisher의 입력을 전달할 수 있으며 출력에 연산을 적용 할 수 있지만 출력을 다른 반응 라이브러리에 맞게 조정해야합니다. 
가능할 때마다 (예 : 주석이 달린 컨트롤러) WebFlux는 RxJava 또는 다른 반응 라이브러리의 사용에 투명하게 적응합니다. 
자세한 내용은 반응 라이브러리 를 참조하십시오.

#### 프로그래밍 모델

이 spring-web모듈에는 HTTP 추상화, 지원되는 서버에 대한 리 액티브 스트림 어댑터, 코덱 및 Servlet API와 비슷하지만 비 차단 계약이 있는 핵심 WebHandlerAPI를 포함하여 Spring WebFlux의 기초가되는 리팩션 토대가 포함되어 있습니다 .

이 기초에서 Spring WebFlux는 두 가지 프로그래밍 모델 중에서 선택할 수 있습니다.

* 주석 처리 된 컨트롤러 : Spring MVC와 일관되고 spring-web모듈 의 동일한 주석을 기반으로합니다. 
스프링 MVC와 WebFlux 컨트롤러는 모두 반응 형 (Reactor 및 RxJava) 반환 유형을 지원하므로 결과를 구별하는 것이 쉽지 않습니다. 
한 가지 주목할만한 차이점은 WebFlux가 또한 반론을지지한다는 것 @RequestBody입니다.

* Functional Endpoints : 람다 기반, 가볍고 기능적인 프로그래밍 모델. 
이것을 응용 프로그램이 요청을 라우트하고 처리하는 데 사용할 수있는 작은 라이브러리 또는 유틸리티 세트라고 생각할 수 있습니다. 
주석이 달린 컨트롤러와의 큰 차이점은 애플리케이 션이 애노테이션을 통해 인 텐트를 선언하고 다시 호출되는 것과 달리 요청 처리를 처음부터 끝까지 담당한다는 점입니다.

#### 적용 분야

스프링 MVC 또는 WebFlux?

자연스러운 질문이지만 불리한 이분법을 설정하는 질문. 실제로, 두 옵션 모두 함께 사용 가능한 옵션 범위를 확장합니다. 
이 두 제품은 서로 연속성과 일관성을 유지하도록 설계되었으며, 나란히 사용할 수 있으며 각 측면의 의견은 양측에 도움이됩니다. 
다음 다이어그램은이 두 가지가 어떻게 관련되어 있으며 공통점과 고유 한 특징을 보여줍니다.

다음과 같은 특정 사항을 고려하는 것이 좋습니다.

* 잘 동작하는 Spring MVC 애플리케이션을 가지고 있다면, 변경할 필요가 없다. 
명령형 프로그래밍은 코드를 작성, 이해 및 디버그하는 가장 쉬운 방법입니다. 
역사적으로 대부분 차단하고 있기 때문에 최대한 많은 라이브러리를 선택할 수 있습니다.
  
* 비 차단 웹 스택을 이미 구매하고 있다면 Spring WebFlux는이 공간에서 다른 실행 모델과 동일한 실행 모델 혜택을 제공하며 서버 (Netty, Tomcat, Jetty, Undertow 및 Servlet 3.1+ 컨테이너), 프로그래밍 모델 선택 (주석이 달린 컨트롤러 및 기능 웹 엔드 포인트) 및 반응 라이브러리 (Reactor, RxJava 또는 기타) 중 하나를 선택할 수 있습니다.
  
* Java 8 lambda 또는 Kotlin과 함께 사용하기위한 가볍고 기능적인 웹 프레임 워크에 관심이 있다면 Spring WebFlux 기능 웹 엔드 포인트를 사용할 수 있습니다. 
이는 또한보다 작은 투명성과 제어로 이익을 얻을 수있는 복잡한 요구 사항이없는 소규모 응용 프로그램 또는 마이크로 서비스에 적합합니다.
  

* 마이크로 서비스 아키텍처에서는 Spring MVC 또는 Spring WebFlux 컨트롤러 또는 Spring WebFlux 기능 엔드 포인트와 함께 다양한 애플리케이션을 사용할 수 있습니다. 
두 프레임 워크에서 동일한 주석 기반 프로그래밍 모델을 지원하면 올바른 작업에 적합한 도구를 선택하는 동시에 지식을 쉽게 재사용 할 수 있습니다.
  
* 응용 프로그램을 평가하는 간단한 방법은 응용 프로그램의 종속성을 확인하는 것입니다. 
지속성 API (JPA, JDBC) 또는 네트워킹 API를 사용할 수 없게하는 경우 Spring MVC는 최소한 공통 아키텍처에 가장 적합한 선택입니다. 
Reactor와 RxJava 모두 별도의 스레드에서 블로킹 호출을 수행하는 것이 기술적으로 가능하지만 논 블로킹 웹 스택을 최대한 활용하지는 않습니다.
  

* 원격 서비스를 호출하는 Spring MVC 애플리케이션을 가지고 있다면, 반응적인 것을 시도해 보라 WebClient. 
반응 형 (Reactor, RxJava 또는 기타 )을 Spring MVC 컨트롤러 메서드에서 직접 반환 할 수 있습니다. 
통화 당 지연 시간이나 통화 간 상호 의존성이 클수록 더 많은 이점이 있습니다. 
스프링 MVC 컨트롤러는 다른 리 액티브 컴포넌트도 호출 할 수있다.

* 규모가 큰 팀의 경우 비 차단, 기능 및 선언적 프로그래밍으로 전환하는 과정에서 가파른 학습 곡선을 염두에 두십시오. 
완전한 전환없이 시작하는 실제적인 방법은 사후 대응을 WebClient 사용하는 것 입니다. 
그 외에도 소규모로 시작하여 이점을 측정하십시오. 
우리는 광범위한 응용 분야에서 변화가 필요하지 않을 것으로 예상합니다. 
찾아야 할 이점이 확실하지 않은 경우 논 블로킹 I / O가 작동하는 방법 (예 : 단일 스레드 Node.js의 동시성)과 그 효과에 대해 배우는 것으로 시작하십시오.
  
#### 서버

Spring WebFlux는 Tomcat, Jetty, Servlet 3.1+ 컨테이너 및 Netty 및 Undertow와 같은 Servlet 이외의 런타임에서 지원됩니다. 
모든 서버는 하위 수준의 공통 API에 맞게 조정 되므로 더 높은 수준의 프로그래밍 모델 을 여러 서버에서 지원할 수 있습니다.

Spring WebFlux에는 서버를 시작하거나 중지 할 수있는 내장 지원 기능이 없습니다. 
그러나, 쉬운 조립 봄 구성과에서 응용 프로그램 WebFlux 인프라 와 실행 몇 줄의 코드와 함께.

스프링 부트에는 이러한 단계를 자동화하는 WebFlux 스타터가 있습니다. 
기본적으로 스타터는 Netty를 사용하지만 Maven 또는 Gradle 종속성을 변경하여 Tomcat, Jetty 또는 Undertow로 전환하기 쉽습니다. 
스프링 부트는 비동기식 비 블로킹 공간에서보다 널리 사용되며 클라이언트와 서버가 리소스를 공유 할 수 있기 때문에 Netty로 기본 설정됩니다.

Tomcat과 Jetty는 Spring MVC와 WebFlux와 함께 사용할 수 있습니다. 
그러나 그들이 사용되는 방식은 매우 다르다는 것을 명심하십시오. 
Spring MVC는 Servlet blocking I / O에 의존하며 필요할 경우 애플리케이션이 Servlet API를 직접 사용할 수있게합니다. 
Spring WebFlux는 Servlet 3.1 비 블로킹 I / O를 사용하며 하위 레벨 어댑터의 서블릿 API를 사용하며 직접 사용하지 않습니다.

Undertow에서 Spring WebFlux는 서블릿 API 없이 바로 Undertow API를 사용합니다.

#### Performance

성과에는 많은 특징과 의미가 있습니다. 
리 액티브 및 비 블로킹은 일반적으로 애플리케이션을 더 빠르게 실행하지 않습니다. 
어떤 경우에는 (예를 들어,를 사용하여 WebClient원격 호출을 병렬로 실행 하는 경우 ). 
전체적으로 비 차단 방식을 사용하려면 더 많은 작업이 필요하며 이는 필요한 처리 시간을 약간 늘릴 수 있습니다.

리 액티브 및 비 블로킹의 주요 이점은 작은 고정 수의 스레드와 적은 메모리로 확장 할 수 있다는 것입니다. 
따라서 응용 프로그램이 예측 가능한 방식으로 확장되므로 응용 프로그램이로드로 인해보다 탄력적으로 변합니다. 
그러나 이러한 이점을 관찰하기 위해서는 느리고 예측할 수없는 네트워크 I / O가 혼합 된 것을 포함하여 대기 시간이 필요합니다. 
그것은 반응성 스택이 강점을 보여주기 시작하는 곳이며 그 차이는 극적 일 수 있습니다.

#### 동시성 모델

Spring MVC와 Spring WebFlux는 모두 주석이 달린 컨트롤러를 지원하지만 동시성 모델과 블로킹 및 스레드에 대한 기본 가정에 중요한 차이가 있습니다.

Spring MVC (및 서블릿 애플리케이션 전반)에서는 애플리케이션이 현재 스레드 (예 : 원격 호출)를 차단할 수 있다고 가정하므로 서블릿 컨테이너는 큰 스레드 풀을 사용하여 요청시 차단 가능성을 흡수합니다 손질.

Spring WebFlux (일반적으로 비 차단 서버)에서는 응용 프로그램이 차단되지 않으므로 비 차단 서버는 크기가 작은 고정 크기 스레드 풀 (이벤트 루프 작업자)을 사용하여 요청을 처리합니다.

##### 블로킹 API 호출

차단 라이브러리를 사용해야하는 경우 어떻게해야합니까? 
Reactor와 RxJava는 모두 publishOn 다른 스레드에서 처리를 계속할 수있는 연산자를 제공합니다. 
즉, 쉽게 탈출 해치가 있음을 의미합니다. 
그러나 블로킹 API는이 동시성 모델에 적합하지 않습니다.

##### 가변 상태

Reactor와 RxJava에서는 연산자를 통해 논리를 선언하고 런타임시 데이터가 순차적으로 처리되는 무효 파이프 라인이 형성됩니다. 
이 기능의 주요 이점은 해당 파이프 라인 내의 응용 프로그램 코드가 절대로 호출되지 않으므로 응용 프로그램이 변경 가능한 상태를 보호하지 않아도된다는 것입니다.

##### 스레딩 모델

Spring WebFlux를 사용하는 서버에서 어떤 스레드를 볼 수 있습니까?

* "바닐라"Spring WebFlux 서버 (예 : 데이터 액세스 나 다른 선택적 종속성)에서는 서버에 대한 하나의 스레드와 요청 처리를위한 다른 스레드 (일반적으로 CPU 코어 수만큼)를 기대할 수 있습니다. 
그러나 서블릿 컨테이너는 서블릿 (블로킹) I / O와 서블릿 3.1 (비 블로킹) I / O 사용을 지원하기 위해 더 많은 스레드 (예 : Tomcat의 경우 10)로 시작될 수 있습니다.
  
* WebClient액션은 이벤트 루프 스타일로 작동합니다. 
따라서 이와 관련된 작은 수의 고정 된 처리 스레드 (예 : reactor-http-nio-Reactor Netty 커넥터)를 볼 수 있습니다. 
그러나 Reactor Netty가 클라이언트와 서버 모두에 사용되는 경우이 두 노드는 기본적으로 이벤트 루프 리소스를 공유합니다.
 

* Reactor와 RxJava는 처리기 publishOn를 다른 스레드 풀로 전환하는 데 사용되는 연산자 와 함께 사용할 Schedulers라는 스레드 풀 추상화를 제공 합니다. 
스케줄러에는 특정 병렬성 전략을 제안하는 이름이 있습니다. 
예를 들어 "병렬"(제한된 수의 스레드를 사용하는 CPU 바인딩 작업) 또는 "elastic"(많은 수의 스레드가있는 I / O 바인딩 작업)이 있습니다. 
이러한 스레드가 표시되면 일부 코드가 특정 스레드 풀 Scheduler전략을 사용하고 있음을 의미 합니다.

* 데이터 액세스 라이브러리 및 기타 타사 종속성은 자체 스레드를 만들고 사용할 수도 있습니다.
  
##### 구성

Spring Framework는 서버 시작 및 중지를 지원하지 않습니다. 
서버용 스레딩 모델을 구성하려면 서버 특정 구성 API를 사용해야하며, 아니면 Spring Boot를 사용하는 경우 각 서버에 대한 Spring Boot 구성 옵션을 확인하십시오. 
WebClient 구성을 직접 할 수 있습니다. 
다른 모든 라이브러리의 경우 해당 설명서를 참조하십시오.


### 반응 코어

이 spring-web모듈에는 사후 대응 웹 응용 프로그램에 대한 다음과 같은 기본 지원이 포함되어 있습니다.

* 서버 요청 처리에는 두 가지 레벨의 지원이 있습니다.
  
    * HttpHandler : Reactor Netty, Undertow, Tomcat, Jetty 및 Servlet 3.1+ 컨테이너에 대한 어댑터와 함께 논 블로킹 I / O 및 Reactive Streams 백 프레셔로 HTTP 요청 처리를위한 기본 계약.

    * WebHandlerAPI : 요청 처리를위한 약간 더 높은 수준의 범용 웹 API로서, 주석이 달린 컨트롤러 및 기능 종단점과 같은 구체적인 프로그래밍 모델이 구축됩니다.

* 클라이언트 측은 Reactor Netty 및 반응 Jetty HttpClient 용 ClientHttpConnector어댑터와 함께 논 블로킹 I / O 및 Reactive Streams 백 프레셔로 HTTP 요청을 수행 하는 기본 계약이 있습니다. 
응용 프로그램에 사용되는 상위 수준의 WebClient 는이 기본 계약을 기반으로합니다.

* 클라이언트 및 서버의 경우 코덱 에서 HTTP 요청 및 응답 내용을 직렬화 및 비 직렬화하는 데 사용합니다.

#### HttpHandler

HttpHandler 는 요청 및 응답을 처리하는 단일 메서드를 사용하는 간단한 계약입니다. 
그것은 의도적으로 최소이며, 주요 목적은 다른 HTTP 서버 API에 대한 최소한의 추상화입니다.


# 참조
-----
* [spring web-reactive](https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html)


