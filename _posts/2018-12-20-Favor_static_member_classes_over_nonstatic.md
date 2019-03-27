---
layout: post
title: "아이템 24. 맴버클래스는 되도록 static으로 만들자"
date: 2018-12-20 10:53 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

## 이펙티브 자바

### 아이템 24. 맴버클래스는 되도록 static으로 만들자

ava 프로그래밍 언어를 사용하면 다른 클래스에서 클래스를 정의 할 수 있습니다. 
이러한 클래스는 중첩 클래스(Nested Classes) 라고하며 여기에 설명되어 있습니다.

```java

class OuterClass {
    ...
    class NestedClass {
        ...
    }
}

```


중첩 클래스는 정적 및 비 정적이라는 두 가지 범주로 나뉩니다. 
static 선언 된 중첩 클래스 는 정적 중첩 클래스 라고 합니다. 
비 정적 중첩 클래스는 내부 클래스 라고 합니다.

```java

class OuterClass {
    ...
    static class StaticNestedClass {
        ...
    }
    class InnerClass {
        ...
    }
}

```

중첩 클래스를 사용하는 이유

* 한 곳에서만 사용되는 클래스를 논리적으로 그룹화하는 방법입니다 . 
한 클래스가 다른 한 클래스에 유용하면 그 클래스에 클래스를 포함시키고 두 클래스를 함께 유지하는 것이 논리적입니다. 
이러한 "헬퍼 클래스"를 중첩하면 패키지가보다 간결 해집니다.

* 그것은 캡슐화를 증가시킵니다 . A와 B라는 두 개의 최상위 클래스를 고려하십시오. 
여기서 B는 선언되지 않으면 A의 멤버에게 액세스해야합니다 private. A 클래스 내의 B 클래스를 숨김으로써 A 멤버는 비공개로 선언 될 수 있고 B 멤버는 비공개로 선언 될 수 있습니다. 또한 B 자체는 외부 세계로부터 숨길 수 있습니다.

* 보다 읽기 쉽고 유지 보수가 쉬운 코드로 이어질 수 있습니다 . 최상위 클래스의 작은 클래스를 중첩하면 코드가 사용되는 위치에 가깝게 배치됩니다.


정적 중첩 클래스

클래스 메소드 및 변수와 마찬가지로 정적 중첩 클래스는 외부 클래스와 연관됩니다. 정적 클래스 메소드와 마찬가지로 정적 중첩 클래스는 객체 클래스 또는 객체 클래스에 정의 된 메소드를 직접 참조 할 수 없으며 객체 참조를 통해서만 사용할 수 있습니다.

정적 중첩 클래스는 다른 최상위 클래스와 마찬가지로 외부 클래스 (및 다른 클래스)의 인스턴스 멤버와 상호 작용합니다. 실제로, 정적 중첩 클래스는 행동 상으로는 패키징 편의를 위해 다른 최상위 클래스에 중첩 된 최상위 클래스입니다.

Static Nested Classes

```java

OuterClass.StaticNestedClass nestedObject = new OuterClass.StaticNestedClass();

```

Inner Classes

```java

class OuterClass {
    ...
    class InnerClass {
        ...
    }
}


```

```java

OuterClass.InnerClass innerObject = outerObject.new InnerClass();

```

위처럼 내부 클래스에는 local classes 와 anonymous classes 두가지에 특별한 경우가 있다.

로컬클래스의 예제는 

```java

package com.github.sejoung.codetest.nested;

public class LocalClassExample {

    static String regularExpression = "[^0-9]";

    public static void validatePhoneNumber(
            String phoneNumber1, String phoneNumber2) {

        final int numberLength = 10;

        // Valid in JDK 8 and later:

        // int numberLength = 10;

        class PhoneNumber {

            String formattedPhoneNumber = null;

            PhoneNumber(String phoneNumber) {
                // numberLength = 7;
                String currentNumber = phoneNumber.replaceAll(
                        regularExpression, "");
                if (currentNumber.length() == numberLength)
                    formattedPhoneNumber = currentNumber;
                else
                    formattedPhoneNumber = null;
            }

            public String getNumber() {
                return formattedPhoneNumber;
            }

            // Valid in JDK 8 and later:

//            public void printOriginalNumbers() {
//                System.out.println("Original numbers are " + phoneNumber1 +
//                    " and " + phoneNumber2);
//            }
        }

        PhoneNumber myNumber1 = new PhoneNumber(phoneNumber1);
        PhoneNumber myNumber2 = new PhoneNumber(phoneNumber2);

        // Valid in JDK 8 and later:

//        myNumber1.printOriginalNumbers();

        if (myNumber1.getNumber() == null)
            System.out.println("First number is invalid");
        else
            System.out.println("First number is " + myNumber1.getNumber());
        if (myNumber2.getNumber() == null)
            System.out.println("Second number is invalid");
        else
            System.out.println("Second number is " + myNumber2.getNumber());

    }

    public static void main(String... args) {
        validatePhoneNumber("123-456-7890", "456-7890");
    }
}

```
실행결과
```
First number is 1234567890
Second number is invalid

Process finished with exit code 0
```

위에 소스는 2개의 번호에 벨리데이션을 체크하는로직이다.

번호를 2개 입력받아서 숫자타입인지 정규식으로 체크하고 길이가 10자리인지 체크하는 로직이다.


```java

  private String name;
    public void greetInEnglish() {
        interface HelloThere {
            public void greet();
        }
        class EnglishHelloThere implements HelloThere {
            public void greet() {
                System.out.println("Hello " + name);
            }
        }
        HelloThere myGreeting = new EnglishHelloThere();
        myGreeting.greet();
    }

```

위에 코드는 에러가 난다 왜냐고 하면 localclass는 interface를 선언할수 없다.  인터페이스는 본질적으로 정적이다.


```java

    public void sayGoodbyeInEnglish () {
        class EnglishGoodbye {
            public static void sayGoodbye () {
                System.out.println ( "안녕히 가세요");
            }
        }
        EnglishGoodbye.sayGoodbye ();
    }

```

로컬 클래스에서는 static 메소드를 선언 할수 없다.

```java

    public void sayGoodbyeInEnglish() {
        class EnglishGoodbye {
            public static final String farewell = "Bye bye";
            public void sayGoodbye() {
                System.out.println(farewell);
            }
        }
        EnglishGoodbye myEnglishGoodbye = new EnglishGoodbye();
        myEnglishGoodbye.sayGoodbye();
    }

```

위에 코드는 정상 동작한다 상수 변수를 제공하면 정적 맴버를 가질수 있다.

그럼 익명 클래스에대해서 설명한다.

```java

package com.github.sejoung.codetest.nested;

public class HelloWorldAnonymousClasses {

    interface HelloWorld {
        public void greet();
        public void greetSomeone(String someone);
    }

    public void sayHello() {

        class EnglishGreeting implements HelloWorld {
            String name = "world";
            public void greet() {
                greetSomeone("world");
            }
            public void greetSomeone(String someone) {
                name = someone;
                System.out.println("Hello " + name);
            }
        }

        HelloWorld englishGreeting = new EnglishGreeting();

        HelloWorld frenchGreeting = new HelloWorld() {
            String name = "tout le monde";
            public void greet() {
                greetSomeone("tout le monde");
            }
            public void greetSomeone(String someone) {
                name = someone;
                System.out.println("Salut " + name);
            }
        };

        HelloWorld spanishGreeting = new HelloWorld() {
            String name = "mundo";
            public void greet() {
                greetSomeone("mundo");
            }
            public void greetSomeone(String someone) {
                name = someone;
                System.out.println("Hola, " + name);
            }
        };
        englishGreeting.greet();
        frenchGreeting.greetSomeone("Fred");
        spanishGreeting.greet();
    }

    public static void main(String... args) {
        HelloWorldAnonymousClasses myApp =
                new HelloWorldAnonymousClasses();
        myApp.sayHello();
    }
}


```

실행 결과

```

Hello world
Salut Fred
Hola, mundo

Process finished with exit code 0

```
로컬 클래스는 클래스 선언이지만 익명 클래스는 표현식이므로 다른 표현식에서 클래스를 정의해야합니다


```java

package com.github.sejoung.codetest.nested;

public class ShadowTest {

    public int x = 0;

    class FirstLevel {

        public int x = 1;

        void methodInFirstLevel(int x) {
            System.out.println("x = " + x);
            System.out.println("this.x = " + this.x);
            System.out.println("ShadowTest.this.x = " + ShadowTest.this.x);
        }
    }

    public static void main(String... args) {
        ShadowTest st = new ShadowTest();
        ShadowTest.FirstLevel fl = st.new FirstLevel();
        fl.methodInFirstLevel(23);
    }
}



```
실행결과
```
x = 23
this.x = 1
ShadowTest.this.x = 0

Process finished with exit code 0
```

위에서는 변수에대한 쉐도잉에대해서 볼수가 있다.


중첩클래스에 대해서 살펴 보았다. 

여기서 맴버클래스에서 외부 인스턴스에 접근할일이 있다면 무조건 static을 붙혀서 정적맴버클래스로 만들자
static을 생략하면 숨은참조를 가지게 되어 메모리누수 현상이 생길수도 있다.

중첩클래스는 위에서 말한 4가지 종류가 있고 각각쓰임세가 틀리다 쓰임세에 맞게 잘만들어야 된다.


# 참조
-----
* [Nested Classes](https://docs.oracle.com/javase/tutorial/java/javaOO/nested.html)


