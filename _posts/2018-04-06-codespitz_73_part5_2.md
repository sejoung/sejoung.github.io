---
layout: post
title: "codespitz73_part5_2"
date: 2018-04-06 10:30:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 코드스피츠73 part5

#### BLOCK, NONBLOCK

##### BLOCKING EVASION -> NONBLOCKING

서브루틴이 즉시플로우 제어권을 내놓는것

```javascript

const a=123;

looper(12, console.log);

backRun(v=>v[0] + v[1], console.log, 3, 5);

console.log(a); //어쨌든콘솔은123부터출력

```

#### SYNC, ASYNC

병행성 프로그래밍에 익숙해져야 된다.

##### SYNC

서브루틴이 즉시값을 반환함

```javascript

const double = v=>v*2;

console.log(double(2)); //4


```

block 즉시 플로우 제어권을 반환하지 않음

```javascript

const sum = n=>{
	let sum = 0;
	for(let i = 1; i <= n; i++) 
		sum += i;
		return sum;
};

sum(100);

```

non block즉시플로우제어권을반환함

```javascript
const sum = n=>{
	const result = {isComplete:false};
	requestAnimationFrame(_=>{
		let sum = 0;
		for(let i = 1; i <= n; i++) 
			sum += i;
			result.isComplete = true;
			result.value = sum;
	});
	return result;
};

const result = sum(100);

while(!result.isComplete); // 무한루프기 때문에 에러남
console.log(result.value); 

```
##### ASYNC

서브루틴이 콜백을 통해 값을 반환함
 
```javascript

const double = (v, f)=> f(v*2); 

double(2, console.log); //4

```

block 즉시 플로우 제어권을 반환하지 않음

```javascript

const sum = (n, f)=>{
	let sum = 0;
	for(let i = 1; i <= n; i++) 
		sum += i;
	return f(sum);
};

sum(10, console.log);
console.log(123); //55 → 123

```

non block즉시플로우제어권을반환함

```javascript

const sum = (n, f)=>{
	requestAnimationFrame(_=>{
		let sum = 0;
		for(let i = 1; i <= n; i++) 
			sum += i;
			f(sum);
	});
};

sum(10, console.log);
console.log(123);//123 → 55

```

루프를 짤때 블럭가드를 항상 설치한다.

```javascript

for(let i = 0; i <= arr.length, limit = 50000; limit-- >0 && i<j; i++){

}

if(limit < 0){

}

```

callback 함수는 리턴 받는 함수를 캡슐화 하기 위해서 

##### SIMILAR ASYNC-BLOCK 미루기 패턴 


```javascript

const sum = (n, f)=>{
	requestAnimationFrame(_=>{
		let sum = 0;
		for(let i = 1; i <= n; i++) 
			sum += i;
			f(sum);
	});
};

sum(100000000, console.log);
console.log(123);// 여기서 sync가 발생

```


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

// 사용하는 코드 

const f = v=>{
	for(let i = 1, sum = 0; i <= v[0]; i++){
		sum += i;
	}
	return sum;
};

let i=1000;
// 쓰레드가 엄청 생김 쓰레드 고갈 10k 문제
while(i--) backRun(f, console.log, 100000);

```



# 참조 
-----
* [코드스피츠73_part5](https://www.youtube.com/watch?v=BeFekctVoq0)
* [코드스피츠73_part5 교안](https://onedrive.live.com/?authkey=%21AM2CnCfuu1K5R5g&cid=AE0BF2746200B9CD&id=AE0BF2746200B9CD%2156080&parId=AE0BF2746200B9CD%2146307&o=OneUp)
