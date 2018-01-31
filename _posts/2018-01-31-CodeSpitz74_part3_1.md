---
layout: post
title: "CodeSpitz74_Part3_1"
date: 2018-01-31 09:00:00 +0900
comments: false
---

### 코드스피츠 74 3회차

HTML PARSER 만들기

A = <TAG>BODY</TAG>
B = <TAG/>
C = TEXT
BODY = (A|B|C)N

함수는 어떻게 짠다. 레이아웃이라는 개념으로 짠다. 함수의 시그니쳐를 확정하는데 있다.

node로 확정되는 순간은?


```javascript

const parser = input =>{
    const result;
    let cursor = 0;
    
    let text = '';
    while (cursor < input.length){
        const char = input[cursor++];
        // 여기서 text노드가 탄생하는 순간이다.
        if(char === '<'){
            // 함수로 제거
            if(text.length){
                //텍스트 노드 삽입
                text = '';
            }
   
        }else{
            text += char;
        }
    }
    
    return result;
};

```

함수를 만드는 기본적인 이유 사람한테 쉬운 단어로 바꾼다 어휘로 바꾼다.

```javascript

const textNode = (text, target) =>{
     if(text.length){
         //target 삽입           
     }
};

const parser = input =>{
    const result;
    let cursor = 0;
    
    let text = '';
    while (cursor < input.length){
        const char = input[cursor++];
        if(char === '<'){
            
            //알고리즘 제거 어휘로 바꾼다.
            text = textNode(text, target);
            text = '';

        }else{
            text += char;
        }
    }
    
    return result;
};

```
첫번째 테그의 이름까지 얻어냄 

```javascript

const textNode = (text, target) =>{
     if(text.length){
         //target 삽입           
     }
};

const parser = input =>{
    const result;
    let cursor = 0;
    
    let text = '';
    while (cursor < input.length){
        const char = input[cursor++];
        if(char === '<'){

            text = textNode(text, target);
            text = '';

            if(input[cursor++] != '/'){
                let name = input.substr(cursor -1, cursor = input.indexOf('>', cursor));
                const isClose = input[cursor] === '/';
                if(isClose){
                    name = name.substr(0, name.length - 1);
                }
                const tag = {name, type:'NODE', children:[]};
                cursor++;
            }

        }else{
            text += char;
        }
    }
    
    return result;
};

```

스택추가 ㅜㅜ

```javascript

const textNode = (text, target) =>{
     if(text.length){
         target.push({type:'TEXT', text});
         return '';
     }
};

const parser = input =>{
    const result ={tag:{type:'ROOT', children:[]}, stacks=[]};
    let cursor = 0, stack = result;
    
    do{
        let text = '';
            while (cursor < input.length){
                const char = input[cursor++];
                if(char === '<'){
                    text = textNode(text, stack.tag.children);
                    if(input[cursor++] != '/'){
                        let name = input.substr(cursor -1, cursor = input.indexOf('>', cursor));
                        const isClose = input[cursor] === '/';
                        if(isClose){
                            name = name.substr(0, name.length - 1);
                        }
                        const tag = {name, type:'NODE', children: isClose ? null:[]};
                        cursor++;
                        stack.tag.children.push(tag);
                        if(!isClose){
                            stacks.push({tag, back: stack});
                            break;
                        }
                    }
                }else{
                    text += char;
                }
            }
    }while (stack = stacks.pop())
    
    return result;
};

```


# 참조 
-----

* [코드스피츠 74 3회차 1강](https://www.youtube.com/watch?v=LZSnwTArz3A&list=PLBA53uNlbf-vuKTARH6Ka7a_Jp0OVT_AY&index=2)
* [코드스피츠 74 3회차 2강](https://www.youtube.com/watch?v=X7E2NnkclRE&index=1&list=PLBA53uNlbf-vuKTARH6Ka7a_Jp0OVT_AY)
* [Abstract syntax tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree)
* [Backus–Naur form](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form)
