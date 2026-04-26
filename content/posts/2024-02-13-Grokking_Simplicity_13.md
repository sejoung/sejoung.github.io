---
layout: post
title: "CHAPTER 13 함수형 도구 체이닝"
date: 2024-02-13 09:35 +0900
comments: true
tags: [ "쏙쏙 들어오는 함수형 코딩","심플한 코드로 복잡한 소프트웨어 길들이기" ]
categories: [ "books" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# CHAPTER 13 함수형 도구 체이닝

여러 단계를 하나로 조합하는것을 체이닝(chaining)이라고 합니다.

## 체인을 명확하게 만들기 1: 단계에 이름 붙이기 
```javascript
function biggestPurchasesBestCustomers(customers) {
  var bestCustomers    = selectBestCustomers(customers);
  var biggestPurchases = getBiggestPurchases(bestCustomers);
  return biggestPurchases;
}

function selectBestCustomers(customers) {
    return filter(customers, function(customer) {
        return customer.purchases.length >= 3;
    });
}

function getBiggestPurchases(customers) {
    return map(customers, getBiggestPurchase);
}

```
## 체인을 명확하게 만들기 2: 콜백에 이름 붙이기

```javascript


function biggestPurchasesBestCustomers(customers) {
  var bestCustomers    = filter(customers, isGoodCustomer);
  var biggestPurchases = map(bestCustomers, getBiggestPurchase);
  return biggestPurchases;
}

function isGoodCustomer(customer) {
    return customer.purchases.length >= 3;
}

function getBiggestPurchase(customer) {
    return maxKey(customer.purchases, {total: 0}, getPurchaseTotal);
}

```
## 체인을 명확하게 만들기 3: 두 방법을 비교 

일반적으로는 콜백에 이름 붙이기가 더 명확하다

## 반복문을 함수형 도구로 리팩터링하기

지금 하는 것은 최적화이다 병목이 생겼을 때만 최적화를 하자

* 이해하고 다시 만들기
* 단서를 찾아 리팩터링

### 값 하나에 map() 두번 사용

```javascript

var names = map(customers, getFullName);
var nameLengths = map(names, stringLength);


var nameLengths = map(customers, function(customer) {
    return stringLength(getFullName(customer));
});

```

### 값 하나에 filter() 두번 사용

```javascript
var goodCustomers = filter(customers, isGoodCustomer);
var withAddresses = filter(goodCustomers, hasAddress);

var withAddresses = filter(customers, function(customer) {
    return isGoodCustomer(customer) && hasAddress(customer);
});
```

### map() 다음에 reduce() 사용하기

```javascript

var purchaseTotals = map(purchases, getPurchaseTotal);
var purchaseSum = reduce(purchaseTotals, 0, plus);

var purchaseSum = reduce(purchases, 0, function(total, purchase) {
    return total + getPurchaseTotal(purchase);
});
```

## 팁 1: 데이터 만들기 
```javascript
var answer = [];
var window = 5;

for(var i = 0; i < array.length; i++) {
  var sum = 0;
  var count = 0;
  for(var w = 0; w < window; w++) {
    var idx = i + w;
    if(idx < array.length) {
      sum += array[idx];
      count += 1;
    }
  }
  answer.push(sum/count);
}
```

```javascript

var answer = [];
var window = 5;

for(var i = 0; i < array.length; i++) {
  var sum = 0;
  var count = 0;
  var subarray = array.slice(i, i + window);
  for(var w = 0; w < subarray.length; w++) {
    sum += subarray[w];
    count += 1;
  }
  answer.push(sum/count);
}

```
## 팁 2: 한 번에 전체 배열을 조작하기 
```javascript
var answer = [];
var window = 5;

for(var i = 0; i < array.length; i++) {
  var sum = 0;
  var count = 0;
  var subarray = array.slice(i, i + window);
  for(var w = 0; w < subarray.length; w++) {
    sum += subarray[w];
    count += 1;
  }
  answer.push(sum/count);
}
```

```javascript

var answer = [];
var window = 5;

for(var i = 0; i < array.length; i++) {
  var subarray = array.slice(i, i + window);
  answer.push(average(subarray));
}
```
## 팁 3: 작은 단계로 나누기 

```javascript
var answer = [];
var window = 5;

for(var i = 0; i < array.length; i++) {
  var subarray = array.slice(i, i + window);
  answer.push(average(subarray));
}
```

```javascript

var indices = [];

for(var i = 0; i < array.length; i++)
  indices.push(i);

var window = 5;
var answer = map(indices, function(i) {
  var subarray = array.slice(i, i + window);
  return average(subarray);
});
```
## 체이닝 팁 요약
* 데이터 만들기
* 배열 전체를 다루기
* 작은 단계로 나누기
* 조건문을 filter()로 바꾸기
* 유용한 함수로 추출하기
## 체이닝 디버깅을 위한 팁
* 구체적인 것을 유지하기
* 출력해보기
* 타입을 따라가 보기
## 다양한 함수형 도구
* pluck()
* cancat()
* frequenciesBy(), groupBy()

# 참조
-----

* [쏙쏙 들어오는 함수형 코딩(심플한 코드로 복잡한 소프트웨어 길들이기)](https://www.yes24.com/Product/Goods/108748841)
