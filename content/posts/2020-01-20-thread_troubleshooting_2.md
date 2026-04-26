---
layout: post
title: "자바트러블슈팅-스레드 진단하기(2)"
date: 2020-01-20 14:00 +0900
comments: true
tags : ["자바트러블슈팅","스레드 진단하기","록 경합을 피하는 10+1가지 방법"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 스레드 진단하기

### 록 경합을 피하는 10+1가지 방법

* 코드가 아닌 데이터를 보호 하라. -  가장 간단하고 빠른 방법은 전체 함수 호출에 synchronized를 거는 것이다. 
하지만 데이터 만 synchronized 블록으로 감싼다면 중요한 코드를 잠그는데 드는 시간을 줄일수 있을 것이다.

* 록 사용 부분에서는 비싼 계산을 하지 말아라

* 록을 분리해라 - 서로 다른 데이터에는 서로 다른 록을 사용하라

* 내부적인 록이나 atomic 작업을 사용하라 - 병렬 프로그래밍 시스템은 단순한 작업을 수행할 수 있도록 atomic 연산을 제공한다.

* 동기화된 데이터 구조를 사용하라 - 만약에 atomic 연산을 직접 사용할수 없다면 내부적으로 atomic을 사용하라는 데이터 구조를 사용할 수 있다.

* 가능하다면 읽기-쓰기 록 디자인 패턴을 사용하라

* 가능하다면 읽기 전용 데이터를 사용하라

* 객체 풀링을 피해라

* 지역 변수를 사용하거나 스레도 로컬 저장소를 사용하라

* 핫스폿을 피하라

* 트렌젝션을 제공하는 메모리 시스템을 사용하라




# 참조
-----
* [10 Ways to Reduce Lock Contention in Threaded Programs](https://www.thinkingparallel.com/2007/07/31/10-ways-to-reduce-lock-contention-in-threaded-programs/)
* [Readers–writer lock](https://en.wikipedia.org/wiki/Readers%E2%80%93writer_lock)

