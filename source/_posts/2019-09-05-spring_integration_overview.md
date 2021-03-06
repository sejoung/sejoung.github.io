---
layout: post
title: "Spring Integration Overview"
date: 2019-09-05 15:55 +0900
comments: true
tags : ["spring integration","Spring Integration Overview"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
## Spring Integration Overview

스프링 통합은 스프링 프로그래밍 모델의 확장을 제공하여 잘 알려진 엔터프라이즈 통합 패턴 을 지원합니다. 
스프링 기반 애플리케이션 내에서 경량 메시징을 사용하고 선언적 어댑터를 통해 외부 시스템과의 통합을 지원합니다. 
이러한 어댑터는 원격 지원, 메시징 및 스케줄링에 대한 Spring의 지원보다 높은 수준의 추상화를 제공합니다.

Spring Integration의 주요 목표는 유지 보수 가능하고 테스트 가능한 코드를 생성하는 데 필수적인 우려를 분리하면서 엔터프라이즈 통합 솔루션을 구축하기위한 간단한 모델을 제공하는 것입니다.

### 배경

Spring Framework의 주요 테마 중 하나는 IoC (Inversion of Control)입니다. 
가장 넓은 의미에서 이는 프레임 워크가 컨텍스트 내에서 관리되는 구성 요소를 대신하여 책임을 처리 함을 의미합니다. 
구성 요소 자체는 그러한 책임이 완화되어 단순화되었습니다. 
예를 들어 종속성 주입은 종속성을 찾거나 작성해야하는 책임의 구성 요소를 덜어줍니다. 
마찬가지로, 관점 지향 프로그래밍은 일반적인 교차 절단 문제의 비즈니스 구성 요소를 재사용 가능한 관점으로 모듈화하여 완화합니다. 
각각의 경우 최종 결과는 테스트, 이해, 유지 및 확장이 쉬운 시스템입니다.

또한 Spring 프레임 워크 및 포트폴리오는 엔터프라이즈 애플리케이션을 빌드하기위한 포괄적 인 프로그래밍 모델을 제공합니다. 
개발자는이 모델의 일관성, 특히 인터페이스 프로그래밍 및 상속보다 컴포지션 선호와 같은 잘 확립 된 모범 사례를 기반으로한다는 사실에서 이점을 얻습니다. 
Spring의 단순화 된 추상화와 강력한 지원 라이브러리는 개발자의 생산성을 높이는 동시에 테스트 가능성과 이식성의 수준을 높입니다.

Spring Integration은 이와 동일한 목표와 원칙에 의해 동기가 부여됩니다. 
Spring 프로그래밍 모델을 메시징 도메인으로 확장하고 Spring의 기존 엔터프라이즈 통합 지원을 기반으로하여 더 높은 수준의 추상화를 제공합니다. 
특정 비즈니스 로직이 실행되는시기 및 응답이 전송되는 위치와 같은 런타임 문제에 대한 제어 역전이 적용되는 메시지 중심 아키텍처를 지원합니다. 
메시지 전송 및 변환을 지원하므로 테스트 가능성에 영향을주지 않으면 서 다른 전송 및 다른 데이터 형식을 통합 할 수 있습니다. 
즉, 메시징 및 통합 문제는 프레임 워크에서 처리합니다. 비즈니스 구성 요소는 인프라와 분리되어 있으며 개발자는 복잡한 통합 책임이 없습니다.

Spring 프로그래밍 모델의 확장 인 Spring Integration은 어노테이션, 네임 스페이스 지원 XML, 일반 "bean"요소가있는 XML 및 기본 API의 직접 사용을 포함하여 다양한 구성 옵션을 제공합니다. 
이 API는 잘 정의 된 전략 인터페이스와 비 침습적이며 위임 어댑터를 기반으로합니다. 
Spring Integration의 디자인은 Gregor Hohpe와 Bobby Woolf (Enterison Wesley, 2004)에 의해 Spring 내의 공통 패턴과 Enterprise Integration Patterns에 설명 된 잘 알려진 패턴 사이의 강한 친 화성을 인식함으로써 영감을 얻었습니다. 
이 책을 읽은 개발자는 Spring Integration 개념과 용어에 즉시 익숙해 져야합니다.

### 목표와 원칙

Spring Integration은 다음 목표에 의해 동기 부여됩니다.

* 복잡한 엔터프라이즈 통합 솔루션을 구현하기위한 간단한 모델을 제공하십시오.
* 스프링 기반 애플리케이션 내에서 메시지 중심의 비동기 동작을 촉진합니다.
* 기존 Spring 사용자를위한 직관적이고 점진적인 채택을 촉진합니다.

스프링 통합은 다음과 같은 원칙에 따라 진행됩니다.

* 모듈 성과 테스트 용이성을 위해 구성 요소를 느슨하게 결합해야합니다.
* 프레임 워크는 비즈니스 로직과 통합 로직 간의 관심사 분리를 시행해야합니다.
* 확장 점은 재사용이 용이하고 이식성을 높이기 위해 본질적으로 추상화되어야하지만 잘 정의 된 경계 내에 있어야합니다.

### Main Components

수직적 관점에서 보면 계층 구조는 문제를 쉽게 분리 할 수 있으며 계층 간 인터페이스 기반 계약은 느슨한 결합을 촉진합니다. 
스프링 기반 애플리케이션은 일반적으로 이러한 방식으로 설계되며 스프링 프레임 워크 및 포트폴리오는 엔터프라이즈 애플리케이션의 전체 스택에 대해이 우수 사례를 따르는 강력한 토대를 제공합니다. 
메시지 중심 아키텍처는 수평 적 관점을 추가하지만 이러한 동일한 목표는 여전히 관련이 있습니다. 
"계층화 된 아키텍처"가 매우 일반적이고 추상적 인 패러다임 인 것처럼, 메시징 시스템은 일반적으로 유사하게 "파이프 앤 필터"모델을 따릅니다. 
"필터"는 메시지를 생성하거나 사용할 수있는 모든 구성 요소를 나타내며 "파이프"는 구성 요소 자체가 느슨하게 결합 된 상태로 유지되도록 필터간에 메시지를 전송합니다. 
이 두 가지 고급 패러다임은 상호 배타적이지 않습니다. 
"파이프"를 지원하는 기본 메시징 인프라는 계약이 인터페이스로 정의 된 계층에 여전히 캡슐화되어야합니다. 
마찬가지로, "필터"자체는 응용 프로그램의 서비스 계층보다 논리적으로 높은 계층 내에서 관리되어야하며 웹 계층과 거의 같은 방식으로 인터페이스를 통해 해당 서비스와 상호 작용해야합니다.

#### 메시지

Spring Integration에서 메시지는 객체를 처리하는 동안 프레임 워크가 사용하는 메타 데이터와 결합 된 Java 객체의 일반 래퍼입니다. 
페이로드와 헤더로 구성됩니다. 
페이로드는 모든 유형이 될 수 있으며 헤더에는 ID, 타임 스탬프, 상관 관계 ID 및 반송 주소와 같이 일반적으로 필요한 정보가 들어 있습니다. 
헤더는 또한 연결된 전송간에 값을 전달하는 데 사용됩니다. 
예를 들어, 수신 된 파일로부터 메시지를 생성 할 때, 파일 이름은 헤더에 저장되어 다운 스트림 컴포넌트에 의해 액세스 될 수있다. 
마찬가지로, 메시지 내용이 궁극적으로 아웃 바운드 메일 어댑터에 의해 전송 될 경우, 다양한 속성 (cc, 제목 등)은 업스트림 구성 요소에 의해 메시지 헤더 값으로 구성 될 수 있습니다. 
개발자는 임의의 키-값 쌍을 헤더에 저장할 수도 있습니다.

#### 메시지 채널

메시지 채널은 파이프 및 필터 아키텍처의 "파이프"를 나타냅니다. 
생산자는 채널에 메시지를 보내고 소비자는 채널에서 메시지를받습니다. 
따라서 메시지 채널은 메시징 구성 요소를 분리하고 메시지를 가로 채고 모니터링하기위한 편리한 지점을 제공합니다.

메시지 채널은 지점 간 또는 publish-subscribe 시맨틱을 따를 수 있습니다. 
지점 간 채널을 사용하면 둘 이상의 소비자가 채널로 전송 된 각 메시지를 수신 할 수 없습니다. 
반면, publish-subscribe 채널은 각 메시지를 채널의 모든 가입자에게 브로드 캐스트하려고 시도합니다. 
Spring Integration은이 두 가지 모델을 모두 지원합니다.

"지점 간"및 "게시-구독"은 각 메시지를 최종적으로받는 소비자 수에 대한 두 가지 옵션을 정의하지만 다른 중요한 고려 사항이 있습니다. 
채널 버퍼 메시지? Spring Integration에서 폴링 가능 채널은 큐 내의 메시지를 버퍼링 할 수 있습니다. 
버퍼링의 장점은 인바운드 메시지를 제한하여 소비자의 과부하를 막을 수 있다는 것입니다. 
그러나 이름에서 알 수 있듯이 폴러가 구성된 경우 소비자가 해당 채널에서 메시지를 수신 할 수 있기 때문에 약간의 복잡성이 추가됩니다. 
반면 가입 가능한 채널에 연결된 소비자는 단순히 메시지 중심입니다. Message Channel Implementations 는 Spring Integration에서 사용 가능한 다양한 채널 구현 에 대해 자세히 설명합니다.

#### 메시지 엔드 포인트

메시지 엔드 포인트는 파이프 및 필터 아키텍처의 "필터"를 나타냅니다. 
앞에서 언급했듯이 엔드 포인트의 주요 역할은 애플리케이션 코드를 메시징 프레임 워크에 연결하고 비 침습적 인 방식(non-invasive manner)으로 수행하는 것입니다. 
다시 말해서, 응용 프로그램 코드는 이상적으로 메시지 객체 나 메시지 채널을 인식하지 않아야합니다. 
이것은 MVC 패러다임에서 컨트롤러의 역할과 유사합니다. 
컨트롤러가 HTTP 요청을 처리하는 것처럼 메시지 엔드 포인트는 메시지를 처리합니다. 
컨트롤러가 URL 패턴에 매핑되는 것처럼 메시지 끝점은 메시지 채널에 매핑됩니다. 
목표는 두 경우 모두 동일합니다. 
애플리케이션 코드를 인프라와 격리시킵니다. 
이러한 개념과 다음에 나오는 모든 패턴은 엔터프라이즈 통합 패턴 책에서 자세히 설명합니다. 
여기에서는 Spring Integration에서 지원하는 기본 엔드 포인트 유형과 해당 유형과 연관된 역할에 대한 고급 설명 만 제공합니다. 
다음 장에서는 구성 예제뿐만 아니라 샘플 코드도 정교하게 제공합니다.

##### Message Transformer

메시지 변환기는 메시지의 내용 또는 구조를 변환하고 수정 된 메시지를 반환합니다. 
아마도 가장 일반적인 유형의 변환기는 메시지의 페이로드를 한 형식에서 다른 형식으로 변환하는 형식 일 것입니다 (예 : XML에서로 java.lang.String). 
마찬가지로 변환기는 메시지의 헤더 값을 추가, 제거 또는 수정할 수 있습니다.

##### Message Filter

메시지 필터는 메시지가 출력 채널로 전달되어야하는지 여부를 결정합니다. 
여기에는 특정 페이로드 컨텐츠 유형, 특성 값, 헤더 존재 또는 기타 조건을 확인할 수있는 부울 테스트 방법이 필요합니다. 
메시지가 수락되면 출력 채널로 전송됩니다. 
그렇지 않은 경우, 삭제됩니다 (또는 더 심각한 구현의 Exception경우 발생 가능). 
메시지 필터는 종종 여러 소비자가 동일한 메시지를 수신하고 필터 기준을 사용하여 처리 할 메시지 세트를 좁힐 수있는 발행-구독 채널과 함께 사용됩니다.

```
파이프 및 필터 아키텍처 패턴에서 "필터"의 일반적인 사용을 두 채널 사이에서 흐르는 메시지를 선택적으로 좁히는 이 특정 엔드 포인트 유형과 혼동하지 않도록주의하십시오. 
"필터"의 파이프 앤 필터 개념은 Spring Integration의 메시지 엔드 포인트, 메시지를 보내거나 받기 위해 메시지 채널에 연결할 수있는 모든 구성 요소와 더 밀접하게 일치합니다.
```

##### Message Router

메시지 라우터는 다음에 메시지를 수신 할 채널을 결정합니다. 
일반적으로 결정은 메시지 내용 또는 메시지 헤더에서 사용 가능한 메타 데이터를 기반으로합니다. 
메시지 라우터는 종종 서비스 활성화 기 또는 응답 메시지를 보낼 수있는 다른 엔드 포인트에서 정적으로 구성된 출력 채널에 대한 동적 대안으로 사용됩니다. 
마찬가지로, 메시지 라우터는 앞에서 설명한 것처럼 여러 가입자가 사용하는 반응 메시지 필터에 대한 대안을 제공합니다.

##### Splitter

스플리터는 입력 채널에서 메시지를 수락하고 해당 메시지를 여러 메시지로 분할 한 다음 각 메시지를 출력 채널로 보내는 역할을하는 다른 유형의 메시지 엔드 포인트입니다. 
이것은 일반적으로 "복합"페이로드 오브젝트를 세분화 된 페이로드를 포함하는 메시지 그룹으로 나누는 데 사용됩니다.

##### Aggregator

기본적으로 스플리터의 미러 이미지 인 수집기는 여러 메시지를 수신하고 단일 메시지로 결합하는 메시지 엔드 포인트 유형입니다. 
실제로 Aggregator는 종종 스플리터가 포함 된 파이프 라인에서 다운 스트림 소비자입니다. 
기술적으로 Aggregator는 상태 (집계 할 메시지)를 유지하고, 전체 메시지 그룹을 사용할 수있는시기를 결정하고, 필요한 경우 제한 시간을 초과해야하기 때문에 스플리터보다 더 복잡합니다. 
또한 시간 초과의 경우 Aggregator는 부분 결과를 보낼지, 폐기하거나 별도의 채널로 보낼지를 알아야합니다. 
스프링 통합이 제공 CorrelationStrategy하는 ReleaseStrategy제한 시간에 부분적인 결과를 보낼 것인지, 시간 초과 및 채널 폐기 구성 설정을하고 보낼것인지

##### Service Activator

Service Activator는 서비스 인스턴스를 메시징 시스템에 연결하기위한 일반 엔드 포인트입니다. 
입력 메시지 채널을 구성해야하며 호출 할 서비스 메소드가 값을 리턴 할 수있는 경우 출력 메시지 채널도 제공 될 수 있습니다.

```
출력 채널은 선택 사항입니다. 
각 메시지는 고유 한 'Return Address'헤더를 제공 할 수도 있습니다. 
이 규칙은 모든 소비자 엔드 포인트에 적용됩니다.
```

서비스 활성화 기는 일부 서비스 객체에서 작업을 호출하여 요청 메시지를 처리하고 요청 메시지의 페이로드를 추출하고 변환합니다 (메소드가 메시지 유형 매개 변수를 기대하지 않는 경우). 
서비스 객체의 메소드가 값을 반환 할 때마다 해당 반환 값은 필요한 경우 회신 메시지로 변환됩니다 (메시지 유형이 아닌 경우). 
이 회신 메시지는 출력 채널로 전송됩니다. 
출력 채널이 구성되지 않은 경우 응답은 가능한 경우 메시지의 "반환 주소"에 지정된 채널로 전송됩니다.

요청-응답 서비스 활성화 기 엔드 포인트는 대상 객체의 메소드를 메시지 채널의 입력 및 출력에 연결합니다.

```

앞에서 설명한 것처럼 Message Channel 에서 채널을 폴링하거나 구독 할 수 있습니다. 
위의 다이어그램에서 이것은 "시계"기호와 실선 화살표 (폴) 및 점선 화살표 (구독)로 표시됩니다.

```

##### Channel Adapter

채널 어댑터는 메시지 채널을 다른 시스템이나 전송에 연결하는 엔드 포인트입니다. 
채널 어댑터는 인바운드 또는 아웃 바운드 일 수 있습니다. 
일반적으로 채널 어댑터는 메시지와 다른 시스템 (파일, HTTP 요청, JMS 메시지 및 기타)에서 수신 또는 전송 된 오브젝트 또는 자원간에 메시지를 맵핑합니다. 
전송에 따라 채널 어댑터는 메시지 헤더 값을 채우거나 추출 할 수도 있습니다. 
Spring Integration은 다음 장에서 설명하는 여러 채널 어댑터를 제공합니다.



# 참조
----- 
* [spring-integration-introduction](https://docs.spring.io/spring-integration/docs/5.1.7.RELEASE/reference/html/#spring-integration-introduction)
