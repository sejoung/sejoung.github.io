---
layout: post
title: "codespitz73_part3_1(ITERATION & GENERATOR)"
date: 2018-01-15 19:30:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 코드스피츠73 part3_1

#### ITERATION & GENERATOR

##### INTERFACE

1. 인터페이스란 사양에 맞는 값과 연결된 속성키의 셋트
2. 어떤 Object라도 인터페이스의 정의를 충족 시킬수 있다.

```javascript

const obj = {
    
    test(str){
        return true;      
    }
    
};

const Test = class{
    test(str){
        return true;
    }
};

//덕타이핑
const test = new Test();

//컴파일타임에는 타입체크가 안되니

```

우리 머리속에서만 있는 약속이라서 어렵다.

자바 스크립트에서 미리 정의하고 있는 인테페이스

##### ITERATOR

1. next라는 키를 갖고
2. 값으로 인자를 받지 않고 IteratiorResultObject를 반환하는 함수
3. IteratiorResultObject는 value와 done이라는 키를 갖고 있다.
4. 이중 done은 계속 반속 할수 있을지 없을지에따라 boolean 값을 반환

```javascript

const iterator = {
    next() {
        return {
            value : 1,
            done : true
        };
    }
};

```

```javascript

const con = document.getElementById("log");
const log = (...args) => con.innerHTML += '<br/>' + args.join(' ');

const iterator = {
    data : [1,2,3,4],
    next() {
        return {
            value : this.data.pop(),
            done : this.data.length === 0
        };
    }
};

let iResult = iterator.next();
log(iResult.value + ' , '+ iResult.done);
iResult = iterator.next();
log(iResult.value + ' , '+ iResult.done);
iResult = iterator.next();
log(iResult.value + ' , '+ iResult.done);
iResult = iterator.next();
log(iResult.value + ' , '+ iResult.done);
iResult = iterator.next();
log(iResult.value + ' , '+ iResult.done);


```
##### ITERABLE

1. Symbol.iterator라는 키를 갖고 
2. 값으로 인자를 받지 않고 IteratorObject를 반환


```javascript

const con = document.getElementById("log");
const log = (...args) => con.innerHTML += '<br/>' + args.join(' ');

const iterator = {
    data : [1,2,3,4],
    next() {
        return {
            value : this.data.pop(),
            done : this.data.length === 0
        };
    }
};

// new가 되지 않음
const s = Symbol();

const Iterator = class{
    constructor(){
        this.data = [1,2,3,4];
    },
    next() {
        return {
            value : this.data.pop(),
            done : this.data.length === 0
        };
    }
};

// Symbol은 참조가 일어나지 않고 복사가 일어난다(유일값)
const iterable = {
    
    //['@@iterator'] 
    [Symbol.iterator](){
        return new Iterator();
    }
    
}

```

#### LOOP

```javascript

const con = document.getElementById("log");
const log = (...args) => con.innerHTML += '<br/>' + args.join(' ');

const a ={
    '0':3,
    a:5,
    [Symbol()]:7,
    b:6
};

let b = 0;
const c ={
    [b++]:3,
    [b++]:4   
};

```
ES6에서는 object에 순서가 생겼다.
 
 ```javascript

let arr = [1,2,3,4];
//계속 반복할지 판단
while (arr.length > 0){
    //반복시마다 처리할 것
    console.log(arr.pop());
}
// 호출지연
// 값으로 호출 함수 내부에서 가지고 감 판단여부 및 실행
const iterator = {
    arr : [1,2,3,4],
    next() {
        return {
            //반복시마다 처리할 것
            value : this.arr.pop(),
            //계속 반복할지 판단
            done : this.arr.length === 0
        };
    }
};

```
문은 실행이 바로 됨 함수는 바로 실행이 안됨


```javascript

//연산지연 
const a = b || c;

const d = b && c;

//지연 실행
const obj = {
    get a() {
        return 3;
    }
}
// 함수 호출됨
obj.a;

//호출지연
function a() {

      
}

```



# 참조 
-----
* [코드스피츠73_part3](https://www.youtube.com/watch?v=GhAkc00TvZs)
* [iterator-interface](http://www.ecma-international.org/ecma-262/6.0/#sec-iterator-interface)
* [iterable-interface](http://www.ecma-international.org/ecma-262/6.0/#sec-iterable-interface)

