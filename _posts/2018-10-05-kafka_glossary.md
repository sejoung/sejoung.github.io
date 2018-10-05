---
layout: post
title: "kafka_glossary"
date: 2018-10-05 10:55 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 카프카 용어사전(?)

```
borker : 카프카가 설치 되어 있는 서버 또는 노드를 말한다.
topic : Producers 와 Consumers 들이 카프카로 보낸 메시지를 구분하기 위한 이름
partitions : 병렬 처리가 가능하게 topic 나눌 수있고 많은양의 메시지를 처리하기 위해 나눌수 있는 구조
Producers : 메시지를 생산해서 borker의 topic에게 전달하는 서버 또는 어플리케이션
Consumers : borker에 topic의 이름이로 저장된 메시지를 가져가는 서버 또는 어플리케이션
offset : 파티션 내의 각 레코드를 고유하게 식별 하는 순차적 인 ID 번호
Consumer Group : Consumer Instance를 대표하는 그룹

```

kafka.consumer.auto-offset-reset 설정

```
earliest: 오프셋을 초기값으로 자동 리셋
largest: 오프셋 값을 최대값으로 자동 리셋
none: 컨슈머 그룹에서 이전 오프셋을 찾지 못한다면, 컨슈머에 에러를 던짐
anything else: 컨슈머에 에러를 던짐 

```
