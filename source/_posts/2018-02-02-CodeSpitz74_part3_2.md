---
layout: post
title: "CodeSpitz74_Part3_2(HTML PARSER 만들기)"
date: 2018-02-02 14:00:00 +0900
comments: true
tags : ["javascript","HTML PARSER"]
categories : ["study"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### 코드스피츠 74 3회차

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
                        // 활당 연산자를 통해서 변수를 줄임
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

함수로 변환

```javascript

const elementNode = (input, cursor, text, stack, stacks) =>{
   
   const char = input[cursor++];
   let isBreak = false;
   
   if(char === '<'){
       text = textNode(text, stack.tag.children);
       if(input[cursor++] != '/'){
           // 활당 연산자를 통해서 변수를 줄임
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
               isBreak = true;
           }
       }
   }else{
       text += char;
   }
   return {cursor, text, isBreak}
};


```



```javascript

const textNode = (text, target) =>{
     if(text.length){
         target.push({type:'TEXT', text});
         return '';
     }
};


const elementNode = (input, cursor, text, stack, stacks) =>{
   
   const char = input[cursor++];
   let isBreak = false;
   
   if(char === '<'){
       text = textNode(text, stack.tag.children);
       if(input[cursor++] != '/'){
           // 활당 연산자를 통해서 변수를 줄임
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
               isBreak = true;
           }
       }else if(stack.tag.name == input.substring(cursor, input.indexOf('>',cursor))){
           stack = stack.back;
       }
   }else{
       text += char;
   }
   return {cursor, text, isBreak}
};


const parser = input =>{
    const result ={tag:{type:'ROOT', children:[]}, stacks=[]};
    let cursor = 0, stack = result;
    
    do{
        let text = '';
        while (cursor < input.length){
            const v = elementNode(input, cursor, text, stack, stacks);
            ({cursor, text} = v);
            if(v.isBreak) break;
        }
    }while (stack = stacks.pop())
    
    return result;
};

```

잘만들자 ㅜㅜ

# 참조 
-----

* [코드스피츠 74 3회차 1강](https://www.youtube.com/watch?v=LZSnwTArz3A&list=PLBA53uNlbf-vuKTARH6Ka7a_Jp0OVT_AY&index=2)
* [코드스피츠 74 3회차 2강](https://www.youtube.com/watch?v=X7E2NnkclRE&index=1&list=PLBA53uNlbf-vuKTARH6Ka7a_Jp0OVT_AY)
* [오토마타 이론](https://ko.wikipedia.org/wiki/%EC%98%A4%ED%86%A0%EB%A7%88%ED%83%80_%EC%9D%B4%EB%A1%A0)
* [형식언어와오토마타 편](https://brunch.co.kr/@toughrogrammer/11)