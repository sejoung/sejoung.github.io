---
layout: post
title: "아이템 11. equals를 재정의 하려면 hashcode도 재정의 하라"
date: 2018-11-27 09:10 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 11. equals를 재정의 하려면 hashcode도 재정의 하라

equals를 재정의한 클래스에서 hashcode도 재정의 해야된다 그렇지 않으면 hashcode의 일반규약을 어기게 되어
해당 클래스를 hashmap, hashset 같은 컬렉션의 원소로 사용될때 문제를 일으킬것이다.

hashcode의 일반규약은

```
* equals 비교에 사용되는 정보가 변경 되지 않았다면 
애플리케이션이 실행되는동안 몇번을 호출해도 항상 같은 값을 반환한다
단, 애플리케이션을 다시 실행하면 변경되어도 상관 없다.

* equals(Object)가 두 객체를 같다고 판단했다면, 두 객체의 hashcode는 항상 같은 값을 반환해야 된다.

* equals(Object)가 두 객체가 다르다고 판단해도 두객체의 hashcode가 서로 다른값을 반환할 필요는 없다.
단, 다른 객체에 대해서는 다른 값을 반환해야 해시테이블의 성능이 좋아진다.

```

hashcode 재정의가 잘못되었을때 크게 문제되는 조항은 두번째 즉, 논리적으로 같은 객체는 같은 해시코드를 반환 해야 된다.

equals 메소드만 재정의 했을때 어떻게 동작하는지 보겠다.

```java

package com.github.sejoung.codetest.hashcode;

import java.util.HashMap;
import java.util.Map;

// equals를 재정의하면 hashCode로 재정의해야 함을 보여준다. (70-71쪽)
public final class PhoneNumber {
    private final short areaCode, prefix, lineNum;

    public PhoneNumber(int areaCode, int prefix, int lineNum) {
        this.areaCode = rangeCheck(areaCode, 999, "area code");
        this.prefix = rangeCheck(prefix, 999, "prefix");
        this.lineNum = rangeCheck(lineNum, 9999, "line num");
    }

    private static short rangeCheck(int val, int max, String arg) {
        if (val < 0 || val > max)
            throw new IllegalArgumentException(arg + ": " + val);
        return (short) val;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof PhoneNumber))
            return false;
        PhoneNumber pn = (PhoneNumber) o;
        return pn.lineNum == lineNum && pn.prefix == prefix
                && pn.areaCode == areaCode;
    }

    public static void main(String[] args) {
        Map<PhoneNumber, String> m = new HashMap<>();
        m.put(new PhoneNumber(707, 867, 5309), "제니");
        System.out.println(m.get(new PhoneNumber(707, 867, 5309)));
    }
}


```

실행결과

```
null

Process finished with exit code 0
```

위에 재정의 하지 않은 hashcode 때문에 저장할때 hashcode 값과 다시 불러 올때 hashcode 값이 같지 않지 때문에
다른곳에 저장한 hashtable을 검색해서 null이 나온다.

최악이지만 적법한 hashcode를 구현해보면

```java

package com.github.sejoung.codetest.hashcode;

import java.util.HashMap;
import java.util.Map;

// equals를 재정의하면 hashCode로 재정의해야 함을 보여준다. (70-71쪽)
public final class PhoneNumber {
    private final short areaCode, prefix, lineNum;

    public PhoneNumber(int areaCode, int prefix, int lineNum) {
        this.areaCode = rangeCheck(areaCode, 999, "area code");
        this.prefix = rangeCheck(prefix, 999, "prefix");
        this.lineNum = rangeCheck(lineNum, 9999, "line num");
    }

    private static short rangeCheck(int val, int max, String arg) {
        if (val < 0 || val > max)
            throw new IllegalArgumentException(arg + ": " + val);
        return (short) val;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof PhoneNumber))
            return false;
        PhoneNumber pn = (PhoneNumber) o;
        return pn.lineNum == lineNum && pn.prefix == prefix
                && pn.areaCode == areaCode;
    }

    @Override
    public int hashCode() {
        return 42;
    }

    public static void main(String[] args) {
        Map<PhoneNumber, String> m = new HashMap<>();
        m.put(new PhoneNumber(707, 867, 5309), "제니");
        m.put(new PhoneNumber(11, 12, 123), "바보");

        System.out.println(m.get(new PhoneNumber(707, 867, 5309)));
        System.out.println(m.get(new PhoneNumber(11, 12, 123)));
    }
}


```

실행 결과

```
제니
바보

Process finished with exit code 0
```

이코드는 동치인 모든 객체에 42라는 코드 값을 던진다. 
위에서 보면 실행 결과는 정상적으로 나오는것 처럼 보인다.

하지만 검색할때 시간복잡도가 O(1) 해쉬테이블이 O(n) 으로 증가하게 된다.
마치 linkedlist 처럼 동작하게 된다. 이건 객체가 많아지면 느려져서 도저히 쓸수 없게 된다.

그럼 전형적인 해쉬코드를 구현하면

```java

package com.github.sejoung.codetest.hashcode;

import java.util.HashMap;
import java.util.Map;

// equals를 재정의하면 hashCode로 재정의해야 함을 보여준다. (70-71쪽)
public final class PhoneNumber {
    private final short areaCode, prefix, lineNum;

    public PhoneNumber(int areaCode, int prefix, int lineNum) {
        this.areaCode = rangeCheck(areaCode, 999, "area code");
        this.prefix = rangeCheck(prefix, 999, "prefix");
        this.lineNum = rangeCheck(lineNum, 9999, "line num");
    }

    private static short rangeCheck(int val, int max, String arg) {
        if (val < 0 || val > max)
            throw new IllegalArgumentException(arg + ": " + val);
        return (short) val;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof PhoneNumber))
            return false;
        PhoneNumber pn = (PhoneNumber) o;
        return pn.lineNum == lineNum && pn.prefix == prefix
                && pn.areaCode == areaCode;
    }


    // 코드 11-2 전형적인 hashCode 메서드 (70쪽)
    @Override
    public int hashCode() {
        int result = Short.hashCode(areaCode);
        result = 31 * result + Short.hashCode(prefix);
        result = 31 * result + Short.hashCode(lineNum);
        return result;
    }


    public static void main(String[] args) {
        Map<PhoneNumber, String> m = new HashMap<>();
        m.put(new PhoneNumber(707, 867, 5309), "제니");
        m.put(new PhoneNumber(11, 12, 123), "바보");

        System.out.println(m.get(new PhoneNumber(707, 867, 5309)));
        System.out.println(m.get(new PhoneNumber(11, 12, 123)));
    }
}


```
실행결과
```
제니
바보

Process finished with exit code 0

```
정상적으로 동작한다 
 
위에서 보면 31을 곱하는데 곱셉없이 해쉬코드를 계산하면 모든 아나그램에 해쉬값이 동일하게 된다.

31을 정한 이유는 홀수 이면서 소수이기 때문이 짝수는 오버플로가 발생하면 정보를 잃기 때문이다.
소수를 곱하는건 전통적으로 그렇게 했기 때문이다

그럼 String class에 hashCode 구현체를 찾아 보겠다.

```java

public int hashCode() {
        int h = hash;
        if (h == 0 && value.length > 0) {
            hash = h = isLatin1() ? StringLatin1.hashCode(value)
                                  : StringUTF16.hashCode(value);
        }
        return h;
    }

``` 

StringLatin1.hashCode

```java
    
    public static int hashCode(byte[] value) {
        int h = 0;
        for (byte v : value) {
            h = 31 * h + (v & 0xff);
        }
        return h;
    }

```

StringUTF16.hashCode

```java

    public static int hashCode(byte[] value) {
        int h = 0;
        int length = value.length >> 1;
        for (int i = 0; i < length; i++) {
            h = 31 * h + getChar(value, i);
        }
        return h;
    }

```

위에서 보면 다 31을 곱해서 사용하고 있다.

null은 기본적으로 0을 리턴한다.

한줄짜리 hashcode 구현방법

```java

package com.github.sejoung.codetest.hashcode;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

// equals를 재정의하면 hashCode로 재정의해야 함을 보여준다. (70-71쪽)
public final class PhoneNumber {
    private final short areaCode, prefix, lineNum;

    public PhoneNumber(int areaCode, int prefix, int lineNum) {
        this.areaCode = rangeCheck(areaCode, 999, "area code");
        this.prefix = rangeCheck(prefix, 999, "prefix");
        this.lineNum = rangeCheck(lineNum, 9999, "line num");
    }

    private static short rangeCheck(int val, int max, String arg) {
        if (val < 0 || val > max)
            throw new IllegalArgumentException(arg + ": " + val);
        return (short) val;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof PhoneNumber))
            return false;
        PhoneNumber pn = (PhoneNumber) o;
        return pn.lineNum == lineNum && pn.prefix == prefix
                && pn.areaCode == areaCode;
    }

    // 코드 11-3 한 줄짜리 hashCode 메서드 - 성능이 살짝 아쉽다. (71쪽)
    @Override
    public int hashCode() {
        return Objects.hash(lineNum, prefix, areaCode);
    }


    public static void main(String[] args) {
        Map<PhoneNumber, String> m = new HashMap<>();
        m.put(new PhoneNumber(707, 867, 5309), "제니");
        m.put(new PhoneNumber(11, 12, 123), "바보");

        System.out.println(m.get(new PhoneNumber(707, 867, 5309)));
        System.out.println(m.get(new PhoneNumber(11, 12, 123)));
    }
}


```

실행결과

```
제니
바보

Process finished with exit code 0
```

위에 코드는 한줄자리 이지만 속도는 더 느리다. 
입력변수를 담기위한 객체도 만들어야 되고 박싱과 언박싱을 거쳐야 되기 때문에 성능이 좋지 않다.

불변 클래스이고 해쉬코드를 계산하는 것이 부담스럼다면 캐싱도 고려해야 된다.

샘플 코드

```java

package com.github.sejoung.codetest.hashcode;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

// equals를 재정의하면 hashCode로 재정의해야 함을 보여준다. (70-71쪽)
public final class PhoneNumber {
    private final short areaCode, prefix, lineNum;

    public PhoneNumber(int areaCode, int prefix, int lineNum) {
        this.areaCode = rangeCheck(areaCode, 999, "area code");
        this.prefix = rangeCheck(prefix, 999, "prefix");
        this.lineNum = rangeCheck(lineNum, 9999, "line num");
    }

    private static short rangeCheck(int val, int max, String arg) {
        if (val < 0 || val > max)
            throw new IllegalArgumentException(arg + ": " + val);
        return (short) val;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof PhoneNumber))
            return false;
        PhoneNumber pn = (PhoneNumber) o;
        return pn.lineNum == lineNum && pn.prefix == prefix
                && pn.areaCode == areaCode;
    }

    // 해시코드를 지연 초기화하는 hashCode 메서드 - 스레드 안정성까지 고려해야 한다. (71쪽)
    private int hashCode; // 자동으로 0으로 초기화된다.

    @Override public int hashCode() {
        int result = hashCode;
        if (result == 0) {
            result = Short.hashCode(areaCode);
            result = 31 * result + Short.hashCode(prefix);
            result = 31 * result + Short.hashCode(lineNum);
            hashCode = result;
        }
        return result;
    }

    public static void main(String[] args) {
        Map<PhoneNumber, String> m = new HashMap<>();
        m.put(new PhoneNumber(707, 867, 5309), "제니");
        m.put(new PhoneNumber(11, 12, 123), "바보");

        System.out.println(m.get(new PhoneNumber(707, 867, 5309)));
        System.out.println(m.get(new PhoneNumber(11, 12, 123)));
    }
}


```

위에 방식을 채텍할수도 있다.

대표적인 불변클래스인 String도 위 방식이다.

```java

public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    
    /** Cache the hash code for the string */
    private int hash; // Default to 0
    
    public int hashCode() {
            int h = hash;
            if (h == 0 && value.length > 0) {
                hash = h = isLatin1() ? StringLatin1.hashCode(value)
                                      : StringUTF16.hashCode(value);
            }
            return h;
        }
        
    }

```


# 참조
-----
* [Java_hashCode](https://en.wikipedia.org/wiki/Java_hashCode())
* [해싱, 해시함수, 해시테이블](https://ratsgo.github.io/data%20structure&algorithm/2017/10/25/hash/)
