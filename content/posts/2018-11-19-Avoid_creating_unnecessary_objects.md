---
layout: post
title: "아이템 6. 불필요한 객체생성을 피하라"
date: 2018-11-19 09:49 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 이펙티브 자바 

### 아이템 6. 불필요한 객체생성을 피하라

똑같은 기능의 객체를 매번 생성하기 보다는 객체하나를 재사용하는 편이 좋을수도 있다.


```java

package com.github.sejoung.codetest.objects;

public class StringTest {
    public static void main(String[] args) {

        String string1 = "1223";
        String string2 = new String("1223");

        Boolean true1 = Boolean.valueOf("true");
        Boolean true2 = Boolean.valueOf("true");
        Boolean true3 = new Boolean("true");

        System.out.println(true1 == true2);
        System.out.println(true1 == true3);
        System.out.println(true1 == Boolean.TRUE);
        System.out.println(true3 == Boolean.TRUE);

    }
}


```

결과 

```
true
false
true
false

Process finished with exit code 0

```

위에서 보면 string을 선언 할때 생성자를 통해서 만든 1223과 기능적으로 완전히 똑같은 생성자를 통하지 않은 객체가 있다.
이것은 생성자를 통해서 만드는것은 불필요 한 일이다.

위 사항과 마찬가지로 Boolean 객체를 만들때 제공하는 Boolean.valueOf로 만든 것과 생성자를 통해서 만든것이 기능적으로는 
완벽하게 똑같지만 객체는 계속 생성이 된다 이렇게 만들지 않기 위해서 정적팩토리메소드를 통해서 생성하는것을 권장한다.


```java

package com.github.sejoung.codetest.objects;

import java.util.regex.Pattern;

public class RomanNumber {
    private static final Pattern ROMAN = Pattern.compile("^(?=.)M*(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$");

    static boolean isRomanNumeralCompile(String s) {
        return ROMAN.matcher(s).matches();
    }


    static boolean isRomanNumeral(String s) {
        return s.matches("^(?=.)M*(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$");
    }

    public static void main(String[] args) {

        long start = System.currentTimeMillis();

        int max = 100000;

        for (int i = 0 ; i <= max ; i++) {
            RomanNumber.isRomanNumeral("123123");
        }
        System.out.println(System.currentTimeMillis() - start);

        start = System.currentTimeMillis();
        for (int i = 0 ; i <= max ; i++) {
            RomanNumber.isRomanNumeralCompile("123123");
        }
        System.out.println(System.currentTimeMillis() - start);




    }
}



```

결과

```

238
18

Process finished with exit code 0

```


isRomanNumeral 메소드도 매번 정규식을 컴파일하는것보다 위에 처럼 컴파일후에 비교하는것과는 속도 차이가 많이 난다.

```java

package com.github.sejoung.codetest.objects;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class UsingKeySet {

    public static void main(String[] args) {
        Map<String, Integer> menu = new HashMap<>();
        menu.put("Burger", 8);
        menu.put("Pizza", 9);

        Set<String> names1 = menu.keySet();
        Set<String> names2 = menu.keySet();
        System.out.println(names2.size());
        System.out.println(names1.size());
        System.out.println(menu.size());
        names1.remove("Burger");
        System.out.println(names2.size());
        System.out.println(names1.size());
        System.out.println(menu.size());
    }
}


```


또다른 잘못된 예로 map에 keySet을 들수 있다. 위에 코드를 실행 해보면 아래의 결과가 나타난다.

```

2
2
2
1
1
1

Process finished with exit code 0

```

하나의 셋을 삭제 햇는데 나머지까지 다 영향이 가는것을 볼수가 있다.


```java

package com.github.sejoung.codetest.objects;

public class AutoBoxingExample {
    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        Long sum = 0l;
        for (long i = 0 ; i <= Integer.MAX_VALUE ; i++) {
            sum += i;
        }
        System.out.println(sum);
        System.out.println(System.currentTimeMillis() - start);

        start = System.currentTimeMillis();
        long sum2 = 0l;
        for (long i = 0 ; i <= Integer.MAX_VALUE ; i++) {
            sum2 += i;
        }
        System.out.println(sum2);
        System.out.println(System.currentTimeMillis() - start);

    }

}

```

결과

```

2305843008139952128
7590
2305843008139952128
736

Process finished with exit code 0

```

위에 오토 박싱에 예도 마찬 가지 이다 Long으로 선언해서 오토박싱을 하는것보다 long으로 선언해서 보면 속도차이가 많이 난다.



# 참조
-----
[[이팩티브 자바] #6 불필요한 객체를 만들지 말자](https://www.youtube.com/watch?v=0yUxPUXS1pM)