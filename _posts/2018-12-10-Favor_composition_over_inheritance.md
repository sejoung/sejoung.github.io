---
layout: post
title: "Favor composition over inheritance"
date: 2018-12-10 10:33 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 18. 상속보단 컴포지션을 사용하라

상속은 코드를 재사용하는 강력한 수단이지만 항상 최선은 아니다.

상속의 단점

* 매서드 호출과 달리 상속은 캡슐화를 깨뜨린다.

```java

package com.github.sejoung.codetest.composition;

import java.util.*;


// 코드 18-1 잘못된 예 - 상속을 잘못 사용했다! (114쪽)
public class InstrumentedHashSet<E> extends HashSet<E> {
    // 추가된 원소의 수
    private int addCount = 0;

    public InstrumentedHashSet() {
    }

    public InstrumentedHashSet(int initCap, float loadFactor) {
        super(initCap, loadFactor);
    }

    @Override
    public boolean add(E e) {
        addCount++;
        return super.add(e);
    }

    @Override
    public boolean addAll(Collection<? extends E> c) {
        addCount += c.size();
        return super.addAll(c);
    }

    public int getAddCount() {
        return addCount;
    }

    public static void main(String[] args) {
        InstrumentedHashSet<String> s = new InstrumentedHashSet<>();
        //java 9 지원
        //s.addAll(List.of("틱", "탁탁", "펑"));

        s.addAll(Arrays.asList("틱", "탁탁", "펑"));
        System.out.println(s.getAddCount());
    }
}

```
실행결과
```
6

Process finished with exit code 0
```
위에서 실행결과를 3으로 예측했지만 6이 나왔다 

문제점은 HashSet의 addAll메소드에 있다.

```java

    /**
     * {@inheritDoc}
     *
     * <p>This implementation iterates over the specified collection, and adds
     * each object returned by the iterator to this collection, in turn.
     *
     * <p>Note that this implementation will throw an
     * <tt>UnsupportedOperationException</tt> unless <tt>add</tt> is
     * overridden (assuming the specified collection is non-empty).
     *
     * @throws UnsupportedOperationException {@inheritDoc}
     * @throws ClassCastException            {@inheritDoc}
     * @throws NullPointerException          {@inheritDoc}
     * @throws IllegalArgumentException      {@inheritDoc}
     * @throws IllegalStateException         {@inheritDoc}
     *
     * @see #add(Object)
     */
    public boolean addAll(Collection<? extends E> c) {
        boolean modified = false;
        for (E e : c)
            if (add(e))
                modified = true;
        return modified;
    }

```

위에 코드에서 보면 내부적으로 add 메소드를 다시 호출하고 있다 그래서 실행 코드가 6이 나왔다.

이렇게 상위클래스에 메소드으 모든 내용을 확인하고 커버 가능하면 메소드 재정의가 가능하지만 
하기 어렵다. 위에코드에서 해법으로는 addAll을 다시 재정의 하면되지만 문제가 생길때 마다.
재정의 하기 힘들다.

또 다른방법으로 하위클래스가 깨지기 쉬운이유는 다음 릴리즈일때 상위클래스에 새로운 메소드가 추가 되면
깨지기 쉽다.

그래서 컴포지션을 사용하는 방법이 있다. 위에 코드를 컴포지션과 전달 방식으로 다시 구현한 코드이다.

```java

package com.github.sejoung.codetest.composition;

import java.util.Collection;
import java.util.Iterator;
import java.util.Set;

// 코드 18-3 재사용할 수 있는 전달 클래스 (118쪽)
public class ForwardingSet<E> implements Set<E> {
    // 기존 클래스가 새로운 클래스의 구성요소로 쓰인다(컴포지션)
    private final Set<E> s;

    public ForwardingSet(Set<E> s) {
        this.s = s;
    }
    //전달 메서드
    public void clear() {
        s.clear();
    }

    public boolean contains(Object o) {
        return s.contains(o);
    }

    public boolean isEmpty() {
        return s.isEmpty();
    }

    public int size() {
        return s.size();
    }

    public Iterator<E> iterator() {
        return s.iterator();
    }

    public boolean add(E e) {
        return s.add(e);
    }

    public boolean remove(Object o) {
        return s.remove(o);
    }

    public boolean containsAll(Collection<?> c) {
        return s.containsAll(c);
    }

    public boolean addAll(Collection<? extends E> c) {
        return s.addAll(c);
    }

    public boolean removeAll(Collection<?> c) {
        return s.removeAll(c);
    }

    public boolean retainAll(Collection<?> c) {
        return s.retainAll(c);
    }

    public Object[] toArray() {
        return s.toArray();
    }

    public <T> T[] toArray(T[] a) {
        return s.toArray(a);
    }

    @Override
    public boolean equals(Object o) {
        return s.equals(o);
    }

    @Override
    public int hashCode() {
        return s.hashCode();
    }

    @Override
    public String toString() {
        return s.toString();
    }
}


```

```java

package com.github.sejoung.codetest.composition;

import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

// 코드 18-2 래퍼 클래스 - 상속 대신 컴포지션을 사용했다. (117-118쪽)
public class InstrumentedSet<E> extends ForwardingSet<E> {
    private int addCount = 0;

    public InstrumentedSet(Set<E> s) {
        super(s);
    }

    @Override
    public boolean add(E e) {
        addCount++;
        return super.add(e);
    }

    @Override
    public boolean addAll(Collection<? extends E> c) {
        addCount += c.size();
        return super.addAll(c);
    }

    public int getAddCount() {
        return addCount;
    }

    public static void main(String[] args) {
        InstrumentedSet<String> s = new InstrumentedSet<>(new HashSet<>());
        //java 9 지원
        //s.addAll(List.of("틱", "탁탁", "펑"));

        s.addAll(Arrays.asList("틱", "탁탁", "펑"));
        System.out.println(s.getAddCount());
    }
}

```
실행결과
```
3

Process finished with exit code 0

```
InstrumentedSet은 다른 (Set)을 감싸고(wrap) 있다고 해서 래퍼 클래스라 하며 Set의 계측 기능을 덧씌운다고 하는 의미에서
데코레이터 패턴이라고 한다.

래퍼클래스는 단점이 거의 없다. 한가지 래퍼 클래스가 콜백(callback) 프레임워크와는 어울리지 않는다

```java

package com.github.sejoung.codetest.composition;

// basic class which we will wrap
public class Model{
    private final Controller controller;

    Model(Controller controller){
        this.controller = controller;
        controller.register(this); //Pass SELF reference
    }

    public void makeChange(){
        System.out.println("기본 Model");
    }
}

``` 

```java

package com.github.sejoung.codetest.composition;

// wrapper class
public class ModelChangesCounter{
    private final Model model;
    private int changesMade;

    ModelChangesCounter(Model model){
        this.model = model;
    }

    // The wrapper is intended to count changes,
    // but those changes which are invoked from
    // Controller are just skipped
    public void makeChange(){
        model.makeChange();
        changesMade++;
        System.out.println(changesMade);
    }
}

```

```java

package com.github.sejoung.codetest.composition;

public class Controller{
    private Model model;

    public void register(Model model){
        this.model = model;
    }

    // Here the wrapper just fails to count changes,
    // because it does not know about the wrapped object
    // references leaked
    public void doChanges(){
        System.out.println("나다 나다");
        model.makeChange();
    }
}



```


```java

package com.github.sejoung.codetest.composition;

public class ControllerTest {
    public static void main(String[] args) {

        Controller c = new Controller();
        ModelChangesCounter m = new ModelChangesCounter(new Model(c));
        c.doChanges();

    }
}


```

실행결과

```
나다 나다
기본 Model

Process finished with exit code 0
```


위에선 간단한 콜백프레임워크이다 위코드에서 문제점은 controller.register(this); 자기 자신을 넘기는데

래퍼클래스를 호출하지만 실행이 제대로 되지 않는다. 이런문제를 SELF 문제라고 한다.

상속은 강력하지만 캡슐화를 해친다. 상속은 상위클래스와 하위클래스가 순수한 is a 관계일때만 써야 한다.
is a 관계일때도 안심할수만은 없는게 하위클래스의 패키지가 상위 클래스와 상위 클래스가 확정을 고려하지 않았다면
문제가 생긴다.

# 참조
-----
*[Wrapper Classes are not suited for callback frameworks](https://stackoverflow.com/questions/28254116/wrapper-classes-are-not-suited-for-callback-frameworks)