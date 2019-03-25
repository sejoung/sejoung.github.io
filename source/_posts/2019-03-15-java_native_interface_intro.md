---
layout: post
title: "java native interface 소개"
date: 2019-03-15 10:10 +0900
comments: true
tags : ["jni"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## java native interface 소개
이 장에서는 Java Native Interface (JNI)에 대해 소개합니다 . 
JNI는 네이티브 프로그래밍 인터페이스입니다. 
Java Virtual Machine (VM) 내에서 실행되는 Java 코드가 C, C ++ 및 어셈블리와 같은 다른 프로그래밍 언어로 작성된 응용 프로그램 및 라이브러리와 상호 작용할 수 있습니다.

JNI의 가장 중요한 이점은 기본 Java VM의 구현에 제한을 두지 않는다는 것입니다. 
따라서 Java VM 벤더는 VM의 다른 부분에 영향을주지 않고 JNI에 대한 지원을 추가 할 수 있습니다. 
프로그래머는 네이티브 어플리케이션이나 라이브러리의 한 버전을 작성하여 JNI를 지원하는 모든 Java VM에서 작동 할 것으로 기대합니다.

이 장에서 다룰 내용은 다음과 같습니다.

* Java 네이티브 인터페이스 개요
* 역사적 배경
  * JDK 1.0 네이티브 메소드 인터페이스
  * 자바 런타임 인터페이스
  * 원시 기본 인터페이스 및 Java / COM 인터페이스
* 목표
* 자바 네이티브 인터페이스 접근법
* JNI 프로그래밍
* 변경 사항

### Java 네이티브 인터페이스 개요

Java로 응용 프로그램을 작성할 수는 있지만 Java 만으로는 응용 프로그램의 요구 사항을 충족시키지 못하는 경우가 있습니다.
프로그래머는 JNI를 사용하여 응용 프로그램을 Java 로 완전히 작성할 수없는 상황을 처리하기 위해 Java native methods 를 작성합니다.

다음 예제는 Java native methods를 사용해야하는 경우를 보여줍니다.

* 표준 Java 클래스 라이브러리는 응용 프로그램에 필요한 플랫폼 종속 기능을 지원하지 않습니다.
* 이미 다른 언어로 작성된 라이브러리가 있으며 JNI를 통해 Java 코드에 액세스 할 수 있도록하려고합니다.
어셈블리와 같이 하위 수준 언어로 시간 결정적 코드의 작은 부분을 구현하려고합니다.

JNI를 통해 프로그래밍함으로써 네이티브 메소드를 사용하여 다음을 수행 할 수 있습니다.

* Java 객체 (배열 및 문자열 포함) 생성, 검사 및 업데이트
* Java 메소드를 호출하십시오.
* catch 및 예외를 throw합니다.
* 클래스를 로드하고 클래스 정보를 얻습니다.
* 런타임 유형 검사를 수행하십시오

JNI를 Invocation API 와 함께 사용해 , 임의의 네이티브 어플리케이션으로 Java VM를 포함 할 수가 있습니다. 
이를 통해 프로그래머는 VM 소스 코드와 연결하지 않고도 기존 응용 프로그램을 Java 에서 쉽게 사용할 수 있습니다.

### 역사적 배경

다른 벤더의 VM은 다른 고유 메소드 인터페이스를 제공합니다. 
이러한 서로 다른 인터페이스는 프로그래머가 특정 플랫폼에서 여러 버전의 원시 메소드 라이브러리를 생성, 유지 및 배포하도록합니다.

다음과 같이 네이티브 메소드 인터페이스의 일부를 간단히 살펴 보겠습니다.

* JDK 1.0 네이티브 메소드 인터페이스
* 넷스케이프의 자바 런타임 인터페이스
* Microsoft의 원시 네이티브 인터페이스 및 Java / COM 인터페이스

#### JDK 1.0 네이티브 메소드 인터페이스

JDK 1.0은 기본 메소드 인터페이스와 함께 제공됩니다. 
불행히도이 인터페이스가 다른 Java VM에서 채택하기에 부적합한 두 가지 주요 이유가있었습니다.

첫째, 네이티브 코드는 C 객체의 멤버로서 Java 객체의 필드에 액세스했습니다. 
그러나 Java 언어 스펙 은 객체가 메모리에 배치되는 방법을 정의하지 않습니다. 
Java VM가 객체를 메모리에 다르게 배치하는 경우, 프로그래머는 원시 메소드 라이브러리를 다시 컴파일해야합니다.

둘째, JDK 1.0의 네이티브 메소드 인터페이스는 보수적 인 가비지 수집기에 의존합니다. 
unhand예를 들어 매크로를 제한없이 사용 하면 기본 스택을 보수적으로 검사해야했습니다.

#### 자바 런타임 인터페이스

Netscape는 Java 가상 머신에서 제공되는 서비스의 일반 인터페이스 인 Java Runtime Interface (JRI)를 제안했습니다. 
JRI는 이식성을 염두에두고 설계되었으므로 기본 Java VM의 구현 세부 사항에 대해 거의 가정하지 않습니다. 
JRI는 원시 메소드, 디버깅, 리플렉션, 임베딩 (호출) 등을 포함하여 광범위한 문제를 해결했습니다.

#### 원시 기본 인터페이스 및 Java / COM 인터페이스

Microsoft Java VM은 2 개의 원시 메소드 인터페이스를 지원합니다. 
낮은 수준에서는 효율적인 Raw 네이티브 인터페이스 (RNI)를 제공합니다. 
RNI는 JDK의 네이티브 메소드 인터페이스와 높은 수준의 소스 레벨 역 호환성을 제공합니다 (주요 차이점은 하나 있음). 
보수적 인 가비지 수집에 의존하는 대신 원시 코드는 RNI 함수를 사용하여 가비지 수집기와 명시 적으로 상호 작용해야합니다.

상위 레벨에서 Microsoft의 Java / COM 인터페이스는 Java VM에 대한 언어 독립적 인 표준 바이너리 인터페이스를 제공합니다. 
Java 코드는 마치 COM 객체를 Java 객체처럼 사용할 수 있습니다. 
Java 클래스는 COM 클래스로 나머지 시스템에 노출 될 수도 있습니다.

### 목표

우리는 획일적이고 잘 고안된 표준 인터페이스가 모든 사람에게 다음과 같은 이점을 제공한다고 믿습니다.

* 각 VM 공급 업체는 더 많은 양의 원시 코드를 지원할 수 있습니다.
* 툴 빌더는 다양한 종류의 네이티브 메소드 인터페이스를 유지할 필요가 없습니다.
* 응용 프로그램 프로그래머는 고유 코드의 한 버전을 작성할 수 있으며이 버전은 다른 VM에서 실행됩니다

표준 네이티브 메소드 인터페이스를 구현하는 가장 좋은 방법은 Java VM에 관심이있는 모든 관계자를 참여시키는 것입니다. 
따라서 우리는 자바 라이센스 사용자들간에 균일 한 네이티브 메소드 인터페이스 설계에 관한 일련의 토론을 진행했습니다. 
표준 네이티브 메서드 인터페이스가 다음 요구 사항을 충족해야한다는 것은 해당 토론에서 분명합니다.

* 바이너리 호환성 - 주된 목적은, 지정된 플랫폼상의 모든 Java VM 구현을 거쳐 네이티브 메소드 라이브러리의 바이너리 호환성입니다. 
프로그래머는 특정 플랫폼에 대해 고유 메소드 라이브러리의 버전을 하나만 유지해야합니다.

* 효율성 - 시간이 중요한 코드를 지원하기 위해 기본 메소드 인터페이스는 최소한의 오버 헤드를 부과해야합니다. 
VM 독립성 (및 바이너리 호환성)을 보장하기위한 모든 알려진 기술은 일정량의 오버 헤드를 전달합니다. 
우리는 어떻게 든 효율성과 VM 독립성간에 타협을해야합니다.

* 기능 - 인터페이스는 네이티브 메소드가 유용한 태스크를 완수 할 수 있도록 (듯이) 충분한 Java VM 내부를 공개 할 필요가 있습니다.

### 자바 네이티브 인터페이스 접근법

우리는 기존 인터페이스 중 하나를 표준 인터페이스로 채택하기를 원했습니다. 
이는 다른 VM에서 여러 인터페이스를 배워야하는 프로그래머에게 최소한의 부담을 주었기 때문입니다. 
불행히도 기존 솔루션은 우리의 목표를 달성하는 데 완전히 만족스럽지 않습니다.

넷스케이프의 JRI는 우리가 이식 가능한 네이티브 메소드 인터페이스로 상상했던 것과 가장 가깝고, 우리 설계의 출발점으로 사용되었다. 
JRI에 익숙한 독자는 API 명명 규칙, 메소드 및 필드 ID 사용, 로컬 및 글로벌 참조 사용 등에서 유사점을 알 수 있습니다. 
그러나 VM이 JRI와 JNI를 모두 지원할 수 있지만 최선의 노력에도 불구하고 JNI는 JRI와 이진 호환되지 않습니다.

Microsoft의 RNI는 JDK 1.0보다 향상된 기능입니다. 
RNI는 비 보존 형 가비지 컬렉터에서 작동하는 원시 메소드의 문제를 해결했기 때문입니다. 
그러나 RNI는 VM 독립적 인 원시 메소드 인터페이스로 적합하지 않았습니다. JDK와 마찬가지로 RNI 원시 메소드는 Java 객체를 C 구조체에 액세스하므로 두 가지 문제가 발생합니다.

* RNI는 내부 자바 객체의 레이아웃을 원시 코드에 노출 시켰습니다.
* C 객체로 Java 객체에 직접 액세스하면 고급 가비지 수집 알고리즘에 필요한 "write barriers"을 효율적으로 통합 할 수 없습니다.

바이너리 표준 인 COM은 여러 VM에서 완벽한 바이너리 호환성을 보장합니다. 
COM 메서드를 호출하려면 간접 호출 만 있으면되므로 오버 헤드가 거의 발생하지 않습니다. 
또한 COM 개체는 버전 관리 문제를 해결할 때 동적 연결 라이브러리에 비해 크게 개선되었습니다.

그러나 COM을 표준 Java 원시 메소드 인터페이스로 사용하는 것은 다음과 같은 몇 가지 요인에 의해 방해 받고 있습니다.

* 첫째, Java / COM 인터페이스에는 개인 필드에 액세스하고 일반적인 예외를 발생시키는 것과 같은 특정 기능이 부족합니다.

* 둘째, Java / COM 인터페이스는 Java 객체에 대한 표준 IUnknown 및 IDispatch COM 인터페이스를 자동으로 제공하므로 기본 코드가 공용 메소드 및 필드에 액세스 할 수 있습니다. 
아쉽게도 IDispatch 인터페이스는 오버로드 된 Java 메소드를 처리하지 않으며 메소드 이름을 일치시키는 경우 대소 문자를 구별하지 않습니다. 
또한 IDispatch 인터페이스를 통해 노출 된 모든 Java 메소드는 동적 유형 확인 및 강제 변환을 수행하기 위해 랩핑됩니다. 
이는 IDispatch 인터페이스가 약식 언어 (예 : 기본)를 염두에두고 설계 되었기 때문입니다.

* 셋째, 개별 저수준 함수를 다루는 대신 COM은 소프트웨어 구성 요소 (본격적인 응용 프로그램 포함)가 함께 작동 할 수 있도록 설계되었습니다. 
우리는 모든 Java 클래스 또는 하위 레벨 원시 메소드를 소프트웨어 구성 요소로 취급하는 것이 적절하지 않다고 생각합니다.

* 넷째, COM의 즉각적인 채택은 UNIX 플랫폼에 대한 지원 부족으로 인해 방해 받고 있습니다.

Java 객체는 COM 객체로 네이티브 코드에 노출되지 않지만 JNI 인터페이스 자체는 COM과 이진 호환됩니다. 
JNI는 COM과 같은 점프 테이블 구조와 호출 규칙을 사용합니다. 
즉, COM에 대한 크로스 플랫폼 지원이 제공되는 즉시 JNI는 Java VM에 대한 COM 인터페이스가 될 수 있습니다.

JNI는, 지정된 Java VM에 의해 서포트되는 유일한 네이티브 메소드 인터페이스라고는 믿을 수 없습니다. 
표준 인터페이스는 자신의 원시 코드 라이브러리를 다른 Java VM에 로드하려는 프로그래머에게 유용합니다. 
어떤 경우에는 프로그래머가 더 낮은 수준의 VM 특정 인터페이스를 사용하여 최고의 효율성을 달성해야 할 수도 있습니다. 
다른 경우, 프로그래머는 상위 레벨 인터페이스를 사용하여 소프트웨어 구성 요소를 빌드 할 수 있습니다. 
실제로 자바 환경과 컴포넌트 소프트웨어 기술이 더욱 성숙 해짐에 따라 네이티브 메소드는 점차 중요성을 잃을 것입니다.

### JNI 프로그래밍

네이티브 메소드 프로그래머는, JNI에 프로그램을 실시 할 필요가 있습니다. 
JNI 프로그래밍은 최종 사용자가 실행중인 공급 업체의 VM과 같은 알려지지 않은 곳에서 사용자를 보호합니다. 
JNI 표준을 준수하면 네이티브 라이브러리가 주어진 Java VM에서 실행할 수있는 최상의 기회를 제공하게됩니다.

Java VM을 구현하고있는 경우, JNI를 구현할 필요가 있습니다. 
JNI는 시간 테스트를 거쳤으며 오브젝트 표현, 가비지 콜렉션 스키마 등을 포함하여 VM 구현에 오버 헤드 나 제한을 가하지 않았습니다. 
간과 할 수있는 문제가 생기면 의견을 보내주십시오.

### 변경 사항

Java SE 6.0에서는, 비추천 구조의 JDK1_1InitArgs 및 JDK1_1AttachArgs가 삭제되었습니다. 대신에, JavaVMInitArgs 및 JavaVMAttachArgs가 사용됩니다.



# 참조
-----
* [java native interface intro](https://docs.oracle.com/javase/8/docs/technotes/guides/jni/spec/intro.html)

