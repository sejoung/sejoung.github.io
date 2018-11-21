---
layout: post
title: "dependency injection"
date: 2018-11-14 09:53 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

## 이펙티브 자바 

### 아이템 5. 자원을 직접 명시 하지 말고 의존성 객체 주입(dependency injection)을 사용하라

지금 대부분 자바 개발자들은 spring 프레임워크를 쓰면서 의존성 주입에 대한 이견은 없을 것입니다.

```java

package com.github.sejoung.codetest.di.test1;

import java.util.List;

public class SpellChecker {
    private static final Lexicon dictionary = new KoreanDicationry();

    private SpellChecker() {
    }

    public static boolean isValid(String word) {
        throw new UnsupportedOperationException();
    }

    public static List<String> suggestions(String typo) {
        throw new UnsupportedOperationException();
    }

    public static void main(String[] args) {
        SpellChecker.isValid("하이");
    }
}

interface Lexicon {
}

class KoreanDicationry implements Lexicon {
}

```

위에 방식으로 구현한 케이스와 비슷하게 아래 처럼 싱글턴방식으로 구현한 케이스 두가지는 흔한 방식이다.

```java

package com.github.sejoung.codetest.di.test2;

import java.util.List;

public class SpellChecker {

    private final Lexicon dictionary = new KoreanDicationry();

    private SpellChecker() {
    }

    public static final SpellChecker INSTANCE = new SpellChecker() {
    };

    public boolean isValid(String word) {
        throw new UnsupportedOperationException();
    }


    public List<String> suggestions(String typo) {
        throw new UnsupportedOperationException();
    }

    public static void main(String[] args) {
        SpellChecker.INSTANCE.isValid("하이");
    }

}


interface Lexicon {}

class KoreanDicationry implements Lexicon {}


```

위에 2가지 방식다 모두 단하나의 사전만 사용한다는 점에서 그리 훌륭해 보이지 않다.

위에 코드는 SpellChecker 클래스와 KoreanDicationry 커플링 된 상태이다. 

커플링된 코드를 디커플링 시키기 위해서 의존성 주입을 선택할수도 있다.

그럼 코드를 바꾸면 

```java

package com.github.sejoung.codetest.di.test3;

import java.util.List;
import java.util.Objects;
import java.util.function.Supplier;

public class SpellChecker {

    private final Lexicon dictionary;

    public SpellChecker(Supplier<Lexicon> dictionary) {
        this.dictionary = Objects.requireNonNull(dictionary.get());
    }

    public boolean isValid(String word) {
        throw new UnsupportedOperationException();
    }

    public List<String> suggestions(String typo) {
        throw new UnsupportedOperationException();
    }

    public static void main(String[] args) {
        Lexicon lexicon = new TestDictionary();
        SpellChecker spellChecker = new SpellChecker(() -> lexicon);
        spellChecker.isValid("하이");
    }

}

interface Lexicon {}

class KoreanDictionary implements Lexicon {}

class TestDictionary implements Lexicon {}

```

위에 처럼 SpellChecker 생성시에 주입을 선택하면 생성시에 언제든 사전을 교체 할 수 있다.

그럼 SpellChecker 에서 기존에 KoreanDictionary와 가지고 있던 커플링이 디커플링 된다.

이런 비슷한 일을 java 6부터 service loader에서 비슷하게 할수 있고

또 java 9 부터 jigsaw가 적용되면서 이렇게 비슷하게 디커플링 시킬수 있다.

이렇게 언어 차원에서도 할수 있지만 프로젝트가 커지고 하면 프레임워크 도입도 고려 해봐야 된다.



# 참조
-----
* [martinfowler injection](https://martinfowler.com/articles/injection.html)
* [[이팩티브 자바] #5 의존성 주입](https://www.youtube.com/watch?v=24scqT2_m4U)
* [ServiceLoader doc](https://docs.oracle.com/javase/7/docs/api/java/util/ServiceLoader.html)
