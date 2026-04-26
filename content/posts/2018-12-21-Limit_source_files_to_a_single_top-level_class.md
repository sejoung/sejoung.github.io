---
layout: post
title: "아이템 25. 톱레벨 클래스는 한 파일에 하나만 담으라"
date: 2018-12-21 10:55 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 이펙티브 자바

### 아이템 25. 톱레벨 클래스는 한 파일에 하나만 담으라

소스파일에 톱레벨 클래스를 여러게 만들어도 자바 컴파일러는 문제가 없다.

아래는 Utensil.java 클래스에 톱레벨 클래스를 두개 지정해도 정상적이다.

```java

package com.github.sejoung.codetest.toplevel;

// 코드 25-1 두 클래스가 한 파일(Utensil.java)에 정의되었다. - 따라 하지 말 것! (150쪽)
class Utensil {
    static final String NAME = "pan";
}

class Dessert {
    static final String NAME = "cake";
}

```

```java

package com.github.sejoung.codetest.toplevel;

public class Main {
    public static void main(String[] args) {
        System.out.println(Utensil.NAME + Dessert.NAME);
    }
}

```

```java

package com.github.sejoung.codetest.toplevel;

// 코드 25-2 두 클래스가 한 파일(Dessert.java)에 정의되었다. - 따라 하지 말 것! (151쪽)
class Utensil {
    static final String NAME = "pot";
}

class Dessert {
    static final String NAME = "pie";
}


```

위처럼 톱레벨클래스를 2개를 하나에 파일에 작성하게 되면 원치 않는 결과를 나타낼수도 있다.

```

javac Main.java Dessert.java

```

위 명령어를 실행하면 potpie가 나오고 아래 명령어를 실행하면 pancake이 나오게 된다.

```

javac Main.java Utensil.java

```

해결책은 간단하나 하나의 파일에 하나의 클래스만 담으면 된다.

굳이 여러게의 클래스를 하나의 파일에 담고 싶으면 정적맴버 클래스를 사용하는 방법도 있다 

```java

package com.github.sejoung.codetest.toplevel;

// 코드 25-3 톱레벨 클래스들을 정적 멤버 클래스로 바꿔본 모습 (151-152쪽)
public class Test {
    public static void main(String[] args) {
        System.out.println(Utensil.NAME + Dessert.NAME);
    }

    private static class Utensil {
        static final String NAME = "pan";
    }

    private static class Dessert {
        static final String NAME = "cake";
    }
}


```

private으로 하면 접근 제한도 되고 여러모로 편할것이다.


# 참조
-----


