---
layout: post
title: "아이템 46. 스트림에서는 부작용 없는 함수를 사용하라"
date: 2019-02-08 11:23 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 46. 스트림에서는 부작용 없는 함수를 사용하라. 

스트림 패러다임의 핵심은 계산을 일련의 변환으로 재구성하는 부분이다. 이때 각 단계는 가능한 한 이전 단계의 결과를 받아 처리 하는 순수 함수여야 한다.
순수 함수란 입력만이 결과에 영향을 주는 함수이다.

그래서 side effect가 없어야 된다.

아래 코드를 보자

```java

package com.github.sejoung.codetest.stream;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.stream.Stream;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.*;


// 빈도표 초기화에 스트림을 적절하지 못하게 혹은 적절하게 사용하는 예 (277-279쪽)
public class Freq {
    public static void main(String[] args) throws FileNotFoundException {
        File file = new File("src/main/resources/words.txt");

        // 코드 46-1 스트림 패러다임을 이해하지 못한 채 API만 사용했다 - 따라 하지 말 것! (277쪽)
        Map<String, Long> freq = new HashMap<>();
        try (Stream<String> words = new Scanner(file).tokens()) {
            words.forEach(word -> {
                freq.merge(word.toLowerCase(), 1L, Long::sum);
            });
        }

        System.out.println(freq);
    }
}


```
실행결과
```

{상태에서=1, exception=1, 스프링이=1, cglib=1, aop=1, 고민을=1, 방식으로=1, 지원=2, 소스를=1, 단위=1, 강제로=1, 예제=1, 만들면=1, 처리=1, dao에는=1, egovframe의=1, 되는지도=1, 수=2, 생성방법=1, cglib의=2, 필요한시점에=1, 프록시객체=1, service와=1, 얻는=1, 성능측정=1, 부분이며,=1, 이용을=1, proxy=1, 현재=1, 어노테이션의=1, jdk의=1, 안된다고=1, 같다.=2, 문서에서=1, 나도=2, :=1, 관련=1, 되는것=1, 좋다고=1, 반드시=1, 인터페이스가=1, 상황이=1, enhancer=2, 보니=1, 것이=2, 어느=1, 보장할수=1, proxy만을=1, 이유로는=1, 대한=2, 알=1, 때=2, 책과=1, 있다.=1, 컴포넌트로서=1, 먼저=1, proxy를=1, 지인중=1, 왜=1, 속성=1, 통한=1, proxy-target-class="true"=1, 설명이=1, 내용=1, 했었던것=1, 아무=1, 시점에=1, 되는=1, “interface를=1, 없음므로)=1, jdk=1, 그로=1, 인터페이스에=1, 설명할=1, 클래스를=2, 이득을=1, 생각없이=1, 처리가=1, proxy는=1, 두번째=1, 답변=1, 의견이고=1, transaction=1, 거부감은=1, 첫번째는=1, 한번쯤=1, 도입하는=1, 좋을것=2, 보듯이=1, 경우=1, 만들다보니=1, 포스팅에도=1, 사람도=1, 처리,=1, 한명은=1, spring=1, 태그에=1, 등의=1, 이것은=1, 부분에=2, 지정되기=1, 적절한가?=1, 더이상=1, 모르는=1, 사이트=1, 자바지기님의=3, 정확히=1, proxy-target-class=”true”=1, 있을=1, 경계가=1, 두가지=1, 생성하는=1, 해보는=1, 이용=2, 것도=1, 내=1, 프로젝트에서=1, 필요한=1, 만들어서=2, 생기다=1, 것에=1, type의=1, interface는=1, 스스로가=1, 지식을=1, 기능을=1, 생성한다는=1, 쓰는것이=1, 위의=1, 전파할=1, 생각한다.=1, 만드는=3, 있고,=1, 이유를=1, 만들어야=1, aop:config=1, 그래서=1, interface를=4, <aop:aspectj-autoproxy=1, 사용하는=1, 발생한=1, 이런=1, 인해=1, 글에서=1, 대부분의=2, 나와있듯이=1, 방법은=1, 이유는=1, 때문(?)=1, 것”=1, 등장하면서=1, />=1, 생성후에(확장이=1, 추가=1, service=2, 안됨=1, 그=1, 주로=1, 사용해서=1, aop는=1, 같다=1, 다음=1}

Process finished with exit code 0


```

위에 코드를 보면 무엇이 문제인지 보이는가?

위에 코드는 람다의 이점을 살리지 못하고 같은 반복적 코드보다 코딩량이 길어졌다고 하는데 음 모르겠다. 일단 반복적인 코드르 짠것을 보면

```java

package com.github.sejoung.codetest.stream;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.*;


// 빈도표 초기화에 스트림을 적절하지 못하게 혹은 적절하게 사용하는 예 (277-279쪽)
public class Freq {
    public static void main(String[] args) throws FileNotFoundException {
        File file = new File("src/main/resources/words.txt");


        Map<String, Long> freq = new HashMap<>();
        // 반복적인 코드
        try (Stream<String> words = new Scanner(file).tokens()) {
            List<String> wordsList = words.collect(toList());
            for(String word : wordsList){
                freq.merge(word.toLowerCase(), 1L, Long::sum);
            }
        }

        System.out.println(freq);
    }
}


```
실행결과
```

{상태에서=1, exception=1, 스프링이=1, cglib=1, aop=1, 고민을=1, 방식으로=1, 지원=2, 소스를=1, 단위=1, 강제로=1, 예제=1, 만들면=1, 처리=1, dao에는=1, egovframe의=1, 되는지도=1, 수=2, 생성방법=1, cglib의=2, 필요한시점에=1, 프록시객체=1, service와=1, 얻는=1, 성능측정=1, 부분이며,=1, 이용을=1, proxy=1, 현재=1, 어노테이션의=1, jdk의=1, 안된다고=1, 같다.=2, 문서에서=1, 나도=2, :=1, 관련=1, 되는것=1, 좋다고=1, 반드시=1, 인터페이스가=1, 상황이=1, enhancer=2, 보니=1, 것이=2, 어느=1, 보장할수=1, proxy만을=1, 이유로는=1, 대한=2, 알=1, 때=2, 책과=1, 있다.=1, 컴포넌트로서=1, 먼저=1, proxy를=1, 지인중=1, 왜=1, 속성=1, 통한=1, proxy-target-class="true"=1, 설명이=1, 내용=1, 했었던것=1, 아무=1, 시점에=1, 되는=1, “interface를=1, 없음므로)=1, jdk=1, 그로=1, 인터페이스에=1, 설명할=1, 클래스를=2, 이득을=1, 생각없이=1, 처리가=1, proxy는=1, 두번째=1, 답변=1, 의견이고=1, transaction=1, 거부감은=1, 첫번째는=1, 한번쯤=1, 도입하는=1, 좋을것=2, 보듯이=1, 경우=1, 만들다보니=1, 포스팅에도=1, 사람도=1, 처리,=1, 한명은=1, spring=1, 태그에=1, 등의=1, 이것은=1, 부분에=2, 지정되기=1, 적절한가?=1, 더이상=1, 모르는=1, 사이트=1, 자바지기님의=3, 정확히=1, proxy-target-class=”true”=1, 있을=1, 경계가=1, 두가지=1, 생성하는=1, 해보는=1, 이용=2, 것도=1, 내=1, 프로젝트에서=1, 필요한=1, 만들어서=2, 생기다=1, 것에=1, type의=1, interface는=1, 스스로가=1, 지식을=1, 기능을=1, 생성한다는=1, 쓰는것이=1, 위의=1, 전파할=1, 생각한다.=1, 만드는=3, 있고,=1, 이유를=1, 만들어야=1, aop:config=1, 그래서=1, interface를=4, <aop:aspectj-autoproxy=1, 사용하는=1, 발생한=1, 이런=1, 인해=1, 글에서=1, 대부분의=2, 나와있듯이=1, 방법은=1, 이유는=1, 때문(?)=1, 것”=1, 등장하면서=1, />=1, 생성후에(확장이=1, 추가=1, service=2, 안됨=1, 그=1, 주로=1, 사용해서=1, aop는=1, 같다=1, 다음=1}

Process finished with exit code 0


```

위에 코드를 반복문 스타일로 만들어 보았는데 토큰라이징을 위에 코드 보다 짧게 할수있는지 모르겠다.

일단 동의 하는 부분은 반복문 스타일로 스트림 코드를 만들었다는거다.

그럼 좀더 좋게 변화 시키면

```java

package com.github.sejoung.codetest.stream;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Map;
import java.util.Scanner;
import java.util.stream.Stream;

import static java.util.stream.Collectors.counting;
import static java.util.stream.Collectors.groupingBy;


// 빈도표 초기화에 스트림을 적절하지 못하게 혹은 적절하게 사용하는 예 (277-279쪽)
public class Freq {
    public static void main(String[] args) throws FileNotFoundException {
        File file = new File("src/main/resources/words.txt");

        // 코드 46-2 스트림을 제대로 활용해 빈도표를 초기화한다. (278쪽)
        Map<String, Long> freq;
        try (Stream<String> words = new Scanner(file).tokens()) {
            freq = words
                    .collect(groupingBy(String::toLowerCase, counting()));
        }

        System.out.println(freq);

    }
}

```
실행결과
```

{상태에서=1, exception=1, 스프링이=1, cglib=1, aop=1, 고민을=1, 방식으로=1, 지원=2, 소스를=1, 단위=1, 강제로=1, 예제=1, 만들면=1, 처리=1, dao에는=1, egovframe의=1, 되는지도=1, 수=2, 생성방법=1, cglib의=2, 필요한시점에=1, 프록시객체=1, service와=1, 얻는=1, 성능측정=1, 부분이며,=1, 이용을=1, proxy=1, 현재=1, 어노테이션의=1, jdk의=1, 안된다고=1, 같다.=2, 문서에서=1, 나도=2, :=1, 관련=1, 되는것=1, 좋다고=1, 반드시=1, 인터페이스가=1, 상황이=1, enhancer=2, 보니=1, 것이=2, 어느=1, 보장할수=1, proxy만을=1, 이유로는=1, 대한=2, 알=1, 때=2, 책과=1, 있다.=1, 컴포넌트로서=1, 먼저=1, proxy를=1, 지인중=1, 왜=1, 속성=1, 통한=1, proxy-target-class="true"=1, 설명이=1, 내용=1, 했었던것=1, 아무=1, 시점에=1, 되는=1, “interface를=1, 없음므로)=1, jdk=1, 그로=1, 인터페이스에=1, 설명할=1, 클래스를=2, 이득을=1, 생각없이=1, 처리가=1, proxy는=1, 두번째=1, 답변=1, 의견이고=1, transaction=1, 거부감은=1, 첫번째는=1, 한번쯤=1, 도입하는=1, 좋을것=2, 보듯이=1, 경우=1, 만들다보니=1, 포스팅에도=1, 사람도=1, 처리,=1, 한명은=1, spring=1, 태그에=1, 등의=1, 이것은=1, 부분에=2, 지정되기=1, 적절한가?=1, 더이상=1, 모르는=1, 사이트=1, 자바지기님의=3, 정확히=1, proxy-target-class=”true”=1, 있을=1, 경계가=1, 두가지=1, 생성하는=1, 해보는=1, 이용=2, 것도=1, 내=1, 프로젝트에서=1, 필요한=1, 만들어서=2, 생기다=1, 것에=1, type의=1, interface는=1, 스스로가=1, 지식을=1, 기능을=1, 생성한다는=1, 쓰는것이=1, 위의=1, 전파할=1, 생각한다.=1, 만드는=3, 있고,=1, 이유를=1, 만들어야=1, aop:config=1, 그래서=1, interface를=4, <aop:aspectj-autoproxy=1, 사용하는=1, 발생한=1, 이런=1, 인해=1, 글에서=1, 대부분의=2, 나와있듯이=1, 방법은=1, 이유는=1, 때문(?)=1, 것”=1, 등장하면서=1, />=1, 생성후에(확장이=1, 추가=1, service=2, 안됨=1, 그=1, 주로=1, 사용해서=1, aop는=1, 같다=1, 다음=1}

Process finished with exit code 0


```
위에 처럼 바꿀수 있다 더 스트림 스럼다

forEach 연산은 종단 연산 중 기능이 가장 적고 덜 스트림답다. 그리고 대놓고 반복이라 병렬화도 할수없다. forEach연산은 스트림 계산 결과를 보고할 때만 사용하고 계산하는데는 쓰지 말자


빈도표에서 가장 흔한 단어 10개를 뽑아내는 파이프라인을 만들어 보면

```java

package com.github.sejoung.codetest.stream;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.stream.Stream;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.*;


// 빈도표 초기화에 스트림을 적절하지 못하게 혹은 적절하게 사용하는 예 (277-279쪽)
public class Freq {
    public static void main(String[] args) throws FileNotFoundException {
        File file = new File("src/main/resources/words.txt");

       // 코드 46-2 스트림을 제대로 활용해 빈도표를 초기화한다. (278쪽)
        Map<String, Long> freq;
        try (Stream<String> words = new Scanner(file).tokens()) {
            freq = words
                    .collect(groupingBy(String::toLowerCase, counting()));
        }

        System.out.println(freq);
        // 코드 46-3 빈도표에서 가장 흔한 단어 10개를 뽑아내는 파이프라인 (279쪽)
        List<String> topTen = freq.keySet().stream()
                .sorted(comparing(freq::get).reversed())
                .limit(10)
                .collect(toList());

        System.out.println(topTen);
    }
}


```
실행결과
```

{상태에서=1, exception=1, 스프링이=1, cglib=1, aop=1, 고민을=1, 방식으로=1, 지원=2, 소스를=1, 단위=1, 강제로=1, 예제=1, 만들면=1, 처리=1, dao에는=1, egovframe의=1, 되는지도=1, 수=2, 생성방법=1, cglib의=2, 필요한시점에=1, 프록시객체=1, service와=1, 얻는=1, 성능측정=1, 부분이며,=1, 이용을=1, proxy=1, 현재=1, 어노테이션의=1, jdk의=1, 안된다고=1, 같다.=2, 문서에서=1, 나도=2, :=1, 관련=1, 되는것=1, 좋다고=1, 반드시=1, 인터페이스가=1, 상황이=1, enhancer=2, 보니=1, 것이=2, 어느=1, 보장할수=1, proxy만을=1, 이유로는=1, 대한=2, 알=1, 때=2, 책과=1, 있다.=1, 컴포넌트로서=1, 먼저=1, proxy를=1, 지인중=1, 왜=1, 속성=1, 통한=1, proxy-target-class="true"=1, 설명이=1, 내용=1, 했었던것=1, 아무=1, 시점에=1, 되는=1, “interface를=1, 없음므로)=1, jdk=1, 그로=1, 인터페이스에=1, 설명할=1, 클래스를=2, 이득을=1, 생각없이=1, 처리가=1, proxy는=1, 두번째=1, 답변=1, 의견이고=1, transaction=1, 거부감은=1, 첫번째는=1, 한번쯤=1, 도입하는=1, 좋을것=2, 보듯이=1, 경우=1, 만들다보니=1, 포스팅에도=1, 사람도=1, 처리,=1, 한명은=1, spring=1, 태그에=1, 등의=1, 이것은=1, 부분에=2, 지정되기=1, 적절한가?=1, 더이상=1, 모르는=1, 사이트=1, 자바지기님의=3, 정확히=1, proxy-target-class=”true”=1, 있을=1, 경계가=1, 두가지=1, 생성하는=1, 해보는=1, 이용=2, 것도=1, 내=1, 프로젝트에서=1, 필요한=1, 만들어서=2, 생기다=1, 것에=1, type의=1, interface는=1, 스스로가=1, 지식을=1, 기능을=1, 생성한다는=1, 쓰는것이=1, 위의=1, 전파할=1, 생각한다.=1, 만드는=3, 있고,=1, 이유를=1, 만들어야=1, aop:config=1, 그래서=1, interface를=4, <aop:aspectj-autoproxy=1, 사용하는=1, 발생한=1, 이런=1, 인해=1, 글에서=1, 대부분의=2, 나와있듯이=1, 방법은=1, 이유는=1, 때문(?)=1, 것”=1, 등장하면서=1, />=1, 생성후에(확장이=1, 추가=1, service=2, 안됨=1, 그=1, 주로=1, 사용해서=1, aop는=1, 같다=1, 다음=1}
[interface를, 자바지기님의, 만드는, 지원, 수, cglib의, 같다., 나도, enhancer, 것이]

Process finished with exit code 0

```

위에 코드도 java.util.stream.Collectors 클래스를 사용하는데 스트림을 사용할때 꼭알아야 되는 클래스이다. 

jdk 11 기준으로 메소드도 53개나 되고 있다. 위에 클래스를 잘활용하여 스트림 API를 잘 활용하자.




# 참조
-----






