---
layout: post
title: "coupling_(data coupling)"
date: 2018-05-21 09:30:00 +0900
comments: false
---

### 결합도 (coupling)

#### 데이터 결합 (data coupling)
 
약결합

data coupling은 모듈이 매개 변수를 통해 데이터를 공유 할 때 발생합니다.
각 데이텀은 기본 요소이며 공유 된 유일한 데이터입니다.
아래는 BigDecimal 클래스에 longCompareMagnitude 메소드 입니다. 


```java

private static int longCompareMagnitude(long x, long y) {
        if (x < 0)
            x = -x;
        if (y < 0)
            y = -y;
        return (x < y) ? -1 : ((x == y) ? 0 : 1);
    }

```
