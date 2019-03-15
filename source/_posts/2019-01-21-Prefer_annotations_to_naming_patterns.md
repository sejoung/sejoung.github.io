---
layout: post
title: "아이템 39. 명명 패턴보다는 애너테이션을 사용하라"
date: 2019-01-21 09:37 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 39. 명명 패턴보다는 애너테이션을 사용하라

junit3 버전과 junit4 버전에 차이점을 보면 테스트 메소드가 무조건 test라는 단어로 시작이 되어야 되었는데
junit4버전은 @Test 어너테이션으로 대체 되었다.

명명 패턴에 문제점

1. 오타가 나면 안된다.
1. 올바른 프로그램 요소만 사용되었다는 보장이 없다.(클래스명을 Test라고 지어도 매소드가 실행이 안될수도 있다.)
1. 프로그램요소를 매개변수로 전달할 방법이 없다.


```java

package com.github.sejoung.codetest.annotation.markerannotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 테스트 메서드임을 선언하는 애너테이션이다.
 * 매개변수 없는 정적 메서드 전용이다.
 */
// 런타임에도 유지되어야 한다.
@Retention(RetentionPolicy.RUNTIME)
// 메소드만 타겟이다.
@Target(ElementType.METHOD)
public @interface Test{

}


```

```java


package com.github.sejoung.codetest.annotation.markerannotation;

// 코드 39-2 마커 애너테이션을 사용한 프로그램 예 (239쪽)
public class Sample {
    @Test
    public static void m1() {
    }        // 성공해야 한다.

    public static void m2() {
    }

    @Test
    public static void m3() {    // 실패해야 한다.
        throw new RuntimeException("실패");
    }

    public static void m4() {
    }  // 테스트가 아니다.

    @Test
    public void m5() {
    }   // 잘못 사용한 예: 정적 메서드가 아니다.

    public static void m6() {
    }

    @Test
    public static void m7() {    // 실패해야 한다.
        throw new RuntimeException("실패");
    }

    public static void m8() {
    }
}



```

```java

package com.github.sejoung.codetest.annotation.markerannotation;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class RunTests {
    public static void main(String[] args) throws Exception {
        int tests = 0;
        int passed = 0;
        Class<?> testClass = Sample.class;

        for (Method m : testClass.getDeclaredMethods()) {
            if (m.isAnnotationPresent(Test.class)) {
                tests++;
                try {
                    m.invoke(null);
                    passed++;
                } catch (InvocationTargetException wrappedExc) {
                    Throwable exc = wrappedExc.getCause();
                    System.out.println(m + " 실패: " + exc);
                } catch (Exception exc) {
                    System.out.println("잘못 사용한 @Test: " + m);
                }
            }
        }
        System.out.printf("성공: %d, 실패: %d%n",
                passed, tests - passed);
    }
}

```
실행결과

```

public static void com.github.sejoung.codetest.annotation.markerannotation.Sample.m3() 실패: java.lang.RuntimeException: 실패
잘못 사용한 @Test: public void com.github.sejoung.codetest.annotation.markerannotation.Sample.m5()
public static void com.github.sejoung.codetest.annotation.markerannotation.Sample.m7() 실패: java.lang.RuntimeException: 실패
성공: 1, 실패: 3

Process finished with exit code 0

```

위와 같은 결과를 나타낸다. 이것은 리플렉션을 통한 테스트 방법이다.

그럼 특정 예외를 발생시켜야 성공하는 케이스를 만들면

```java

package com.github.sejoung.codetest.annotation.annotationwithparameter;


// 코드 39-4 매개변수 하나를 받는 애너테이션 타입 (240-241쪽)

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 명시한 예외를 던져야만 성공하는 테스트 메서드용 애너테이션
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface ExceptionTest {
    Class<? extends Throwable> value();
}

```

```java

package com.github.sejoung.codetest.annotation.annotationwithparameter;

// 코드 39-5 매개변수 하나짜리 애너테이션을 사용한 프로그램 (241쪽)
public class Sample2 {
    @ExceptionTest(ArithmeticException.class)
    public static void m1() {  // 성공해야 한다.
        int i = 0;
        i = i / i;
    }
    @ExceptionTest(ArithmeticException.class)
    public static void m2() {  // 실패해야 한다. (다른 예외 발생)
        int[] a = new int[0];
        int i = a[1];
    }
    @ExceptionTest(ArithmeticException.class)
    public static void m3() { }  // 실패해야 한다. (예외가 발생하지 않음)
}


```

```java

package com.github.sejoung.codetest.annotation.annotationwithparameter;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

// 마커 애너테이션과 매개변수 하나짜리 애너태이션을 처리하는 프로그램 (241-242쪽)
public class RunTests {
    public static void main(String[] args) throws Exception {
        int tests = 0;
        int passed = 0;
        Class<?> testClass = Sample2.class;

        for (Method m : testClass.getDeclaredMethods()) {
            if (m.isAnnotationPresent(ExceptionTest.class)) {
                tests++;
                try {
                    m.invoke(null);
                    System.out.printf("테스트 %s 실패: 예외를 던지지 않음%n", m);
                } catch (InvocationTargetException wrappedEx) {
                    Throwable exc = wrappedEx.getCause();
                    Class<? extends Throwable> excType =
                            m.getAnnotation(ExceptionTest.class).value();
                    if (excType.isInstance(exc)) {
                        passed++;
                    } else {
                        System.out.printf(
                                "테스트 %s 실패: 기대한 예외 %s, 발생한 예외 %s%n",
                                m, excType.getName(), exc);
                    }
                } catch (Exception exc) {
                    System.out.println("잘못 사용한 @ExceptionTest: " + m);
                }
            }
        }

        System.out.printf("성공: %d, 실패: %d%n",
                passed, tests - passed);
    }
}


```
실행결과
```
테스트 public static void com.github.sejoung.codetest.annotation.annotationwithparameter.Sample2.m2() 실패: 기대한 예외 java.lang.ArithmeticException, 발생한 예외 java.lang.ArrayIndexOutOfBoundsException: Index 1 out of bounds for length 0
테스트 public static void com.github.sejoung.codetest.annotation.annotationwithparameter.Sample2.m3() 실패: 예외를 던지지 않음
성공: 1, 실패: 2

Process finished with exit code 0

```

여기서 배열 매개변수를 받는것으로 수정을 하면

```java

package com.github.sejoung.codetest.annotation.annotationwitharrayparameter;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// 코드 39-6 배열 매개변수를 받는 애너테이션 타입 (242쪽)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface ExceptionTest {
    Class<? extends Exception>[] value();
}


```

```java

package com.github.sejoung.codetest.annotation.annotationwitharrayparameter;

import java.util.ArrayList;
import java.util.List;

// 배열 매개변수를 받는 애너테이션을 사용하는 프로그램 (242-243쪽)
public class Sample3 {
    // 이 변형은 원소 하나짜리 매개변수를 받는 애너테이션도 처리할 수 있다. (241쪽 Sample2와 같음)
    @ExceptionTest(ArithmeticException.class)
    public static void m1() {  // 성공해야 한다.
        int i = 0;
        i = i / i;
    }
    @ExceptionTest(ArithmeticException.class)
    public static void m2() {  // 실패해야 한다. (다른 예외 발생)
        int[] a = new int[0];
        int i = a[1];
    }
    @ExceptionTest(ArithmeticException.class)
    public static void m3() { }  // 실패해야 한다. (예외가 발생하지 않음)

    // 코드 39-7 배열 매개변수를 받는 애너테이션을 사용하는 코드 (242-243쪽)
    @ExceptionTest({ IndexOutOfBoundsException.class,
            NullPointerException.class })
    public static void doublyBad() {   // 성공해야 한다.
        List<String> list = new ArrayList<>();

        // 자바 API 명세에 따르면 다음 메서드는 IndexOutOfBoundsException이나
        // NullPointerException을 던질 수 있다.
        list.addAll(5, null);
    }
}


```


```java

package com.github.sejoung.codetest.annotation.annotationwitharrayparameter;

import java.lang.reflect.Method;

public class RunTests {
    public static void main(String[] args) throws Exception {
        int tests = 0;
        int passed = 0;
        Class<?> testClass = Sample3.class;
        for (Method m : testClass.getDeclaredMethods()) {

            // 배열 매개변수를 받는 애너테이션을 처리하는 코드 (243쪽)
            if (m.isAnnotationPresent(ExceptionTest.class)) {
                tests++;
                try {
                    m.invoke(null);
                    System.out.printf("테스트 %s 실패: 예외를 던지지 않음%n", m);
                } catch (Throwable wrappedExc) {
                    Throwable exc = wrappedExc.getCause();
                    int oldPassed = passed;
                    Class<? extends Throwable>[] excTypes =
                            m.getAnnotation(ExceptionTest.class).value();
                    for (Class<? extends Throwable> excType : excTypes) {
                        if (excType.isInstance(exc)) {
                            passed++;
                            break;
                        }
                    }
                    if (passed == oldPassed)
                        System.out.printf("테스트 %s 실패: %s %n", m, exc);
                }
            }
        }
        System.out.printf("성공: %d, 실패: %d%n",
                passed, tests - passed);
    }
}


```
실행결과

```

테스트 public static void com.github.sejoung.codetest.annotation.annotationwitharrayparameter.Sample3.m2() 실패: java.lang.ArrayIndexOutOfBoundsException: Index 1 out of bounds for length 0 
테스트 public static void com.github.sejoung.codetest.annotation.annotationwitharrayparameter.Sample3.m3() 실패: 예외를 던지지 않음
성공: 2, 실패: 2

Process finished with exit code 0

```

마지막으로 반복가능한 타입으로 

```java

package com.github.sejoung.codetest.annotation.repeatableannotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// 반복 가능한 애너테이션의 컨테이너 애너테이션 (244쪽)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface ExceptionTestContainer {
    ExceptionTest[] value();
}

```

```java

package com.github.sejoung.codetest.annotation.repeatableannotation;


import java.lang.annotation.*;

// 코드 39-8 반복 가능한 애너테이션 타입 (243-244쪽)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Repeatable(ExceptionTestContainer.class)
public @interface ExceptionTest {
    Class<? extends Throwable> value();
}


```

```java

package com.github.sejoung.codetest.annotation.repeatableannotation;

import java.util.ArrayList;
import java.util.List;

// 반복 가능한 애너테이션을 사용한 프로그램 (244쪽)
public class Sample4 {
    @ExceptionTest(ArithmeticException.class)
    public static void m1() {  // 성공해야 한다.
        int i = 0;
        i = i / i;
    }

    @ExceptionTest(ArithmeticException.class)
    public static void m2() {  // 실패해야 한다. (다른 예외 발생)
        int[] a = new int[0];
        int i = a[1];
    }

    @ExceptionTest(ArithmeticException.class)
    public static void m3() { }  // 실패해야 한다. (예외가 발생하지 않음)

    // 코드 39-9 반복 가능 애너테이션을 두 번 단 코드 (244쪽)
    @ExceptionTest(IndexOutOfBoundsException.class)
    @ExceptionTest(NullPointerException.class)
    public static void doublyBad() {
        List<String> list = new ArrayList<>();

        // 자바 API 명세에 따르면 다음 메서드는 IndexOutOfBoundsException이나
        // NullPointerException을 던질 수 있다.
        list.addAll(5, null);
    }
}

```

```java

package com.github.sejoung.codetest.annotation.repeatableannotation;

import java.lang.reflect.Method;

// 마커 애너테이션과 반복 가능 애너테이션을 처리하는 프로그램 (244-245쪽)
public class RunTests {
    public static void main(String[] args) throws Exception {
        int tests = 0;
        int passed = 0;
        Class testClass = Sample4.class;
        for (Method m : testClass.getDeclaredMethods()) {

            // 코드 39-10 반복 가능 애너테이션 다루기 (244-245쪽)
            if (m.isAnnotationPresent(ExceptionTest.class)
                    || m.isAnnotationPresent(ExceptionTestContainer.class)) {
                tests++;
                try {
                    m.invoke(null);
                    System.out.printf("테스트 %s 실패: 예외를 던지지 않음%n", m);
                } catch (Throwable wrappedExc) {
                    Throwable exc = wrappedExc.getCause();
                    int oldPassed = passed;
                    ExceptionTest[] excTests =
                            m.getAnnotationsByType(ExceptionTest.class);
                    for (ExceptionTest excTest : excTests) {
                        if (excTest.value().isInstance(exc)) {
                            passed++;
                            break;
                        }
                    }
                    if (passed == oldPassed)
                        System.out.printf("테스트 %s 실패: %s %n", m, exc);
                }
            }
        }
        System.out.printf("성공: %d, 실패: %d%n",
                passed, tests - passed);
    }
}


```
실행결과
```
테스트 public static void com.github.sejoung.codetest.annotation.repeatableannotation.Sample4.m2() 실패: java.lang.ArrayIndexOutOfBoundsException: Index 1 out of bounds for length 0 
테스트 public static void com.github.sejoung.codetest.annotation.repeatableannotation.Sample4.m3() 실패: 예외를 던지지 않음
성공: 2, 실패: 2

Process finished with exit code 0

```

자바 프로그래머라면 예외 없이 자바가 제공하는 어너테이션을 사용해야 한다.

# 참조
-----
* [august-2007-migrating-from-junit-3-to-junit-4-nothing-but-good-news](https://objectcomputing.com/resources/publications/sett/august-2007-migrating-from-junit-3-to-junit-4-nothing-but-good-news)

