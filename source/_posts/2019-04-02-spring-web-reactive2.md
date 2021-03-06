---
layout: post
title: "Web on Reactive Stack(Spring WebFlux Reactive Core)"
date: 2019-04-02 10:30 +0900
comments: true
tags : ["Web on Reactive Stack","Spring WebFlux"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## Reactive Core

이 spring-web모듈에는 사후 대응 웹 응용 프로그램에 대한 다음과 같은 기본 지원이 포함되어 있습니다.

* 서버 요청 처리에는 두 가지 레벨의 지원이 있습니다.
  
    * HttpHandler : Reactor Netty, Undertow, Tomcat, Jetty 및 Servlet 3.1+ 컨테이너에 대한 어댑터와 함께 논 블로킹 I / O 및 Reactive Streams 백 프레셔로 HTTP 요청 처리를위한 기본 계약.

    * WebHandlerAPI : 요청 처리를위한 약간 더 높은 수준의 범용 웹 API로서, 주석이 달린 컨트롤러 및 기능 종단점과 같은 구체적인 프로그래밍 모델이 구축됩니다.

* 클라이언트 측은 Reactor Netty 및 반응 Jetty HttpClient 용 ClientHttpConnector어댑터와 함께 논 블로킹 I / O 및 Reactive Streams 백 프레셔로 HTTP 요청을 수행 하는 기본 계약이 있습니다. 
응용 프로그램에 사용되는 상위 수준의 WebClient 는이 기본 계약을 기반으로합니다.

* 클라이언트 및 서버의 경우 코덱 에서 HTTP 요청 및 응답 내용을 직렬화 및 비 직렬화하는 데 사용합니다.

### HttpHandler

HttpHandler 는 요청 및 응답을 처리하는 단일 메서드를 사용하는 간단한 계약입니다. 
그것은 의도적으로 최소이며, 주요 목적은 다른 HTTP 서버 API에 대한 최소한의 추상화입니다.


Server name	 | Server API used | Reactive Streams support
---- | ---- | ----
Netty | Netty API | Reactor Netty
Undertow | Undertow API | spring-web: Undertow to Reactive Streams bridge
Tomcat | Servlet 3.1 non-blocking I/O; Tomcat API to read and write ByteBuffers vs byte[] | spring-web: Servlet 3.1 non-blocking I/O to Reactive Streams bridge
Jetty | Servlet 3.1 non-blocking I/O; Jetty API to write ByteBuffers vs byte[] | spring-web: Servlet 3.1 non-blocking I/O to Reactive Streams bridge
Servlet 3.1 container | Servlet 3.1 non-blocking I/O | spring-web: Servlet 3.1 non-blocking I/O to Reactive Streams bridge

Reactor Netty

```java

HttpHandler handler = ...
ReactorHttpHandlerAdapter adapter = new ReactorHttpHandlerAdapter(handler);
HttpServer.create(host, port).newHandler(adapter).block();

```

Undertow

```java

HttpHandler handler = ...
UndertowHttpHandlerAdapter adapter = new UndertowHttpHandlerAdapter(handler);
Undertow server = Undertow.builder().addHttpListener(port, host).setHandler(adapter).build();
server.start();

```

Tomcat

```java

HttpHandler handler = ...
Servlet servlet = new TomcatHttpHandlerAdapter(handler);

Tomcat server = new Tomcat();
File base = new File(System.getProperty("java.io.tmpdir"));
Context rootContext = server.addContext("", base.getAbsolutePath());
Tomcat.addServlet(rootContext, "main", servlet);
rootContext.addServletMappingDecoded("/", "main");
server.setHost(host);
server.setPort(port);
server.start();

```

Jetty

```java

HttpHandler handler = ...
Servlet servlet = new JettyHttpHandlerAdapter(handler);

Server server = new Server();
ServletContextHandler contextHandler = new ServletContextHandler(server, "");
contextHandler.addServlet(new ServletHolder(servlet), "/");
contextHandler.start();

ServerConnector connector = new ServerConnector(server);
connector.setHost(host);
connector.setPort(port);
server.addConnector(connector);
server.start();

```
Servlet 3.1 이상 컨테이너

WAR로 모든 Servlet 3.1+ 컨테이너에 배포하려면 WAR에 확장하여 포함시킬 수 있습니다 AbstractReactiveWebInitializer . 
그 클래스는 HttpHandlerwith를 랩핑하고 ServletHttpHandlerAdaptera로 등록합니다 Servlet.

### WebHandler API

org.springframework.web.server 패키지는 기반으로 HttpHandler다수의 체인을 통해 처리 요청에 대한 범용 웹 API를 제공하는 계약 WebExceptionHandler, 다중 WebFilter및 단일 WebHandler구성 요소입니다. 
체인은 WebHttpHandlerBuilder단순히 ApplicationContext구성 요소가 자동 감지 되는 Spring을 가리키 거나 빌더에 구성 요소를 등록하여 함께 배치 할 수 있습니다.

HttpHandler다른 HTTP 서버의 사용을 추상화하려는 단순한 목표를 가지고 있지만 WebHandlerAPI는 다음과 같은 웹 응용 프로그램에서 일반적으로 사용되는 더 광범위한 기능 세트를 제공하는 것을 목표로합니다.

* 속성이있는 사용자 세션
* 속성을 요청하십시오.
* 해결 Locale되었거나 Principal요청에 대해.
* 구문 분석되고 캐시 된 양식 데이터에 액세스합니다.
* 다중 부분 데이터의 추상화.

#### FormData

ServerWebExchange 양식 데이터에 액세스하기 위해 다음과 같은 방법을 제공합니다.

```java

Mono<MultiValueMap<String, String>> getFormData();

```

DefaultServerWebExchange용도는 구성 HttpMessageReader(폼 데이터를 구문 분석 application/x-www-form-urlencoded(A) 내로) MultiValueMap. 기본적으로 Bean FormHttpMessageReader에서 사용하도록 구성됩니다 ServerCodecConfigurer( Web Handler API 참조 ).

#### MultipartData

ServerWebExchange multipart 데이터에 액세스하기 위해 다음 메소드를 노출합니다.

```java

Mono<MultiValueMap<String, Part>> getMultipartData();

```

The DefaultServerWebExchange는 콘텐츠 HttpMessageReader<MultiValueMap<String, Part>>를 구문 분석 하도록 구성된 구성 요소 를 사용합니다 . 
현재 Synchronoss NIO Multipart 는 유일하게 지원되는 써드 파티 라이브러리이며 멀티 파트 요청의 논 블로킹 구문 분석을 위해 우리가 알고있는 유일한 라이브러리입니다. 
Bean을 통해 사용 가능하게됩니다 ( Web Handler API 참조 ).multipart/form-dataMultiValueMapServerCodecConfigurer


스트리밍 방식으로 multipart 데이터를 구문 분석하려면 대신 Flux<Part>from에서 반환 된 값을 사용할 수 있습니다 HttpMessageReader<Part>. 
예를 들어, 주석이 달린 컨트롤러에서 이름별로 개별 파트에 액세스하는 @RequestPart것을 의미 Map하므로 다중 파트 데이터를 완전히 구문 분석해야합니다. 
대조적으로, 당신은 수집하지 않고 @RequestBody콘텐츠를 디코딩하는 데 사용할 수 있습니다 .Flux<Part>MultiValueMap

#### 전달 된 헤더

요청이 프록시 (예 :로드 밸런서)를 통과 할 때 호스트, 포트 및 체계가 변경 될 수 있으므로 클라이언트 관점에서 올바른 호스트, 포트 및 체계를 가리키는 링크를 만드는 것이 어려워집니다.

RFC 7239 는 Forwarded프록시가 원래 요청에 대한 정보를 제공하는 데 사용할 수 있는 HTTP 헤더를 정의합니다 . 
이 비표준 헤더를 포함하여,도있다 X-Forwarded-Host, X-Forwarded-Port, X-Forwarded-Proto, X-Forwarded-Ssl,와 X-Forwarded-Prefix.

ForwardedHeaderTransformer전달 된 헤더를 기반으로 요청의 호스트, 포트 및 스키마를 수정 한 다음 해당 헤더를 제거하는 구성 요소입니다. 
이름을 bean으로 선언 할 수 있으며 forwardedHeaderTransformer,이를 감지 하여 사용합니다.

전달 헤더에는 보안 고려 사항이 있습니다. 
응용 프로그램은 헤더가 프록시에 의해 의도 된대로 추가되었거나 악의적 인 클라이언트에 의해 추가되었는지 여부를 알 수 없으므로 보안 고려 사항이 있습니다. 
따라서 외부에서 들어오는 신뢰할 수없는 전달 된 트래픽을 제거하도록 트러스트 경계의 프록시를 구성해야합니다. 
ForwardedHeaderTransformerwith를 구성 할 수도 있습니다. removeOnly=true이 경우 헤더를 제거하지만 사용하지는 않습니다.

5.1에서는 ForwardedHeaderFilter더 이상 사용되지 않으므로 대신 ForwardedHeaderTransformer전달 헤더가 처리되기 전에 교환을 생성 할 수 있습니다. 
필터가 어쨌든 구성되어 있으면 필터 목록에서 제거되어 ForwardedHeaderTransformer대신 사용됩니다.

### 필터

WebHandlerAPI 에서, 당신은을 사용 WebFilter하기 전에 및 필터 및 대상의 프로세싱 체인의 휴식 후 차단 스타일의 논리를 적용 WebHandler. 
WebFlux Config를 사용할 때 WebFiltera를 Spring 빈으로 선언하고 (선택적으로) @OrderBean 선언을 사용하거나 구현 하여 선행을 표현하는 것처럼 간단하게 등록 할 수 Ordered있습니다.

#### CORS

Spring WebFlux는 컨트롤러의 주석을 통해 CORS 구성을 세밀하게 지원합니다. 
그러나 Spring Security와 함께 사용할 때는 CorsFilterSpring Security의 필터 체인보다 먼저 주문해야하는 내장 함수를 사용하는 것이 좋습니다.

섹션을 참조하십시오 CORS 과 CORSWebFilter 자세한 내용을.

### 예외

에서 WebHandlerAPI , 당신은을 사용할 수 WebExceptionHandler의 사슬에서 예외 처리하는 WebFilter경우와 대상을 WebHandler. 
WebFlux Config를 사용할 때 WebExceptionHandlera를 Spring 빈으로 선언하고 (선택적으로) @OrderBean 선언을 사용하거나 구현 하여 선행을 표현하는 것처럼 간단하게 등록 할 수 Ordered있습니다.

다음 표는 사용 가능한 WebExceptionHandler구현을 설명합니다 .

### 코덱

spring-web및 spring-core모듈 반응성 다시 스트림 압력 비 블록 I / O를 통해 직렬화 및 역 직렬화하는 바이트 콘텐츠 및 높은 수준의 개체의 지원을 제공한다. 
다음은이 지원에 대해 설명합니다.

* Encoder및 Decoder인코딩 및 HTTP의 내용 독립을 디코딩하는 낮은 수준의 계약이다.
  
* HttpMessageReader및 HttpMessageWriter인코딩 및 HTTP 메시지 내용을 디코딩하는 계약이다.
  
* An Encoder은 EncoderHttpMessageWriter웹 응용 프로그램에서 사용할 Decoder수 있도록 래핑 할 수있는 반면에 래핑 할 수 있습니다 DecoderHttpMessageReader.
  
* DataBuffer다른 바이트 버퍼 표현 (예를 들면 인 Netty 추상화 ByteBuf, java.nio.ByteBuffer등) 모든 코덱에 일 것입니다. 이 주제에 대한 더 자세한 정보는 "Spring Core"섹션의 데이터 버퍼와 코덱 을 참고하십시오 .
  

spring-core모듈을 제공하고 byte[], ByteBuffer, DataBuffer, Resource, 및 String인코더와 디코더 구현. 
이 spring-web모듈은 잭슨 JSON, 잭슨 스마일, JAXB2, 프로토콜 버퍼 및 기타 인코더 및 디코더와 양식 데이터, 멀티 파트 콘텐츠, 서버 전송 이벤트 및 기타에 대한 웹 전용 HTTP 메시지 판독기 및 작성기 구현을 제공합니다.

ClientCodecConfigurer 그리고 ServerCodecConfigurer 일반적으로 구성하고 응용 프로그램에서 사용하는 코덱을 사용자 정의하는 데 사용됩니다. 
HTTP 메시지 코덱 구성 섹션을 참조하십시오.

### Logging

Spring의 DEBUG 레벨 로깅 WebFlux는 작고, 최소한이며, 인간 친화적으로 설계되었습니다. 
그것은 특정 이슈를 디버깅 할 때만 유용한 유용한 정보 비트와 반복적으로 유용한 정보 비트에 중점을 둡니다.

TRACE 레벨 로깅은 일반적으로 DEBUG와 동일한 원칙을 따르며 (예를 들어 firehose가 아니어야 함) 모든 문제를 디버깅하는 데 사용될 수 있습니다. 
또한 일부 로그 메시지는 TRACE 대 DEBUG에서 다른 수준의 세부 정보를 표시 할 수 있습니다.

좋은 로깅은 로그 사용 경험에서 나온 것입니다. 명시된 목표를 충족시키지 못하는 것을 발견하면 알려주십시오.

#### 로그 ID

WebFlux에서 단일 요청은 여러 스레드에서 실행될 수 있으며 스레드 ID는 특정 요청에 속한 로그 메시지를 상관시키는 데 유용하지 않습니다. 
이것이 WebFlux 로그 메시지 앞에 기본적으로 요청 고유 ID가 붙는 이유입니다.

서버 측에서는 로그 ID가 ServerWebExchangeattribute ( LOG_ID_ATTRIBUTE)에 저장되는 반면 해당 ID를 기반으로하는 완전한 형식의 접두사는에서 사용할 수 있습니다 ServerWebExchange#getLogPrefix(). 
WebClient측온 로그 ID가 저장되는 ClientRequest속성 ( LOG_ID_ATTRIBUTE완전히 배열 프리픽스에서 사용할 때) ClientRequest#logPrefix().

#### 민감한 데이터

DEBUG및 TRACE로깅은 중요한 정보를 기록 할 수 있습니다. 
이것이 폼 매개 변수와 헤더가 기본적으로 마스크되어있는 이유이며 명시 적으로 로깅을 완전히 활성화해야합니다.

다음 예제는 서버 측 요청에 대해이를 수행하는 방법을 보여줍니다.

```java

@Configuration
@EnableWebFlux
class MyConfig implements WebFluxConfigurer {

    @Override
    public void configureHttpMessageCodecs(ServerCodecConfigurer configurer) {
        configurer.defaultCodecs().enableLoggingRequestDetails(true);
    }
}

```

```java

Consumer<ClientCodecConfigurer> consumer = configurer ->
        configurer.defaultCodecs().enableLoggingRequestDetails(true);

WebClient webClient = WebClient.builder()
        .exchangeStrategies(ExchangeStrategies.builder().codecs(consumer).build())
        .build();

```

# 참조
-----
* [spring web-reactive](https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html)



