---
layout: post
title: "자바트러블슈팅-메모리 진단하기(2)"
date: 2020-02-04 16:25 +0900
comments: true
tags : ["자바트러블슈팅","메모리 진단하기","메모리 문제"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 메모리 진단하기

### 메모리 단면은 언제 자르나?

힙 덤프는 메모리가 부족해지는 현상이 지속해서 발생할 때와 OutOfMemoryError가 발생했을 때 생성해야 한다.
이러한 메모리 문제가 아닌 다른 상황에서는 메모리 단면을 잘라 놓을 필요가 없다는 말이다.

메모리가 부족해지는 현상을 확인하는 방법

* jstat로 확인
* WAS의 모니터링 콘솔이 있는 경우 콘솔의 메모리 사용량에서 확인
* Java Visual VM이나 JConsole 과 같은 JMX 기반 모니터링 도구로 확인
* scouter와 같은 APM이 설치되어 있으면 APM으로 확인
* verbosegc(java 8 이전) -xlog:gc(java 9 이후) 옵션으로 확인 

jstat 사용법

```
jstat -gcutil PID 1s

  S0     S1     E      O      M     CCS    YGC     YGCT    FGC    FGCT    CGC    CGCT     GCT   
  0.00   0.00  44.44  45.84  95.21  83.09      4    0.007     3    0.043     0    0.000    0.050
  0.00   0.00  44.44  45.84  95.21  83.09      4    0.007     3    0.043     0    0.000    0.050
  0.00   0.00  44.44  45.84  95.21  83.09      4    0.007     3    0.043     0    0.000    0.050
  0.00   0.00  44.44  45.84  95.21  83.09      4    0.007     3    0.043     0    0.000    0.050
  0.00   0.00  44.44  45.84  95.21  83.09      4    0.007     3    0.043     0    0.000    0.050
```

위와 같이 나오는데 여기서 확인 할것은 `O` 영역이 GC 이후에도 증가하는지만 확인 해봐야 한다.

tenured 영역(보통 OLD 영역이라고 부르는 영역)은 계속 증가하는것이 기본이다. 
Full GC가 발생한 뒤에도 메모리사용량이 증가해야만 메모리 릭이 발생하고 있다고 볼수 있다.

메모리 단면을 자를때 드는 비용

* 덤프 파일을 생성하는 동안 서비스가 불가능한 상황이 된다.
* 덤프 생성 시 너무 많은 시간이 소요된다.
* 큰 파일(메모리 크기만큼의 큰파일)이 생성된다
* 몇몇 JDK 버전(특히 JDK 5.0)에서 jmap과 같은 도구를 사용할 경우 한 번밖에 덤프 파일을 생성할수 없다.

메모리 단면을 생성하는 추천 방법

* jmap 명령어
* 리눅스의 gcore와 같이 OS에서 제공하는 코어 덤프 명령어(이 방법은 다른 방법을 사용할수 없을때 권장한다. 생성되는 파일에 크기가 자바덤프에 비해 훨씬 크다)

#### jmap으로 메모리 단면 생성하기

jmap은 jstat 처럼 pid만 알고 있으면 메모리 단면을 생성할수 있다.


````java

package com.github.sejoung.jts;

import java.util.HashMap;
import java.util.Map;

public class HoldMemory {

	private final static Map<String, String> leakMap = new HashMap<>();

	private final static String STORE_DATA = "STORE_DATA";

	public static void main(String[] args) {

		HoldMemory holdMemory = new HoldMemory();
		holdMemory.addObject(50000);

		try {
			System.out.println("Holding memory. it will be stopped after 10 min.");
			Thread.sleep(600000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

	}

	public void addObject(int objectCount) {

		int mapSize = leakMap.size();
		int maxCount = mapSize + objectCount;

		for (int loop = mapSize; loop < maxCount; loop++) {
			leakMap.put(STORE_DATA + loop, STORE_DATA);
		}

	}

}


````
위에 코드를 실행 시킨후에 아래 명령어를 실행 시키면 
```
jmap -finalizerinfo 38635
No instances waiting for finalization found
```

위 명령은 gc 대기중인 클래스 목록 확인하는 명령어다 대기중인 상태가 존재 하지 않는다.

```
 jmap -clstats 38635
Index Super InstBytes KlassBytes annotations   CpAll MethodCount Bytecodes MethodAll   ROAll   RWAll   Total ClassName
    1    -1   1999904        504           0       0           0         0         0      24     616     640 [B
    2    49   1715104        584           0    1392           7       149      1864    1152    3008    4160 java.util.HashMap$Node
    3    49   1364208        616         128   14224         109      4577     38504   18640   36136   54776 java.lang.String
    4    -1    577296        504           0       0           0         0         0      32     616     648 [Ljava.util.HashMap$Node;
    5    -1    536528        504           0       0           0         0         0      24     616     640 [I
    6    49    137104        672           0   22120         139      5682     36368   24616   36440   61056 java.lang.Class
    7    -1    100560        504           0       0           0         0         0      24     616     640 [Ljava.lang.Object;
    8    -1     50048        504           0       0           0         0         0      24     616     640 [C
    9    49     43328        592           0    1368           9       213      2360    1488    3168    4656 java.util.concurrent.ConcurrentHashMap$Node
   10     2     24800        584           0     512           1        10       624     304    1648    1952 java.util.LinkedHashMap$Entry
   11   762     18720       1024           0    7912          51      4065     27176   12672   24424   37096 java.util.HashMap
   12    -1     18000        504           0       0           0         0         0      32     616     648 [Ljava.util.concurrent.ConcurrentHashMap$Node;
   13    49     13872        576           0   11528          89      4308     26856   15088   25232   40320 java.lang.invoke.MemberName
              6837432     707784        6712 2612752       14922    689152   3776832 2724408 4766056 7490464 Total
                91.3%       9.4%        0.1%   34.9%           -      9.2%     50.4%   36.4%   63.6%  100.0%
Index Super InstBytes KlassBytes annotations   CpAll MethodCount Bytecodes MethodAll   ROAll   RWAll   Total ClassName
```

객체 타입별로 점유하고 있는 바이트 크기 등을 보여주며 마지막 줄에서는 전체 객체의 통계를 보여준다

```
jmap -histo 38635
 num     #instances         #bytes  class name (module)
-------------------------------------------------------
   1:         57382        1999904  [B (java.base@11.0.2)
   2:         53597        1715104  java.util.HashMap$Node (java.base@11.0.2)
   3:         56842        1364208  java.lang.String (java.base@11.0.2)
   4:           374         577296  [Ljava.util.HashMap$Node; (java.base@11.0.2)
   5:           241         536528  [I (java.base@11.0.2)
   6:          1125         137104  java.lang.Class (java.base@11.0.2)
   7:          1300         100560  [Ljava.lang.Object; (java.base@11.0.2)
   8:            11          50048  [C (java.base@11.0.2)
Total        180424        6837432

```

가장 많이 메모리를 점유한 객체부터 데이터를 출력한다.

#### jmap의 -dump 옵션 사용하기

```

jmap -dump:[live,]format=b,file=<filename>

```

메모리 단면은 스레드 단면처럼 지금 무슨일이 일어난지 별로 중요하지 않다 누가 얼마나 데이터를 더 잡아 먹고 있는지 확인하는것이 더 중요하다.
따라서 사용자의 접근을 막고 작업해도 무방하다.

가끔 몇몇 버전의 JDK에서는 두번 이상 jmap으로 덤프를 생성할수 없다 리눅스에서 이럴경우 gcore를 이용해 코어 덤프를 할용하면된다.

```
gcore -o holdmem.core 1975

```

#### 자동으로 힙 덤프 생성시키기

```
-XX:+HeapDumpOnOutOfMemoryError 
```

```
-XX:HeapDumpPath=경로
```

```
-XX:OnOutOfMemoryError=명령어
```

# 참조
-----


