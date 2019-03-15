---
layout: post
title: "codespitz73_part4(ABSTRACT LOOP & LAZY EXECUTION)"
date: 2018-01-17 09:00:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 코드스피츠73 part4

#### ABSTRACT LOOP & LAZY EXECUTION

단순한 루프

```javascript

{
    [Symbol.iterator](){return this;},
    data : [1,2,3,4],
    next() {
        return {
            //계속 반복할지 판단 
            done : this.data.length === 0,
            //반복시마다 처리할 것
            value : this.data.shift()
           
        };
    }
}

```
복잡한 루프

```javascript

{
    [Symbol.iterator](){return this;},
    data : [{a:[1,2,3,4], b:'-'},[5,6,7],8,9],
    next() {
        let v;
        while (v = this.data.shift()){
            switch (true){
                case Array.isArray(v):{
                    this.data.unshift(...v);
                    break;
                }
                case v && typeof v == 'object':{
                    for(let k in v) this.data.unshift(v[k]);
                    break;
                }
                default : return {value: v, done:false}
            }
        }
        return {done:true}
    }
}

```
##### ABSTRACT LOOP 
다양한 구조의 루프와 무관하게 해당 값이나 상황만 개입만 하고 싶은경우

```javascript
(data, f) => {
    let v;
    while (v = data.shift()){
        if(!(v instanceof Object)) f(v);
        else {
            if(!Array.isArray(v)) v = Object.values(v);
            data.unshift(...v);
        }
    }
}

```
위에 함수에서 console.log 만 추가 할려고 해도 아래 처럼 수정 할수 밖에 없다.

```javascript

(data, f) => {
    let v;
    while (v = data.shift()){
        if(!(v instanceof Object)){
            console.log(v);
            f(v);
        } else {
            if(!Array.isArray(v)) v = Object.values(v);
            data.unshift(...v);
        }
    }
}

```
코드는 고정 되어 있고 변수가 상태를 바꾼다.
위에 함수를 객체화로 바꾸면 아래 처럼 된다.

팩토리 + 컴포지트

```javascript

const Operator = class{
    static factory(v){
        if(v instanceof Object){
              if(!Array.isArray(v)) v = Object.values(v);
              return new ArrayOp(v.map(v=> Operator.factory(v)));
        }else{
            return new PrimaOp(v);
        }
    }
    constructor(v){
        this.v = v;
    }
    operation(f){throw 'override';}
};

const PrimaOp = class extends Operator{
        constructor(v){
            this.v = v;
        }
        operation(f){
            f(this.v);
        }
};

const ArrayOp class extends Operator{
    constructor(v){
        this.v = v;
    }
    operation(f){
        for(const v of this.v){
            v.operation(f);
        }
    }
};

Operator.factory([1,2,3,{a:4,b:5},6,7]).operation(console.log);

```

팩토리 + 컴포지트 + ES6 Iterable

```javascript


const Operator = class{
    static factory(v){
        if(v instanceof Object){
              if(!Array.isArray(v)) v = Object.values(v);
              return new ArrayOp(v.map(v=> Operator.factory(v)));
        }else{
            return new PrimaOp(v);
        }
    }
    constructor(v){
        this.v = v;
    }
    *gene(){throw 'override';}
};

const PrimaOp = class extends Operator{
        constructor(v){
            this.v = v;
        }
        *gene(){
           yield this.v;
        }
};

const ArrayOp class extends Operator{
    constructor(v){
        this.v = v;
    }
    *gene(){
        for(const v of this.v){
            yield * v.gene()
        }
    }
};

for(const v of Operator.factory([1,2,3,{a:4,b:5},6,7]).gene()) console.log(v);

```
##### LAZY EXECUTION

YIELD

```javascript

const odd = function*(data) {
  for (const v of data){
      console.log('odd',odd.cnt ++);
      if(v % 2) yield v;
  }
};

odd.cnt =0;
for(const v of odd([1,2,3,4])) console.log(v);

const take= function*(data, n) {
    for (const v of data){
        console.log('take',take.cnt ++);
        if(n--) yield v; else break;
    }
};

take.cnt =0;
for(const v of take([1,2,3,4], 2)) console.log(v);

for(const v of take(odd([1,2,3,4]), 2)) console.log(v);


```

YIELD*

```javascript

const Stream = class{
    static get(v){return new Stream(v);}
    constructor(v){
        this.v = v;
        this.filters = [];
    }
    add(gene, ...arg){
        this.filters.push(v=>gene(v, ...arg));
        return this;
    }
    *gene(){
        let v = this.v;
        for(const f of this.filters) v = f(v);
        yield* v;
    }
};

const odd = function*(data){
    for(const v of data) if(v % 2) yield v;
};

const take = function*(data, n){
    for(const v of data) if(n--) yield v; else break;
};

for(const v of Stream.get([1,2,3,4]).add(odd).add(take, 2).gene()) console.log(v);

```

어렵네요... ㅜㅜ


# 참조 
-----
* [코드스피츠73_part4](https://www.youtube.com/watch?v=Ufh_E2Y090k)
