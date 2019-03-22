---
layout: post
title: "아이템 75. 예외의 상세 메시지에 실패 관련 정보를 담으라."
date: 2019-03-22 09:32 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 75. 예외의 상세 메시지에 실패 관련 정보를 담으라.

실패 순간을 포착하려면 발생한 예외에 관여된 모든 매개변수와 필드의 값을 실패 메시지에 담아야 된다.

IndexOutOfBoundsException 에서 실패값을 온전히 포착하도록 수정해 보겠다.

```java

package com.github.sejoung.codetest.exception;


// 실패 상황을 온전히 포착하도록 수정해본 IndexOutOfBoundsException (405쪽)
public class IndexOutOfBoundsException extends RuntimeException {

  private final int lowerBound;
  private final int upperBound;
  private final int index;

  /**
   * IndexOutOfBoundsException을 생성한다.
   *
   * @param lowerBound 인덱스의 최솟값
   * @param upperBound 인덱스의 최댓값 + 1
   * @param index 인덱스의 실젯값
   */
  public IndexOutOfBoundsException(int lowerBound, int upperBound,
      int index) {
    // 실패를 포착하는 상세 메시지를 생성한다.
    super(String.format(
        "최솟값: %d, 최댓값: %d, 인덱스: %d",
        lowerBound, upperBound, index));

    // 프로그램에서 이용할 수 있도록 실패 정보를 저장해둔다.
    this.lowerBound = lowerBound;
    this.upperBound = upperBound;
    this.index = index;
  }
}

```

위에 처럼 수정하면 좀 더 좋은 코드가 될수도 있었다. 저자는 생각하더라.

# 참조
-----
