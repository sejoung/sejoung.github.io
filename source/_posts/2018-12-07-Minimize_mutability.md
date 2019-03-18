---
layout: post
title: "아이템 17. 변경가능성을 최소화하라."
date: 2018-12-07 10:33 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 17. 변경가능성을 최소화하라.

불변 클래스란 인스턴스의 내부 값을 수정할 수 없는 클래스다.
불변 인스턴스에 간직한 정보는 고정되어 객체가 파괴되는 순간까지 절대 달라지지 않는다.

클래스를 불변으로 만들려면 다음 다섯 가지 규칙을 따르면 된다.

* 객체의 상태를 변경하는 매서드를 제공하지 않는다.
* 클래스를 확장할수 없도록 한다. 상속을 막는 대표적인 방법은 final 다른 방법도 살펴 보겠다.
* 모든 필드를 final로 선언한다.
* 모든 필드를 private으로 선언한다.
* 자신 외에는 내부의 가변 컴포넌트에 접근할 수 없도록 한다. 생성자, 점근자, readObject 메서드 모두에서 방어적 복사를 수행하라

```java

package com.github.sejoung.codetest.mutability;

// 코드 17-1 불변 복소수 클래스 (106-107쪽)
public final class Complex {
    private final double realNumber;
    private final double imaginaryNumber;

    public static final Complex ZERO = new Complex(0, 0);
    public static final Complex ONE = new Complex(1, 0);
    public static final Complex I = new Complex(0, 1);

    public Complex(double realNumber, double imaginaryNumber) {
        this.realNumber = realNumber;
        this.imaginaryNumber = imaginaryNumber;
    }

    public double realPart() {
        return realNumber;
    }

    public double imaginaryPart() {
        return imaginaryNumber;
    }

    public Complex plus(Complex c) {
        return new Complex(realNumber + c.realNumber, imaginaryNumber + c.imaginaryNumber);
    }

    // 코드 17-2 정적 팩터리(private 생성자와 함께 사용해야 한다.) (110-111쪽)
    public static Complex valueOf(double realNumber, double imaginaryNumber) {
        return new Complex(realNumber, imaginaryNumber);
    }

    public Complex minus(Complex c) {
        return new Complex(realNumber - c.realNumber, imaginaryNumber - c.imaginaryNumber);
    }

    public Complex times(Complex c) {
        return new Complex(realNumber * c.realNumber - imaginaryNumber * c.imaginaryNumber,
                realNumber * c.imaginaryNumber + imaginaryNumber * c.realNumber);
    }

    public Complex dividedBy(Complex c) {
        double tmp = c.realNumber * c.realNumber + c.imaginaryNumber * c.imaginaryNumber;
        return new Complex((realNumber * c.realNumber + imaginaryNumber * c.imaginaryNumber) / tmp,
                (imaginaryNumber * c.realNumber - realNumber * c.imaginaryNumber) / tmp);
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Complex))
            return false;
        Complex c = (Complex) o;

        // == 대신 compare를 사용하는 이유는 63쪽을 확인하라.
        return Double.compare(c.realNumber, realNumber) == 0
                && Double.compare(c.imaginaryNumber, imaginaryNumber) == 0;
    }

    @Override
    public int hashCode() {
        return 31 * Double.hashCode(realNumber) + Double.hashCode(imaginaryNumber);
    }

    @Override
    public String toString() {
        return "(" + realNumber + " + " + imaginaryNumber + "i)";
    }
}


```

위에 클래스는 복소수를 표현하는 클래스이다. 위에 보면 사칙연산 메소드에서도 객체를 새로 생성 해서 반환하고
인스턴스 안에 변수에 값을 변경하는 것들이 없다. 메소드 이름도 add라는 동사 되신 plus라는 전치사를 사용한 점도 주목해야 된다.

이렇게 코딩하면 코드에서 불변이 되는 영역의 비율이 높아지는 장점을 누릴수 있다.

불변객체는 근본적으로 스레드에 안전하며 따로 동기화할 필요가 없다.그래서 안심하고 공유 할 수 있다.


```java
 /**
     * The signum of this BigInteger: -1 for negative, 0 for zero, or
     * 1 for positive.  Note that the BigInteger zero <i>must</i> have
     * a signum of 0.  This is necessary to ensures that there is exactly one
     * representation for each BigInteger value.
     *
     * @serial
     */
    final int signum;

    /**
     * The magnitude of this BigInteger, in <i>big-endian</i> order: the
     * zeroth element of this array is the most-significant int of the
     * magnitude.  The magnitude must be "minimal" in that the most-significant
     * int ({@code mag[0]}) must be non-zero.  This is necessary to
     * ensure that there is exactly one representation for each BigInteger
     * value.  Note that this implies that the BigInteger zero has a
     * zero-length mag array.
     */
    final int[] mag;

    /**
     * This internal constructor differs from its public cousin
     * with the arguments reversed in two ways: it assumes that its
     * arguments are correct, and it doesn't copy the magnitude array.
     */
    BigInteger(int[] magnitude, int signum) {
        this.signum = (magnitude.length == 0 ? 0 : signum);
        this.mag = magnitude;
        if (mag.length >= MAX_MAG_LENGTH) {
            checkRange();
        }
    }

```


```java

   /**
     * Returns a BigInteger whose value is {@code (-this)}.
     *
     * @return {@code -this}
     */
    public BigInteger negate() {
        return new BigInteger(this.mag, -this.signum);
    }

```
불변 객체끼리는 내부 데이터를 공유할수 있다.

위에코드는 BigInteger라는 불변객에인데 negate메소드에서 크기는 같고 부호만 반데인 새로운 것을 생성하는데 
int[]은 가변이지만 복사하지 않고 공유하는데 그결과 새로만든 인스턴스도 
원본 인스턴스가 가르치는 내부 배열을 그대로 가르킨다.

불변객체들을 구성요소로 사용하면 이점이 많다.
아무리 구조가 복잡해도 불변을 유지하기가 편하기 때문이다.
Map이나 Set의 키나 원소로 쓰기 좋다 map이나 set의 값이 바뀌면 불변이 깨지는데 그런 걱정을 안해도 된다.

불변객체는 그자체로 실패 원자성(예외가 발생되어도 그객체는 여전히 유효한 상태야 된다.)을 제공한다. 상태가 절대 안변하니 잠깐이라도 불일치 상태에 빠질 가능성이 없다.

불변 클래스에 단점은 값이 다르면 반드시 독립된 객체로 만들어야 된다.

클래스는 특별한 상황이 아니면 불변이여야 된다. 무조건 setter를 만들지는 말자

불변으로 만들수 없는 클래스라도 변경할수 있는 부분을 최소화하자. 다른 합당한 이유가 없다면 모든 필드는 private final이여야 된다.

생성자는 불변식 설정이 모두 완료된 초기화가 완벽히 끝난 상태의 객체를 생성해야 된다.

# 참조
-----
