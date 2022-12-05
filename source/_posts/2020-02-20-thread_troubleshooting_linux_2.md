---
layout: post
title: "자바트러블슈팅-리눅스 진단하기(2)"
date: 2020-02-20 15:08 +0900
comments: true
tags : ["자바트러블슈팅","리눅스 진단 도구","CPU 모니터링하기"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 왜 CPU를 모니터링 해야 하나

CPU가 병목이 가장 많이 발생하는 부분이다.

일반적인 자바 기반의 시스템의 CPU 사용량 User:System 비율은 10:1 ~ 8:1 정도 이다.

상세한 분석이 필요할때 mpstat를 사용하면 많은 도움이 된다.

## 전반적인 상황 모니터링 하기

vmstat를 사용하면 전반적으로 모니터링 할수있다.

vmstat보다 상세한 정보는 sar로 확인 가능

## 프로세스 상황 모니터링 하기

* pstree : 프로세스의 트리를 보여줌
* ps : 현재 프로세스의 스냅샷 정보를 보여준다.
* pidstat : 프로세스 별로 CPU 모니터링할수 있음
* pmap : 프로세스의 메모리 맵 상황 리포팅 도구

## I/O 상황 모니터링

디스크 모니터링

* df 
* du

I/O 모니터링

* iostat : 전반적인 IO 상황 모니터링
* lsof : 프로세스가 사용중인 IO 확인

# 참조
-----
* [Linux ip Command Examples](https://www.cyberciti.biz/faq/linux-ip-command-examples-usage-syntax/)
