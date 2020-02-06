---
layout: post
title: "자바트러블슈팅-메모리 진단하기(3)"
date: 2020-02-06 14:08 +0900
comments: true
tags : ["자바트러블슈팅","메모리 진단하기","메모리 문제"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 메모리 진단하기

### 잘라놓은 메모리 단면 분석하기

메모리 단면을 분석하는 도구

* MAT
* IBM Heap Analyzer

```
jmap -dump:format=b,file=holemem.hprof PID

```

위에 명령어로 덤프를 떠서 확인을 해볼수 있다

#### Leak Suspects Report

Leak Suspects Report 를 선택해서 확인해보면 간단하게 가장 많은 메모리를 점유하고 있는 객체가 어떤부분인지 알수있다.

Detail 화면으로 들어가면 아래의 설명들이 있다.

* Description : 해당 객체에 대한 설명
* Shortest Paths To the Accumulation Point : 메모리를 점유하고 있는 객체가 가장 상단에 있고, 그 객체를 생성하고 호출한 객체가 하단에 있는 트리형태의 목록
* Accumulated Objects : 메모리를 점유하고 있는 객체가 가장 하단에 있고, 그 객체를 생성하고 호출한 객체가 가장 상단에 있는 트리 형태의 목록
* Accumulated Objects by Class : 클래스별로 객체를 점유하는 대상 목록

#### OverView

* Actions

Histogram : jmap -histo 옵션을 적용했는때나오는 정보랑 같다.
Dominator Tree : 각 클래스별로 점유하고 있는 메모리의 양이 가장 많은 클래스부터 트리형태로 확인 할수 있다.
Top Consumers : 클래스, 패키지 등의 각종 그룹에 따라서 많은 메모리를 점유하고 있는 객체를 확인할수 있다.
Duplicate Classes : 여러 클래스 로더에서 중첩되게 로딩한 클래스에 대한 정보를 확인할수 있다.

* Reports
Leak Suspects : 메모리 릭으로 추정되는 부분을 분석
Top Components : 전체 힙 메모리 중에서 1% 이상 되는 모든 컴포넌트에 대한 정보를 제공



# 참조
-----
* [eclipse mat](https://www.eclipse.org/mat/)
* [ibm-heapanalyzer](https://www.ibm.com/support/pages/ibm-heapanalyzer)


