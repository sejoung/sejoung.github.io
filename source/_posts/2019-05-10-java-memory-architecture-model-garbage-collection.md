---
layout: post
title: "Java Memory Architecture Cheat Sheet"
date: 2019-05-10 11:27 +0900
comments: true
tags : ["java-memory-architecture-model-garbage-collection","Java Memory Architecture Cheat Sheet"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## Java Memory Architecture Cheat Sheet

java process memory가 있고 jvm memory 그리고 non-jvm memory(native livraries)

jvm memory 아래에 java heap 영역과 non-heap 영역

java heap 영역 아래 youn gen 과 old gen 

young gen 아래 eden 과 survivor0 과 survivor1

non-heap 영역 아래 thread stacks , metaspace, compressed class space, code cache, nio direct buffers, other jvm memmory

우리가 컨트롤 하는건은 java heap

아래 다이어그램은 JVM (Java Virtual Machine)에서 실행중인 Java 응용 프로그램의 PermGen과 Heap 용 Java 메모리 모델입니다. 
각 세대 유형에 대해 허용 된 메모리의 분포가 어떻게 이루어지는 지에 대한 정확한 이해를 돕기 위해 비율도 제공됩니다. 
모든 정보는 Java 1.7 (포함)까지 완벽하게 적용됩니다. 이 다이어그램은 메모리 모델의 'Managed Area'이라고도합니다.

위의 것 외에도 -Xss 옵션을 사용하여 구성 할 수있는 스택 영역이 있습니다. 
이 영역에는 힙, 원시 참조, pc 레지스터, 코드 캐시 및 모든 스레드에 대한 로컬 변수에 대한 참조가 들어 있습니다. 
이것은 메모리 모델의 '기본 영역'이라고도합니다.

### Java 메모리 모델의 관리 영역 (Java Memory Architecture)

#### [Young Generation/Nursery] Eden Space

모든 새로운 객체는 처음에 에덴 공간에서 생성됩니다. 
JVM에 의해 결정된 임의의 임계 값에 도달하자마자 마이너 가비지 콜렉션 (Minor GC)이 시작됩니다. 
먼저 참조되지 않은 모든 오브젝트를 제거하고 참조 된 오브젝트를 'eden'및 'from'에서 'to'로 이동합니다. 
생존자 공간. GC가 끝나면 '보낸 사람'및 '받는 사람'역할 (이름)이 서로 바뀝니다.

#### [Young Generation/Nursery] Survivor 1 (From)

이것은 생존자 공간의 일부입니다 (생존자 공간에서이 역할을 생각할 수 있습니다). 
이것은 이전 가비지 콜렉션 (GC) 동안 'to'역할이었습니다.

#### [Young Generation/Nursery] Suvrivor 2 (To)

이것은 생존자 공간의 일부이기도합니다 (생존자 공간에서도이 역할을 생각할 수 있습니다). 
GC에서 참조 된 모든 객체가 'from'및 'eden'에서로 이동됩니다.

#### [Old Generation] Tenured

나이별로 개체 (바이트 단위의 공간)를 보여주는 -XX : + PrintTenuringDistribution 을 사용하여 확인할 수있는 임계 값 한계에 따라 개체가 'Survivor'공간에서 'Tenured'공간으로 이동합니다. '나이'는 생존자 공간 내에서 이동 한 횟수입니다.

그 외에도 -XX : InitialTenuringThreshold, -XX : MaxTenuringThreshold 및 -XX : TargetSurvivorRatio 와 같은 중요한 플래그 가있어 생존자 공간뿐 아니라 종신 후원자 공간 을 최적으로 활용합니다.

-XX : InitialTenuringThreshold 및 -XX : MaxTenuringThreshold 를 설정 하여 -XX : + NeverTenure 및 -XX : 로 지정된대로 'Survivor (To)'의 사용률을 유지하면서 'Age'의 초기 값과 최대 값을 허용합니다 . 
+ AlwaysTenure 는 객체를 소유하지 않으려 고 (위험한) 사용하도록 장려했습니다. 반대 사용법은 항상 '구세대'를 사용한다는 의미 인 항상 재임 기간입니다.

여기에서 발생하는 가비지 수집은 주요 가비지 수집 (주요 GC)입니다. 일반적으로 힙이 가득 차거나 구세대가 가득 차게되면 트리거됩니다. 이것은 일반적으로 가비지 콜렉션을 수행하기 위해 인계하는 'Stop-the-World'이벤트 또는 스레드입니다. 
permgen 공간과 같은 다른 메모리 영역을 포함하는 GC (Full Garbage Collection)라는 또 다른 유형의 GC가 있습니다.

전체 힙과 관련된 기타 중요하고 흥미로운 플래그는 -XX : SurvivorRatio 및 -XX : NewRatio로 , 생존자 공간 비율 및 구 세대에서 새 세대 비율까지 에덴 공간을 지정합니다.

#### [Permanent Generation] Permgen space

'Permgen'은 상수 풀 (메모리 풀), 필드 및 메소드 데이터 및 코드와 같은 정보를 저장하는 데 사용됩니다. 
그들 각각은 그들의 이름과 같은 구체적인 특성과 관련이있다.

#### Java에서 메모리 누수의 일반적인 정의

더 이상 필요하지 않은 개체 참조가 불필요하게 유지 관리되면 메모리 누수가 발생합니다.

Java에서의 메모리 누수는 일부 객체가 더 이상 응용 프로그램에서 사용되지 않는 상황이지만 GC는 이들 객체를 사용하지 않는 것으로 인식하지 못합니다.

객체가 프로그램에서 더 이상 사용되지 않지만 도달 할 수없는 위치의 어딘가에서 참조되는 경우 메모리 누수가 나타납니다. 따라서 가비지 수집기는이를 삭제할 수 없습니다. 이 개체에 사용 된 메모리 공간이 해제되지 않고 프로그램에 사용 된 총 메모리가 증가합니다. 이로 인해 시간이 지남에 따라 성능이 저하되고 JVM의 메모리가 부족해질 수 있습니다.

어떤면에서, 기억 공간은 누락 된 공간에 메모리를 할당 할 수 없을 때 발생합니다.

메모리 누수의 가장 일반적인 원인 중 일부는 다음과 같습니다.

* ThreadLocal 변수
* 원형 및 복합 양방향 참조
* JNI 메모리 누수
* 변경할 수있는 정적 필드 (가장 일반적인)

JDK에 번들 된 Visual VM을 사용하여 메모리 누수 문제를 디버깅하는 것이 좋습니다.


#### 메모리 누수의 일반적인 디버깅

1. NetBeans 프로필러
1. jhat 유틸리티 사용
1. 힙 덤프 만들기
1. 실행중인 프로세스에서 힙 히스토그램 얻기
1. OutOfMemoryError에서 힙 히스토그램 얻기
1. 완성 대기중인 객체 수 모니터링
1. 타사 메모리 디버거

# 참조
-----
* [java-memory-architecture-model-garbage-collection](https://dzone.com/articles/java-memory-architecture-model-garbage-collection)
* [HotSpot JVM garbage collection options cheat sheet (v4)](http://blog.ragozin.info/2016/10/hotspot-jvm-garbage-collection-options.html)
* [visualvm](https://visualvm.github.io/)