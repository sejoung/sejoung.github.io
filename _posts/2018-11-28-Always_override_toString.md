---
layout: post
title: "Always override toString"
date: 2018-11-28 10:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 12. toString은 항상 재정의 하라.

Object의 toString은 우리에게 필요한 정보는 보이는것이 아니라 클래스이름@16진수 해시코드를 반환할뿐이다.

equals와 hashcode 처럼 대단히 중요하진 않지만 toString은 항상 재정의 하는것이 좋다.

그럼 PhoneNumber클래스를 보겠다

```java

package com.github.sejoung.codetest.tostring;

// PhoneNumber에 toString 메서드 추가 (75쪽)
public final class PhoneNumber {
    private final short areaCode, prefix, lineNum;

    public PhoneNumber(int areaCode, int prefix, int lineNum) {
        this.areaCode = rangeCheck(areaCode, 999, "지역코드");
        this.prefix = rangeCheck(prefix, 999, "프리픽스");
        this.lineNum = rangeCheck(lineNum, 9999, "가입자 번호");
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
        int result = Short.hashCode(areaCode);
        result = 31 * result + Short.hashCode(prefix);
        result = 31 * result + Short.hashCode(lineNum);
        return result;
    }

    public static void main(String[] args) {
        PhoneNumber jenny = new PhoneNumber(707, 867, 5309);
        System.out.println("제니의 번호: " + jenny);
    }
}


```
실행 결과

```

제니의 번호: com.github.sejoung.codetest.tostring.PhoneNumber@adbbd

Process finished with exit code 0

```

위에는 toString을 재정의 하지 않았을때 PhoneNumber@adbbd 라는 결과 값만 찍혔다.

toString을 정의할때 유이사항

* toString은 그 객체가 가진 주요 정보 모두를 반환하는것이 좋다.
* 포멧을 명시하던 안하던 의도를 명확히 발혀야 된다.
* 포멧 명시 여부와 상관 없이 toString이 반환한 값에 포함된 정보를 얻어올수 있는 API를 제공하자.

PhoneNumber의 toString을 재정의 하는 부분

```java

package com.github.sejoung.codetest.tostring;

// PhoneNumber에 toString 메서드 추가 (75쪽)
public final class PhoneNumber {
    private final short areaCode, prefix, lineNum;

    public PhoneNumber(int areaCode, int prefix, int lineNum) {
        this.areaCode = rangeCheck(areaCode, 999, "지역코드");
        this.prefix = rangeCheck(prefix, 999, "프리픽스");
        this.lineNum = rangeCheck(lineNum, 9999, "가입자 번호");
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
        int result = Short.hashCode(areaCode);
        result = 31 * result + Short.hashCode(prefix);
        result = 31 * result + Short.hashCode(lineNum);
        return result;
    }

    /**
     * 이 전화번호의 문자열 표현을 반환한다.
     * 이 문자열은 "XXX-YYY-ZZZZ" 형태의 12글자로 구성된다.
     * XXX는 지역 코드, YYY는 프리픽스, ZZZZ는 가입자 번호다.
     * 각각의 대문자는 10진수 숫자 하나를 나타낸다.
     * <p>
     * 전화번호의 각 부분의 값이 너무 작아서 자릿수를 채울 수 없다면,
     * 앞에서부터 0으로 채워나간다. 예컨대 가입자 번호가 123이라면
     * 전화번호의 마지막 네 문자는 "0123"이 된다.
     */

    @Override
    public String toString() {
        return String.format("%03d-%03d-%04d",
                areaCode, prefix, lineNum);
    }

    public static void main(String[] args) {
        PhoneNumber jenny = new PhoneNumber(707, 867, 5309);
        System.out.println("제니의 번호: " + jenny);
    }
}


```

실행 결과

```

제니의 번호: 707-867-5309

Process finished with exit code 0

```

유틸클래스와 enum 클래스는 toString을 재정의 할필요 없다 enum은 자바에서 toString을 제공해준다.

# 참조
-----
