
---
layout: post
title: "자바트러블슈팅-자바 종합 분석 도구 arthas"
date: 2020-02-11 14:08 +0900
comments: true
tags : ["자바트러블슈팅","자바 종합 분석 도구 arthas","arthas"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 자바 종합 분석 도구 arthas

중국 알리바바에서 만든 자바 분석도구

아서스 주요 기능

* 클래스가 로딩되었는지, 어디에서 로딩되었는지 확인 가능
* 코드가 예상한 대로 실행되는지 확인하기 위한 클래스 역 컴파일 기능
* 클래스 로더의 통계 확인
* 메서드 호출 상세 정보
* 지정한 메서드가 호출되었을 때의 스택 추적 정보
* 느린 하위 호출을 찾기 위한 메서드 호출 추적
* 메서드 호출 통계

### 아서스 주요 명령어

* 전반적인 현황을 확인하는 명령어들 : dashboard, thread, jvm, sysprop, sysenv
* 특정 스레드/클래스/파일 등 분석하기 위한 명령어들 : getstatic, ognl, sc, sm, dump, jad, classloader, mc, redefine, monitor, watch, trace, stack, tt
* 도구들 : pwd, options, help, shutdown

#### dashboard

jvm에 전반적인 상황을 확인

* 가장 상단에 스레드 상태
* 중간에 메모리
* 가장 밑에는 시스템의 전반적인 상황

#### thread

스레드의 전반적인 통계정보를 나타낸다.

* RUNNALBE이 높은 경우 : 정상적인 상태일수 있지만 너무 비정상적으로 높을 경우 RUNNALBE인 스레드를 확인하여 CPU사용량이 높을것을 찾아내야 한다.
* BLOCKED가 높은 경우 : 어디선가 락을 잡고 있는것이 있다 찾아야 된다.
* WAITING이나 TIMED_WAITING이 높은경우 : 대다수 스레드가 대기상태니 문제가 되지 않는다

#### jvm

jvm 상태 확인

#### sc/sm

sc 명령은 search class 약자 sm 명령은 search method의 약자

#### monitor

monitor 명령은 특정 메서드를 추적하는 용도로 사용 기본적으로 통계를 제공하는 주기가 120초

#### stack/trace

stack 명령은 클래스의 메서드간에 호출관계를 확인

trace 지정 메서드를 실행할때의 스택 정보를 실시간으로 보고자 할때

#### TT

tt는 timetunnel의 약자 특정 클래스의 메서드가 정상적으로 잘 실행이 되고 있는지에 대한 정보들을 확인하기 위한 용도



# 참조
-----
* [arthas](https://github.com/alibaba/arthas)

