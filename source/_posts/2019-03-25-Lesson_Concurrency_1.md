---
layout: post
title: "동시성(Concurrency) Processes and Threads"
date: 2019-03-25 10:20 +0900
comments: true
tags : ["동시성", "Concurrency", "Processes and Threads"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 동시성(Concurrency)

컴퓨터 사용자는 시스템이 한 번에 두 가지 이상을 할 수 있다는 것을 당연시합니다. 
다른 응용 프로그램이 파일을 다운로드하고 인쇄 대기열을 관리하며 오디오를 스트리밍하는 동안 계속해서 워드 프로세서에서 작업 할 수 있다고 가정합니다. 
단일 응용 프로그램조차도 한 번에 두 가지 이상을 수행 할 것으로 예상됩니다. 
예를 들어 스트리밍 오디오 응용 프로그램은 네트워크에서 디지털 오디오를 동시에 읽거나 압축을 풀거나 재생을 관리하고 디스플레이를 업데이트해야합니다. 
워드 프로세서조차도 텍스트를 다시 포맷하거나 디스플레이를 업데이트하는 것이 무엇이든간에 키보드 및 마우스 이벤트에 응답 할 준비가되어 있어야합니다. 
이러한 작업을 수행 할 수있는 소프트웨어를 동시(concurrent) 소프트웨어 라고 합니다.


Java 플랫폼은 Java 프로그래밍 언어 및 Java 클래스 라이브러리의 기본 동시성 지원과 함께 병행 프로그래밍을 지원할 수 있도록 설계되었습니다. 
버전 5.0 이후로 Java 플랫폼에는 고급 동시성 API도 포함되었습니다. 
이 학습에서는 플랫폼의 기본 동시성 지원을 소개하고 java.util.concurrent 패키지의 일부 고급 API를 요약 합니다.


### Processes and Threads

동시 프로그래밍에서 프로세스(Processes) 와 스레드(Threads) 라는 두 가지 기본 단위가 있습니다. 
Java 프로그래밍 언어에서 동시 프로그래밍은 주로 스레드와 관련이 있습니다. 
그러나 프로세스 또한 중요합니다.

컴퓨터 시스템에는 일반적으로 많은 활성 프로세스 및 스레드가 있습니다. 
이는 단일 실행 코어 만있는 시스템에서도 마찬가지이므로 주어진 순간에 하나의 스레드 만 실제로 실행됩니다. 
단일 코어의 처리 시간은 시간 분할이라는 OS 기능을 통해 프로세스와 스레드간에 공유됩니다.

컴퓨터 시스템이 다중 프로세서 또는 여러 실행 코어가있는 프로세서를 사용하는 것이 점점 더 보편화되고 있습니다. 
이것은 프로세스와 스레드의 동시 실행을위한 시스템 용량을 크게 향상시킵니다. 
그러나 다중 프로세서 나 실행 코어가없는 단순한 시스템에서도 동시성이 가능합니다.

#### Processes

프로세스에는 자체 포함 된 실행 환경이 있습니다. 
프로세스는 일반적으로 기본 런타임 리소스의 완전한 개인 집합을 가집니다. 
특히 각 프로세스는 자체 메모리 공간을 가지고 있습니다.

프로세스는 종종 프로그램이나 응용 프로그램과 동의어로 간주됩니다. 
그러나 사용자가 단일 응용 프로그램으로 보는 것은 실제로 협력 프로세스 집합 일 수 있습니다. 
프로세스 간의 통신을 원활하게하기 위해 대부분의 운영 체제 는 파이프 및 소켓과 같은 프로세스 간 통신 (IPC) 리소스를 지원 합니다. 
IPC는 동일한 시스템의 프로세스 간 통신뿐만 아니라 다른 시스템의 프로세스에도 사용됩니다.

Java 가상 머신의 대부분의 구현은 단일 프로세스로 실행됩니다. 
Java 응용 프로그램은 ProcessBuilder 객체를 사용하여 추가 프로세스를 만들 수 있습니다. 
다중 프로세스 응용 프로그램은이 단원에서 다루지 않습니다.

#### Threads

스레드는 가벼운 프로세스 라고도 합니다. 
프로세스와 스레드 모두 실행 환경을 제공하지만 새 스레드를 만들려면 새 프로세스를 만드는 것보다 적은 자원이 필요합니다.

* 스레드는 프로세스 내에 존재합니다 - 모든 프로세스에는 적어도 하나가 있습니다. 
스레드는 메모리 및 열린 파일을 포함하여 프로세스의 리소스를 공유합니다. 
이것은 효율적이지만 잠재적으로 문제가되는 커뮤니케이션을 만듭니다.

멀티 스레드 실행은 Java 플랫폼의 필수 기능입니다. 
메모리 관리 및 신호 처리와 같은 일을하는 "시스템"스레드를 계산하면 모든 응용 프로그램에 적어도 하나의 스레드가 있거나 여러 개가 있습니다. 
그러나 응용 프로그램 프로그래머의 관점에서 보자면 메인 스레드 라고하는 하나의 스레드로 시작해야 합니다. 
이 스레드는 다음 절에서 설명 할 것처럼 추가 스레드를 생성 할 수 있습니다.


# 참조
-----
* [concurrency](https://docs.oracle.com/javase/tutorial/essential/concurrency/index.html)
* [Processes and Threads](https://docs.oracle.com/javase/tutorial/essential/concurrency/procthread.html)
