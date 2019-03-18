---
layout: post
title: "spring_one"
date: 2018-11-08 08:50 +0900
comments: true
tags : ["spring_one"]
categories : ["2018 세미나"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### spring one

피보탈 코리아 노경은 대표 개회사

#### Reactice Spring with Spring Boot 2.0

첫번째 발표자 

오늘은 스프링 프레임워크 쿠버네티스 새로운 아키텍쳐를 설명한다.
피보탈은 소프트웨어를 잘작성하도록 지원한다.

피보탈은 크개 4개 구분으로 나눠진다.

* 플랫폼이 있다.(피보탈 클라우드 파운드리)
* 우리는 툴을 제공한다.
* 우리는 프로세스를 제공한다.
* 우리는 문화를 만들려고 한다.

Two-phase commit protocol 은? 뭔말 통역이 이상함

두번째 발표자 

자바는 말고 코틀린으로 말함 리엑티브는 코틀린인가 ㅋㅋㅋ

오 트위터 애찬론자 ㅋㅋㅋ 트위터 사용해보라고 합니다. 트위터로 연락주면 됩니다. ^^ 잼있네요

자바 챔피언 멋지네요 계속 노력하고 있다고 합니다. 사진 찍는다 상관한테 보고 한다고 ㅋㅋㅋ 발표 잘하시네요 
은하수를 여행하는 히치하이커를 위한 안내서 영화를 좋아하시는듯 ㅋ

쓰레드의 대기 상태가 너무 많다. 스케일링 모델이 너무 효율적이지 않다.

리엑티브 방식은 성능은 좀 떨어지지만 확장성은 엄청나다.

적은 리소스로 많은 처리를 할수있다. 비동기 방식으로 처리 한다. 콜백지옥에 대해서 말함

스프링에 대한 지식을 버리지 않고 리엑티브 프로그래밍을 사용하기 위해 project reactor

꺄 라이브 코딩 [it crowd](https://namu.wiki/w/The%20IT%20Crowd) 시리즈 추천

아 코틀린을 쓴 이유를 알겠네요 엄청 심플하고 맘에 드네요 코드가 스칼라도 이렇게 되는듯 오오오

이번 스프링 5에서 추가 된것을 사용해 봐야 될것 같음

아 리엑티브 이건 토비님의 강의를 추천합니다. 

발표자 [mkheck github](https://github.com/mkheck)


#### Cloud-Native Spring

사진찍어야 됨 ㅋㅋㅋ 외국애들은 다 사진찍음 ㅋㅋㅋㅋ 다른 컨퍼런스도 그러더니 ㅋㅋㅋㅋ

오렐리 책에 자바섬에 사는 새라고 함 ㅋㅋㅋ 십덕후의 냄새가 ㅋㅋㅋ 잼있네요 ㅋㅋㅋ

리엑티브는 쓰래드에 재사용을 중점에 둔다. 모든건 다 리엑티브에 촛점이 맞춰져있음  

또 라이브 코딩 

이분 스프링에 대한 사랑이 좋네 ㅋㅋㅋ 졸라 표정이 진지함 ㅋㅋㅋ 

이분은 자바로 하는듯 롬복 넣었다 ㅋㅋㅋ

[r2dbc](https://github.com/r2dbc)를 소개해 줌 

아 잼있었음 ㅋ

http 에서 변경 -> 
[rsocket](http://rsocket.io/)을 사용해서 처리함 


#### Spring Cloud Gateway

막간 발표 메가존에서 조원우님이 발표 

정윤진님 발표

[microservices.io](https://microservices.io/)

기존 zuul1 사용(동기)
zuul2(비동기)

음 다른 세션은 라이브 코드라서 더 잼있었는데.....

마지막으로 전반적인 데모를 보여줌

이걸보니 넷플릿스가... 짱인가 ㅋ

[netflix github](https://netflix.github.io/)

[httpbin](https://httpbin.org/)

[httpie](https://httpie.org/)

[spring-cloud-sample](https://github.com/spring-cloud-sample)

[micrometer](https://micrometer.io/)

[ryanjbaxter](https://github.com/ryanjbaxter)


#### Cloud Event Driven Architectures with Spring Cloud Stream 2.0

발표자 [pillopl](http://pillopl.github.io/)

이벤트 스토밍(event storming) 

찾아보니 스프링 블로그에 발표자의 포스팅이 있네요

[event-storming-and-spring-with-a-splash-of-ddd](https://spring.io/blog/2018/04/11/event-storming-and-spring-with-a-splash-of-ddd)

[Alan Curtis Kay](https://ko.wikipedia.org/wiki/%EC%95%A8%EB%9F%B0_%EC%BC%80%EC%9D%B4)

[introducing_eventstorming](https://leanpub.com/introducing_eventstorming)

[spockframework](http://spockframework.org/)

DDD를 공부해야 됨 ㅜㅜ

큐를 통해서 이벤트를 받고 이벤트별로 처리 하는 컨슈머가 이벤트를 처리 하는 케이스로(?)

클라우드 스트리밍 오오 좀보던것이 나오네 ㅋㅋ

오 다 좋음 ㅋ

#### Spring, Fuctions, Serverless and You

[ebooks pivotal](https://content.pivotal.io/ebooks)

어떤 툴을 사용하는것을 결정하는 법

지금 까지 커리어에서 서버를 제공 받는데 얼마나 오래걸렸나?

이 시스템에서 초기에 얼마나 부하를 받을까? 하지만 답은 나도 모른다.

클라우드는 만능이 아니다 우리조직에 맞는 레벨을 사용하자

[riff](https://github.com/projectriff/riff)

케이스바이케이스가 답이다. 하나의 정답은 없다. 은탄환은 없다.

항상 선택엔 트레이드오프가 존재 한다.

#### Spring Boot & Spring Cloud on Pivotal Application Service

넷플릭스에 대한 이야기를 해줌

위에서 발표하신 분이랑 비슷한 이야기를 진행하심 

아래 발표자 블로그

[younjinjeong](http://blog.younjinjeong.io/post/chaosmonkey-for-spring-boot/)

이번 발표는 스프링 클라우드 서비스를 쓰면 좋다라고 설명하는 듯

#### Using Spinnaker to Create a Development Workflow on Kubernetes

발표자는 시스템 어드민 출신이라고 합니다.

다시 한번 피보탈 클라우드 파운더리 설명

쿠버네티스에 대한 상세 설명을....

[helm](https://helm.sh/)

[spinnaker](https://www.spinnaker.io/)


# 참조
-----
* [springonetour](https://springonetour.io/2018/seoul)
* [httpbin](https://httpbin.org/)
* [httpie](https://httpie.org/)
* [microservices.io](https://microservices.io/)
* [rsocket](http://rsocket.io/)
* [r2dbc](https://github.com/r2dbc)
* [micrometer](https://micrometer.io/)
* [Event_storming](https://en.wikipedia.org/wiki/Event_storming)
* [event-storming-and-spring-with-a-splash-of-ddd](https://spring.io/blog/2018/04/11/event-storming-and-spring-with-a-splash-of-ddd)
* [spockframework](http://spockframework.org/)
* [ddd-auditing-domain-layer-or-repository-layer](https://stackoverflow.com/questions/20646222/ddd-auditing-domain-layer-or-repository-layer)
* [riff](https://github.com/projectriff/riff)
* [helm](https://helm.sh/)
* [spinnaker](https://www.spinnaker.io/)

