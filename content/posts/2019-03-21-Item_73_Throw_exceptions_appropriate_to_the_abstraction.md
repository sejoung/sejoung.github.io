---
layout: post
title: "아이템 73. 추상화 수준에 맞는 예외를 던져라."
date: 2019-03-21 10:05 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 73. 추상화 수준에 맞는 예외를 던져라.

상위 계층에서는 저수준의 예외를 잡아 자신에 추상화 수준에 맞는 예외를 던져야 된다.(exception translation)

1. 저수준의 예외가 도움이 되면 예외 연쇄를 이용하라.(exception chaining)

1. 무턱대고 예외를 던지는 것 보다는 예외 번역이 좋지만 남용하면 안된다.

#### 예외 연쇄

Throwable 에서 예외 연쇄를 지원하는 메소드는

```java

Throwable getCause()
Throwable initCause(Throwable)
Throwable(String, Throwable)
Throwable(Throwable)

```

Throwable 생성자에서 인수를 initCause 에 넘기고  Throwable 생성 시키고 현재 원인은 getCause 로 확인 가능 다시 원인을 설정할때는 initCause를 사용

```java

try {

} catch (IOException e) {
    throw new SampleException("Other IOException", e);
}

```
이 예제에서  IOException이 발견되면 SampleException 원래의 원인이 첨부 된 새로운 예외가 생성되고 예외 체인이 다음 상위 수준의 예외 처리기까지 처리됩니다.

##### 스택 추적 정보 액세스

이제 더 높은 수준의 예외 처리기가 스택 추적을 자체 형식으로 덤프하려고한다고 가정 해 봅시다.

다음 코드는 getStackTrace예외 객체 에서 메서드 를 호출하는 방법을 보여줍니다 .

```java

catch (Exception cause) {
    StackTraceElement elements[] = cause.getStackTrace();
    for (int i = 0, n = elements.length; i < n; i++) {       
        System.err.println(elements[i].getFileName()
            + ":" + elements[i].getLineNumber() 
            + ">> "
            + elements[i].getMethodName() + "()");
    }
}

```
정의 : 스택 트레이스는 현재 스레드의 실행 내역에 대한 정보를 제공하고, 예외가 발생했을 때 지점에서 호출 된 클래스와 메소드의 이름을 나열합니다. 
스택 추적은 예외가 발생할 때 일반적으로 활용할 수있는 유용한 디버깅 도구입니다.

##### 로깅 API

다음 코드 스 니펫은 catch블록 내에서 예외가 발생한 위치를 기록합니다. 
그러나 수동으로 스택 추적을 구문 분석하고 출력을 System.err()로 보내지 않고 java.util.logging 패키지 의 로깅 기능을 사용하여 출력을 파일로 보냅니다.

```java

try {
    Handler handler = new FileHandler("OutFile.log");
    Logger.getLogger("").addHandler(handler);
    
} catch (IOException e) {
    Logger logger = Logger.getLogger("package.name"); 
    StackTraceElement elements[] = e.getStackTrace();
    for (int i = 0, n = elements.length; i < n; i++) {
        logger.log(Level.WARNING, elements[i].getMethodName());
    }
}

```


# 참조
-----
* [Throwable api](https://docs.oracle.com/javase/7/docs/api/java/lang/Throwable.html)
* [Chained Exceptions](https://docs.oracle.com/javase/tutorial/essential/exceptions/chained.html)