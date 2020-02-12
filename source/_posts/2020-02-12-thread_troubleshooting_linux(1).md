
---
layout: post
title: "자바트러블슈팅-리눅스 진단하기(1)"
date: 2020-02-12 17:36 +0900
comments: true
tags : ["자바트러블슈팅","리","리눅스 진단 도구"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 60,000 밀리초에 리눅스 시스템 분석하기

```
uptime
dmesg | tail
vmstat 1
mpstat -P ALL 1
pidstat 1
iostat -xz 1
free -m
sar -n DEV 1
sar -n TCP,ETCP 1
top

```

### uptime

uptime은 원래 서버가 시작한지 얼마나 되는지 확인하기 위한 명령이다. 근데 가장먼저 이 명령어를 실행하는 이유는 load average 때문이다.
load average는 앞에서 부터 1분 5분 15분간의 평균값이다. 이값은 0에 가까우면 좋고, 클수록 좋지 않다. 
그리고 1분 평균이 5분이나 15분 평균보다 높으면 아직도 문제가 지속중이고 
5분이나 15분평균이 1분 평균 보다 높으면 이미 상황은 거의 종료 되었다는 의미로 볼수 있기 때문이다.

### dmesg | tail

dmesg 명령은 시스템 메시지를 확인하는 명령어이며, 파이프와 tail을 사용했기 때문에 최근 시스템 메시지를 확인할수 있다.

### vmstat 1

vmstat 명령은 가상 메모리의 상황을 확인하는 도구이지만, 아주 많은 정보를 제공한다.

* r : CPU의 Run Queue를 의미하며, CPU가 바빠서 자기 차례를 기다리는 프로세스 개수를 뜻한다. 
그래서 CPU 코어 갯수 보다 이 숫자가 많으면 서버가 아주 바쁜상황이라고 판단할수 있다.

* free : KB 단위의 메모리 여유를 의미
* swap : 메모리가 부족할때 디스크를 메모리처럼 사용하는 영역
* si : swap in
* so : swap out
* cpu 
    * us : user CPU
    * sy : system CPU
    * wa : wait I/O CPU
    * st : stolen time
 
 ### mpstat -P ALL 1
 
 mpstat 명령어는 CPU별 사용량을 확인할 수 있다. 단일 CPU만 사용하는지 여러 CPU가 분산되서 일하는지 확인이 가능하다.
 
 ### pidstat 1
 
 pidstat는 프로세스별 CPU 사용량을 확인 하는 명령어다

### iostat -xz 1

iostat는 I/O 상황을 확인하는 용도로 사용된다. 맨앞의 r은 read를 w는 write를 뜻한다.

### free -m

free는 메모리 사용량을 확인하는 명령어 -h 명령어는 읽기좋게 표현한다.

### sar -n DEV 1

sar 명령은 여러 서버의 정보들을 취합하는데 사용 -n은 네트워크 상태를 나타낸다 DEV는 모든 네트워크 디바이스의 상태를 보겠다는 의미

### sar -n TCP,ETCP 1

* active/s : 장비에서 외부로 초기화된 초당 TCP 연결의 개수 이 값이 많으면 새롭게 접근한 클라이언트 수가 많다는 의미 connect() 메서드에 해당 
* passive/s : 외부에서 장비로 초기화된 초당 TCP 연결의 개수를 가르키는것 accept() 메서드의 해당

### top

top는 시스템의 전반적인 현화을 한눈에 실시간으로 볼수있다는 장점이 있지만 CPU를 많이 사용하므로 부하가 심하다는 단점도 존재한다.

# 참조
-----
* [Linux Performance Analysis in 60,000 Milliseconds](https://netflixtechblog.com/linux-performance-analysis-in-60-000-milliseconds-accc10403c55)

