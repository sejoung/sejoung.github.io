---
layout: post
title: "아이템 31. 한정적 와일드카드를 사용해 API의 유연성을 높혀라."
date: 2019-01-02 14:59 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 31. 한정적 와일드카드를 사용해 API의 유연성을 높혀라.

```java

package com.github.sejoung.codetest.generics.bounded;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;

// 와일드카드 타입을 이용해 대량 작업을 수행하는 메서드를 포함한 제네릭 스택 (181-183쪽)
public class Stack<E> {
    private E[] elements;
    private int size = 0;
    private static final int DEFAULT_INITIAL_CAPACITY = 16;

    // 코드 29-3 배열을 사용한 코드를 제네릭으로 만드는 방법 1 (172쪽)
    // 배열 elements는 push(E)로 넘어온 E 인스턴스만 담는다.
    // 따라서 타입 안전성을 보장하지만,
    // 이 배열의 런타임 타입은 E[]가 아닌 Object[]다!
    @SuppressWarnings("unchecked")
    public Stack() {
        elements = (E[]) new Object[DEFAULT_INITIAL_CAPACITY];
    }

    public void push(E e) {
        ensureCapacity();
        elements[size++] = e;
    }

    public E pop() {
        if (size==0)
            throw new RuntimeException();
        E result = elements[--size];
        elements[size] = null; // 다 쓴 참조 해제
        return result;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    private void ensureCapacity() {
        if (elements.length == size)
            elements = Arrays.copyOf(elements, 2 * size + 1);
    }

    // 코드 31-1 와일드카드 타입을 사용하지 않은 pushAll 메서드 - 결함이 있다! (181쪽)
    public void pushAll(Iterable<E> src) {
        for (E e : src)
            push(e);
    }

    // 코드 31-3 와일드카드 타입을 사용하지 않은 popAll 메서드 - 결함이 있다! (183쪽)
    public void popAll(Collection<E> dst) {
        while (!isEmpty())
            dst.add(pop());
    }


    // 제네릭 Stack을 사용하는 맛보기 프로그램
    public static void main(String[] args) {
        Stack<Number> numberStack = new Stack<>();
        Iterable<Integer> integers = Arrays.asList(3, 1, 4, 1, 5, 9);
        numberStack.pushAll(integers);

        Collection<Object> objects = new ArrayList<>();
        numberStack.popAll(objects);

        System.out.println(objects);
    }
}


```
컴파일에러
```
Error:(76, 29) java: incompatible types: java.lang.Iterable<java.lang.Integer> cannot be converted to java.lang.Iterable<java.lang.Number>
Error:(79, 28) java: incompatible types: java.util.Collection<java.lang.Object> cannot be converted to java.util.Collection<java.lang.Number>
```

위와 같은 에러가 난다. 보기에는 당연히 되어야 할것 같은데 에러가 난다. 제네릭은 불공변이기 때문이다.

```java

package com.github.sejoung.codetest.generics.bounded;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;

// 와일드카드 타입을 이용해 대량 작업을 수행하는 메서드를 포함한 제네릭 스택 (181-183쪽)
public class Stack<E> {
    private E[] elements;
    private int size = 0;
    private static final int DEFAULT_INITIAL_CAPACITY = 16;

    // 코드 29-3 배열을 사용한 코드를 제네릭으로 만드는 방법 1 (172쪽)
    // 배열 elements는 push(E)로 넘어온 E 인스턴스만 담는다.
    // 따라서 타입 안전성을 보장하지만,
    // 이 배열의 런타임 타입은 E[]가 아닌 Object[]다!
    @SuppressWarnings("unchecked")
    public Stack() {
        elements = (E[]) new Object[DEFAULT_INITIAL_CAPACITY];
    }

    public void push(E e) {
        ensureCapacity();
        elements[size++] = e;
    }

    public E pop() {
        if (size==0)
            throw new RuntimeException();
        E result = elements[--size];
        elements[size] = null; // 다 쓴 참조 해제
        return result;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    private void ensureCapacity() {
        if (elements.length == size)
            elements = Arrays.copyOf(elements, 2 * size + 1);
    }

    // 코드 31-2 E 생산자(producer) 매개변수에 와일드카드 타입 적용 (182쪽)
    public void pushAll(Iterable<? extends E> src) {
        for (E e : src)
            push(e);
    }

    // 코드 31-4 E 소비자(consumer) 매개변수에 와일드카드 타입 적용 (183쪽)
    public void popAll(Collection<? super E> dst) {
        while (!isEmpty())
            dst.add(pop());
    }

    // 제네릭 Stack을 사용하는 맛보기 프로그램
    public static void main(String[] args) {
        Stack<Number> numberStack = new Stack<>();
        Iterable<Integer> integers = Arrays.asList(3, 1, 4, 1, 5, 9);
        numberStack.pushAll(integers);

        Collection<Object> objects = new ArrayList<>();
        numberStack.popAll(objects);

        System.out.println(objects);
    }
}


```
실행결과
```

[9, 5, 1, 4, 1, 3]

Process finished with exit code 0
```

위에 처럼 자바에서는 이런상황을 대처하기 위해 와일드 카트 타입을 지원한다.

유연성을 극대화 하기위해서는 생산자나 소비자에 입력매개변수의 와일드타입을 사용하라.

```
PECS(Produce - Extends, Consumer - Super)

<? extends T>, <? super T>

```
위에 내용을 기억하라 그래서 pushAll 과 popAll을 비교해보면 된다.

생성자의 적용 내용

```java

package com.github.sejoung.codetest.generics.bounded;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Random;

// T 생산자 매개변수에 와일드카드 타입 적용 (184쪽)
public class Chooser<T> {
    private final List<T> choiceList;
    private final Random rnd = new Random();

    // 코드 31-5 T 생산자 매개변수에 와일드카드 타입 적용 (184쪽)
    public Chooser(Collection choices) {
        choiceList = new ArrayList<>(choices);
    }

    public T choose() {
        return choiceList.get(rnd.nextInt(choiceList.size()));
    }

    public static void main(String[] args) {
        List<Integer> intList = List.of(1, 2, 3, 4, 5, 6);
        Chooser<Number> chooser = new Chooser<>(intList);
        for (int i = 0; i < 10; i++) {
            Number choice = chooser.choose();
            System.out.println(choice);
        }
    }
}


```
컴파일메시지
```
Warning:(15, 22) java: unchecked method invocation: constructor <init> in class java.util.ArrayList is applied to given types
  required: java.util.Collection<? extends E>
  found: java.util.Collection
Warning:(15, 38) java: unchecked conversion
  required: java.util.Collection<? extends E>
  found:    java.util.Collection
Warning:(15, 22) java: unchecked conversion
  required: java.util.List<T>
  found:    java.util.ArrayList

```
위에 메시지를 없에기 위해 

```java
package com.github.sejoung.codetest.generics.bounded;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Random;

// T 생산자 매개변수에 와일드카드 타입 적용 (184쪽)
public class Chooser<T> {
    private final List<T> choiceList;
    private final Random rnd = new Random();

    // 코드 31-5 T 생산자 매개변수에 와일드카드 타입 적용 (184쪽)
    public Chooser(Collection<? extends T> choices) {
        choiceList = new ArrayList<>(choices);
    }

    public T choose() {
        return choiceList.get(rnd.nextInt(choiceList.size()));
    }

    public static void main(String[] args) {
        List<Integer> intList = List.of(1, 2, 3, 4, 5, 6);
        Chooser<Number> chooser = new Chooser<>(intList);
        for (int i = 0; i < 10; i++) {
            Number choice = chooser.choose();
            System.out.println(choice);
        }
    }
}


```
실행결과
```
6
1
3
1
3
5
5
5
6
4

Process finished with exit code 0
```

```java

package com.github.sejoung.codetest.generics.bounded;

import java.util.Arrays;
import java.util.List;

// 와일드카드 타입을 실제 타입으로 바꿔주는 private 도우미 메서드 (189쪽)
public class Swap {
    public static void swap(List<?> list, int i, int j) {
        list.set(i, list.set(j, list.get(i)));

    }

    public static void main(String[] args) {
        // 첫 번째와 마지막 인수를 스왑한 후 결과 리스트를 출력한다.
        List<String> argList = Arrays.asList("a","b","c");
        swap(argList, 0, argList.size() - 1);
        System.out.println(argList);
    }
}


```
컴파일메시지
```
Error:(10, 41) java: incompatible types: java.lang.Object cannot be converted to capture#1 of ?

```
위에 처럼 컴파일 되지 않는데 문제는< ? > 카드 타입 때문이다. 이것은 null 빼고는 아무것도 못넣는데 있다 하지만 해결방법이 있다.

```java

package com.github.sejoung.codetest.generics.bounded;

import java.util.Arrays;
import java.util.List;

// 와일드카드 타입을 실제 타입으로 바꿔주는 private 도우미 메서드 (189쪽)
public class Swap {
    public static void swap(List<?> list, int i, int j) {
        swapHelper(list, i, j);
    }

    // 와일드카드 타입을 실제 타입으로 바꿔주는 private 도우미 메서드
    private static <E> void swapHelper(List<E> list, int i, int j) {
        list.set(i, list.set(j, list.get(i)));
    }

    public static void main(String[] args) {
        // 첫 번째와 마지막 인수를 스왑한 후 결과 리스트를 출력한다.
        List<String> argList = Arrays.asList("a","b","c");
        swap(argList, 0, argList.size() - 1);
        System.out.println(argList);
    }
}


```
실행결과
```
[c, b, a]

Process finished with exit code 0
```



# 참조
-----

