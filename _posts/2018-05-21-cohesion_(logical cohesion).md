---
layout: post
title: "cohesion_(logical cohesion)"
date: 2018-05-21 14:00:00 +0900
comments: false
---

### 응집도 (cohesion)

#### 논리적 응집도 (logical)

논리적 응집력이란 모듈의 일부가 논리적으로 분류되어 자연스럽지 만 똑같은 것을 수행하도록 분류되기 때문입니다.

아래 예제 클래스는 StrictMath 클래스를 들겠습니다. 아래는 짧게 코드를 옴겨 왔습니다.

 ```java
 
 public final class StrictMath {
 
   
     private StrictMath() {}
 

     public static final double E = 2.7182818284590452354;

     public static final double PI = 3.14159265358979323846;
 

     public static native double sin(double a);
 

     public static native double cos(double a);
 

     public static native double tan(double a);
}
 

```
