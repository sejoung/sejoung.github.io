---
layout: post
title: "아이템 59. 라이브러리를 익히고 사용하라."
date: 2019-02-27 10:54 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 59. 라이브러리를 익히고 사용하라.

```java

package com.github.sejoung.codetest.general;

import java.util.Random;

// 무작위 수 생성은 쉽지 않다.
public class RandomBug {
    // 코드 59-1 흔하지만 문제가 심각한 코드! (351쪽)
    static Random rnd = new Random();

    static int random(int n) {
        return Math.abs(rnd.nextInt()) % n;
    }

    // 무작위 수 1백만 개 생성 후, 중간 값보다 작은 수의 개수 출력 (351쪽)
    public static void main(String[] args) {
        int n = 2 * (Integer.MAX_VALUE / 3);
        int low = 0;
        for (int i = 0; i < 1000000; i++)
            if (random(n) < n/2)
                low++;
        System.out.println(low);
    }
}

```
실행결과
```

666718

Process finished with exit code 0

```

위 코드는 문제가 있는데 보면 low가 50만개가 출력 되어야 되는데 66만개 이상 출력이 된다.


표준 라이브러리를 사용하면 그 코드를 작성한 전문가의 지식과 여러분보다 앞서 사용한 다른 프로그래머들의 지식을 활용할수도 있다.

```java

package com.github.sejoung.codetest.general;


import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

// 코드 59-2 transferTo 메서드를 이용해 URL의 내용 가져오기 - 자바 9부터 가능하다. (353쪽)
public class Curl {
    public static void main(String[] args) throws IOException {
        try (InputStream in = new URL("https://www.naver.com").openStream()) {
            in.transferTo(System.out);
        }
    }
}

```

위에는 java 9에 추가된 기능을 사용한것이다.

그리고 메이저 릴리즈 마다 주목할만한 많은 기능이 추가된다. 한번쯤은 봐둘만하다.

바퀴를 다시 발명하지 말자.

# 참조
-----




