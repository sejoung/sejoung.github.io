---
layout: post
title: "CHAPTER 14 중첩된 데이터에 함수형 도구 사용하기"
date: 2024-02-14 09:48 +0900
comments: true
tags: [ "쏙쏙 들어오는 함수형 코딩","심플한 코드로 복잡한 소프트웨어 길들이기" ]
categories: [ "books" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# CHAPTER 14 중첩된 데이터에 함수형 도구 사용하기

## 함수형 도구: update() 

```javascript
function update(object, key, modify) {
  var value = object[key];
  var newValue = modify(value);
  var newObject = objectSet(object, key, newValue);
  return newObject;
}

function withObjectCopy(object, modify) {
    var copy = Object.assign({}, object);
    modify(copy);
    return copy;
}

function objectSet(object, key, value) {
    return withObjectCopy(object, function(copy) {
        copy[key] = value;
    });
}

```

객체를 다루는 함수형 도구

## update2() 도출하기 
```javascript
function update2(object, key1, key2, modify) {
    return update(object, key1, function(subObject) {
        return update(subObject, key2, modify);
    });
}

```
## incrementSizeByName()을 만드는 네 가지 방법 

### 옵션1: update()와 incrementSize()로 만들기

```javascript
function incrementSizeByName(cart, name) {
    return update(cart, name, incrementSize);
}

function incrementSize(item) {
    var size = item['size'];
    var newSize = size + 1;
    var newItem = objectSet(item, 'size', newSize);
    return newItem;
}
```

### 옵션2: update()와 update2()로 만들기 

```javascript
function incrementSizeByName(cart, name) {
    return update(cart, name, function (item) {
        return update2(item, 'options', 'size', function (size) {
            return size + 1;
        });
    });
}

```

### 옵션3: update()로 만들기 

```javascript
function incrementSizeByName(cart, name) {
  return update(cart, name, function(item) {
    return update(item, 'options', function(options) {
      return update(options, 'size', function(size) {
        return size + 1;
      });
    });
  });
}
```

### 옵션4: 조회하고 바꾸고 설정하는 것을 직접만들기

```javascript
function incrementSizeByName(cart, name) {
  var item       = cart[name];
  var options    = item.options;
  var size       = options.size;
  var newSize    = size + 1;
  var newOptions = objectSet(options, 'size', newSize);
  var newItem    = objectSet(item, 'options', newOptions);
  var newCart    = objectSet(cart, name, newItem);
  return newCart;
}
```

## update3() 도출하기
```javascript
function update3(object, key1, key2, key3, modify) {
  return update(object, key1, function(object2) {
    return update2(object2, key2, key3, modify);
  });
}

```

## nestedUpdate() 도출하기 

```javascript
function nestedUpdate(object, keys, modify) {
  if(keys.length === 0)
    return modify(object);
  var key1 = keys[0];
  var restOfKeys = drop_first(keys);
  return update(object, key1, function(value1) {
    return nestedUpdate(value1, restOfKeys, modify);
  });
}
```

## 안전한 재귀 사용법 

* 종료조건
  * 재귀를 멈추려면 종료 조건(base case)이 필요하다.
* 재귀 호출
  * 재귀 호출을 하려면 자신을 호출하는 코드가 필요하다.
* 종료 조건에 다가가기
  * 최소 하나 이상의 인자가 점점 줄어들어야 한다

## 재귀 함수가 적합한 이유 
재귀나 호출 스택을 사용하지 않고 중첩된 데이터를 다루기는 어렵다

# 참조
-----

* [쏙쏙 들어오는 함수형 코딩(심플한 코드로 복잡한 소프트웨어 길들이기)](https://www.yes24.com/Product/Goods/108748841)
