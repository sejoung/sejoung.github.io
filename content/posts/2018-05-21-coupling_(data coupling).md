---
layout: post
title: "결합도_(data coupling)"
date: 2018-05-21 09:30:00 +0900
comments: true
tags : ["결합도"]
categories : ["study"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### 결합도 (coupling)

#### 데이터 결합 (data coupling)
 
약결합

data coupling은 모듈이 매개 변수를 통해 데이터를 공유 할 때 발생합니다.

```java

package com.github.sejoung.reactive.test;

public class DataCode {

    public int count(int i){
        return ++i;
    }

}


```

```java

package com.github.sejoung.reactive.test;

public class DataCode2 {
    private DataCode dataCode;

    private int counter;

    public DataCode2(DataCode dataCode){
        this.dataCode = dataCode;
        this.counter = 0;
    }

    public void count(){
        this.counter = this.dataCode.count(this.counter);
    }

    public int getCounter(){
        return this.counter;
    }
}


```
실행 소스 

```java

package com.github.sejoung.reactive.test;

public class DataCodeTest {
    public static void main(String[] args) {
        DataCode2 dc = new DataCode2(new DataCode());

        dc.count();
        dc.count();

        System.out.println(dc.getCounter());
    }
}


```