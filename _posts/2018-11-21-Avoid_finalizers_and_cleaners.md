---
layout: post
title: "Avoid_finalizers_and_cleaners"
date: 2018-11-21 14:05 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 7. Finalizer와 Cleaner의 사용은 피하라

finalize() 메소드에 대한 설명

```

가비지 수집에 의해 개체에 대한 참조가 더 이상 없다고 판단 될 때 개체의 가비지 수집기가 호출합니다. 서브 클래스 finalize는 시스템 자원을 처리하거나 다른 정리를 수행 하는 메소드를 대체합니다 .
일반적인 계약의 finalize취지는, Java ™ 가상 머신이, 액션의 결과를 제외하면 (자),이 객체에 아직 액세스 할 수 없었던 thread가 액세스 할 수없는 수단이 없다고 판단했을 경우에 불려갑니다. 최종 완성 될 준비가되어있는 다른 객체 또는 클래스의 완성으로 finalize방법은 다른 thread로 다시 이용 가능하게하는이 객체을 포함한 모든 조치를 취할 수있다; finalize그러나 객체의 취소 불가능한 폐기가 일어나기 전에 정리 작업을 수행하는 것이 일반적인 목적입니다 . 예를 들어 입출력 연결을 나타내는 객체의 finalize 메서드는 객체가 영구적으로 버려지기 전에 명시 적 I / O 트랜잭션을 수행하여 연결을 끊을 수 있습니다.

finalize클래스 의 메서드는 Object특별한 동작을 수행하지 않습니다. 단순히 정상적으로 반환됩니다. 의 서브 클래스는 Object이 정의를 오버라이드 (override ) 할 수 있습니다.

Java 프로그램 언어는 어떤 스레드가 finalize주어진 객체에 대해 메소드를 호출 할지는 보증하지 않습니다 . 그러나 finalize를 호출하는 스레드는 finalize가 호출 될 때 사용자가 볼 수있는 동기화 잠금을 보유하지 않습니다. catch되지 않는 예외가 finalize 메소드에 의해 발생되면 예외는 무시되고 해당 객체의 종료가 종료됩니다.

finalize객체에 대해서 메소드가 불려 가면 (자), Java 가상 머신이,이 객체가 아직 죽지 않고있는 thread에 의해 액세스 할 수있는 수단이 없어 졌다고 다시 결정할 때까지, 그 이외의 액션은 행해지 지 않습니다. 완성 될 준비가되어있는 다른 객체 또는 클래스는 그 시점에서 객체가 삭제 될 수 있습니다.

이 finalize메소드는 지정된 객체에 대해 Java 가상 머신에 의해 두 번 이상 호출되지 않습니다.

finalize메서드에 의해 throw 된 예외가 발생 하면이 객체의 종료가 중지되지만 그렇지 않으면 무시됩니다.

```

jdk 9

```

Deprecated

마무리 메커니즘은 본질적으로 문제가 있습니다. 마무리 작업으로 인해 성능 문제, 교착 상태 및 중단이 발생할 수 있습니다. 
파이널 라이저의 오류로 인해 리소스가 누출 될 수 있습니다. 더 이상 필요하지 않으면 종료를 취소 할 수있는 방법이 없습니다. 
finalize다른 오브젝트의 메소드에의 호출에서는 순서 부를 지정하지 않습니다 . 또한 최종 확정시기에 대한 보장은 없습니다. 이 finalize메소드는 무제한 지연 후에 만 ​최종 객체에 호출 될 수 있습니다. 
인스턴스가 힙이 아닌 자원을 보유하는 클래스는 해당 자원의 명시 적 릴리스를 가능하게하는 메소드를 제공해야하며, AutoCloseable적절한 경우 구현해야합니다 . 
Cleaner및 PhantomReference 객체 도달 할 수 없을 때 리소스를 해제하기 위해보다 유연하고 효율적인 방법을 제공합니다.

```

C++에서의 destructor랑 다른것이다 자바에서 자원 반납은 try-with-resources또는 try-finally 블럭을 통해서 한다.

단점 1. 언제 실행 할지 알수가 없다. gc의 실행을 보장 할수 없다.

```java

package com.github.sejoung.codetest.object;

public class FinalizerSample {
    @Override
    protected void finalize() throws Throwable {
        super.finalize();
        System.out.println("finalize 종료");
    }
}

```

위에선 finalize를 Override 해서 구현했고 아래는 실행 코드이다.

```java

package com.github.sejoung.codetest.object;

public class FinalizerTest {
    public static void main(String[] args) {
        FinalizerSample fs = new FinalizerSample();

        fs = null; // 자원 회수
        
        System.gc();
        
        System.out.println("메롱");

    }
}


```

실행결과 

```

메롱
finalize 종료

Process finished with exit code 0

```

아래는 Cleaner 예제 코드이다. jdk8기준 

jdk9 이상부터는 java.lang.ref.Cleaner가 추가 되었다 책에서는 9이상으로 말한다.

```java

package com.github.sejoung.codetest.object;

public class MyObject {
    private String id;

    public MyObject(String id) {
        this.id = id;
    }
}


```

```java

package com.github.sejoung.codetest.object;


import org.omg.Messaging.SYNC_WITH_TRANSPORT;
import sun.misc.Cleaner;

public class CleanerExample {
    public static void main(String[] args) throws InterruptedException {

        for (int i = 0; i < 10; i++) {
            String id = Integer.toString(i);
            MyObject myObject = new MyObject(id);
            Cleaner.create(myObject, ()->{
                //System.out.println("gc "+myObject.getId());
                System.out.printf("MyObject with id %s, is gc'ed%n", id);

            });
            myObject = null;
        }

        System.gc();

        Thread.sleep(10000);

    }

}

```

실행결과

```

MyObject with id 6, is gc'ed
MyObject with id 3, is gc'ed
MyObject with id 4, is gc'ed
MyObject with id 5, is gc'ed
MyObject with id 7, is gc'ed
MyObject with id 8, is gc'ed
MyObject with id 9, is gc'ed
MyObject with id 0, is gc'ed
MyObject with id 1, is gc'ed
MyObject with id 2, is gc'ed

Process finished with exit code 0


```


위에처럼 코드를 짜면 GC가 될때 run 메소드를 호출해서 정리작업을 진행할수 있다.


위에 보듯이 gc를 해도 언제 gc가 되는지는 모른다. 

단점 2. Finalizer는 인스턴스 반납을 지연시킨다. 우선순위가 낮아서 언제 실행 될지 모름 GC가 안되면 OutOfMomoryException가 발생할수도 있다.

단점 3. 즉시는 실행 안되도 아에 실행이 안될수도 있다. System.gc나 System.runFinalization에 속지 말라. 그걸 실행해도 Finalizer나 Cleaner를 바로 실행한다고 보장하진 못한다. 그걸 보장해주겠다고 만든 System.runFinalizersOnExit와 그 쌍둥이 Runtime.runFinalizersOnExit은 둘다 망했고 수십년간 deprecated 상태다(쓰레드 스탑).

위에 코드에서 System.gc();를 빼면 

```java

package com.github.sejoung.codetest.object;

public class FinalizerTest {
    public static void main(String[] args) {
        FinalizerSample fs = new FinalizerSample();

        fs = null; // 자원 회수       
        System.out.println("메롱");

    }
}

```

실행결과 

```

메롱

Process finished with exit code 0

```

위에처럼 main 쓰레드가 끝날때까지 안된다.

단점 4. AutoCloseable를 구현한 객체를 만들고 try-with-resource로 자원 반납 하는데 12ns 인데 Finalizer를 사용하면 
550ns 약 50배 Cleaner를 사용한경우 66ns 약 5배

단점 5. Finalizer 공격이라는 심각한 보안 이슈에도 이용 [finalizer-attack](https://yangbongsoo.gitbooks.io/study/content/finalizer-attack.html)

Finalizer와 Cleaner를 안전망으로 쓰기 이부분은 AutoCloseable 구현 하고 안전망으로 하는 예제가 FileInputStream, FileOutputStream, ThreadPoolExecutor 그리고 java.sql.Connection에는 안전망으로 동작하는 finalizer가 있다.

Cleaner를 안전망으로 활용 

```java

package com.github.sejoung.codetest.object;

import java.lang.ref.Cleaner;

// 코드 8-1 cleaner를 안전망으로 활용하는 AutoCloseable 클래스 (44쪽)
public class Room implements AutoCloseable {
    private static final Cleaner cleaner = Cleaner.create();

    // 청소가 필요한 자원. 절대 Room을 참조해서는 안 된다!
    private static class State implements Runnable {
        int numJunkPiles; // Number of junk piles in this room

        State(int numJunkPiles) {
            this.numJunkPiles = numJunkPiles;
        }

        // close 메서드나 cleaner가 호출한다.
        @Override public void run() {
            System.out.println("Cleaning room "+ numJunkPiles);
            numJunkPiles = 0;
        }
    }

    // 방의 상태. cleanable과 공유한다.
    private final State state;

    // cleanable 객체. 수거 대상이 되면 방을 청소한다.
    private final Cleaner.Cleanable cleanable;

    public Room(int numJunkPiles) {
        state = new State(numJunkPiles);
        cleanable = cleaner.register(this, state);
    }

    @Override public void close() {
        cleanable.clean();
    }
}
```

잘된 코드

```java

package com.github.sejoung.codetest.object;

public class RoomTest {
    public static void main(String[] args) {
        try (Room myRoom = new Room(7)) {
            System.out.println("안녕~");
        }
    }
}


```

실행결과

```
안녕~
Cleaning room 7

Process finished with exit code 0
```

잘못된코드 

```java

package com.github.sejoung.codetest.object;

public class RoomTest {
    public static void main(String[] args) {
        new Room(99);
        System.out.println("안되~");
    }
}

```
실행결과

```
안되~

Process finished with exit code 0
```

위에서는 close가 안되었지만 나중에 gc가 될때 자원회수가 된다. 그것을 보기 위해 System.gc();를 추가

```java

package com.github.sejoung.codetest.object;

public class RoomTest {
    public static void main(String[] args) {
        new Room(99);
        System.gc();
        System.out.println("안되~");
    }
}


```

실행결과

```

안되~
Cleaning room 99

```


# 참조
-----
* [[이팩티브 자바] #8 Finalizer와 Cleaner 쓰지 마세요](https://www.youtube.com/watch?v=sdPdpMYqW_k)
* [jdk 9 doc](https://docs.oracle.com/javase/9/docs/api/java/lang/Object.html)
* [cleaner](https://www.logicbig.com/tutorials/core-java-tutorial/gc/ref-cleaner.html)
* [finalizer-attack](https://yangbongsoo.gitbooks.io/study/content/finalizer-attack.html)