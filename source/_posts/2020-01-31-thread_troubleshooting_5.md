---
layout: post
title: "자바트러블슈팅-스레드 진단하기(5)"
date: 2020-01-31 16:03 +0900
comments: true
tags : ["자바트러블슈팅","스레드 진단하기","스레드 문제"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 스레드 진단하기

### 스레드 문제

#### 스레드 단면으로 어떤 문제를 확인할 수 있을까?

시스템이 죽는 경우는 스레드 단면으로 확인 할수 없는데

```

-XX:OnError=string

```

XX:OnError=string 명령 행 옵션을 사용하여 지정 여기서 string 은 단일 명령이거나 세미콜론으로 구분 된 명령 목록

예) `java -XX:OnError="gcore %p; dbx - %p" MyApp`

%p는 현재 pid로 대체된다.

#### 시스템이 느릴 때도 스레드와 관련이 있을까?


시스템이 느리다고 무작성 스레드 단면을 뜨는 것은 좋은 해결방법이라고 할수는 없지만 생성해 놓으면 근거를 찾을수는 있다.

시스템이 문제가 생겼을때 확인

* CPU, 메모리와 같은 리소스 사용량 점검
* 외부와 연동하는 리소스 사용량 점검
* WAS 메모리 및 스레드 설정 및 사용량 점검
* Web 서버 설정 점검
* OS 설정 점검
* 스레드 상태 점검
* 메모리 상태 점검

#### 시스템 응답이 없을 때에는 스레드 단면이 가장 효과적이다.

스레드 단면이 가장 큰효과를 발휘 하는 부분이 바로 시스템 응답이 없는 경우다.

시스템이 응답하지 않을때에는 보통 WAS가 정해 놓은 스레드 풀이나 DB 커넥션 풀이 꼭 찼을 확율이 높다.
스레드 단면을 30초에서 1분단위로 발생시킨후 스레드 단면 분석도구로 확인하는것이 좋다.

분석 도구를 활용하여 확인해야 할 순서

* 전체 스레드의 개수가 몇개인지 확인한다.
* java 6 이상일 경우 스레드 단면의 루트 노드를 클릭하여 메모리 사용량을 확인 해보고, 여러 개의 단면 파일을 비교해 가면서 그 값이 어떻게 변하는지 확인해 본다.
* Monitor 목록에서 빨간색으로 표시되어 여러 스레드를 잡는 녀석이 없는지 찾아 본다.
* 빨간색으로 표시된 스레드가 보이지 않을때에는 Runnable인 스레드들을 살펴보자
* 지속해서 수행 중인 스레드가 존재하지 않는지 `Long running threads detect` 기능을 사용하여 확인한다.
* 그래도 원인이 없으면 다른 원인을 찾아 보자

스레드 단면을 뜰때 같이 `ps -Lf -p pid` 명령어도 같이 떠 놓는게 좋다

스레드 문제가 gc 관련 스레드이면 `jstat -gcutil 5s` 명령어로 메모리도 확인하는 것이 좋다.

스레드 단면은 문제가 생겼을때 생성해야 한다.

# 참조
-----
* [threadlogic](https://github.com/sparameswaran/threadlogic)
* [java_troubleshooting_book code](https://github.com/sejoung/java_troubleshooting_book)
* [jdk 8 The -XX:OnError Option](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/clopts001.html)
