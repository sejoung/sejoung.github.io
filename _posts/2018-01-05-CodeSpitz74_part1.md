---
layout: post
title: "CodeSpitz74_Part1"
date: 2018-01-05 09:00:00 +0900
comments: false
---

### 코드스피츠 74 1회차

함수는 만들때 고심을 해야 된다. 함수는 무한대로 크게 되기 때문에
함수를 만들때 첫번째 고민해야 되는 것은 인자를 얼마나 제네릭 하게 만들수 있는지

* 괄호가 없는 서브루틴 호출 예제

```javascript

const a = {
    get a() {
        console.log('hello');
        return 1;
    },
    
    set a(v){
        console.log('world');
        return 1+v;
    }
     
};

a.a
a.a=3;

```
 
자바스크립트는 무조건 리턴이 있는 함수이다. 리턴을 선언 하지 않아도 undefined 값을 받음
리턴을 하는것과 안하는 구문을 구분해서 함수 와 프로시져로 구분하기도 한다.
자바스크립트는 함수만 있는데 프로시져 흉내를 낼수도 있다. throw 구문을 통해서 구현을 통해 retrun 값을 안보낼수도 있다.
함수안에 함수를 무한대로 부를수 없다(자바에 OOM)
자바스크립트에서는100번의 함수 중첩을 허용하지 않는다
함수는 call stack을 고려 해야 된다.

value, reference

```javascript

const a =  new Number(3);
const b = new Number(3);

a == b;

a === b;

a+b;

const c = 3;
const d = 3;

c==d;

```

call by reference, call by value

```javascript

const a =  new Number(3);

a.test = function() {
  console.log('hello');
};

a.test();
// 공백을 두는 이유는 3. 로 찍으면 소수점으로 인식하기 때문에 
// 아래는 되는것 처럼 보인다 박싱이 일어나서
3 .test = function() {
  console.log('???');
};

//value는 참조를 걸수 없기 때문에 안된다.

3 .test();

```

Larry Constantine(래리 콘스탄틴) - high coherence and low coupling(높은 응집도와 낮은 결합도)

content - 강결합 

```javascript

const A = class {
    constructor(v){
        this.v = v;
    }
};

const B = class {
    constructor(a){
        this.v = a.v;
    }
};
  
const b = new B(new A(3));

b.v 

```

common - 강결합

```javascript

const Common = class {
    constructor(v){
        this.v = v;
    }
};


const A = class {
    constructor(c){
        this.v = c.v;
    }
};

const B = class {
    constructor(c){
        this.v = c.v;
    }
};

const a = new A(new Common(3));
const b = new B(new Common(3));

a.v
b.v

```

external - 강결합

```javascript

const A = class {
    constructor(v){
        this.v = v;
    }
    getValue(){
        return this.v;
    }
};

const B = class {
    constructor(a){
        this.v = a.getValue();
    }
};
  
const b = new B(new A(3));

b.v 

```

control - 강결합(편의상 사용시작)

```javascript

const A = class {
   process(flag, v){
       switch (flag){
           case 1: return this.run1(v);
           case 2: return this.run2(v);
           case 3: return this.run3(v); 
       }
   }
};

const B = class {
    constructor(a){
        this.a = a;
    }
    noop(){
        this.a.process(1);
    }
    echo(data){
        this.a.process(2,data);
    }
};
  
const b = new B(new A());

b.noop();
b.echo('test');

```
stamp - 강결합 or 유사약결합

```javascript


const A = class {
    count(v){
        v.count++;
    } 
};

const B = class {
    constructor(a){
        this.a = a;
        this.counter = {
            count : 0
        } 
    }
    count(){
        this.a.count(this.counter);
    }
};

const b = new B(new A());
b.count();
b.count();

b.counter

```
data - 약결합

```javascript

const A = class {
    count(v){
        return ++v;
    } 
};

const B = class {
    constructor(a){
        this.a = a;
        this.counter = 0;
    }
    count(){
        this.counter = this.a.count(this.counter);
    }
};

const b = new B(new A());
b.count();
b.count();

b.counter

```

위내용은 결합도 모델 
아래는 응집도

coincidental(우연히) 

```javascript

const Util = class{
    
    static isConnect(){}
    static log(){}
    static isLogin(){}
    
};


```

logical(사고적으로)

```javascript

const Math = class{
    
    static sin(r){}
    static cos(r){}
    static random(){}
    static sqrt(v){}

};

```

temporal(시점을 기준으로)

why?가 코드로 설명이 안된다.

주석은 코드가 아니라 썩어버린다.

```javascript

const App = class{    
  init(){
      this.db.init();
      this.net.init();
      this.asset.init();
      this.ui.start();
  }
};

```

procedural(절차적으로 처리)

```javascript

const Account = class{    
  login(){
      p = this.ptoken();
      s = this.stoken(p);
      if(!s) this.newLogin();
      else this.auth(s);
  }
};

```

commincation(통신)

응집도가 높고 클래스와 매소드 느낌이 나기 시작

OOP의 모체

```javascript

const Array = class{
    
    push(v){}
    pop(){}
    shift(){}
    unshift(){}
    
};

```

sequential(실행순소)

응집도는 높아지면 결합도도 높아진다.

```javascript

const Account = class{    
    ptoken(){
        return this.pk || (this.pk = IO.cookie.get('ptoken'));
    }
    stoken(){
        if(this.sk) return this.sk;
        if(this.pk){
            const sk = Net.getSessionFromPtoken(this.pk);
        }
    }
    auth(){
        if(this.isLogin) return;
        Net.auth(this.sk).then(v=>this.isLogin);
    }
};

```


# 참조 
-----

* [코드스피츠 74 1회차 1강](https://www.youtube.com/watch?v=hc536Jk9UJE)
* [코드스피츠 74 1회차 2강](https://www.youtube.com/watch?v=HN8kcqv_CKY)
* [코드스피츠 74 1회차 교안](https://onedrive.live.com/?authkey=%21ALhQA-ea1K1WDSA&cid=AE0BF2746200B9CD&id=AE0BF2746200B9CD%2156150&parId=AE0BF2746200B9CD%2156146&o=OneUp)
* [Larry Constantine](https://en.wikipedia.org/wiki/Larry_Constantine)