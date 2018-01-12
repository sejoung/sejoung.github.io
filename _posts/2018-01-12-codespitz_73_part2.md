---
layout: post
title: "codespitz73part2"
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

##### if문

```javascript

a:const  c = 3;
if(식) 옵션널
if(식) 
else 필수

```
 
```javascript

a:const  c = 3;
if( c === 1){
    
} else if (c === 2){
    
} else if (c === 3){
    
}else{
    
}

```
else if문은 없다. else 후방 결합을 사용하지 말아라

병렬 조건을 사용할때 else if를 사용하지말아라

1차 조건이 분기한 이후에 부분집합에 분기가 필요할때만 사용해라

```javascript

a:const  c = 3;
if( c === 1){
    
} else {
    if (c === 2){
        
    } else {
        if (c === 3){
               
        }else{
            
        }    
    }
}  

```

else 문 후방결합에 따라서 아래 방식대로 사용가능하다.


```javascript

a:const  c = 3;
if( c === 1){
    
} else for(;;;) {
    
} else switch (){
    
} else {
    
}

```

코드의 부수효과 else를 제거 하면서 필수 조건이 빠지면 안된다. else를 사용하면 필수로 가는것을 추천하라

```javascript

a:const  c = 3;
if( c === 1){
    
} else {
    if (c === 2){
        
    } else {
        if (c === 3){
               
        }    
    }
}  

```

##### for 문

for문에 첫번째 인자만 식과 선언문이 들어 올수 있다.

```javascript

const con = document.getElementById("log");
const log = (...args) => con.innerHTML += '<br/>' + args.join(' ');

var a = 3;

for(선언문 또는 식 또는 공문; truthy ; for문에 맨마지막에 실행된다.){
    
 '', false, 0, undefined, null, NaN, // falsy 값   

}

// 무한 루프 가운데 값을 공문으로 채우면 truthy로 판단함 예외사항
for(; ; ){
    
}

// 에러가 남 
while (){
    
}

// 한번은 먼저 실행해야 되는경우에 많이 사용
do {
    
}while ()

```
 쉬운 문장
 
```javascript

var a = -1;

while (a > 2){
    a++;
}


do {
    
}while (truthy);

do a++; while (a);

```

아래의 코드는 배재함

```javascript

while (act.method().c){
    other.action();
}


```

이런식으로 보이게 만들어라 

```javascript

var a = act.method().c;
while (a){
    other.action();
    a = act.method().c;
}


```

아래 처럼 테스트 코드 작성 하기 편함

```javascript

var a = act.method().c;
while (a) {
    let r  = other.action();
    a = act.method().c;
    if(r === 'abc') a = false;
}

```

어렵다. 오늘도...

# 참조 
-----
* [코드스피츠73_part2-1](https://www.youtube.com/watch?v=q9j6XLOQYeA)
* [코드스피츠73_part2-2](https://www.youtube.com/watch?v=U6dmAT8KImY)
