---
layout: post
title: "아이템 4. 인스턴스화를 막으려면 private 생성자를 사용하라"
date: 2018-11-13 10:41 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

## 이펙티브 자바 

### 아이템 4. 인스턴스화를 막으려면 private 생성자를 사용하라

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

백기선 님은 spring 코드를 보고 현실적인 대안을 찾으심 spring에서 util 클래스들은 abstract 키워드로 제한을 하고 있다.

여기서 spring code에 기여 할수 있는 방법을 하나 말씀 하셨는데. 전 이미 늦게 봐서 처리가 되었고

그부분에 기여가 올라와서 머지가 되었습니다. 잼있네요 pr 링크 걸어 드립니다.

[Prevent instantiation of AnnotatedElementUtils](https://github.com/spring-projects/spring-framework/pull/1848)


# 참조
-----
* [AssertionError](https://stackoverflow.com/questions/24863185/what-is-an-assertionerror-in-which-case-should-i-throw-it-from-my-own-code)
* [[이팩티브 자바] #4 인스턴스를 못만들게 하고 싶다면?](https://www.youtube.com/watch?v=A-t1T3_m15M)

