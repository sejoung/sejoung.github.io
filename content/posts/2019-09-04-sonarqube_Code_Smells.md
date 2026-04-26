---
layout: post
title: "sonarqube Code Smells Generic Serializable"
date: 2019-09-04 11:04 +0900
comments: true
tags : ["Code Smells","sonarqube","Serializable","Generic"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
### sonarqube Code Smells Generic Serializable

소나 큐브에서 Generic 타입을 Serializable 할수 없다는 오류가 나왔다 


```java

public class Test<T> implements Serializable {
 private T data;

}

```

위와 같은 클래스이다.


```java

public class Test<T extends Serializable> implements Serializable {
 private T data;

}

```

위처럼 바꾸면 될텐데 아니면 직렬화로 데이터 전달을 할것이 아니면 transient 키워드를 넣는것이 좋다

```java

public class Test<T> implements Serializable {
 private transient T data;

}

```


# 참조
----- 
* [sonarqube](https://www.sonarqube.org/)
* [how-to-serialize-a-generic-class-in-java](https://stackoverflow.com/questions/16852247/how-to-serialize-a-generic-class-in-java)
