---
layout: post
title: "코드스피츠73 part5_1(BLOCK, NONBLOCK)"
date: 2018-04-04 09:00:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 코드스피츠73 part5

#### BLOCK, NONBLOCK

##### FLOW IS BLOCKING
프로그램이 실행되면 도중에 멈춰지지 않고 끝까지 실행됨

```javascript

for(const i of (function*(){
    let i = 0;
	while(true) yield i++;
	})()) console.log(i);


//script timeout
//플랫폼 안정성을 위해 강제 종료 시킴
//스크립트가 5초 정도를 허용시킴

```

##### BLOCKING FUNCTION

점유하는 시간 만큼 블록을 일으키는 함수

```javascript

const f = v->{
	let i=0;
	while(i++ < v);
	return i;
};

f(10);
f(10000000000000);

```
* 배열순회, 정렬-배열크기에따라
* DOM순회-DOM의하위구조에따라
* 이미지프로세싱-이미지크기에따라

##### BLOCKING EVASION

독점적인 cpu 점유로 인해 모든 동작이 정지됨

타임아웃체크에 의해 프로그램이 강제 중단됨

블록킹의 조합을 예측할 수 없음

```javascript

const f = v->other(some(v), v * 2);
f(10);

```

칸텍스트 스위칭 - 시분황 운영체제의 동시 실행

하나의 프로세스에 여러 쓰레드를 사용해서 동시 실행한다.

time slicing

```javascript

const looper =(n, f)=>{
	for(let i = 0; i < n; i++) 
		f(i);
};

looper(10, console.log);
looper(10000, console.log);


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
시간 기준으로 자동화 시킴

time slicing auto

```javascript

const looper =(n, f, ms = 5000, i = 0)=>{
	let old = performance.now(), curr; 
	const runner=_=>{
		while(i < n){
			curr = performance.now();
			if(curr -old < ms) 
				f(i++);
			else{
				old = curr;
				requestAnimationFrame(runner);
				break;
			}
		}
	};
	requestAnimationFrame(runner);
};


```
worker thread pattern

web worker

```javascript

const backRun = (f, end, ...arg)=>{
	const blob = new Blob([`
		onmessage =e=>postMessage((${f})(e.data));
	`], {type:'text/javascript'});
	const url = URL.createObjectURL(blob);
	const worker = new Worker(url);
	worker.onmessage =e=>end(e.data);
	worker.onerror =e=>end(null);
	worker.postMessage(arg);
};

backRun(v=>v[0] + v[1], console.log, 3, 5);

```

1시간 6분 까지 들음 

진짜 명강의 ㅜㅜ

# 참조 
-----
* [코드스피츠73_part5](https://www.youtube.com/watch?v=BeFekctVoq0)
* [코드스피츠73_part5 교안](https://onedrive.live.com/?authkey=%21AM2CnCfuu1K5R5g&cid=AE0BF2746200B9CD&id=AE0BF2746200B9CD%2156080&parId=AE0BF2746200B9CD%2146307&o=OneUp)
* [mozilla requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
* [mozilla performance.now()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)
* [web_workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
* [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
