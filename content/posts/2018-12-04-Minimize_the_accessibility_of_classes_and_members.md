---
layout: post
title: "아이템 15. 클래스와 맴버의 접근권한을 최소화 하라."
date: 2018-12-04 13:30 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 15. 클래스와 맴버의 접근권한을 최소화 하라.

잘 설계된 컨포넌트와 어설프게 설계된 컨포넌트에 차이점은 내구 구현 정보와 데이터를 얼마나 잘숨겼는지에 따른다.
이런것을 은닉화라고 한다.

정보 은닉의 장점

* 시스템 개발 속도를 높인다. 여러 컴포넌트를 병렬로 개발할 수 있기 때문이다.
* 시스템 관리 비용을 낮춘다. 컴포넌트를 더 빨리 파악하여 디버깅 할수 있고 다른 컴포넌트로 교체비용도 줄어든다.
* 정보 은닉이 성능을 높혀주지는 않지만 성능 최적화에 도움을 준다. 다른 컴포넌트에 영향을 주지 않고 해당 컴포넌트만 최적화 가능
* 소프트 웨어 재사용성을 높인다.
* 큰시스템을 제작하는 난이도를 낮춰준다.

기본원칙은 간단하다 모든 클래스와 맴버의 접근성을 가능한 한 좁혀야 한다.

public 클래스의 인스턴스 필드는 되도록 public이 아니여야 한다. public 가변필드를 갖는 클래스는 일반적으로 스레드 세이프 하지 않다.

클래스에서 public static final 배열필드를 두거나 이플드를 반환하는 접근자 메서드를 제공해서는 않된다
위에 방법에서는 보안 헛점이 존재한다. 그것은 클라이언트에서 배열 내용을 수정할수 있게 되어서 이다.

```java
package com.github.sejoung.codetest.accessiblility;

public class ArrayTest {

    public static final String [] VALUES = {"A","B","C"};

    public static void main(String[] args) {


        for (String v : VALUES){
            System.out.println(v);
        }

        ArrayTest.VALUES[1] = "T";


        for (String v : VALUES){
            System.out.println(v);
        }

    }
}

```
실행결과
```
A
B
C
A
T
C

Process finished with exit code 0
```

위에 방법처럼 final 이지만 값이 수정이 가능하다.

위에 단점을 보안하기 위한 코딩 방법이 2가지 있다.

첫번째 방법

```java
package com.github.sejoung.codetest.accessiblility;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class ArrayToList {
    private static final String[] VALUES = {"A", "B", "C"};
    public static final List<String> LISTVALUES = Collections.unmodifiableList(Arrays.asList(VALUES));

}

```

```java

package com.github.sejoung.codetest.accessiblility;

public class ArrayToListTest {

    public static void main(String[] args) {


        ArrayToList.LISTVALUES.add("asdasd");

    }
}


```
실행결과
```

Exception in thread "main" java.lang.UnsupportedOperationException
	at java.util.Collections$UnmodifiableCollection.add(Collections.java:1055)
	at com.github.sejoung.codetest.accessiblility.ArrayToListTest.main(ArrayToListTest.java:6)

Process finished with exit code 1

```
위에 코드로는 수정을 할수가 없다

두번째로 방어적 복사를 통한방법

```java

package com.github.sejoung.codetest.accessiblility;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class ArrayToClone {
    private static final String[] VALUES = {"A", "B", "C"};
    public static final String[] values(){
      return VALUES.clone();
    }
}


```

```java

package com.github.sejoung.codetest.accessiblility;

public class ArrayToCloneTest {
    public static void main(String[] args) {

        String[] test = ArrayToClone.values();
        for (String v : test) {
            System.out.println(v);
        }

        test[1] = "T";

        for (String v : test) {
            System.out.println(v);
        }


        for (String v : ArrayToClone.values()) {
            System.out.println(v);
        }


    }
}


```
실행결과
```

A
B
C
A
T
C
A
B
C

Process finished with exit code 0

```

방어적 복사 방법으로 변수에 담은 String[] 값은 수정되지만 다시 한번 values()메소드를 호출했을때는 해당값이 수정이 안되어 있다.

이거 말고도 자바 9부터 jigsaw가 추가 되여 모듈 방식대로 코딩을 할수있다. 해당 방법에 대한 포스팅을 8월달에 한것이 있으니 아래의 링크하겠다.


# 참조
-----
* [jigsaw_eclipse](https://sejoung.github.io/2018/08/jigsaw_eclipse)
* [jigsaw_coding_eclipse](https://sejoung.github.io/2018/08/jigsaw_coding_eclipse)
* [jigsaw_coding_intellij](https://sejoung.github.io/2018/08/jigsaw_coding_intellij)