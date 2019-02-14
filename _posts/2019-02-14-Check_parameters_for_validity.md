---
layout: post
title: "아이템 49. 매개변수가 유효한지 검사하라."
date: 2019-02-14 09:53 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 49. 매개변수가 유효한지 검사하라.

매서드와 생성자 대부분은 입력 매개변수의 값이 특정 조건을 만족하기를 바란다.
이러한 제약은 반드시 문서화해야 되며 몸체가 실행되기전 검사해야된다. 

java 7에 추가된 requireNonNull 매서드는 유연하고 사용하기도 편하니 더이상 null 검사를 수동으로 하지 않아도 된다.

```java

package com.github.sejoung.codetest.methods;

import java.util.Objects;

public class ParametersValidity {
    public static void main(String[] args) {

        String nullTest = null;

        Objects.requireNonNull(nullTest,"널이다.");



    }


}


```
실행결과
```
Exception in thread "main" java.lang.NullPointerException: 널이다.
	at java.base/java.util.Objects.requireNonNull(Objects.java:246)
	at com.github.sejoung.codetest.methods.ParametersValidity.main(ParametersValidity.java:10)

Process finished with exit code 1

```

또는 단언문을 사용해서 검사할수도 있다.

단언문은 특별한 에러를 나타내지는 않지만 vm 옵션을 주면 에러를 배터 낸다.

```

java [ -enableassertions | -ea  ] [:<package name>"..." | :<class name> ]

```

아래 예제를 보면

```java

package com.github.sejoung.codetest.methods;

import java.util.Objects;

public class ParametersValidity {
    public static void main(String[] args) {

        String nullTest = null;

        assert false;
        Objects.requireNonNull(nullTest,"널이다.");



    }


}



```
실행결과
```
Exception in thread "main" java.lang.NullPointerException: 널이다.
	at java.base/java.util.Objects.requireNonNull(Objects.java:246)
	at com.github.sejoung.codetest.methods.ParametersValidity.main(ParametersValidity.java:11)

Process finished with exit code 1

```

위에는 vm 옵션을 주지 않은경우고 vm 옵션을 주면

실행결과는 틀려진다.

```
Exception in thread "main" java.lang.AssertionError
	at com.github.sejoung.codetest.methods.ParametersValidity.main(ParametersValidity.java:10)

Process finished with exit code 1

```

단 유효성 검사비용이 지나치게 높거나 실용적이지 않을때 혹은 계산과정에서 암묵적으로 검사가 수행될때를 말한다.



# 참조
-----
* [Enabling and Disabling Assertions](https://docs.oracle.com/cd/E19683-01/806-7930/assert-4/index.html)





