---
layout: post
title: "아이템 13. clone 재정의는 주의해서 진행하라."
date: 2018-11-29 13:54 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 13. clone 재정의는 주의해서 진행하라.

Cloneable을 구현한 클래스는 clone 메소드를 
public으로 제공하고 사용자는 복제가 당연히 제대로 이뤄 질꺼라고 생각한다.

clone 메소드의 일반규약

```

이 객체의 복사본을 생성해 반환한다. '복사'의 정확한 뜻은 그 객체를 구현한 클래스에 따라 다를 수 있다.
일반적인 의도는 다음과 같다. 어떤 객체 x에 대해 다음 식은 참이다.

x.clone() != x

또한 다음 식도 참이다.

x.clone().getClass() == x.getClass()

하지만 이상의 요구를 반드시 만족해야 하는 것은 아니다.
한편 다음 식도 일반적으로 참이만, 역시 필수는 아니다.

x.clone.equlse(x)

관례상, 이 매서드가 반환하는 객체는 super.clone을 호출해 얻어야 한다.
이클래스와(Object를 제외한) 모든 상위 클래스가 이 관례를 따른다면 다음 식은 참이다.

x.clone().getClass() == x.getClass()

관례상, 반환된 객체와 원복 객체는 독립적이어야 한다. 
이를 만족하려면 super.clone으로 얻은 객체의 필드 중 하나 이상을 반환전에 수정해야 할 수도 있다.

```

위에 일반규약으로 만든 클래스를 보겠다.


```java

package com.github.sejoung.codetest.cloneable;

import java.util.HashMap;
import java.util.Map;

// PhoneNumber에 clone 메서드 추가 (79쪽)
public final class PhoneNumber implements Cloneable {
    private final short areaCode, prefix, lineNum;

    public PhoneNumber(int areaCode, int prefix, int lineNum) {
        this.areaCode = rangeCheck(areaCode, 999, "지역코드");
        this.prefix = rangeCheck(prefix, 999, "프리픽스");
        this.lineNum = rangeCheck(lineNum, 9999, "가입자 번호");
    }

    private static short rangeCheck(int val, int max, String arg) {
        if (val < 0 || val > max)
            throw new IllegalArgumentException(arg + ": " + val);
        return (short) val;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof PhoneNumber))
            return false;
        PhoneNumber pn = (PhoneNumber) o;
        return pn.lineNum == lineNum && pn.prefix == prefix
                && pn.areaCode == areaCode;
    }

    @Override
    public int hashCode() {
        int result = Short.hashCode(areaCode);
        result = 31 * result + Short.hashCode(prefix);
        result = 31 * result + Short.hashCode(lineNum);
        return result;
    }

    /**
     * 이 전화번호의 문자열 표현을 반환한다.
     * 이 문자열은 "XXX-YYY-ZZZZ" 형태의 12글자로 구성된다.
     * XXX는 지역 코드, YYY는 프리픽스, ZZZZ는 가입자 번호다.
     * 각각의 대문자는 10진수 숫자 하나를 나타낸다.
     * <p>
     * 전화번호의 각 부분의 값이 너무 작아서 자릿수를 채울 수 없다면,
     * 앞에서부터 0으로 채워나간다. 예컨대 가입자 번호가 123이라면
     * 전화번호의 마지막 네 문자는 "0123"이 된다.
     */
    @Override
    public String toString() {
        return String.format("%03d-%03d-%04d",
                areaCode, prefix, lineNum);
    }

    // 코드 13-1 가변 상태를 참조하지 않는 클래스용 clone 메서드 (79쪽)
    @Override
    public PhoneNumber clone() {
        try {
            return (PhoneNumber) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();  // 일어날 수 없는 일이다.
        }
    }

    public static void main(String[] args) {
        PhoneNumber pn = new PhoneNumber(707, 867, 5309);
        Map<PhoneNumber, String> m = new HashMap<>();
        m.put(pn, "제니");

        PhoneNumber pn2 = pn.clone();

        System.out.println(pn != pn2);
        System.out.println(pn.getClass() == pn2.getClass());
        System.out.println(m.get(pn2));
    }
}

```
실행 결과 
```
true
true
제니

Process finished with exit code 0
```

위에 코드는 일반적인 객체를 참고 하는 코드 이고 
이제는 가변객체를 참조하는 코드를 짜보자

```java

package com.github.sejoung.codetest.cloneable;

import java.util.Arrays;

// Stack의 복제 가능 버전 (80-81쪽)
public class Stack implements Cloneable {
    private Object[] elements;
    private int size = 0;
    private static final int DEFAULT_INITIAL_CAPACITY = 16;

    public Stack() {
        this.elements = new Object[DEFAULT_INITIAL_CAPACITY];
    }

    public void push(Object e) {
        ensureCapacity();
        elements[size++] = e;
    }

    public Object pop() {
        if (size == 0)
            throw new EmptyStackException();
        Object result = elements[--size];
        elements[size] = null; // 다 쓴 참조 해제
        return result;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    // 코드 13-2 가변 상태를 참조하는 클래스용 clone 메서드
    @Override
    public Stack clone() {
        try {
            Stack result = (Stack) super.clone();
            return result;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }

    // 원소를 위한 공간을 적어도 하나 이상 확보한다.
    private void ensureCapacity() {
        if (elements.length == size)
            elements = Arrays.copyOf(elements, 2 * size + 1);
    }

    // clone이 동작하는 모습을 보려면 명령줄 인수를 몇 개 덧붙여서 호출해야 한다.
    public static void main(String[] args) {
        Stack stack = new Stack();
        String [] arg2 = {"1","2","3","4"};
        for (String arg : arg2)
            stack.push(arg);
        Stack copy = stack.clone();
        while (!stack.isEmpty())
            System.out.print(stack.pop() + " ");
        System.out.println();
        while (!copy.isEmpty())
            System.out.print(copy.pop() + " ");
    }
}

```
실행결과
```
4 3 2 1 
null null null null 
Process finished with exit code 0
```

위에 코드는 하나의 문제점 때문에 copy에서 값을 pop할때 null이 나오게됩니다.

여기서 코드를 수정하면 

```java

package com.github.sejoung.codetest.cloneable;

import java.util.Arrays;

// Stack의 복제 가능 버전 (80-81쪽)
public class Stack implements Cloneable {
    private Object[] elements;
    private int size = 0;
    private static final int DEFAULT_INITIAL_CAPACITY = 16;

    public Stack() {
        this.elements = new Object[DEFAULT_INITIAL_CAPACITY];
    }

    public void push(Object e) {
        ensureCapacity();
        elements[size++] = e;
    }

    public Object pop() {
        if (size == 0)
            throw new EmptyStackException();
        Object result = elements[--size];
        elements[size] = null; // 다 쓴 참조 해제
        return result;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    // 코드 13-2 가변 상태를 참조하는 클래스용 clone 메서드
    @Override
    public Stack clone() {
        try {
            Stack result = (Stack) super.clone();
            result.elements = elements.clone();
            return result;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }

    // 원소를 위한 공간을 적어도 하나 이상 확보한다.
    private void ensureCapacity() {
        if (elements.length == size)
            elements = Arrays.copyOf(elements, 2 * size + 1);
    }

    // clone이 동작하는 모습을 보려면 명령줄 인수를 몇 개 덧붙여서 호출해야 한다.
    public static void main(String[] args) {
        Stack stack = new Stack();
        String [] arg2 = {"1","2","3","4"};
        for (String arg : arg2)
            stack.push(arg);
        Stack copy = stack.clone();
        while (!stack.isEmpty())
            System.out.print(stack.pop() + " ");
        System.out.println();
        while (!copy.isEmpty())
            System.out.print(copy.pop() + " ");
    }
}

```

실행 결과

```
4 3 2 1 
4 3 2 1 
Process finished with exit code 0
```

clone 메소드에서 가변 변수인   private Object[] elements; 에 대한 처리를 추가함 result.elements = elements.clone();

배열을 복사할때는 clone 메소드를 사용하라고 권장한다 clone 기능이 제대로 사용하는 유일한 예외라고 할수 있다.

위에처럼 간단하게 만 clone을 처리 하지 못하는 케이스가 있다. 책에서는 hashtable을 설명하고 있다.
책에서 설명한 코드가 조금 바뀐것 같다. 
deepCopy 메소드를 보여주고 있는데 1.8기준부터는 똑같이 clone형태를 호출한다.

그럼 코드를 보시면
```java
public class Hashtable<K,V>
    extends Dictionary<K,V>
    implements Map<K,V>, Cloneable, java.io.Serializable {

    /**
     * The hash table data.
     */
    private transient Entry<?,?>[] table;
    
  /**
     * Creates a shallow copy of this hashtable. All the structure of the
     * hashtable itself is copied, but the keys and values are not cloned.
     * This is a relatively expensive operation.
     *
     * @return  a clone of the hashtable
     */
    public synchronized Object clone() {
        try {
            Hashtable<?,?> t = (Hashtable<?,?>)super.clone();
            t.table = new Entry<?,?>[table.length];
            for (int i = table.length ; i-- > 0 ; ) {
                t.table[i] = (table[i] != null)
                    ? (Entry<?,?>) table[i].clone() : null;
            }
            t.keySet = null;
            t.entrySet = null;
            t.values = null;
            t.modCount = 0;
            return t;
        } catch (CloneNotSupportedException e) {
            // this shouldn't happen, since we are Cloneable
            throw new InternalError(e);
        }
    }
    
}

```


```java

  private static class Entry<K,V> implements Map.Entry<K,V> {
        final int hash;
        final K key;
        V value;
        Entry<K,V> next;

        protected Entry(int hash, K key, V value, Entry<K,V> next) {
            this.hash = hash;
            this.key =  key;
            this.value = value;
            this.next = next;
        }

        @SuppressWarnings("unchecked")
        protected Object clone() {
            return new Entry<>(hash, key, value,
                                  (next==null ? null : (Entry<K,V>) next.clone()));
        }
}

```

복사 생성자와 복사 정적 팩토리 가 더나은 객체 복사 패턴일수가 있다.

```java

public class Yum{
    public Yum(Yum yum){
        
    }
}

```

```java
public class Yum{ 
    
    private Yum(Yum yum){    
    }
    public static Yum newInstance(Yum yum){
        return new Yum(yum);
    }
}

```

일단 clone이라는것을 절대로 확장해선 안되고 새로운 클래스도 이를 구현해서는 안된다.
final 클래스라면 위험이 크지 않지만, 성능 최적화 관점에서 검토후 별다른 문제가 없을때 구현하면 된다.


# 참조
-----
