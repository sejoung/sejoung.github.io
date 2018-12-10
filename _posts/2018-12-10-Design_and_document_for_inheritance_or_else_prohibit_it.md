---
layout: post
title: "Design and document for inheritance or else prohibit it"
date: 2018-12-10 15:02 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 19. 상속을 고려하고 설계하고 문서화 하라 그렇지 않으면 상속을 금지하라

상속용 클래스는 재정의 할수 있는 매서드들을 내부적으로 어떻게 이용하는지 문서로 남겨야 된다.

이부분은 바로 직전 아이템인 18번에서 나왔듯이 상속을 했지만 내부사용을 상세하게 몰라서 메소드의
오작동을 이르켰다.

이부분은 문서화로 남아 있는데 자세히 보지 못했었다 java 8까지는 This implementation 라는 구분으로 javadoc에 명시 되있었다.

![jdk 8](https://sejoung.github.io/images/2018_12_10_02.jpg){: width="100%"}{: .center}

![jdk 9](https://sejoung.github.io/images/2018_12_10_01.jpg){: width="100%"}{: .center}


위에 2개 이미지는 AbstractCollection에서 java 8 과 java 9의 doc를 캡쳐 한것이다.

이부분은 @implSpec @implNote를 추가한것으로 람다식을 추가하는 안에 메일링 리스트에서 이야기가 나와서 드래프트를 추가 했다.
지금 java 11까지도 선택사항으로 남아있다.
그래서 좋은 문서화의 하나의 방향으로 보아도 무방할것 같다.

위처럼 문서화만 신경쓰면 되는것이 아니다.

클래스의 내부 동작 과정 중간에 끼어들 수 있는 hook을 잘선별해 protected 메서드 형태로 공개 할수도 있어야 된다.

![removeRange](https://sejoung.github.io/images/2018_12_10_03.jpg){: width="100%"}{: .center}

위에 코드는 AbstractList 클래스의 removeRange 메소드이다.

상속용으로 만든 클래스는 배포전에 꼭 하위클래스를 만들어서 검증을 해야 된다.

```java

package com.github.sejoung.codetest.inheritance;

// 재정의 가능 메서드를 호출하는 생성자 - 따라 하지 말 것! (115쪽)
public class Super {
    // 잘못된 예 - 생성자가 재정의 가능 메서드를 호출한다.
    public Super() {
        overrideMe();
    }

    public void overrideMe() {
    }
}


```

```java

package com.github.sejoung.codetest.inheritance;

import java.time.Instant;

// 생성자에서 호출하는 메서드를 재정의했을 때의 문제를 보여준다. (126쪽)
public final class Sub extends Super {
    // 초기화되지 않은 final 필드. 생성자에서 초기화한다.
    private final Instant instant;

    Sub() {
        instant = Instant.now();
    }

    // 재정의 가능 메서드. 상위 클래스의 생성자가 호출한다.
    @Override
    public void overrideMe() {
        System.out.println(instant);
    }

    public static void main(String[] args) {
        Sub sub = new Sub();
        sub.overrideMe();
    }
}

```
실행결과
```

null
2018-12-10T06:25:09.618Z

Process finished with exit code 0

```

위에 코드에서는 overrideMe()가 한번 호출되기를 원했지만 두번호출이 된다. 
문제는 생성자에서 재정의 가능 메서드를 호출하는것이다.

상속용 클래스 생성자는 직접적으로든 간접적으로든 재정의 가능 메서드를 호출해서는 안된다.

또 clone, readObject 모두 재정의 가능 메서드를 호출해서는 안된다.

이렇게 상속용 클래스를 설계하려면 시간도 많이 들고 클래스 안에서 제약도 상당하다
상속용으로 설계하지 않은 클래스에서 여러가지 버그 리포트가 올라올수 있는데
이문제를 해결하는 가장 쉬운 방법은 상속을 금지하는것이다.

상속을 금지한다고 해서 문제 보다 다른 대안인 래퍼클래스를 만드는 방법도 있기때문에 문제가 없다.

상속을 금지하는 방법은 모두 final로 선언 해버리거나 생성자를 모두 private으로 선안 해버리는것이다.

# 참조
-----
* [JEP draft: javadoc tags to distinguish API, implementation, specification, and notes](https://openjdk.java.net/jeps/8068562)
* [jdk 8 AbstractCollection](https://docs.oracle.com/javase/8/docs/api/java/util/AbstractCollection.html)
* [jdk 9 AbstractCollection](https://docs.oracle.com/javase/9/docs/api/java/util/AbstractCollection.html)


