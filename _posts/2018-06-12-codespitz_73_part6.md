---
layout: post
title: "codespitz_73_part6"
date: 2018-06-12 10:30:00 +0900
comments: false
---

### 코드스피츠73 part6

#### generator, promise, async/await

#### generator

breaking block

```javascript

const infinity=(function*(){
    let i = 0;
    while(true) 
        yield i++;
})();

console.log(infinity.next());
....
console.log(infinity.next());

```


time slicing manual

```javascript

const looper =(n, f, slice = 3)=>{
	let limit = 0, i = 0;
		const runner=_=>{
			while(i < n){
				if(limit++ < slice) f(i++);
				else{
					limit = 0;
					requestAnimationFrame(runner);
					break;
					}
			}
		};
		requestAnimationFrame(runner);
};

looper(12, console.log);

```

위에 로직을 generator 변경

```javascript

const loop = function*(n, f, slice = 3)=>{
	let limit = 0, i = 0;
        while(i < n){
            if(limit++ < slice) f(i++);
            else{
                limit = 0;
                yleid;
                }
        }
};

const executor =iter =>{
    const runner =_=>{
        iter.next();
        requestAnimationFrame(runner);
    };
    requestAnimationFrame(runner);
};

executor(loop(10, console.log));

```

로직과 알고리즘의 분리가 가능

#### generator + async + executor

yleid는 값을 받아들이거나 출력할수 있다.

```javascript

const profile = function*(end, next, r){
    const userid = yield $.post('member.php', {r}, next);
    let added = yield $.post('detail.php', {userid}, next);
    added = added.split(",");
    end({userid, nick:added[0], thumb:added[1]});
};

const executor = (end, gene, ...arg)=>{
    const next =v=> iter.next(v);
    const iter = gene(end, next,...arg);
    iter.next();
};

executor(console.log, profile, 123);

```

위에 로직은 콜백지옥을 탈출 목표 

비동기를 동기식으로 보이게 하기 위해

#### promise

passive async control

콜백을 보낼수는 있지만 언제올지는 모른다.

콜백은 순서에 관계가 있게 개발해야 되나?(순서 없는쪽으로 가야된다.)

```javascript

$.post(url, data, e=>{
    //언제올까
});

```

왜언제가중요한가?

```javascript

let result;

$.post(url1, data1, v=>{
    result = v;
});

$.post(url2, data2, v=>{
    result.nick = v.nick;
    report(result);
});

```

콜백 제어는 순서를 모르는것이 죄악 ㅜㅜ

active async control

프라미스는 then을 호출해야 결과를 얻는다.

```javascript

let result;

const promise = new Promise(r=>$.post(url1, data1, r));
promise.then(v=>{result = v;});

const promise1 = new Promise(r=>$.post(url1, data1, r));
const promise2 = new Promise(r=>$.post(url2, data2, r));

promise1.then(result=>{
    promise2.then(v=>{
        result.nick = v.nick;
        report(result);
    });
});

```
generator + promise

```javascript

const profile = function*(end, r){
    const userid = yield new Promise(res=>$.post('member.php', {r}, res));
    let added = yield new Promise(res=>$.post('detail.php', {userid}, res));
    added = added.split(",");
    end({userid, nick:added[0], thumb:added[1]});
};

const executor = (gene, end, ...arg)=>{
    const iter = gene(end, ...arg);
    const next = ({value, done}) =>{
        if(!done) 
            value.then(v=>next(iter.next(v)));
    };
    next(iter.next());
};

executor(profile, console.log, 123);

```

#### async await

await promise = sync

```javascript

const profile = async function(end, r){
    const userid = await new Promise(res=>$.post('member.php', {r}, res));
    let added = await new Promise(res=>$.post('detail.php', {userid}, res));
    added = added.split(",");
    end({userid, nick:added[0], thumb:added[1]});
};

profile(console.log, 123);


```


# 참조 
-----
* [코드스피츠73_part5](https://www.youtube.com/watch?v=Ma190j-D5Mg)
