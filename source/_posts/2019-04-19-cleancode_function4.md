---
layout: post
title: "클린코드(함수)4"
date: 2019-04-18 09:14 +0900
comments: true
tags : ["클린코드","cleancode"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 클린코드

### 함수

#### 오류코드 보다는 예외를 사용하라

오류코드를 반환하는 방식은 명령과 조회를 분리하라라는것을 미묘하게 위배한다.

차라리 예외를 사용하는것이 깔끔하다.

try catch블록은 별도로 함수로 분리하는것이 좋다.

오류처리도 한가지 작업이다. 함수는 한가지 일만해야된다.


# 참조
-----

