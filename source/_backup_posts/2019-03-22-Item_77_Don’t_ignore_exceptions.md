---
layout: post
title: "아이템 77. 예외를 무시하지 말라."
date: 2019-03-22 15:34 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 77. 예외를 무시하지 말라.

```java

// catch에서 에러를 무시함
try{
  
}catch(SomeException e){
}


```

catch블럭을 비워두면 예외의 존재 이유가 없어진다.

만약 예외를 무시하기로 결정했으면 이유를 주석으로 남기고 예외 변수 이름도 ignored로 바꿔놓도록 하자.

```java

try{
  
}catch(SomeException ignored){
  // 여차여차 해서 무시하기로 함
}

```

# 참조
-----



