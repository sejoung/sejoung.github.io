---
layout: post
title: "circuit-breaker"
date: 2017-12-20 13:30:00 +0900
comments: true
tags : ["patterns","circuit-breaker"]
categories : ["architecture"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# circuit-breaker

소프트웨어에 대한 복잡도가 높아지면서 
서비스에서 다른서비스를 호출하는 형태(예를들면 MSA 형태로 구성되어 API들을 호출하는 형태)들이
보편화 되어 서비스 되고 있다. 

응용프로그램을 만들때 환경에서 발생할 수 있는 일시적 장애에 민감해야 된다. 
장애에는 구성 요소 및 서비스에 대한 네트워크 연결의 순간적 끊김, 
일시적인 서비스 사용 불가, 서비스를 이용 중일 때 발생하는 시간 초과 등이 포함된다.

위에 장애에 대응하기 위해 retry 패턴을 구현할수 있다.

아래 전략들을 사용하여 장애를 처리할 수 있습니다:

1. 취소-장애가 일시적인 것이 아니거나 반복해도 성공하지 못할 가능성이 있을 경우, 응용 프로그램은 작업을 취소하고 예외를 보고해야 합니다. 예를 들어 잘못된 자격 증명을 제시하여 발생한 인증 실패는 몇 번을 시도하더라도 성공할 가능성이 없습니다.
2. 재시도-보고된 특정 장애가 특이하거나 드문 경우, 네트워크 패킷이 전송되는 동안 손상되는 등 특이한 상황 때문에 야기되었을 가능성이 있습니다. 이 경우, 응용 프로그램이 실패한 요청을 즉시 다시 시도할 수 있는데 그 이유는 동일한 장애가 반복될 가능성이 낮고, 요청이 성공할 가능성이 있기 때문입니다.
3. 지연 후 재시도. 보다 일반적인 연결 또는 사용 중 장애 중 하나로 장애가 야기될 경우, 연결 문제를 시정하거나 작업 백로그가 비워지는 동안 네트워크나 서비스에 잠깐의 시간이 필요할 수 있습니다. 응용 프로그램은 요청을 재시도하기 전에 적절한 시간 동안 기다려야 합니다.

위에 retry 패턴을 구현해도 문제점이 생길수가 있다.

상당 수의 재시도 후에도 요청이 계속 실패하면, 즉시적으로 장애로 판단하고 처리 하는것이 좋다.
하지만 위에 정책만으로는 문제점들이 존재하게 된다. 이럴때 circuit breaker 패턴을 참조해서 구현하는것이 좋다.

circuit breaker 패턴는 

1. 폐쇄-응용 프로그램의 요청이 작업에 전달됩니다. 프록시는 최근 실패 횟수의 카운트를 유지하고 있다가 작업의 호출이 실패하는 경우 실패 횟수 카운트를 하나씩 늘립니다. 최근 실패 횟수가 지정된 시간 이내에 지정된 임계값을 초과하면 프록시는 개방 상태로 전환됩니다. 개방 상태로 전환된 프록시는 시간 초과 타이머를 시작하고, 시간 초과 타이머가 만료되면 프록시는 반개방 상태로 전환됩니다.
(시간 초과 타이머는 응용 프로그램이 작업의 수행을 다시 시도하기 전에 먼저 시스템이 실패의 원인이 되는 문제를 해결할 시간을 확보하기 위한 것입니다.)
2. 개방-응용 프로그램의 요청이 즉시 실패하고 예외가 응용 프로그램에 반환됩니다.
3. 반개방-응용 프로그램으로부터 제한된 횟수의 요청이 통과되어 작업을 호출할 수 있게 됩니다. 이와 같은 요청이 성공하면 이전에 실패를 유발한 장애가 해결되었다고 판단하여 회로 차단기가 폐쇄 상태로 전환되고 실패 카운터가 초기화되지만 이와 같은 요청이 실패하면 장애가 여전히 남아 있다고 판단하여 회로 차단기가 다시 개방 상태로 되돌아가고 시간 초과 타이머를 다시 시작해 시스템이 장애를 복구할 추가 시간을 확보합니다.
(반개방 상태는 복구 중인 서비스가 요청으로 인해 갑자기 서비스 장애를 일으키는 것을 방지하는 데 유용합니다. 복구가 진행되는 동안 서비스는 복구가 완료될 때까지 제한된 양의 요청을 지원할 수 있지만, 복구가 진행되는 동안 엄청난 양의 작업이 요청되면 서비스의 시간 초과 또는 실패가 다시 초래될 수 있습니다.)

위에처럼 상태를 나눌수 있고 거기에 따른 문제점 및 해결 방안을 고려 해야 된다.

해당 패턴을 구현하기 위해 넷플릭스에서 오픈소스를 내 놓은것이 Hystrix가 있다.


# 참조 
-----
* [circuit-breaker](https://docs.microsoft.com/ko-kr/azure/architecture/patterns/circuit-breaker)

* [retry](https://docs.microsoft.com/ko-kr/azure/architecture/patterns/retry)

* [Hystrix! API Gateway를 도와줘!](http://woowabros.github.io/experience/2017/08/21/hystrix-tunning.html)

* [Hystrix](https://github.com/Netflix/Hystrix)

* [Martin Fowler](https://martinfowler.com/bliki/CircuitBreaker.html)