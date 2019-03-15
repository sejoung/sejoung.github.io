---
layout: post
title: "codespitz73_part3_2(ITERATION & GENERATOR)"
date: 2018-01-16 09:00:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 코드스피츠73 part3_2

#### ITERATION & GENERATOR

##### ES6 LOOP 지연루프 

```javascript

const loop = (iter, f) => {
    //iterable이라면 iterator를 얻음
    if(typeof iter[Symbol.iterator] == 'function'){
        iter = iter[Symbol.iterator]();
    }
    //iteratorObject가 아니면 건너뜀(숼드 패턴)
    if(typeof iter.next != 'function') return;
    
    while (true){
        const v = iter.next();
        if(v.done) return; //종료 처리
        f(v.value);// 현제값을 전달함
    }
    
};

const iter = {
    [Symbol.iterator](){return this;},
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

loop(iter, console.log);
//4
//3
//2
//1

```
위에 loop 함수를 사용하지 않고 내장 반복처리기들

* 배열해체 Array destructuring

```javascript

const iter = {
    [Symbol.iterator](){return this;},
    data : [1,2,3,4],
    next() {
        return {
            //계속 반복할지 판단 
            done : this.data.length === 0,
            //반복시마다 처리할 것
            value : this.data.pop()
           
        };
    }
};


const [a,...b] = iter;
// 이터레이터도 테스트
// const [a,...b] = iter[Symbol.iterator]();
// const [a,...b] = [1,2,3,4];
// array도 이터레이터를 상속 받음
// console.log(typeof [][Symbol.iterator]);
// String도 이터레이터를 상속받음
// console.log(typeof ""[Symbol.iterator]);

console.log(a,b);
// 4,[3,2,1]

```
* 펼치기 Spread

```javascript

const iter = {
    [Symbol.iterator](){return this;},
    data : [1,2,3,4],
    next() {
        return {
            //계속 반복할지 판단 
            done : this.data.length === 0,
            //반복시마다 처리할 것
            value : this.data.pop()
           
        };
    }
};

const a =[...iter];

console.log(a);
//[4,3,2,1]

```
배열을 전달 하는것 보다 객체를 전달하는것은 통제권을 객체안에서 가지고 올수 있다.

* Rest Parameter 나머지 인자

```javascript


const iter = {
    [Symbol.iterator](){return this;},
    data : [1,2,3,4],
    next() {
        return {
            //계속 반복할지 판단 
            done : this.data.length === 0,
            //반복시마다 처리할 것
            value : this.data.pop()
           
        };
    }
};

const test = (...arg)=> console.log(arg);
test(...iter);


```

위에 펼치기와 비슷 하지만 함수 내부에서 해체되어 들어온다.

* 함수 선언시에 사용되면 Rest Parameter
* 함수가 아닌곳에서 사용하면 Spread

```javascript

function() {
    // 지역변수
    arguments
    // 전역변수
    location
    //동적컨텍스트
    this
}

() => {
    // 자유변수 아니면 전역변수로 선언됨
    arguments
    location
    this
}

```

보다명확하게 단일한 규칙으로 표현하기 위해서 위처럼 지원한다.(ES6)

```javascript

// ES5
const cls = function() {
  this.base = arguments;
}

new cls(1,2);
new cls(1,2,3);

const arr = [1,2,3,4,5,6,7,8];
// ES5에서는 arr를 생성자에 적용시킬 방법이 없다.
new cls();


// ES6
const cls = function(...arg){
  this.base = arg;
}
//ES6에서는 Spread로 적용가능
new cls(...arr);

```
##### FOR OF

```javascript

const iter = {
    [Symbol.iterator](){return this;},
    data : [1,2,3,4],
    next() {
        return {
            //계속 반복할지 판단 
            done : this.data.length === 0,
            //반복시마다 처리할 것
            value : this.data.pop()
           
        };
    }
};

//제어문이 소비 하는 방식
for (const v of iter){
    console.log(v);    
}
//4
//3
//2
//1

```

연습 문제

* 객체로의 캡슐화 예제

```javascript

const N2 = class{
    constructor(max){
        this.max = max
        
    },
    [Symbol.iterator](){
        let cursor = 0, max = this.max;
        return {
            done : false,
            next(){
                if(cursor > max){
                    this.done = true;
                }else{
                    this.value = cursor * cursor;
                    cursor ++;
                }
                return this;
            }
        };
    }
};

//Spread
console.log([... new N2(5)]);

for (const v of new N2(5)){
    console.log(v);
}

```

LOOP를 실행 할때 메모리에 값을 가지고 실행 했는데 지금은 함수에서 값을 가지고 있어서 지연 실행이 가능

##### Generator

위에 함수를 generator로 재구현

* 함수로써의 캡슐화

```javascript

const generator = function*(max) {
  let cursor = 0;
  while (cursor < max){
      yield cursor * cursorl
      cursor++;
  }
};

//Spread
console.log([... generator(5));

for (const v of generator(5)){
    console.log(v);
}

```

그런데 while을 썼는데 멈추었다. 이건 코루틴에 기초이다.
generator 블록은 코루틴이라서 함수에서 지연호출이 가능함
현대 모던 언어에서는 코루틴을 가지고 있다.

오늘도 최고의 강의 였습니다.
감사합니다. ㅜㅜ

# 참조 
-----
* [코드스피츠73_part3](https://www.youtube.com/watch?v=GhAkc00TvZs)
* [iterator-interface](http://www.ecma-international.org/ecma-262/6.0/#sec-iterator-interface)
* [iterable-interface](http://www.ecma-international.org/ecma-262/6.0/#sec-iterable-interface)

