---
layout: post
title: "아이템 79. 과도한 동기하는 피하라."
date: 2019-03-26 11:34 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 79. 과도한 동기하는 피하라.

이전 상황을 동기화를 하지 않았을때 문제가 생기는 상황을 다뤘고 이번에는 과도하게 동기화를 했을때 생기는 문제를 다룰것이다.

응답 불가와 안전 실패를 피하려면 동기화 메서드나 동기화 블록 안에서는 제어를 절대로 클라이언트에 양도하면 안된다.

```java

package com.github.sejoung.codetest.concurrent.over;

import java.util.Collection;
import java.util.Iterator;
import java.util.Set;

// 재사용할 수 있는 전달 클래스 (118쪽의 코드 18-3 재사용)
public class ForwardingSet<E> implements Set<E> {

  private final Set<E> s;

  public ForwardingSet(Set<E> s) {
    this.s = s;
  }

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

package com.github.sejoung.codetest.concurrent.over;

// 집합 관찰자 콜백 인터페이스 (421쪽)
public interface SetObserver<E> {
  // ObservableSet에 원소가 더해지면 호출된다.
  void added(ObservableSet<E> set, E element);
}


```

```java

package com.github.sejoung.codetest.concurrent.over;


import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

// 관찰자 패턴을 구현하여, 원소가 추가되면 알려주는 집합 (420-425쪽)
public class ObservableSet<E> extends ForwardingSet<E> {

  // 코드 79-1 잘못된 코드. 동기화 블록 안에서 외계인 메서드를 호출한다. (420쪽)
  private final List<SetObserver<E>> observers = new ArrayList<>();

  public ObservableSet(Set<E> s) {
    super(s);
  }

  public void addObserver(SetObserver<E> observer) {
    synchronized (observers) {
      observers.add(observer);
    }
  }

  public boolean removeObserver(SetObserver<E> observer) {
    synchronized (observers) {
      return observers.remove(observer);
    }
  }

  private void notifyElementAdded(E element) {
    synchronized (observers) {
      for (SetObserver<E> observer : observers) {
        observer.added(this, element);
      }
    }
  }


  @Override
  public boolean add(E element) {
    boolean added = super.add(element);
    if (added) {
      notifyElementAdded(element);
    }
    return added;
  }

  @Override
  public boolean addAll(Collection<? extends E> c) {
    boolean result = false;
    for (E element : c) {
      result |= add(element);  // notifyElementAdded를 호출한다.
    }
    return result;
  }
}

```

```java

package com.github.sejoung.codetest.concurrent.over;

import java.util.HashSet;

// ObservableSet 동작 확인 #1 - 0부터 99까지 출력한다. (422쪽)
public class Test1 {

  public static void main(String[] args) {
    ObservableSet<Integer> set =
        new ObservableSet<>(new HashSet<>());

    set.addObserver((s, e) -> System.out.println(e));

    for (int i = 0; i < 100; i++) {
      set.add(i);
    }
  }
}


```
실행결과
```
0
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99

Process finished with exit code 0
```

위에 코드는 정상적으로 보인다 여기서 23이면 자신을 구독해지 하는 코드 하나를 추가 하겠다.

```java

package com.github.sejoung.codetest.concurrent.over;

import java.util.HashSet;

// ObservableSet 동작 확인 #2 - 정숫값이 23이면 자신의 구독을 해지한다. (422쪽)
public class Test2 {

  public static void main(String[] args) {
    ObservableSet<Integer> set =
        new ObservableSet<>(new HashSet<>());

    set.addObserver(new SetObserver<>() {
      public void added(ObservableSet<Integer> s, Integer e) {
        System.out.println(e);
        // 값이 23이면 자신을 구독해지한다.
        if (e == 23) {
          s.removeObserver(this);// 익명 클래스를 사용한 이유
        }
      }
    });

    for (int i = 0; i < 100; i++) {
      set.add(i);
    }
  }
}

```
실행결과
```
0
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
Exception in thread "main" java.util.ConcurrentModificationException
	at java.base/java.util.ArrayList$Itr.checkForComodification(ArrayList.java:1042)
	at java.base/java.util.ArrayList$Itr.next(ArrayList.java:996)
	at com.github.sejoung.codetest.concurrent.over.ObservableSet.notifyElementAdded(ObservableSet.java:36)
	at com.github.sejoung.codetest.concurrent.over.ObservableSet.add(ObservableSet.java:74)
	at com.github.sejoung.codetest.concurrent.over.Test2.main(Test2.java:23)

Process finished with exit code 1

```
위처럼 에러가 난다.

```java

package com.github.sejoung.codetest.concurrent.over;

import java.util.HashSet;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

// ObservableSet 동작 확인 #3
public class Test3 {

  public static void main(String[] args) {
    ObservableSet<Integer> set =
        new ObservableSet<>(new HashSet<>());

// 코드 79-2 쓸데없이 백그라운드 스레드를 사용하는 관찰자 (423쪽)
    set.addObserver(new SetObserver<>() {
      public void added(ObservableSet<Integer> s, Integer e) {
        System.out.println(e);
        if (e == 23) {
          ExecutorService exec =
              Executors.newSingleThreadExecutor();
          try {
            exec.submit(() -> s.removeObserver(this)).get();
          } catch (ExecutionException | InterruptedException ex) {
            throw new AssertionError(ex);
          } finally {
            exec.shutdown();
          }
        }
      }
    });

    for (int i = 0; i < 100; i++) {
      set.add(i);
    }
  }
}


```
실행결과
```
0
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
```
위에 처럼 백그라운드 쓰레드를 사용하면 교착상태에 빠진다.

동기화 블럭을 바깥으로 옴기면

```java

 // 코드 79-3 외계인 메서드를 동기화 블록 바깥으로 옮겼다. - 열린 호출 (424쪽)
  private void notifyElementAdded(E element) {
    List<SetObserver<E>> snapshot = null;
    synchronized (observers) {
      snapshot = new ArrayList<>(observers);
    }
    for (SetObserver<E> observer : snapshot) {
      observer.added(this, element);
    }
  }

```

이렇게 다시 2번과 3번 테스트를 수행하면 

2번 테스트 실행결과

```
0
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23

Process finished with exit code 0
```

3번 테스트 실행결과

```
0
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23

Process finished with exit code 0

```
위에 결과처럼 무리 없이 동작한다. 

또 다른 방법으로 CopyOnWriteArrayList를 사용하는 방법이 있다.

```java

package com.github.sejoung.codetest.concurrent.over;


import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArrayList;

// 관찰자 패턴을 구현하여, 원소가 추가되면 알려주는 집합 (420-425쪽)
public class ObservableSet<E> extends ForwardingSet<E> {

  // 코드 79-4 CopyOnWriteArrayList를 사용해 구현한 스레드 안전하고 관찰 가능한 집합 (425쪽)
  private final List<SetObserver<E>> observers = new CopyOnWriteArrayList<>();

  public ObservableSet(Set<E> s) {
    super(s);
  }

  public void addObserver(SetObserver<E> observer) {
    observers.add(observer);
  }

  public boolean removeObserver(SetObserver<E> observer) {
    return observers.remove(observer);
  }

  private void notifyElementAdded(E element) {
    for (SetObserver<E> observer : observers) {
      observer.added(this, element);
    }
  }

  @Override
  public boolean add(E element) {
    boolean added = super.add(element);
    if (added) {
      notifyElementAdded(element);
    }
    return added;
  }

  @Override
  public boolean addAll(Collection<? extends E> c) {
    boolean result = false;
    for (E element : c) {
      result |= add(element);  // notifyElementAdded를 호출한다.
    }
    return result;
  }
}

```
위에 처럼 수행하고 2번 3번 테스트를 진행하면

2번 테스트 실행결과
```
0
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23

Process finished with exit code 0
```

3번 테스트 실행결과
```
0
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23

Process finished with exit code 0
```

기본 규칙은 동기화 영역에서는 가능한 일을 적게 하는것이다.


# 참조
-----
* [understanding-alien-methods-in-java-concurrency](https://stackoverflow.com/questions/33665253/understanding-alien-methods-in-java-concurrency)

