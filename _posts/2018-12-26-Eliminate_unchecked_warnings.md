---
layout: post
title: "Eliminate unchecked warnings"
date: 2018-12-26 11:53 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 27. 비검사 경고를 제거하라 

제네릭을 사용하면 비검사경고가 많이 보일것이다 가능한 비검사 에러를 제거 하자.

컴파일 명령줄 인수에 -Xlint:unchecked를 추가하면 자세한 코멘트가 보인다.

만약 타입 안정성이 확보 되었다고 판단되면 @SuppressWarnings("unchecked") 사용하여 경고를 없에 버리자

ArrayList에 toArray 메소드를 보면 jdk 11 기준

```java

    @SuppressWarnings("unchecked")
    public <T> T[] toArray(T[] a) {
        if (a.length < size)
            // Make a new array of a's runtime type, but my contents:
            return (T[]) Arrays.copyOf(elementData, size, a.getClass());
        System.arraycopy(elementData, 0, a, 0, size);
        if (a.length > size)
            a[size] = null;
        return a;
    }

```

@SuppressWarnings("unchecked") 전체에 걸려 있는데 범위가 너무 넓어지니 지역변수를 선언해 한정을 시키자.
 
 ```java

    public <T> T[] toArray(T[] a) {
        if (a.length < size)
            // Make a new array of a's runtime type, but my contents:
           @SuppressWarnings("unchecked")
           T[] result = (T[]) Arrays.copyOf(elementData, size, a.getClass());
            return result;
        System.arraycopy(elementData, 0, a, 0, size);
        if (a.length > size)
            a[size] = null;
        return a;
    }

```

# 참조
-----

