---
layout: post
title: "자바트러블슈팅-메모리 진단하기(1)"
date: 2020-02-03 16:10 +0900
comments: true
tags : ["자바트러블슈팅","메모리 진단하기","메모리 문제"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 메모리 진단하기

### 메모리 때문에 발생할 수 있는 문제

OutOfMemoryError가 발생하는 경우

* 가비지 컬렉터가 새로운 객체를 생성할 공간을 더 이상 만들어주지 못하고, 더이상 힙 영역의 메모리가 증가될 수 없을때 

* 네이티브 라이브러리 코드에서 스왑 영역이 부족하여 더 이상 네이티브할당을 할수 없을때

두번째 경우는 순수 자바코드를 사용할 때 발생할 확률이 매우 적으며, JNI와 같은 네이티브 라이브러리를 호출하는 소스를 사용할 경우 발생할수 있다.

### OutOfMemoryError 메시지 의미

#### Exception in thread thread_name: java.lang.OutOfMemoryError: Java heap space

* 메모리 크기를 너무 적게 잡아 놓거나, 아에 메모리 크기를 지정하지 않은 경우
* 오래된 객체들이 계속 참조되고 있어서 GC가 되지 않는 경우
* finalize 메소드를 개발자가 개발한 클래스에 구현을 해놓은 경우
* 스레드 우선순위를 너무 높일 경우
* 큰 덩어리의 객체가 여러 개 있을 경우

#### Exception in thread thread_name: java.lang.OutOfMemoryError: Metaspace

* 너무 많은 자바 클래스가 해당 자바 프로세스에 로딩될 경우

#### Exception in thread thread_name: java.lang.OutOfMemoryError: Requested array size exceeds VM limit

* 배열의 크기가 힙 영역의 크기보다 더 크게 지정되었을 때 발생한다.

#### Exception in thread thread_name: java.lang.OutOfMemoryError: request size bytes for reason. Out of swap space?

* 네이티브 힙 영역이 부족할 때 발생하는 메시지다. OS 메모리의 부족한 상황일때가 나타난다 OS에 swap 메모리까지 부족한 경우다

#### Exception in thread thread_name: java.lang.OutOfMemoryError: reason stack_trace_with_native_method

* 네이티브 힙영역이 부족할때 나타나는 에러 이 경우는 메모리 할당 오류가 JNI나 네이티브 코드에서 발생

### 메모리 릭의 세 종류

* 수평적 메모리 릭
* 수직적 메모리 릭
* 대각선 형태의 메모리 릭

#### 수평적 메모리 릭

하나의 객체에서 많은 객체를 참조하는 경우(예를 들면 ArrayList와 같은 목록형태나 배열에서 객체를 계속 참조)

#### 수직적 메모리 릭

객체들이 링크로 연결되었을 경우(LinkedList를 사용할 경우)

#### 대각선 형태의 메모리 릭

일반적으로 객체들이 복합적으로 메모리를 점유하고 있는 경우가 여기에 속한다.

### OutOfMemoryError 이외의 메모리 문제

OutOfMemoryError 이외의 가장 큰 메모리 문제를 뽑으라고 하면 

* 크래시가 발생하는 경우
* 너무 잦은 Full GC

GC를 발생시키지 않으려면

* 임시 메모리의 사용을 최소화
* 객체의 재사용
* xml 처리 시 메모리를 많이 점유하는 DOM 보다 SAX를 사용
* 너무 많은 데이터를 한 번에 보여주는 비지니스 로직 제거
* 기타 프로파일링을 통하여 임시 메모리를 사용하는 부분 제거

GC 모니터링 방법

* 모니터링 도구
* verbosegc 옵션 사용
* jstat 사용


# 참조
-----
* [OutOfMemoryError Exception 의 이해](https://sejoung.github.io/2019/03/2019-03-20-Understand_the_OutOfMemoryError_Exception/)


