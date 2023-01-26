---
layout: post
title: "4장 처리율 제한 장치 설계"
date: 2023-01-26 21:24 +0900
comments: true
tags : ["가상 면접 사례로 배우는 대규모 시스템 설계 기초"]
categories : ["book"]
sitemap :
changefreq : daily
priority : 1.0
---

# 가상면접으로 배우는 대규모 시스템 설계 기초
## 4장 처리율 제한 장치 설계
### 토큰 버킷 알고리즘

인자
* 버킷 크기
* 토큰 공급율

장점
* 구현이 쉽다
* 메모리 사용 측면에서도 효율적이다.
* 짧은 시간에 집중되는 트래픽도 처리가능하다

단점
* 버킷 크기와 토큰 공급률이라는 두개의 인자를 가지고 있는데 이값을 적절하게 튜닝하는게 어렵다.

### 누출 버킷 알고리즘

토큰 버킷 알고리즘이랑 비슷하지만 요청 처리율이 고정되어 있다. 보통 큐로 많이 구현한다.

인자
* 버킷 크기
* 처리율

장점
* 큐의 크기가 제한되어 있어 메모리 사용량 측면에서 효율적이다.
* 고정된 처리율을 갖고 있기 때문에 안정적 출력이 필요한 경우에 적합하다

단점
* 단시간에 많은 트래픽이 몰리는 경우 큐에는 오래된 요청들이 쌓이게 되고 그요청들을 제때 처리 못하면 최신요청은 버려지게 된다.
* 두개의 인자를 가지고 있는 데 이를 올바르게 튜닝하기 어렵다.

### 고정 원도 카운터 알고리즘

* 타임라인을 고정된 간격의 원도로 나누고 각 원도우 마다 카운터를 붙힌다.
* 요청이 접수될 떄마다 카운터의 값은 1씩 증가한다.
* 카운터의 값이 사전에 설정된 임계치에 도달하면 새로운 윈도우가 열릴때 까지 버려진다.

장점
* 메모리 효율이 좋다
* 이해하기 쉽다
* 원도가 닫히는 시점에 카운터를 초기화하는 방식은 특정한 트래픽 패턴을 처리하기 적합하다.

단점
* 원도 경계 부근에서 일시적으로 많은 트래픽이 몰려드는 경우 기대했던 시스템 처리 한도보다 많은 양의 요청을 처리한다.


### 이동 원도 로깅 알고리즘

고정 원도 카운터 알고리즘에 중대한 문제가 있는데 원도우 경계 부근에 트래픽이 집중 되는 경우 시스템에서 설정한 한도 보다 많은 요청을 처리하는것이다.

이동 원도 로깅 알고리즘은 이 문제를 해결한다.

* 이 알고리즘은 요청의 타임스템프를 추적한다. 타임스템프 데이터는 보통 레디스의 정렬 집합(sorted set) 같은 캐시에 저장한다.
* 새 요청이 오면 만료된 타임스템프는 제거 한다. 만료된 타임스템프는 그값이 현재 원도우 시작시점보다 오래된 타임스템프를 말한다.
* 새 요청의 타임스템프를 로그에 추가 한다.
* 로그의 크기가 허용치보다 같거나 작으면 요청을 시스템에 전달한다 그렇지 않으면 요청은 버린다.

장점
* 이 알고리즘이 구현하는 처리율 제한 메커니즘은 아주 정교하다. 어느 순간의 원도를 보더라도 허용되는 요청의 개수는 시스템 처리한도를 넘지 않는다.

단점
* 이 알고리즘은 다량의 메모리를 사용하는데 거부된 요청의 타임 스템프도 보관하기 때문이다.

### 이동 원도 카운터 알고리즘

이동 원도 카운터 알고리즘은 고정 원도 카운터 알고리즘 과 이동 원도 로깅 알고리즘을 결합한 것이다.

고정 원도우 카운터 알고리즘 처럼 원도우의 카운터를 추적하고 제한 하는데 현재 타임스템프 기반으로 추적하면 이전 요청의 가중치를 부여하여 트레픽 폭주를 완화 한다.

장점
* 이전 시간대의 평균 처리율에 따라 현재 원도의 상태를 계산하므로 짧은 시간에 몰리는 트래픽에도 잘대응한다.
* 메모리 효율이 좋다.

단점
* 직전 시간대에 도착한 요청이 균등하게 분포되어 있다고 가정한 상태에서 추정치를 계산하기 때문에 다소 느슨하다.

### 분산 환경의 처리율 제한장치의 구현
 
* 경쟁조건(race condition)
  * 병행성이 심한 환경에서 경쟁 조건 이슈가 발생할수 있다.
  * 가장 널리 알려진 해결책은 락이다. 하지만 시스템 성능을 상당히 떨어뜨린다.
  * 락 대신 해결 방법 루아 스크립트, sorted set 사용
* 동기화(synchronization)
  * 처리율 제한장치를 여러대 쓸때 동기화 이슈가 발생
    * sticky session 을 활용해 같은 처리율 장치로 전달하는 방법도 있다
    * 다른 방법은 중앙집중식 데이터 저장소를 활용하는것이다.(ex. redis)

* 경성(hard) 또는 연성(soft) 처리율 제한
  * 경성 처리율 제한 : 절대 임계치를 넘을수 없다
  * 연성 처리율 제한 : 잠시 동안은 임계치를 넘을수 있다.

* 다양한 계층에서의 처리율 제한
  * iptables를 사용하면 ip에 처리율 제한을 걸수도 있다.
    * connlimit 모듈
    * limit 모듈


# 참조

-----
* [가상 면접 사례로 배우는 대규모 시스템 설계 기초](http://www.yes24.com/Product/Goods/102819435)
* [API Rate Limiting with Spring Cloud Gateway](https://spring.io/blog/2021/04/05/api-rate-limiting-with-spring-cloud-gateway)
* [Token bucket](https://en.wikipedia.org/wiki/Token_bucket)
* [Leaky bucket](https://en.wikipedia.org/wiki/Leaky_bucket)
* [How to Design a Scalable Rate Limiting Algorithm with Kong API](https://konghq.com/blog/how-to-design-a-scalable-rate-limiting-algorithm)
* [API Gateway Throttling 구현](https://doublem.org/api-gateway-basic/)
* [RateLimit Header Fields for HTTP](https://www.ietf.org/archive/id/draft-polli-ratelimit-headers-02.html)
* [RateLimit header fields for HTTP datatracker](https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/)
* [The netfilter.org "iptables" project](https://www.netfilter.org/projects/iptables/index.html)
* [iptables: How to use the limits module](https://thelowedown.wordpress.com/2008/07/03/iptables-how-to-use-the-limits-module/)
