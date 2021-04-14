---
layout: post
title: "카프카(kafka) 도커로 설치"
date: 2021-04-14 01:19 +0900
comments: true
tags : ["kafka","카프카","nosql","docker","카프카 도커","kafka docker"]
categories : ["db"]
sitemap :
changefreq : daily
priority : 1.0
---
# 카프카(kafka) 도커로 설치

zookepper 1대에 kafka 브로커 3대 구성

이미지는 zookeeper는 공식 repository 와 kafka는 confluentinc repository에 있는것으로 구성함 오늘기준으로 최신 릴리즈 구성으로 셋팅

모니터링 용으로 cmak 까지 같이 셋팅하는 구성임

```yaml
version: "3.0"
services:
  zoo1:
    image: zookeeper:3.7.0
    hostname: zoo1
    restart: always
    ports:
    - "2181:2181"
    environment:
      ZOO_MY_ID: 1
      ZOO_PORT: 2181
      ZOO_SERVERS: server.1=0.0.0.0:2888:3888;2181
    volumes:
      - /Users/beni/kafka/zoo1/data:/data
      - /Users/beni/kafka/zoo1/datalog:/datalog
  kafka1:
    image: confluentinc/cp-kafka:6.1.1
    hostname: kafka1
    restart: always
    links:
      - zoo1:zoo1
    ports:
      - "9092:9092"
    environment:
      KAFKA_ADVERTISED_LISTENERS: LISTENER_DOCKER_INTERNAL://kafka1:19092,LISTENER_DOCKER_EXTERNAL://${DOCKER_HOST_IP:-127.0.0.1}:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: LISTENER_DOCKER_INTERNAL:PLAINTEXT,LISTENER_DOCKER_EXTERNAL:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: LISTENER_DOCKER_INTERNAL
      KAFKA_ZOOKEEPER_CONNECT: "zoo1:2181"
      KAFKA_BROKER_ID: 1
      KAFKA_LOG4J_LOGGERS: "kafka.controller=INFO,kafka.producer.async.DefaultEventHandler=INFO,state.change.logger=INFO"
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 3
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "false"
      KAFKA_LOG_RETENTION_HOURS: 24
    volumes:
      - /Users/beni/kafka/kafka1/data:/var/lib/kafka/data
    depends_on:
      - zoo1
  kafka2:
    image: confluentinc/cp-kafka:6.1.1
    hostname: kafka2
    restart: always
    links:
      - zoo1:zoo1
    ports:
      - "9093:9093"
    environment:
      KAFKA_ADVERTISED_LISTENERS: LISTENER_DOCKER_INTERNAL://kafka2:19093,LISTENER_DOCKER_EXTERNAL://${DOCKER_HOST_IP:-127.0.0.1}:9093
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: LISTENER_DOCKER_INTERNAL:PLAINTEXT,LISTENER_DOCKER_EXTERNAL:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: LISTENER_DOCKER_INTERNAL
      KAFKA_ZOOKEEPER_CONNECT: "zoo1:2181"
      KAFKA_BROKER_ID: 2
      KAFKA_LOG4J_LOGGERS: "kafka.controller=INFO,kafka.producer.async.DefaultEventHandler=INFO,state.change.logger=INFO"
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 3
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "false"
      KAFKA_LOG_RETENTION_HOURS: 24
    volumes:
      - /Users/beni/kafka/kafka2/data:/var/lib/kafka/data
    depends_on:
      - zoo1

  kafka3:
    image: confluentinc/cp-kafka:6.1.1
    hostname: kafka3
    restart: always
    links:
      - zoo1:zoo1
    ports:
      - "9094:9094"
    environment:
      KAFKA_ADVERTISED_LISTENERS: LISTENER_DOCKER_INTERNAL://kafka3:19094,LISTENER_DOCKER_EXTERNAL://${DOCKER_HOST_IP:-127.0.0.1}:9094
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: LISTENER_DOCKER_INTERNAL:PLAINTEXT,LISTENER_DOCKER_EXTERNAL:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: LISTENER_DOCKER_INTERNAL
      KAFKA_ZOOKEEPER_CONNECT: "zoo1:2181"
      KAFKA_BROKER_ID: 3
      KAFKA_LOG4J_LOGGERS: "kafka.controller=INFO,kafka.producer.async.DefaultEventHandler=INFO,state.change.logger=INFO"
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 3
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "false"
      KAFKA_LOG_RETENTION_HOURS: 24
    volumes:
      - /Users/beni/kafka/kafka3/data:/var/lib/kafka/data
    depends_on:
      - zoo1

  cmak:
    image: hlebalbau/kafka-manager:stable
    hostname: cmak
    restart: always
    ports:
      - "9000:9000"
    links:
      - zoo1:zoo1
    environment:
      ZK_HOSTS: "zoo1:2181"
    depends_on:
      - zoo1
      - kafka1
      - kafka2
      - kafka3


```

```
docker-compose -f docker-compose-kafka.yml up -d

docker-compose -f docker-compose-kafka.yml down

docker-compose -f docker-compose-kafka.yml ps

```

* offsets.topic.replication.factor : 기본 값은 3으로, 하나의 파티션이 총 세 개로 분산 저장되는 것
* auto.create.topics.enable : 생성되지 않은 토픽을 자동으로 생성할지 여부. 기본값은 true
* log.retention.hours : 세그먼트 파일의 삭제 주기, 기본값 hours, 168시간( 7일 )

#참고
-------
* [wurstmeister/kafka-docker](https://github.com/wurstmeister/kafka-docker)
* [docker-compose 를 사용하여 kafka Cluster 및 Kafka Manger 세팅하기](https://akageun.github.io/2020/05/01/docker-compose-kafka-cluster-manager.html)
* [apache-kafka-install-by-docker](https://daddyprogrammer.org/post/12087/apache-kafka-install-by-docker/)
