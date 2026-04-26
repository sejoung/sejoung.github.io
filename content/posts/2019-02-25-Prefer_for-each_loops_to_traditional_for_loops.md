---
layout: post
title: "아이템 58. 전통적인 for문 보다는 for-each문을 사용하라."
date: 2019-02-25 15:02 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 58. 전통적인 for문 보다는 for-each문을 사용하라.

```java

        for (Iterator<Suit> i = suits.iterator(); i.hasNext(); ) {
        }


        for(int i = 0; i < a.lenght ; i++){
            
        }
```

위에는 전통적인 for문이다. 


위에 관용구 들은 while 문보다는 좋지만 가장 좋은 코드는 아니다.


```java

package com.github.sejoung.codetest.general;

import java.util.*;

public class Card {
    private final Suit suit;
    private final Rank rank;

    // 버그를 찾아보자.
    enum Suit { CLUB, DIAMOND, HEART, SPADE }
    enum Rank { ACE, DEUCE, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT,
        NINE, TEN, JACK, QUEEN, KING }

    static Collection<Suit> suits = Arrays.asList(Suit.values());
    static Collection<Rank> ranks = Arrays.asList(Rank.values());

    Card(Suit suit, Rank rank ) {
        this.suit = suit;
        this.rank = rank;
    }

    public static void main(String[] args) {
        List<Card> deck = new ArrayList<>();

        for (Iterator<Suit> i = suits.iterator(); i.hasNext(); ) {
            for (Iterator<Rank> j = ranks.iterator(); j.hasNext(); ) {
                deck.add(new Card(i.next(), j.next()));
            }
        }

    }
}

```
실행결과
```
Exception in thread "main" java.util.NoSuchElementException
	at java.base/java.util.Arrays$ArrayItr.next(Arrays.java:4431)
	at com.github.sejoung.codetest.general.Card.main(Card.java:27)

Process finished with exit code 1

```

위에 코드를 수정해 보면

```java

package com.github.sejoung.codetest.general;

import java.util.*;

public class Card {
    private final Suit suit;
    private final Rank rank;

    // 버그를 찾아보자.
    enum Suit { CLUB, DIAMOND, HEART, SPADE }
    enum Rank { ACE, DEUCE, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT,
        NINE, TEN, JACK, QUEEN, KING }

    static Collection<Suit> suits = Arrays.asList(Suit.values());
    static Collection<Rank> ranks = Arrays.asList(Rank.values());

    Card(Suit suit, Rank rank ) {
        this.suit = suit;
        this.rank = rank;
    }

    @Override
    public String toString() {
        return this.suit.toString()+" : "+this.rank.toString();
    }

    public static void main(String[] args) {
        List<Card> deck = new ArrayList<>();

        for (Iterator<Suit> i = suits.iterator(); i.hasNext(); ) {
            Suit suit = i.next();
            for (Iterator<Rank> j = ranks.iterator(); j.hasNext(); ) {
                deck.add(new Card(suit, j.next()));
            }
        }

        deck.forEach(System.out::println);

    }
}

```
실행결과
```
CLUB : ACE
CLUB : DEUCE
CLUB : THREE
CLUB : FOUR
CLUB : FIVE
CLUB : SIX
CLUB : SEVEN
CLUB : EIGHT
CLUB : NINE
CLUB : TEN
CLUB : JACK
CLUB : QUEEN
CLUB : KING
DIAMOND : ACE
DIAMOND : DEUCE
DIAMOND : THREE
DIAMOND : FOUR
DIAMOND : FIVE
DIAMOND : SIX
DIAMOND : SEVEN
DIAMOND : EIGHT
DIAMOND : NINE
DIAMOND : TEN
DIAMOND : JACK
DIAMOND : QUEEN
DIAMOND : KING
HEART : ACE
HEART : DEUCE
HEART : THREE
HEART : FOUR
HEART : FIVE
HEART : SIX
HEART : SEVEN
HEART : EIGHT
HEART : NINE
HEART : TEN
HEART : JACK
HEART : QUEEN
HEART : KING
SPADE : ACE
SPADE : DEUCE
SPADE : THREE
SPADE : FOUR
SPADE : FIVE
SPADE : SIX
SPADE : SEVEN
SPADE : EIGHT
SPADE : NINE
SPADE : TEN
SPADE : JACK
SPADE : QUEEN
SPADE : KING

Process finished with exit code 0
```

그럼 향상된 for문을 사용하면

```java

package com.github.sejoung.codetest.general;

import java.util.*;

public class Card {
    private final Suit suit;
    private final Rank rank;

    // 버그를 찾아보자.
    enum Suit { CLUB, DIAMOND, HEART, SPADE }
    enum Rank { ACE, DEUCE, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT,
        NINE, TEN, JACK, QUEEN, KING }

    static Collection<Suit> suits = Arrays.asList(Suit.values());
    static Collection<Rank> ranks = Arrays.asList(Rank.values());

    Card(Suit suit, Rank rank ) {
        this.suit = suit;
        this.rank = rank;
    }

    @Override
    public String toString() {
        return this.suit.toString()+" : "+this.rank.toString();
    }

    public static void main(String[] args) {
        List<Card> deck = new ArrayList<>();

        // 코드 58-7 컬렉션이나 배열의 중첩 반복을 위한 권장 관용구 (349쪽)
        for (Suit suit : suits)
            for (Rank rank : ranks)
                deck.add(new Card(suit, rank));


        deck.forEach(System.out::println);

    }
}

```
실행결과
```

CLUB : ACE
CLUB : DEUCE
CLUB : THREE
CLUB : FOUR
CLUB : FIVE
CLUB : SIX
CLUB : SEVEN
CLUB : EIGHT
CLUB : NINE
CLUB : TEN
CLUB : JACK
CLUB : QUEEN
CLUB : KING
DIAMOND : ACE
DIAMOND : DEUCE
DIAMOND : THREE
DIAMOND : FOUR
DIAMOND : FIVE
DIAMOND : SIX
DIAMOND : SEVEN
DIAMOND : EIGHT
DIAMOND : NINE
DIAMOND : TEN
DIAMOND : JACK
DIAMOND : QUEEN
DIAMOND : KING
HEART : ACE
HEART : DEUCE
HEART : THREE
HEART : FOUR
HEART : FIVE
HEART : SIX
HEART : SEVEN
HEART : EIGHT
HEART : NINE
HEART : TEN
HEART : JACK
HEART : QUEEN
HEART : KING
SPADE : ACE
SPADE : DEUCE
SPADE : THREE
SPADE : FOUR
SPADE : FIVE
SPADE : SIX
SPADE : SEVEN
SPADE : EIGHT
SPADE : NINE
SPADE : TEN
SPADE : JACK
SPADE : QUEEN
SPADE : KING

Process finished with exit code 0
```

또다른 케이스로는 

```java

package com.github.sejoung.codetest.general;

import java.util.*;

// 코드 58-5 같은 버그, 다른 증상! (349쪽)
public class DiceRolls {
    enum Face { ONE, TWO, THREE, FOUR, FIVE, SIX }

    public static void main(String[] args) {
        // 같은 버그, 다른 증상!
        Collection<Face> faces = EnumSet.allOf(Face.class);

        for (Iterator<Face> i = faces.iterator(); i.hasNext(); )
            for (Iterator<Face> j = faces.iterator(); j.hasNext(); )
                System.out.println(i.next() + " " + j.next());

        System.out.println("***************************");

        // 컬렉션이나 배열의 중첩 반복을 위한 권장 관용구
        for (Face f1 : faces)
            for (Face f2 : faces)
                System.out.println(f1 + " " + f2);
    }
}


```
실행결과
```

ONE ONE
TWO TWO
THREE THREE
FOUR FOUR
FIVE FIVE
SIX SIX
***************************
ONE ONE
ONE TWO
ONE THREE
ONE FOUR
ONE FIVE
ONE SIX
TWO ONE
TWO TWO
TWO THREE
TWO FOUR
TWO FIVE
TWO SIX
THREE ONE
THREE TWO
THREE THREE
THREE FOUR
THREE FIVE
THREE SIX
FOUR ONE
FOUR TWO
FOUR THREE
FOUR FOUR
FOUR FIVE
FOUR SIX
FIVE ONE
FIVE TWO
FIVE THREE
FIVE FOUR
FIVE FIVE
FIVE SIX
SIX ONE
SIX TWO
SIX THREE
SIX FOUR
SIX FIVE
SIX SIX
```

foreach문을 사용할수 없는 케이스

* 파괴적인 필터링 : 순회하면서 remove를 할려고 할때는 하지 못한다.
* 변형 : 배열의 인덱스를 사용해야 되면 하지 못한다.
* 병렬 : 여러 컬렉션을 병렬로 수행해야 되면 엄격하고 명시적으로 제어해야 된다.


# 참조
-----
* [foreach](https://docs.oracle.com/javase/1.5.0/docs/guide/language/foreach.html)

* [enhanced for loop](https://blogs.oracle.com/corejavatechtips/using-enhanced-for-loops-with-your-classes)


