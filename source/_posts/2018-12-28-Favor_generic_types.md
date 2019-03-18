---
layout: post
title: "아이템 29. 이왕이면 제네릭타입으로 만들어라"
date: 2018-12-28 13:43 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 29. 이왕이면 제네릭타입으로 만들어라

[아이템 7. 다쓴 객체의 참조를 해제하라](https://sejoung.github.io/2018/11/Eliminate_obsolete_object_references)
에서 만들었던 Stack 클래스를 제네릭타입으로 변환하는것이다.

```java

package com.github.sejoung.codetest.generics;

import java.util.Arrays;

public class Stack {
    private Object[] elements;
    private int size = 0;
    private static final int DEFAULT_INITIAL_CAPACITY = 16;

    public Stack() {
        elements = new Object[DEFAULT_INITIAL_CAPACITY];
    }

    public void push(Object e) {
        ensureCapacity();
        elements[size++] = e;
    }

    public Object pop() throws Exception{
        if (size == 0)
            throw new Exception();
        Object result = elements[--size];
        elements[size] = null; // 다 쓴 참조 해제
        return result;
    }

    /**
     * 원소를 위한 공간을 적어도 하나 이상 확보한다.
     * 배열 크기를 늘려야 할 때마다 대략 두 배씩 늘린다.
     */
    private void ensureCapacity() {
        if (elements.length == size)
            elements = Arrays.copyOf(elements, 2 * size + 1);
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public static void main(String[] args) throws Exception {
        Stack stack = new Stack();

        for (int i = 0; i < 100; i++) {
            stack.push(i);
        }

        try {
            while (!stack.isEmpty())
                System.out.println(stack.pop());
        } catch (Exception e) {
            System.err.println(e);
        }



    }
}



```

위와 같은 코드가 있는데 배열을 제거 하는 방법이 2가지 있다. 

아래는 첫번째 방법으로

```java

package com.github.sejoung.codetest.generics.stack;

import java.util.Arrays;
import java.util.List;

// E[]를 이용한 제네릭 스택 (170-174쪽)
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
        if (size == 0)
            throw new RuntimeException("스텍이 비였음");
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

    // 코드 29-5 제네릭 Stack을 사용하는 맛보기 프로그램 (174쪽)
    public static void main(String[] args) {
        Stack<String> stack = new Stack<>();
        List<String> list = Arrays.asList("a","b","c");

        for (String arg : list)
            stack.push(arg);
        while (!stack.isEmpty())
            System.out.println(stack.pop().toUpperCase());
    }
}


```

elements의 타입을 E로 변환시켜서 하지만 new E[] 배열이 생성되지 않는다 
그래서 Object[]을 선언하고 E[]로 형변환을 하는것이다 이부분에서 push에서 E타입만 넘어오기때문에 타입은 안전하지만
이 배열에 런타임은 Object로 진행이 된다.

두번째 방법은

```java

package com.github.sejoung.codetest.generics.stack2;

import java.util.Arrays;
import java.util.List;

// Object[]를 이용한 제네릭 Stack (170-174쪽)
public class Stack<E> {
    private Object[] elements;
    private int size = 0;
    private static final int DEFAULT_INITIAL_CAPACITY = 16;

    public Stack() {
        elements = new Object[DEFAULT_INITIAL_CAPACITY];
    }

    public void push(E e) {
        ensureCapacity();
        elements[size++] = e;
    }

    // 코드 29-4 배열을 사용한 코드를 제네릭으로 만드는 방법 2 (173쪽)
    // 비검사 경고를 적절히 숨긴다.
    public E pop() {
        if (size == 0)
            throw new RuntimeException();

        // push에서 E 타입만 허용하므로 이 형변환은 안전하다.
        @SuppressWarnings("unchecked")
        E result = (E) elements[--size];

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

    // 코드 29-5 제네릭 Stack을 사용하는 맛보기 프로그램 (174쪽)
    public static void main(String[] args) {
        Stack<String> stack = new Stack<>();
        List<String> list = Arrays.asList("a", "b", "c");

        for (String arg : list)
            stack.push(arg);

        while (!stack.isEmpty())
            System.out.println(stack.pop().toUpperCase());
    }
}

```
Object[] 을 그대로 사용하고 pop()시에 형변환을 하는 방법이다. 

첫번째 코드는 형변환이 배열생성시 한번만 하지만 두번째 코드는 pop할때마다 형변환이 일어난다.

하지만 첫번째는 힙오염이 생길수 있는 반면 두번째는 그런 위험이 존재하지 않는다.

힙오염에 대해서 조금 뒤에 다시 정리 하겠다.

# 참조
-----

