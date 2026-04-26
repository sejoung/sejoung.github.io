---
layout: post
title: "CHAPTER 17 타임라인 조율하기"
date: 2024-02-19 09:50 +0900
comments: true
tags: [ "쏙쏙 들어오는 함수형 코딩","심플한 코드로 복잡한 소프트웨어 길들이기" ]
categories: [ "books" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# CHAPTER 17 타임라인 조율하기

## 타임라인을 나누기 위한 동시성 기본형 
경쟁조건(race condition)은 어떤 동작이 먼저 끝나는 타임라인에 의존할 때 발생합니다

## 코드에 Cut() 적용하기 

```javascript
function Cut(num, callback) {
  var num_finished = 0;
  return function() {
    num_finished += 1;
    if(num_finished === num)
      callback();
  };
}

var done = Cut(3, function() {
  console.log("3 timelines are finished");
});
  
done();
done();
done();
```

```javascript
function calc_cart_total(cart, callback) {
  var total = 0;
  var done = Cut(2, function() {
    callback(total);
  });
  cost_ajax(cart, function(cost) {
    total += cost;
    done();
  });
  shipping_ajax(cart, function(shipping) {
    total += shipping;
    done();
  });
}
```

## 딱 한 번만 호출하는 기본형 

최초 한 번만 효과가 발생하는 액션을 멱등원(idempotent)이라고 합니다. 

```javascript
function sendAddToCartText(number) {
  sendTextAjax(number, "Thanks for adding something to your cart. Reply if you have any questions!");
}

function JustOnce(action) {
  var alreadyCalled = false;
  return function(a, b, c) {
    if(alreadyCalled) return;
    alreadyCalled = true;
    return action(a, b, c);
  };
}

var sendAddToCartTextOnce = JustOnce(sendAddToCartText);

sendAddToCartTextOnce("555-555-5555-55");
sendAddToCartTextOnce("555-555-5555-55");
sendAddToCartTextOnce("555-555-5555-55");
sendAddToCartTextOnce("555-555-5555-55");
```

## 요약: 타임라인 사용하기 

* 타임라인 수를 줄입니다
* 타임라인 길이를 줄입니다
* 공유 자원을 업앱니다
* 동시성 기본형으로 자원을 공유한다
* 동시성 기본형으로 조율한다


# 참조
-----

* [쏙쏙 들어오는 함수형 코딩(심플한 코드로 복잡한 소프트웨어 길들이기)](https://www.yes24.com/Product/Goods/108748841)
