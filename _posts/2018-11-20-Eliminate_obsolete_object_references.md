---
layout: post
title: "Eliminate obsolete object references"
date: 2018-11-20 10:30 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 다쓴 객체의 참조를 해제하라

```java

package com.github.sejoung.codetest.memory;

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

    public Object pop() throws Exception {
        if (size == 0)
            throw new Exception();
        return elements[--size];
    }
    
    /**
     * 원소를 위한 공간을 적어도 하나 이상 확보한다.
     * 배열 크기를 늘려야 할 때마다 대략 두 배씩 늘린다.
     */
    private void ensureCapacity() {
        if (elements.length == size)
            elements = Arrays.copyOf(elements, 2 * size + 1);
    }
/*

    // 코드 7-2 제대로 구현한 pop 메서드 (37쪽)
    public Object pop() throws Exception{
        if (size == 0)
            throw new Exception();
        Object result = elements[--size];
        elements[size] = null; // 다 쓴 참조 해제
        return result;
   }

*/
    public static void main(String[] args) throws Exception {
        Stack stack = new Stack();
        for (int i = 0; i < Integer.MAX_VALUE; i++) {
            stack.push(new TEST(i));
            System.out.println(i);
        }

        try {
            while (true)
                System.err.println(stack.pop());
        } catch (Exception e) {
            System.out.println("끝");
        }

    }
}



```

위에 처럼 스텍을 만들어서 객체를 저장하는데 다쓴객체의 참조해제를 하지 않아서 메모리 누수 현상이 있다. 

위에 내용을 이해하기 위해서 일반적인 GC의 과정을 알아야 될것 같다.

문제가 될수 있는 부분은 stack.push 하는데 이부분은 Strong references로 참조 되고 있어서 참조가 해지 되지 않으면 GC의 대상이 아니다.

그래서 pop()메소드를 호출하면서 실제적으로 elements에서 TEST 클래스에 참조가 해지 되지 않는다 이부분은 일반적인 상황에서 알아 차리기 힘들다.

하지만 일일이 객체의 참조를 해지하면서 프로그래밍 하진 않는다 

또 메모리 누수를 일으키는 부분이 캐쉬 부분인데 이부분도 Weak Reference를 참조해 구현하고 있는 WeakHashMap을 사용하는게 어떻까 책에서 권장하고 있다.

또 콜백에 대해서도 메모리가 누수 될 수 있다고 한다. 콜백을 등록 해놓기만 하고 참조 해제 하지 않으면 메모리 누수가 될수 있으니 이부분도 Weak Reference를 활용하길 원한다.

# 참조
-----
* [[이팩티브 자바] #7 불필요한 객체 레퍼런스를 정리하자](https://www.youtube.com/watch?v=YijcBaS4cu8)
* [Java Reference와 GC](https://d2.naver.com/helloworld/329631)
* [Java Garbage Collection](https://d2.naver.com/helloworld/1329)