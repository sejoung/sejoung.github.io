---
layout: post
title: "아이템 80. 스레드보다는 실행자, 테스크, 스트림을 애용하라."
date: 2019-03-26 12:36 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 80. 스레드보다는 실행자, 테스크, 스트림을 애용하라.

java.util.concurrent 패키지가 등장 했고 여기에 executor framework라는 것이 포함이 되어 있다. 
실행자 서비스는 쓰레드 보다 고급 api면서 조금더 다루기 쉽다.

실행자 서비스의 주요기능

* 특정 테스크가 완료되기를 기다린다.(`exec.submit(() -> s.removeObserver(this)).get();`)
* 테스크 모음 중 아무것 하나(invokeAny 매서드) 혹은 모든 테스크(invokeAll 매서드)가 완료되기를 기다린다.
* 실행자 서비스가 종료하기를 기다린다.(awaitTermination 메서드)
* 완료된 테스크들의 결과를 차래로 받는다.(ExecutorCompletionService)
* 테스크를 특정 시간에 혹은 주기적으로 실행하게 한다.(ScheduledThreadPoolExecutor)

# 참조
-----
* [understanding-alien-methods-in-java-concurrency](https://stackoverflow.com/questions/33665253/understanding-alien-methods-in-java-concurrency)
* [Executors 프레임워크](https://sejoung.github.io/2019/03/2019-03-25-Lesson_Concurrency_7/#Executors)

