---
layout: post
title: "dgding javascript lesson"
date: 2017-04-12 10:02:00 +0900
comments: false
---

programming이란?

program을 만드는 행위 

program은 컴퓨터가 실행할수 있는 메모리에 올라가 있는 덩어리

compile의 뜻 묶는다 

interpreting의 뜻 번역

언어 마다 기계어로 바꿨을대 강점이 존재함

* Lexical Grammar(어휘 문법)

모든 프로그래밍 언어에서 구체적인 문법을 정의하기 이전에 기본 요소들을 정의해 둔 것을 Lexical Grammar
 
Control Characters(제어문자) : 눈에 보이지 않지만 여러가지 제어를 위해 삽입되는 문자.

White Space(공백) : 공백 (띄어쓰기)를 컴퓨터가 인식하게 하는 문자.

Line terminators(줄바꿈) : 말 그대로 컴퓨터가 줄바꿈을 인식할 수 있게하는 문자.

Comments(주석) : 실제 코드로 작성되어있긴 하지만, 번역기가 코드를 컴퓨터가 이해할 수 있는 더 저차원의 언어로 해석할 때 명령으로 인식하지 않는 부분.

Keywords(키워드) : 미리 약속으로 정해둔 단어들. 자바스크립트에서 정의됨

Literals(리터럴) : 더 이상 나눌 수 없는 값을 표현. 예를 들면 3, ‘3’, [] 등…

자바스크립트 버전업은 이제 부터 년도를 붙히기로 함 

-----------------------------------------------


프로그램은 3가지 요소로 되어 있음 Statement, Expression, Variable


Statement는 컴퓨터에게 제공하는 힌트

Expression는 식은 값과 같다 식은 결국 하나의 값으로 수렴되니깐(1+1=2)

Variable는 식의 결과를 저장하는 곳 변수가 받는것은 식만 들어감

------------------------------------------------


* Statement(문)

	empty statement : 빈문

		i=0; while(i++ <10); console.log(i);

	block statement : 중문({})

	(flow) control statement : 제어문(언어에 미지정의 되있는것)

		질문) 흐름제어를 한다고 하는데 컴파일이 된 결과에서도 흐름제어문이 들어갈수도 있는것아닌가요?

		답) 컴파일된 기계어에서도 흐름제어가 될수도 있고 loop가 100번 돌아가면 컴파일러가 문장을 100번 넣을수도 있는것이기 때문에 거기까진 고민하지 않는다.

	expression statement : 식문(;)

	(variable) declare statement : (변수)선언문

* Expression

	value expression(값식)

	operation expression(연산식)

	call expression(호출식)
	
# 참조 
-----

* [자바스크립트 Lexical Grammar](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar)

* [ECMAScript® Language Specification](https://www.ecma-international.org/ecma-262/5.1/)


