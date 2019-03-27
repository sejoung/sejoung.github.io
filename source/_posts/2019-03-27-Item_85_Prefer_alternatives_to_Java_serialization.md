---
layout: post
title: "아이템 85. 자바 직렬화의 대안을 찾으라."
date: 2019-03-17 15:08 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 85. 자바 직렬화의 대안을 찾으라.

```java

package com.github.sejoung.codetest.serialization;

import static com.github.sejoung.codetest.serialization.Util.deserialize;
import static com.github.sejoung.codetest.serialization.Util.serialize;

import java.util.HashSet;
import java.util.Set;

// 코드 85-1 역직렬화 폭탄 - 이 스트림의 역직렬화는 영원히 계속된다. (451-452쪽)
public class DeserializationBomb {

  public static void main(String[] args) throws Exception {
    System.out.println(bomb().length);
    deserialize(bomb());
  }

  static byte[] bomb() {
    Set<Object> root = new HashSet<>();
    Set<Object> s1 = root;
    Set<Object> s2 = new HashSet<>();
    for (int i = 0; i < 100; i++) {
      Set<Object> t1 = new HashSet<>();
      Set<Object> t2 = new HashSet<>();
      t1.add("foo"); // t1을 t2와 다르게 만든다.
      s1.add(t1);
      s1.add(t2);
      s2.add(t1);
      s2.add(t2);
      s1 = t1;
      s2 = t2;
    }
    return serialize(root);
  }
}


```

직렬화 위험을 회피하는 가장 좋은 방법은 아무것도 역직렬화하지 않는 것 이다.

여러분이 작성하는 새로운 시스템에서 자바 직렬화를 써야 할 이유는 전혀 없다.

신뢰할수없는 데이터는 절대 역질렬화하지 않는 것이다.

블랙리스트 방식보단 화이트리스트 방식을 추천

시스템을 밑바닥부터 설계한다면 JSON이나 프로토콜버퍼 같은 대안을 사용하자.

# 참조
-----



