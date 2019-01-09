---
layout: post
title: "Use EnumSet instead of bit fields"
date: 2019-01-09 10:55 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 36. 비트필드 대신 EnumSet을 사용하라

```java

package com.github.sejoung.codetest.enumtest;

import java.util.Objects;

public class Text {
    public static final int STYLE_BOLD = 1 << 0;
    public static final int STYLE_ITALIC = 1 << 1;
    public static final int STYLE_UNDERLINE = 1 << 2;
    public static final int STYLE_STRIKETHROUGH = 1 << 3;

    public void applyStyles(int styles) {
        System.out.printf("Applying styles %s to text%n",
                Objects.requireNonNull(styles));
    }

    // 사용 예
    public static void main(String[] args) {
        Text text = new Text();
        text.applyStyles(STYLE_BOLD | STYLE_ITALIC);
    }
}


```
실행결과
```
Applying styles 8 to text

Process finished with exit code 0
```

이렇게 사용하는것을 비트필드라고 한다 이렇게 하는것은 집합연산을 통해서 하나의 값을 쓸려고 하는것이다.

이것은 구닥다리 스타일이다.

이것을 enumset을 이용하면 아래의 코드이다.

```java

package com.github.sejoung.codetest.enumtest;

import java.util.EnumSet;
import java.util.Objects;
import java.util.Set;

// 코드 36-2 EnumSet - 비트 필드를 대체하는 현대적 기법 (224쪽)
public class Text {
    public enum Style {BOLD, ITALIC, UNDERLINE, STRIKETHROUGH}

    // 어떤 Set을 넘겨도 되나, EnumSet이 가장 좋다.
    public void applyStyles(Set<Style> styles) {
        System.out.printf("Applying styles %s to text%n",
                Objects.requireNonNull(styles));
    }


    // 사용 예
    public static void main(String[] args) {
        Text text = new Text();
        text.applyStyles(EnumSet.of(Style.BOLD, Style.ITALIC));
    }
}


```
실행결과
```
Applying styles [BOLD, ITALIC] to text

Process finished with exit code 0

```

열거할수 있는 타입을 한데 모아 집합 형태로 사용한다고 해도 비트 필드를 사용할 이유는 없다.


# 참조
-----


