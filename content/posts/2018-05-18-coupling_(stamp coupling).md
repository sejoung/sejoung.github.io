---
layout: post
title: "결합도_(stamp coupling)"
date: 2018-05-18 09:30:00 +0900
comments: true
tags : ["결합도"]
categories : ["study"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### 결합도 (coupling)

#### 스템프결합 (stamp coupling or data-structured coupling)
 
유사 약결합

stamp coupling은 사용되거나 사용되지 않을 수있는 필드를 포함하는 데이터 구조를 사용하여 매개 변수로 데이터가 전달 될 때 모듈간에 발생합니다.  

이렇게 되면 모듈간의 인터페이스를 단순 화 시킴

단점은 인공적인 데이터 구조의 생성을 촉진합니다 (즉, 관련이없는 데이터 요소를 한 묶음으로 묶음).
이 번들링은 모듈 간의 결합을 줄이기위한 것이지만 사실 모듈 사이의 결합을 증가시킵니다. 함께 번들로 묶인 데이터가 의미 있고 관련이있는 한 데이터 구조가 적절합니다.


```java

package com.github.sejoung.reactive.test;

public class Data {
    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

}


```

```java

package com.github.sejoung.reactive.test;

public class StampCode {

    public static void printAge(Data data){
        System.out.println(data.getAge());
    }

    public static void printName(Data data){
        System.out.println(data.getName());
    }
}

```

```java

package com.github.sejoung.reactive.test;

public class StampTest {

    public static void main(String[] args) {
        Data data = new Data();
        data.setAge(1);
        data.setName("zolla");
        StampCode.printAge(data);
        StampCode.printName(data);
    }
}


```

위에 printAge 와 printName 은 스템프 Data 로  스템프 결합이 일어난다.

저기서 값은 age와 data만 사용하지 않으니 메소드를 아래처럼 바꿔도 된다. 그렇게 되면 더이상 스템프 결합은 일어나지 않는다.

하지만 소프트웨어는 변하지 않는것은 없기 때문에 값을 무조건 하나만 사용한다고 가정할수가 있는지에 대한 반문이 존재한다.


```java

package com.github.sejoung.reactive.test;

public class StampCode {

    public static void printAge(int age){
        System.out.println(age);
    }

    public static void printName(String name){
        System.out.println(name);
    }
}

```