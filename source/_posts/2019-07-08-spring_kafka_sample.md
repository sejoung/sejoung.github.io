---
layout: post
title: "spring kafka sample"
date: 2019-07-08 09:59 +0900
comments: true
tags : ["spring","kafka","spring kafka"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
## spring kafka sample

스프링 카프카로 간단한 sample 프로그램 해볼려고 한다. 
프로그램 자체는 스프링 카프카 자체 sample 코드를 사용하려고 한다.

그럼 먼저 카프카를 다운로드 하겠다.

압축을 푼후에 다음 명령어를 실행하겠다. 주키퍼 실행

```

sanaesdevui-MacBookPro:kafka_2.12-2.3.0 sanaes$ bin/zookeeper-server-start.sh config/zookeeper.properties
[2019-07-08 10:22:21,145] INFO Reading configuration from: config/zookeeper.properties (org.apache.zookeeper.server.quorum.QuorumPeerConfig)

```

실행이 되면 카프카를 실행하겠다.

```
sanaesdevui-MacBookPro:kafka_2.12-2.3.0 sanaes$ bin/kafka-server-start.sh config/server.properties
[2019-07-08 10:23:27,820] INFO Registered kafka:type=kafka.Log4jController MBean (kafka.utils.Log4jControllerRegistration$)

```
### sample1

첫번째 샘플은 기본적인 구조로서 간단한 실패처리 방법에 대해서 설명함

첫번째 sample 코드를 실행시킨후 

```
 curl -X POST http://localhost:8080/send/foo/bar
 
```
위에 메시지를 전송시키는 api를 실행시키면 로그가 찍히는것을 확인 할수있다.


그다음 최초 설정 대로 3번 실패시에 DLT 큐로 전송하는 코드를 실행 하는것을 볼려면 

```
 curl -X POST http://localhost:8080/send/foo/fail

```
위에 명령어를 실행 시키면 3번 실행후에 실패 큐로 전송하는것을 확인 할수 있다.

### sample2

두번째는 multi-method consumer 구조를 설명시키는 구조로써


```
curl -X POST http://localhost:8080/send/foo/bar

curl -X POST http://localhost:8080/send/bar/baz

curl -X POST http://localhost:8080/send/unknown/xxx

```
위에 명령어를 실행시키면 각각의 메소드가 실행 되는것을 볼수 있다.

### sample3 

세번째 샘플은 트렌젝션을 설명하는 예제 있다.


```
curl -X POST http://localhost:8080/send/foos/a,b,c,d,e
```

위에 명령어를 실행시키면 엔터를 치라는 문구가 나오고 엔터를 쳐야 트랜젝션이 묶음으로 처리된다.


```
2019-07-08 10:45:46.215  INFO 11584 --- [fooGroup2-0-C-1] com.example.Application                  : Received: [Foo2 [foo=a], Foo2 [foo=b], Foo2 [foo=c], Foo2 [foo=d], Foo2 [foo=e]]
2019-07-08 10:45:46.218  INFO 11584 --- [fooGroup2-0-C-1] com.example.Application                  : Messages sent, hit Enter to commit tx

2019-07-08 10:46:01.168  INFO 11584 --- [fooGroup3-0-C-1] com.example.Application                  : Received: [A, B, C, D, E]
```

# 참조
-----
* [spring-kafka](https://github.com/spring-projects/spring-kafka)
* [apache kafka](https://kafka.apache.org/)
