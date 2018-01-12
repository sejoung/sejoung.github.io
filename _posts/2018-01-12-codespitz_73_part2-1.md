---
layout: post
title: "codespitz73part2-1"
date: 2017-01-12 01:30:00 +0900
comments: false
---

### 코드스피츠73 part2

#### 흐름제어 

##### LABEL, BREAK, CONTINUE

LABEL은 변수의 식별자와 같다.

레이블 레인지가 가르치는 곳으로 갈수있다.

레이블을 주석 형태로도 쓸수 있다.

```javascript

const con = document.getElementById("log");

const log = (...args) => con.innerHTML += '<br/>' + args.join(' ');

abc:() => {
    
    abc:{
        
    }
}


```
레이블 점프

```javascript

const con = document.getElementById("log");

const log = (...args) => con.innerHTML += '<br/>' + args.join(' ');

for(const i of [1,2,3,4]){
    // 레이블 이름을 정하지 않아도 점프가 가능 자동으로 레이블을 만듬
    if(i === 3) break;
    log(i);
}

//에러가 나옴 레이블을 명시하지 않아서
abc: {
    log('a');
    break;
    log('b');
}
log('c');

// 에러가 안됨 현대에 언어에는 아래로만 점프가 가능
abc: {
    log('a');
    break abc;
    log('b');
}
log('c');

```

##### function scope

클로저에 대한 설명

```javascript
const con = document.getElementById("log");
const log = (...args) => con.innerHTML += '<br/>' + args.join(' ');
//자유변수
let a = 3;
// a 자유변수에 대한 클로저
const  f = () => {
    // 쉐도잉
    let a = 5;
    log(a);  
};

```

##### 레이블 스코프

```javascript

const con = document.getElementById("log");
const log = (...args) => con.innerHTML += '<br/>' + args.join(' ');

k1:{
    let a = 3;
    const  f = () => {
        let a = 5;
        k:{
            //레이블 스코프 찾을수 없다 에러가 남
            break k1;
            log(37);
        }
        log(a);
    };
    f();
}

```

##### switch 문

```javascript

const con = document.getElementById("log");
const log = (...args) => con.innerHTML += '<br/>' + args.join(' ');
// 스위치 문에 블럭은 꼭 선언해야 된다.
// 스위치 문에는 특수 레이블을 사용한다.
// 스위치 문에서 익명 레이블을 만들어준다
// 스위치 문에 레이블도 선언해서 쓸수 있다.

let a = 3, b= 0;

// 값이 복잡한 경우
switch (a) {
    case b++: log('a',b);break;
    case b++: log('b',b);break;
    case b++: log('c',b);break;
    case b++: log('d',b);break;
    default: log('e',b);break;           
}

// 조건이 복잡한 경우
switch (true) {
    case a>5: log('a',b);break;
    case a>4: log('b',b);break;
    case a>3: log('c',b);break;
    case a>2: log('d',b);break;
    default: log('e',b);break;           
}

```
스위치 문에는 반드시 default가 있다.


어렵다. 오늘도...

# 참조 
-----
* [코드스피츠73_part2-1](https://www.youtube.com/watch?v=q9j6XLOQYeA)
* [코드스피츠73_part2-2](https://www.youtube.com/watch?v=U6dmAT8KImY)
