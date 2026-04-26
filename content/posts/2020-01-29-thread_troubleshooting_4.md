---
layout: post
title: "자바트러블슈팅-스레드 진단하기(4)"
date: 2020-01-29 12:11 +0900
comments: true
tags : ["자바트러블슈팅","스레드 진단하기","잘라 놓은 스레드 단면 분석하기"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 스레드 진단하기

### 잘라 놓은 스레드 단면 분석하기

[threadlogic](https://github.com/sparameswaran/threadlogic)은 스레드 분석용으로 매우 강력한 기능을 제공하면서 전혀 복잡하지 않다.

threadlogic의 특징은 

* 여러 스레드 단면을 동시에 분석 할 수 있다.
* 잠김 현상이 발생한 스레드를 매우 쉽게 추적할수 있다.
* 오랫동안 수행되는 스레드가 있을 때 매우 쉽게 찾을수 있다.

threadlogic의 메뉴
* Threads - 모든 스레드 목록
* Threads sleeping on Monitors - 대기중인 스레드 목록
* Threads locking Monitors - 잠겨있는 스레드의 목록
* Monitors - 이 메뉴도 역시 잠겨 있는 스레드 목록을 보여주지만 모든 잠김의 원인이 되는 스레드를 식별하기 쉽게 해준다

스레드 단면을 분석할때는 적어도 10초 이상의 간격으로 다섯 번 이상 단면을 생성하는 것을 권장한다.

#### 잠겨있는 스레드 확인

threadlogic 에 Monitors 메뉴에서 확인을 하면 아래와 같이 잠겨있는 스레드를 확인 할수 있다.

![UI1](https://sejoung.github.io/images/2020_01_29_01.png)


#### 무한 루프나 응답 없는 화면 확인

아래의 명령어로 LWP(Light Weight Process, is thread)를 확인해서 native-id 와 매칭해서 확인 해볼수 있다.

```

ps -Lf -p PID

```

맥OS에서 확인 하는 방법이 없다 ㅜㅜ


# 참조
-----
* [threadlogic](https://github.com/sparameswaran/threadlogic)

