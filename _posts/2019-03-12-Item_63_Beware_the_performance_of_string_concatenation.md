---
layout: post
title: "아이템 63. 문자열 연결은 느리니 주의하라."
date: 2019-03-12 09:43 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 63. 문자열 연결은 느리니 주의하라.

자바 6 이후로 성능개선이 많이 되었지만 문자열 연결은 여전히 느리다.

`+=` 연결 보다는 StringBuilder를 활용하는것이 좋다.


```java
package com.github.sejoung.codetest.general;

import org.springframework.util.StopWatch;

public class StringConcat {

  private static final int LINE_WIDTH = 80;

  public String statement() {
    String result = "";
    for (int i = 0; i < numItem(); i++) {
      result += lineForItem(i);
    }
    return result;
  }

  public String statement2() {
    StringBuilder sb = new StringBuilder(numItem()*LINE_WIDTH);
    for (int i = 0; i < numItem(); i++) {
      sb.append(lineForItem(i));
    }

    return sb.toString();
  }


  private String lineForItem(int i) {
    return "12345678901234567890123456789012345678901234567890123456789012345678901234567890";
  }

  private int numItem() {
    return 100;
  }


  public static void main(String[] args) {
    StringConcat sc = new StringConcat();

    StopWatch sw = new StopWatch();

    sw.start("statement");

    sc.statement();

    sw.stop();

    sw.start("statement2");

    sc.statement2();

    sw.stop();

    System.out.println(sw.prettyPrint());
    

  }

}

```
실행결과
```
StopWatch '': running time (millis) = 22
-----------------------------------------
ms     %     Task name
-----------------------------------------
00021  095%  statement
00001  005%  statement2


Process finished with exit code 0


```

결과는 여전히 StringBuilder를 사용했을때가 더 빠르다

# 참조
-----

