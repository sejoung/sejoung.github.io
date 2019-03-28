---
layout: post
title: "아이템 89. 인스턴스 수를 통제해야 한다면 readResolve 보다는 열거타입을 사용하라."
date: 2019-03-28 15:39 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 89. 인스턴스 수를 통제해야 한다면 readResolve 보다는 열거타입을 사용하라.

```java

package com.github.sejoung.codetest.serialization.singletonclass;

public class Elvis {
  public static final Elvis INSTANCE = new Elvis();
  private Elvis(){
    
  }

  public void leaveTheBuilding(){

  }
}

```

생성자를 막아서 하나의 인스턴스만 생성하게 만든 싱근톤

하지만 Serializable구현하면 readResolve 이용해서 싱글턴을 만들어야 된다.

```java

package com.github.sejoung.codetest.serialization.singletonserialization;

import java.io.Serializable;
import java.util.Arrays;

public class Elvis implements Serializable {

  public static final Elvis INSTANCE = new Elvis();

  private static final long serialVersionUID = 0;

  private String[] favoriteSongs = {"자니", "연결고리"};

  private Elvis() {

  }

  public void printFavorites() {
    System.out.println(Arrays.toString(favoriteSongs));
  }

  private Object readResolve() {
    return INSTANCE;
  }

}


```

```java

package com.github.sejoung.codetest.serialization.singletonserialization;


import java.io.Serializable;

public class ElvisStealer implements Serializable {

  private static final long serialVersionUID = 0;
  static Elvis impersonator;
  private Elvis payload;

  private Object readResolve() {
    // Save a reference to the "unresolved" Elvis instance
    impersonator = payload;
    // Return an object of correct type for favorites field
    return new String[]{"A Fool Such as I"};
  }

}


```

```java

package com.github.sejoung.codetest.serialization.singletonserialization;

import static com.github.sejoung.codetest.serialization.Util.deserialize;

public class ElvisImpersonator {
  // Byte stream could not have come from real Elvis instance!
  private static final byte[] serializedForm = new byte[] { (byte) 0xac,
      (byte) 0xed, 0x00, 0x05, 0x73, 0x72, 0x00, 0x05, 0x45, 0x6c, 0x76,
      0x69, 0x73, (byte) 0x84, (byte) 0xe6, (byte) 0x93, 0x33,
      (byte) 0xc3, (byte) 0xf4, (byte) 0x8b, 0x32, 0x02, 0x00, 0x01,
      0x4c, 0x00, 0x0d, 0x66, 0x61, 0x76, 0x6f, 0x72, 0x69, 0x74, 0x65,
      0x53, 0x6f, 0x6e, 0x67, 0x73, 0x74, 0x00, 0x12, 0x4c, 0x6a, 0x61,
      0x76, 0x61, 0x2f, 0x6c, 0x61, 0x6e, 0x67, 0x2f, 0x4f, 0x62, 0x6a,
      0x65, 0x63, 0x74, 0x3b, 0x78, 0x70, 0x73, 0x72, 0x00, 0x0c, 0x45,
      0x6c, 0x76, 0x69, 0x73, 0x53, 0x74, 0x65, 0x61, 0x6c, 0x65, 0x72,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01,
      0x4c, 0x00, 0x07, 0x70, 0x61, 0x79, 0x6c, 0x6f, 0x61, 0x64, 0x74,
      0x00, 0x07, 0x4c, 0x45, 0x6c, 0x76, 0x69, 0x73, 0x3b, 0x78, 0x70,
      0x71, 0x00, 0x7e, 0x00, 0x02 };

  public static void main(String[] args) {
    // Initializes ElvisStealer.impersonator and returns
    // the real Elvis (which is Elvis.INSTANCE)
    Elvis elvis = (Elvis) deserialize(serializedForm);
    Elvis impersonator = ElvisStealer.impersonator;

    elvis.printFavorites();
    impersonator.printFavorites();
  }


}


```




# 참조
-----



