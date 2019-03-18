---
layout: post
title: "java_가변인수(varargs)"
date: 2019-01-07 10:11 +0900
comments: true
tags : ["varargs"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### 가변인수(varargs)

Java 메소드를 생성한다고 가정합시다 . 그러나 메소드가 받아 들일 인수가 얼마나 많은지 확실하지 않습니다. 이 문제를 해결하기 위해 Java 1.5에서는 가변 인수가 도입되었습니다.

Varargs는 가변 인수에 대한 짧은 이름입니다. Java에서 메소드의 인수는 임의의 수의 값을 허용 할 수 있습니다. 가변 개수의 값을 수용 할 수있는이 인수는 varargs라고합니다.

varargs를 구현하는 구문은 다음과 같습니다.

```java

accessModifier methodName(datatype… arg) {
    // method body
}

```

vararg를 정의하기 위해 ... , 메소드의 형식 매개 변수에 (3 개의 점)이 사용됩니다.

가변 개수의 인수를 취하는 메소드를 가변 인수 메소드 또는 단순히 varargs 메소드라고합니다.

먼저, varargs를 사용하지 않는 예제를 보자 :

```java

package com.github.sejoung.codetest.vararg;

public class NoVararg {

    public int sumNumber(int a, int b){
        return a+b;
    }

    public int sumNumber(int a, int b, int c){
        return a+b+c;
    }

    public static void main( String[] args ) {
        NoVararg obj = new NoVararg();
        System.out.println(obj.sumNumber(1, 2));
        System.out.println(obj.sumNumber(1, 2, 3));
    }
}

```
실행결과
```
3
6

Process finished with exit code 0
```

분명히 알 수 있듯이 sumNumber()메서드를 오버로드 하여 3 가지 인수로 작동하도록해야했습니다.

사용자가 5 자리 또는 10 자리 또는 100 자리를 추가하려면 어떻게해야합니까?

이것은 varargs를 사용하여 깔끔하게 처리 할 수 있습니다. 코드 예제를 보자.


```java

package com.github.sejoung.codetest.vararg;

public class VarargExample {
    public int sumNumber(int ... args){
        System.out.println("argument length: " + args.length);
        int sum = 0;
        for(int x: args){
            sum += x;
        }
        return sum;
    }

    public static void main( String[] args ) {
        VarargExample ex = new VarargExample();

        int sum2 = ex.sumNumber(2, 4);
        System.out.println("sum2 = " + sum2);

        int sum3 = ex.sumNumber(1, 3, 5);
        System.out.println("sum3 = " + sum3);

        int sum4 = ex.sumNumber(1, 3, 5, 7);
        System.out.println("sum4 = " + sum4);
    }
}


```
실행결과
```

argument length: 2
sum2 = 6
argument length: 3
sum3 = 9
argument length: 4
sum4 = 16

Process finished with exit code 0

```

sumNumber()메서드는 int전달 된 매개 변수 의 합계를 반환합니다 (전달 된 인수의 수는 중요하지 않음).

보시다시피, varargs는 어떤 상황에서는 정말 유용 할 수 있습니다. 그러나 메서드에 전달 된 인수의 수가 확실하면 대신 메서드 오버로드를 사용합니다. 예를 들어, sumNumber()메소드가 2 또는 3 인수의 합계를 계산하는 데에만 사용 된다는 것이 확실 하면 첫 번째 예와 같이 오버로드를 사용하십시오.

다른 예를 들면 jdk에 포함된 String.format() 메소드도 있다.

```java

public static String format(String format, Object... args) {
    return new Formatter().format(format, args).toString();
}

```

실행 예는 

```java

package com.github.sejoung.codetest.vararg;

public class Company {
    public static void main(String[] args) {
        String siteName = "programiz.com";
        int empCount = 6;
        String type = "tutorial website";
        System.out.println(
                String.format(
                        "Site Name : %s, Emp Count: %d Type: %s",
                        siteName, empCount, type
                )
        );
    }
}


```
실행결과
```

Site Name : programiz.com, Emp Count: 6 Type: tutorial website

Process finished with exit code 0

```

#### 가변인자가 작동하는 방법은?

아래의 pseudo code를 보면

```java

public int sumNumber(int ... nums) {
    // method body
}

```
...구문은 방법은 0 개 이상의 인수로 호출 할 수있는 자바 컴파일러를 알려줍니다. 결과적으로 num 변수는 암시 적 으로 유형 의 배열 로 선언됩니다 int[ ]. 따라서 메서드 내에서 nums 변수는 배열 구문을 사용하여 액세스됩니다.

인수가없는 경우 num 의 길이 는 0입니다.

#### Varargs 메소드 오버로딩

일반적인 방법과 마찬가지로 vararg 메소드를 오버로드 할 수 있습니다.


```java

package com.github.sejoung.codetest.vararg;

public class VarargOverload {
    private void test(int ... args){
        int sum = 0;
        for (int i: args) {
            sum += i;
        }
        System.out.println("sum = " + sum);
    }

    private void test(boolean p, String ... args){
        boolean negate = !p;
        System.out.println("negate = " + negate);
        System.out.println("args.length = "+ args.length);
    }

    public static void main( String[] args ) {
        VarargOverload obj = new VarargOverload();
        obj.test(1, 2, 3);
        obj.test(true, "hello", "world");
    }
}


```
실행결과
```
sum = 6
negate = false
args.length = 2

Process finished with exit code 0
```

#### Varargs를 사용하는 동안 기억해야 할 사항

Java vargars로 작업하는 동안 기억해야 할 몇 가지 사항이 있습니다.

* 메서드 시그니처를 정의하는 동안 항상 마지막에 varargs를 유지하십시오.

가변 인수는 메소드에 전달 된 마지막 인수 여야합니다. 다음 doSomething()과 같이 메소드 를 호출했다고 가정 해 보겠습니다 .

```java
    public static void main(String[] args) {
        VarargTest vararg = new VarargTest();
        vararg.doSomething (1, 2, 3, 4);

    }

```

잘못된 코드는

```java

package com.github.sejoung.codetest.vararg;

public class VarargTest {

    private void doSomething(int ... nums, int p){

    }

    public static void main(String[] args) {
        VarargTest vararg = new VarargTest();
        vararg.doSomething (1, 2, 3, 4);
    }
}

    
```

컴파일이 안됩니다.

정상 코드는 

```java

package com.github.sejoung.codetest.vararg;

public class VarargTest {
    private void doSomething(int p, int ... nums){

    }

    public static void main(String[] args) {
        VarargTest vararg = new VarargTest();
        vararg.doSomething (1, 2, 3, 4);

    }
}


```

* 메소드에는 하나의 varargs 매개 변수 만있을 수 있습니다.

```java

    private int doSomething (int p, float ... floatNums, double ... doubleNums) {
        return 1;
    }

```

#### Varargs 메서드 오버로드의 모호함

다음 test()과 같이 오버로드 된 메소드를 고려해 보겠습니다 .



```java

package com.github.sejoung.codetest.vararg;

public class Demo {
    private void test(int ... vargs) {
        System.out.println("첫번째");
    }

    private void test(int n, int ... vargs) {
        System.out.println("두번째");
    }

    public static void main(String[] args) {
        Demo demo = new Demo();

        demo.test(1,2,3,4);


    }
}


```

위의 프로그램에서 메소드가 오버로드되고 다른 수의 인수를 허용 test()하더라도 test()메소드 를 호출하려고하면 컴파일러가 혼란스러워집니다 .

컴파일러는 호출 할 메소드를 알지 못합니다. 컴파일러는 test(int ... vargs)하나의 varargs 인수를 사용 하여 호출하려고한다고 생각할 수 있습니다 . 또한 컴파일러는 test(int n, int ... vargs)빈 매개 변수 두 번째 매개 변수를 사용하여 첫 번째 매개 변수에 전달 된 인수 로 호출하려고한다고 생각할 수 있습니다 .

두 가지 가능성이 있으므로 모호성이 발생합니다. 이 때문에 때때로 varargs 메소드를 오버로드하는 대신 두 개의 다른 메소드 이름을 사용해야 할 수도 있습니다.

# 참조
-----
* [varargs programiz](https://www.programiz.com/java-programming/varargs)
* [varargs](https://docs.oracle.com/javase/8/docs/technotes/guides/language/varargs.html)


