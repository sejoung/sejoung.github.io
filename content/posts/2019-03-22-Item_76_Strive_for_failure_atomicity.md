---
layout: post
title: "아이템 76. 가능한 실패를 원자적으로 만들라."
date: 2019-03-22 14:51 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 76. 가능한 실패를 원자적으로 만들라.

일반화 해서 말하자면 호출된 메서드가 실패 하더라도 해당 객체는 메서드 호출 전 상태를 유지해야 한다.
이러한 특성을 실패 원자적(failure atomic)이라고 한다.

#### 메서드를 원자적으로 만드는 방법 

* 가장 간단한 방법은 불변객체로 설계하는 방법이다.

아래는 불변객체의 예로 String 클래스를 들어 보면 거기에 substring 메서드를 보면 실패 원자적이다.

```java

    public String substring(int beginIndex) {
        if (beginIndex < 0) {
            throw new StringIndexOutOfBoundsException(beginIndex);
        }
        int subLen = length() - beginIndex;
        if (subLen < 0) {
            throw new StringIndexOutOfBoundsException(subLen);
        }
        if (beginIndex == 0) {
            return this;
        }
        return isLatin1() ? StringLatin1.newString(value, beginIndex, subLen)
                          : StringUTF16.newString(value, beginIndex, subLen);
    }

```

* 가변 객체에서 메서드를 실패 원자적으로 만드는 가장 흔한 방법은 작업 수행중에 매개변수의 유효성을 검사하는 것이다.

위에 코드에서 beginIndex 매개변수를 검사한것처럼 말이다.

* 객체의 임시 복사본에서 작업을한 후에 성공시 원래 객체와 교환하는 방법이다.

* 작업도중 실패를 가로채는 복구코드를 작성하여 작업전으로 돌리는것이다.

모두 실패 원자성을 보장할수있는것은 아니다 여러쓰레드가 하나의 객체값을 수정했을떄 에러를 잡았다고 해서 객체의 원자성을 보장해줄수는 없다.

Error는 복구 할 수가 없으므로 시도조차 할 필요 없다.

# 참조
-----
* [what is “failure atomicity” used by J bloch and how its beneficial in terms of immutable object?](https://stackoverflow.com/questions/29842845/what-is-failure-atomicity-used-by-j-bloch-and-how-its-beneficial-in-terms-of-i)
* [아이템 17. 변경가능성을 최소화하라.](https://sejoung.github.io/2018/12/2018-12-07-Minimize_mutability/)
* [아이템 49. 매개변수가 유효한지 검사하라.](https://sejoung.github.io/2019/02/2019-02-14-Check_parameters_for_validity/)

