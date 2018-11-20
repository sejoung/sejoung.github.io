---
layout: post
title: "Types_Of_References_In_Java"
date: 2018-11-20 14:16 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 자바의 레퍼런스 타입

자바의 레퍼런스 타입은 

1) Strong References

2) Soft References

3) Weak References

4) Phantom References

위에 4가지 타입으로 나눌수 있다. 

#### Strong References

```java

package com.github.sejoung.codetest.reference;

public class StrongReferenceTest {

    public static void main(String[] args) {
        A a = new A(); // 강한참조 StrongReferenceTest 에서 A 클래스는 강한 참조이다.

        a = null; // 이제 GC 대상이 된다.
    }
}

class A {

}


```
위에 코드는 강한 참조를 설명한것인데 a= null; 로 선언하면서 카비지 컬렉션의 대상이 된다 
왜냐 하면 엑티브된 참조가 사라지기 때문에 이제부터 가비지 컬렉터가 실행하기로 결정될때 가비지 컬렉팅 될 가능성이 높다.

#### Soft References

Soft References는 jvm이 메모리를 필요로 할때 GC가 됩니다.

```java

package com.github.sejoung.codetest.reference;

import java.lang.ref.SoftReference;

public class SoftReferencesTest {
    public static void main(String[] args) {
        B b = new B();

        SoftReference<B> softB = new SoftReference<B>(b);

        b = null;

        b = softB.get();


    }
}

class B {

}


```


#### Weak References

jvm에서는 Weak References는 무시 대상이다. 그냥 GC대상이 된다 GC가 되면 참조가 사라지면서 null을 반환함


```java

package com.github.sejoung.codetest.reference;

import java.lang.ref.WeakReference;

public class WeakReferencesTest {
    public static void main(String[] args) {

        C c = new C(); //Strong Reference

        WeakReference<C> weakC = new WeakReference<C>(c);

        c = null; // GC 대상

        c = weakC.get();

    }
}
class C {

}

```

위에 같은 경우에는 메모리에서 제거 되지 않은 경후 객체의 값을 반환하니 캐쉬를 쉽게 만들수 있는 방법이다.

#### Phantom References

여기서 유즈 케이스 2개를 볼수있는데 

하나는 객체가 메모리에서 언제 제거 되었는 확인한다. 메모리에 민감한 작업을 예약 할 수 있다.

```java

package com.github.sejoung.codetest.reference;

import java.lang.ref.PhantomReference;
import java.lang.ref.Reference;
import java.lang.ref.ReferenceQueue;

public class PhantomReferencesTest {
    public static void main(String[] args) throws InterruptedException {
        D d = new D();
        d.say();
        ReferenceQueue<D> refQueue = new ReferenceQueue<D>();
        PhantomReference<D> phantomRef = new PhantomReference<D>(d, refQueue);
        d = null;
        System.out.println(phantomRef.isEnqueued());// 큐에 들어갔는지 확인
        System.gc(); // gc를 강제하는데 하지 않으면 remove에서 무한대기
        System.out.println(phantomRef.isEnqueued());// 큐에 들어갔는지 확인
        Reference pr = refQueue.remove();
        d = phantomRef.get(); //null 반환
        d.say(); // NPE ㅜㅜ
    }
}

class D {
    public void say() {
        System.out.println("하하하");
    }
}

```

실행 결과

```
하하하
false
Exception in thread "main" java.lang.NullPointerException
	at com.github.sejoung.codetest.reference.PhantomReferencesTest.main(PhantomReferencesTest.java:19)
true

Process finished with exit code 1

```

두번째는 finalize method를 사용하지 않고 finalization 프로세스를 개선할수 있다.

```java

package com.github.sejoung.codetest.reference;

import java.lang.ref.PhantomReference;
import java.lang.ref.ReferenceQueue;

public class LargeObjectFinalizer extends PhantomReference<Object> {

    public LargeObjectFinalizer(
            Object referent, ReferenceQueue<? super Object> q) {
        super(referent, q);
    }

    public void finalizeResources() {
        // free resources
        System.out.println("clearing ...");
    }
}


```

위에 PhantomReference의 subclass 를 만들고

```java

package com.github.sejoung.codetest.reference;

import java.lang.ref.PhantomReference;
import java.lang.ref.Reference;
import java.lang.ref.ReferenceQueue;
import java.util.ArrayList;
import java.util.List;

public class LargeObjectFinalizerTest {
    public static void main(String[] args) {
        ReferenceQueue<Object> referenceQueue = new ReferenceQueue<>();
        List<LargeObjectFinalizer> references = new ArrayList<>();
        List<Object> largeObjects = new ArrayList<>();

        for (int i = 0; i < 10; ++i) {
            Object largeObject = new Object();
            largeObjects.add(largeObject);
            references.add(new LargeObjectFinalizer(largeObject, referenceQueue));
        }

        largeObjects = null;
        System.gc();

        Reference<?> referenceFromQueue;
        for (PhantomReference<Object> reference : references) {
            System.out.println(reference.isEnqueued());
        }

        while ((referenceFromQueue = referenceQueue.poll()) != null) {
            ((LargeObjectFinalizer)referenceFromQueue).finalizeResources();
            referenceFromQueue.clear();
        }
    }
}


```
실행결과
```

true
true
true
true
true
true
true
true
true
true
clearing ...
clearing ...
clearing ...
clearing ...
clearing ...
clearing ...
clearing ...
clearing ...
clearing ...
clearing ...

Process finished with exit code 0

```

# 참조
-----
* [types-references-java](https://www.geeksforgeeks.org/types-references-java/)
* [java-phantom-reference](https://www.baeldung.com/java-phantom-reference)