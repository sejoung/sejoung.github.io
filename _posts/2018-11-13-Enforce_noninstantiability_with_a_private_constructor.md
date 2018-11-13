---
layout: post
title: "Enforce_noninstantiability_with_a_private_constructor"
date: 2018-11-13 10:41 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 인스턴스화를 막으려면 private 생성자를 사용하라

정적 팩토리 메소드만 모아 놓은 유틸클래스들은 의도치 않게 인스턴스화가 될수 있다.

그런 것을 막으려면 private 생성자를 사용해서 인스턴스 화를 막으면 좋다.

```java

package com.github.sejoung.codetest.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateUtils {

    private DateUtils(){
        throw new AssertionError();
    }

    public static String getCurrentDateTime(String pattern) {
        LocalDateTime time = LocalDateTime.now();
        return getFormatterDate(pattern, time);
    }

    public static String getFormatterDate(String pattern, LocalDateTime ldt) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
        return formatter.format(ldt);
    }

    public static String getCurrentDateTime() {
        LocalDateTime time = LocalDateTime.now();
        return time.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    public static String getCurrentDateTimeMinusDay(String pattern,long minusDay) {
        LocalDateTime time = LocalDateTime.now().minusDays(minusDay);
        return getFormatterDate(pattern, time);
    }
}


```

위에서는 정적팩토리 패턴을 제공하는 dateutil 클래스이다. 인스턴스화를 시킬 필요 없으니 private 생성자로 인스턴스화를 막았다.


# 참조
-----
* [AssertionError](https://stackoverflow.com/questions/24863185/what-is-an-assertionerror-in-which-case-should-i-throw-it-from-my-own-code)

