---
layout: post
title: "데이터 베이스 코드 테이블의 값을 Enum 으로 바꾸기"
date: 2019-01-21 14:15 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 데이터 베이스 코드 테이블의 값을 Enum 으로 바꾸기


일단 데이터 베이스에서 공통을 정의 하고 많이 쓰실텐데 코드에서 들어 오는 값이랑 DB 값이랑 불일치 하는 경우가 있다.

java 1.5 이전 버전에는 아래 처럼 선언 하고 썼다.

```java

package com.github.sejoung.codetest.constant;

public class CommonConstants {
    public final static String WEB = "01";
    public final static String MOBILE = "02";
}


```

위에 코드에 선택을 하려고 swich 문까지 써서

```java

package com.github.sejoung.codetest.constant;

import java.util.Optional;

public class Run {


    public String getPlatformCode(String plateform) {
        String result = "";

        switch (plateform) {
            case "WEB":
                result = CommonConstants.WEB;
                break;
            case "MOBILE":
                result = CommonConstants.MOBILE;
                break;

        }

        return result;
    }

    public static void main(String[] args) {
        Run r = new Run();

        System.out.println(r.getPlatformCode("WEB"));
    }
}


```
실행결과
```
01

Process finished with exit code 0
```

위에 코드를 enum으로 바꾸고 코드를 수정하면

```java

package com.github.sejoung.codetest.constant;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toMap;

public enum Platform {

    WEB("01","PC로 접속"),
    MOBILE("02","모바일로 접속");

    private String code;
    private String desc;

    Platform(String code,String desc){
        this.code = code;
        this.desc = desc;
    }

    private static final Map<String, Platform> stringToEnum =
            Stream.of(values()).collect(
                    toMap(Object::toString, e -> e));

    public static Optional<Platform> fromString(String symbol) {
        return Optional.ofNullable(stringToEnum.get(symbol));
    }

    public String getCode() {
        return code;
    }

    public String getDesc() {
        return desc;
    }
}


```

```java

package com.github.sejoung.codetest.constant;

import java.util.Optional;

public class Run {

    public static void main(String[] args) {
        Optional<Platform> p = Platform.fromString("WEB");

        p.ifPresent((platform) -> {

            System.out.println(platform.getCode());

            System.out.println(platform.getDesc());
        });
    }
}


```
실행 결과
```
01
PC로 접속

Process finished with exit code 0
```

위 처럼 바꾸는것이 좀더 깔끔 할것 같다.

아래 sql은 concat으로 enum을 만들어서 복붙하려고 한번 해보았다. 비슷하게 하면 코드를 안해도 복붙가능하다.

```sql

select CONCAT(CODE_VAL , '(''', CODE_ID,''',''',CODE_DESC,'''),') 
from COM_CODE 
where CODE_TP_ID ='';

```

# 참조
-----

