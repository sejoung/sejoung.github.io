---
layout: post
title: "CodeSpitz74_Part2"
date: 2018-01-11 19:00:00 +0900
comments: false
---

### 코드스피츠 74 2회차

함수를 작성할때에 참조에 대해서 충분히 고민해야 된다.

참조를 인자로 보내면 위험하다.


call 스택 -> 지역변수, 인자, 함수의 참조주소

tail recursion(꼬리물기 최적화) -> 메모리 고갈을 방지함 -> 자바스크립트는 ES6에 표준(사파리에서만 작동)

```javascript

// 연산스택 때문에 스택을 해제 할수 없다.(+)
const sum = v => v + (v>1 ? sum(v-1) : 0);

sum(3);

```

```javascript

// 인자로 이관해서 꼬리 물기 최적화
const sum = (v, prev = 0 )=> {
    prev +=v;
    return (v>1 ? sum(v-1,prev) : prev);
}; 

sum(3);

```

```javascript

// 재귀함수는 먼저 꼬리물기 최적화로 바꿈 loop로 빠꿈
const sum = (v)=> {
    let prev +=v;
    while (v>1){
        prev += v;
        v--;
    }
    return prev;
}; 

sum(3);

```
위에 까지는 정적함수 개념을 배운것

closure

자유변수 : free variables 루틴안에 있는 지역변수도 아니고 글로벌 변수도 아닌데 사용할수 있음

nested closure(중첩된 클로저)

```javascript

window.a =3;
if(a == 3){
    const b= 5;
    const f1 = v =>{
        const c = 8;
        if(a+b>c){
            return p => v + p + a + b + c;
        }else{
            return p => v + p + a + b;            
        }
    };
}

```
자유변수를 쓰는 이유는 함수자체에서 제공 받는 객체가 필요해서 사용한다.

shadowing(클로저에서 자유변수로 접근을 막기 위해서 사용한다.)

```javascript

const a =3;
if(a == 3){
    const a =5;
    const f1 = v=>{
        const a = 7;
        console.log(a);
    }
}

```

co routine(여러번 진입하고 반환하는 것)

메모리 지속을 위해서 코루틴을 사용.

```javascript

const generator = function*(a) {
  a++;
  yield a;
  a++;
  yield a;
  a++;
  yield a;
}

const coroutine = generator(3);
let result = 0;
result+= coroutine().value;
console.log(result);
result+= coroutine().value;
console.log(result);
result+= coroutine().value;
console.log(result);

//축약을 위해 아래처럼 사용되기도 함
const a = {*_(){}};
const b = a._();

```

숙제 es6에서 진짜 배열을 상속 받아서 구현 할수 있는이유 super 있어서

```javascript

class TestArray extends Array {
    constructor(...args) { 
        super(...args);
    }
}

const a = new TestArray(2);

console.log(a.length);

//배열 연산자를 뺄수 있는 경우가 ㅜㅜ
function TestArray(...args) {
    var inst = new Array(...args);
    inst.__proto__ = TestArray.prototype;
    return inst;
}

TestArray.prototype = Object.create(Array.prototype);
var a = new TestArray('1','2');
console.log(a.length);

``` 

기존 프로토타입 체인으로 어떻게 될지 잘모르니 좌절 사람들 설명을 보고 나서 대충 감이... 

어렵다 ㅜㅜ



# 참조 
-----

* [코드스피츠 74 2회차 1강](https://www.youtube.com/watch?v=I5BZ7E6xIQ4&list=PLBA53uNlbf-vuKTARH6Ka7a_Jp0OVT_AY&index=2)
* [코드스피츠 74 2회차 2강](https://www.youtube.com/watch?v=S9kjZGc9UiE&index=1&list=PLBA53uNlbf-vuKTARH6Ka7a_Jp0OVT_AY)
* [코드스피츠 74 2회차 교안](https://onedrive.live.com/?authkey=%21ANDAFlMvPM4zKpo&cid=AE0BF2746200B9CD&id=AE0BF2746200B9CD%2156292&parId=AE0BF2746200B9CD%2156146&o=OneUp)
* [lambda 와 closure 의 차이점 ?](https://stackoverflow.com/questions/220658/what-is-the-difference-between-a-closure-and-a-lambda)
* [ES6의 제너레이터를 사용한 비동기 프로그래밍](http://meetup.toast.com/posts/73)
* [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)
* [ES6 Class는 단지 prototype 상속의 문법설탕일 뿐인가?](https://gomugom.github.io/is-class-only-a-syntactic-sugar/)
* [ecma-262](http://www.ecma-international.org/ecma-262/6.0/#sec-class-definitions)
* [es6 class문은 특별할까?](http://www.bsidesoft.com/?p=5370)
* [Subclassing builtins in ECMAScript 6](http://2ality.com/2013/03/subclassing-builtins-es6.html)

