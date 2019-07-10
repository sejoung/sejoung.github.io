---
layout: post
title: "spring kafka consumer sample"
date: 2019-07-10 18:17 +0900
comments: true
tags : ["spring","kafka","spring kafka"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
## spring kafka consumer sample

스프링 카프카로 간단한 consumer sample 프로그램 해볼려고 한다. 

처음에는 카프카를 다운 받고 [quickstart](https://kafka.apache.org/quickstart)에 3번항목 토픽생성까지 한후에


스프링 컨슈머를 시작하면 간단하게 정보를 볼수있다. 일단 로컬에 환경을 맞춘다는 가정하에 코드를 만들었는데

프로퍼티에 `spring.kafka.bootstrap-servers=` 여기 부분에 카프카 브로커 주소를 넣어 주면 실행할수있다.

메시지가 `spring.kafka.consumer.value-deserializer=org.apache.kafka.common.serialization.StringDeserializer` 

StringDeserializer를 사용해서 String으로 오는데 나중에 JsonDeserializer로 변경해서 사용하면 좋을것 같다.


# 참조
-----
* [apache kafka](https://kafka.apache.org/)
* [consumer sample](https://github.com/sejoung/consumer)