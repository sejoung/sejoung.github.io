---
layout: post
title: "OutOfMemoryError Exception 의 이해"
date: 2019-03-20 12:03 +0900
comments: true
tags : ["OutOfMemoryError Exception","OOM","메모리누수"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## OutOfMemoryError Exception 의 이해

메모리 누수에 대한 한 가지 일반적인 표시는 java.lang.OutOfMemoryError 예외(Exception) 입니다.
일반적으로이 Java 힙 메모리에서 오브젝트를 할당하기에 불충분 한 공간이있을 때 발생합니다. 
이 경우 가비지 컬렉터는 새 오브젝트를 수용 할 수있는 공간(메모리)을 확보 할 수 없으므로 힙을 더 이상 확장 할 수 없습니다. 
또한 Java 클래스 로드를 지원하기에 충분한 원시 메모리가 없는 경우 이 오류가 발생할 수 있습니다. 
드물게, 가비지 콜렉션을 수행하는 데 과도한 시간이 소요되고 메모리가 조금 남은 상황이면 java.lang.OutOfMemoryError 가 발생합니다.

java.lang.OutOfMemoryError 예외가 발생되면 스택 추적도 인쇄됩니다.

java.lang.OutOfMemoryError 기본 할당을 충족 할 수없는 경우 예외가 네이티브 라이브러리 코드에 의해 발생 될 수있다
(예를 들어, 스왑 공간이 낮은 경우).

OutOfMemoryError 예외를 진단하는 초기 단계는 예외의 원인을 판별하는 것입니다. 
Java 힙이 가득 차거나 기본 힙이 가득 차서 폐기 되었습니까? 
원인을 찾을 수 있도록 예외 텍스트에는 다음 예외와 같이 끝에 세부 메시지가 포함됩니다.

### Exception in thread thread_name: java.lang.OutOfMemoryError: Java heap space

* 원인 : 상세 메시지 Java 힙 공간 은 Java 힙에서 오브젝트를 할당 할 수 없음을 나타냅니다. 
이 오류는 반드시 메모리 누수를 의미하지는 않습니다. 
문제는 구성 문제와 같이 간단 할 수 있습니다. 
구성 문제는 지정된 힙 크기 (또는 지정되지 않은 경우 기본 크기)가 응용 프로그램에 충분하지 않은 경우에 발생합니다.
다른 경우, 특히 수명이 긴 응용 프로그램의 경우 메시지가 응용 프로그램이 의도하지 않게 개체에 대한 참조를 보유한다는 표시 일 수 있으며 이로 인해 개체가 가비지 수집되지 않습니다. 
이것은 메모리 누출과 동일한 상황 입니다. 
참고 : 응용 프로그램에서 호출 한 API가 의도하지 않게 개체 참조를 보유 할 수도 있습니다.

이 오류의 잠재적인 원인 중 하나는 finalizer를 과도하게 사용하는 응용 프로그램에서 발생합니다. 
클래스에 finalize 메소드 가있는 경우 해당 유형의 객체는 가비지 수집 시간에 공간을 확보하지 못합니다. 
대신, 가비지 콜렉션 후에는 오브젝트가 나중에 완료 될 때까지 대기열에 넣어집니다. 
Oracle Sun 구현에서 finalizer는 finalization queue를 제공하는 데몬 스레드에 의해 실행됩니다. 
finalizer thread 가 finalization queue를 따라갈 수 없다면 자바 힙이 채워질 수 있고 이 유형의 OutOfMemoryError 예외가 발생합니다. 
이 상황을 일으킬 수있는 한 가지 시나리오는 응용 프로그램이 finalizer thread가 finalizer queue를 처리하는 속도보다 
빠른 속도로 증가시키는 높은 우선 순위의 스레드를 만드는 경우입니다.

* 조치 : 보류중인 오브젝트를 모니터하는 방법에 대한 자세한 정보는 객체 보류 중 Finalization 모니터링 를 참조하십시오 .

#### 객체 보류 중 Finalization 모니터링

"Java heap space"세부 메시지와 함께 OutOfMemoryError 예외가 발생하면 원인은 finalizer를 과도하게 사용할 수 있습니다. 
이를 진단하기 위해 최종 결정을 보류중인 객체 수를 모니터링하는 몇 가지 옵션이 있습니다.

JConsole의의 관리 도구 완성을 보류하는 객체의 수를 모니터링하는 데 사용할 수 있습니다. 
이 도구는 요약 탭 창의 메모리 통계에 보류중인 종료 수를보고합니다. 
개수는 대략적인 값이지만 응용 프로그램의 특성을 결정하고 최종 설정에 많은 영향을 주는지 이해하는 데 사용할 수 있습니다.

Oracle Solaris 및 Linux 운영 체제에서는 jmap유틸리티를 사용하여 -finalizerinfo 마무리 대기중인 객체에 대한 정보를 인쇄 하는 옵션을 사용할 수 있습니다.

응용 프로그램은 java.lang.management.MemoryMXBean 클래스 의 getObjectPendingFinalizationCount 메소드를 사용하여 종료가 보류중인 객체의 대략적인 수를보고 할 수 있습니다. 
API 설명서 및 예제 코드에 대한 링크는 Custom Diagnostic Tools 에서 찾을 수 있습니다.
예제 코드는 보류중인 종료 카운트의 보고를 포함하도록 쉽게 확장 될 수 있습니다.

### Exception in thread thread_name: java.lang.OutOfMemoryError: GC Overhead limit exceeded

* 원인 : "GC 오버 헤드 한계를 초과했습니다"라는 세부 메시지는 가비지 수집기가 항상 실행 중이고 Java 프로그램이 매우 느리게 진행 중임을 나타냅니다.
가비지 콜렉션 후에 Java 프로세스가 가비지 콜렉션을 수행하는 데 걸리는 시간의 약 98 % 이상을 소비하고 있고 힙의 2 % 미만을 복구 중이며 지금까지 수행 한 적이있는 경우 
마지막 5 (컴파일 타임 상수) 연속 가비지 컬렉션이 있으면 java.lang.OutOfMemoryError 가 throw 됩니다. 
이 예외는 일반적으로 라이브 데이터의 양이 새 할당을 위한 여유 공간이 거의없는 Java 힙에 거의 들어 가지 않기 때문에 발생합니다.

* 조치 : 힙 크기를 늘리십시오. java.lang.OutOfMemoryError 대한 예외 초과 오버 헤드 GC 제한 명령 행 플래그(-XX:-UseGCOverheadLimit)로 해제 될 수있다.

### Exception in thread thread_name: java.lang.OutOfMemoryError: Requested array size exceeds VM limit

* 원인 : "요청 된 배열 크기가 VM 제한을 초과합니다"라는 세부 메시지는 응용 프로그램 (또는 해당 응용 프로그램에서 사용하는 API)이 힙 크기보다 큰 배열을 할당하려고 시도했음을 나타냅니다. 
예를 들어, 응용 프로그램이 512MB의 배열을 할당하려하지만 최대 힙 크기가 256MB 인 OutOfMemoryError 경우 Requested array size가 VM limit 를 초과하는 이유와 함께 throw됩니다.

* 조치 : 보통 문제가 구성 문제 (너무 작은 힙 사이즈), 또는 예를 들어 배열의 요소 수는 알고리즘을 사용하여 계산되면 
그 계산 (큰 배열을 만들려고 애플리케이션 결과 버그 중입니다 잘못된 크기).

### Exception in thread thread_name: java.lang.OutOfMemoryError: Metaspace

* 원인 : Java 클래스 메타 데이터 (Java 클래스의 가상 컴퓨터 내부 표현)는 원시 메모리 (여기서는 메타 공간이라고 함)에 할당됩니다. 
클래스 메타 데이터에 대한 메타 공간이 모두 소모되면 java.lang.OutOfMemoryError 세부 사항 MetaSpace이 있는 예외 가 발생합니다. 
클래스 메타 데이터에 사용할 수있는 메타 공간의 양은 MaxMetaSpaceSize 명령 행에 지정된 매개 변수에 의해 제한됩니다. 
클래스 메타 데이터에 필요한 원시 메모리 양이 초과 MaxMetaSpaceSize 되면 java.lang.OutOfMemoryError 세부 사항 MetaSpace이 있는 예외 가 발생합니다.

* 조치 : MaxMetaSpaceSize 명령 행에서를 설정 한 경우, 값을 늘리십시오. MetaSpace Java 힙과 동일한 주소 공간에서 할당됩니다. 
Java 힙의 크기를 줄이면 MetaSpace 가 더 많은 공간을 확보 할 수 있습니다. 
Java 힙에 여유 공간이 초과되는 경우에만 올바른 트레이드 오프입니다. 
스왑 공간 부족 상세 메시지에 대한 다음 작업을 참조하십시오 .

### Exception in thread thread_name: java.lang.OutOfMemoryError: request size bytes for reason. Out of swap space?

* 원인 : 세부 메시지 "이유 크기의 바이트를 요청하십시오 . 스왑 공간이 부족합니까?" 예외 인 것으로 보인다 . 
그러나, Java HotSpot VM 코드는 네이티브 힙으로부터의 할당이 실패 해 네이티브 힙이 고갈 될 가능성이있는 경우,이 명백한 예외를보고합니다. 
이 메시지는 실패한 요청의 크기 (바이트)와 메모리 요청의 이유를 나타냅니다. 
대개의 경우 그 이유는 할당 실패를보고하는 소스 모듈의 이름입니다.

* 조치 : 이 에러 메세지가 슬로우되면 (자), VM는 치명적인 에러 처리기구를 호출합니다 
(즉, 크래쉬시의 thread, 프로세스, 및 시스템에 관한 유용한 정보를 포함한 치명적인 에러 로그 파일을 생성합니다). 
원시 힙 고갈의 경우 로그의 힙 메모리 및 메모리 맵 정보가 유용 할 수 있습니다. 
치명적인 오류 로그 파일 이해에 대한 자세한 내용은 아래의 A Fatal Error Log 링크를 참조하십시오.
이러한 유형의 OutOfMemoryError 예외가 발생하면 운영 체제에서 문제 해결 유틸리티를 사용해야 문제를 더 진단 할 수 있습니다. 
다양한 운영 체제에서 사용 가능한 도구에 대한 자세한 내용은 아래의 Native Operating System Tools 링크를 참조하십시오.

### Exception in thread thread_name: java.lang.OutOfMemoryError: Compressed class space

* 원인 : 64 비트 플랫폼에서 클래스 메타 데이터에 대한 포인터는 32 비트 오프셋 (with UseCompressedOops) 로 나타낼 수 있습니다. 
이것은 명령 행 플래그로 제어됩니다 UseCompressedClassPointers(기본값은 on입니다)를 사용하면 
UseCompressedClassPointers 클래스 메타 데이터에 사용할 수있는 공간의 양(CompressedClassSpaceSize)이 고정됩니다. 
UseCompressedClassPointers 클래스 CompressedClassSpaceSize를 초과 공간이 필요한 경우java.lang.OutOfMemoryError : Compressed class space 이 발생합니다.

* 작업 : UseCompressedClassPointers 해제하려면 CompressedClassSpaceSize 늘리십시오 
  * 참고 : 의 허용되는 크기에 한계가 있습니다 CompressedClassSpaceSize. 예를 들어 -XX: CompressedClassSpaceSize=4g 허용되는 범위를 초과하면 다음과 같은 메시지가 표시됩니다.
CompressedClassSpaceSize of 4294967296 is invalid; must be between 1048576 and 3221225472.

### Exception in thread thread_name: java.lang.OutOfMemoryError: reason stack_trace_with_native_method

* 원인 : 오류 메시지의 세부 정보 부분이 " reason stack_trace_with_native_method "이고 최상위 프레임이 기본 메서드 인 스택 추적이 인쇄되면 네이티브 메서드에서 할당 오류가 발생했음을 나타냅니다. 
이 메시지와 이전 메시지의 차이점은 JVM 코드가 아니라 Java Native Interface (JNI) 또는 원시 메소드에서 할당 실패가 감지되었다는 것입니다.

* 조치 :  이 유형의 OutOfMemoryError예외가 발생하면  Native Operating System Tools를 사용하여 문제점을 추가로 진단해야합니다. 
다양한 운영 체제에서 사용 가능한 도구에 대한 자세한 내용은 아래의 Native Operating System Tools 링크를 참조하십시오.

# 참조
-----
* [Understand the OutOfMemoryError Exception](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/memleaks002.html)
* [아이템 8. Finalizer와 Cleaner의 사용은 피하라](https://sejoung.github.io/2018/11/2018-11-21-Avoid_finalizers_and_cleaners/)
* [Custom Diagnostic Tools](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr021.html#BABEDEBD)
* [A Fatal Error Log](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/felog.html#fatal_error_log_vm)
* [Native Operating System Tools](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr020.html#BABBHHIE)
