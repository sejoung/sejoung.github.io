---
layout: post
title: "spring integration 용어"
date: 2019-09-05 15:47 +0900
comments: true
tags : ["spring integration","용어"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
### spring integration 용어

#### Component

Message - 페이로드와 헤더로 구성

Message Channel - 파이프 및 필터 아키텍쳐에서 파이프를 뜻 함

Message Endpoints - 파이프 및 필터 아키텍쳐에서 필터를 뜻 함

#### Message Send/Recieve

Outbound
Gateway ⇒ Message Channel ⇒ outbound-channel-adapter 

Inbound
inbound-channel-adapter ⇒ Message Channel ⇒ Service Activator

#### MessageChannel
PollableChannel : QueueChannel ...
SubscribableChannel : DirectChannel ...

Point-to-Point Channel : DirectChannel, QueueChannel ...
Publish/Subscribe Channel : PublishSubscribeChannel ...

#### Message Endpoints 정리
Gateway 비즈니스 로직에서 메시지 송수신을 쉽게 도와주는 컴포넌트
Service Activator 메시지가 입력 채널에 도착했을 때 특정 빈의 메소드를 호출해주는 컴포넌트
Channel Adapter 외부 시스템과 메시지 송수신 하기 위한 컴포넌트
Transformer 인풋 채널로 들어온 페이로드를 특정 목적에 맞게 변환하여 아웃풋 채널로 전달하는 엔드포인트
Filter 특정 채널로 어떤 메시지는 전달하지 말아야 할지를 걸러내는 컴포넌트
Router 메시지를 한 개 이상의 채널로 보내는 컴포넌트
Splitter 채널로 들어온 메시지를 여러 조각으로 나눌 때 사용
Aggregator 여러 메시지를 조합하여 하나의 메시지로 통합하는 컴포넌트
Message Bridge 다른 종류의 메시징 채널이나 어댑터를 연결하는 컴포넌트
Message Enricher 수신 메시지에 추가적인 정보를 더하여 확장, 업데이트 된 객체를 하위 소비자에게 전송


# 참조
----- 
* [spring-integration](https://docs.spring.io/spring-integration/docs/5.1.7.RELEASE/reference/html/)
