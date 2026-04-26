---
layout: post
title: "CodeSpitz74_Part4(권한과 책임)"
date: 2018-02-19 19:45:00 +0900
comments: true
tags : ["javascript","권한과 책임"]
categories : ["study"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### 코드스피츠 74 4회차

프로그램 짤때는 권한과 책임이 일치하게 짜야 된다. 권한과 책임이 일치하면 그것을 역활이라고 한다.

TETRIS
객체후보

- STAGE(현재 스테이지 정보)
- SCORE(점수 및 계산법)
- BLOCK(범용 블록정의) - 색깔, 회전
- 게임본체
- 범용 패널
- 시작화면
- 스테이지 종료
- 죽음
- 클리어
- 결과 화면

추상화 
* 일반화(카테고라이즈) - 기준점은 역활이다
* 모델링 - 기억해야만 하는것
* 그룹핑 - 랜덤하게 묶이는것(권한)

직접 통신 방법 보다 인터페이스를 통해서 통신해야 된다. 수정에 열려있다.

```javascript

const Stage = class{
    init(listener){
        this.listener = listener;
    }
    clear(){
        this.stage = 0;
        this.next();
    }
    next(){
        if(this.stage++ < Stage.maxStage){
            this.speed = 500 - 450 * this.stage / Stage.maxStage;
            this.listener();
        }
    }
    [Symbol.toPrimitive](hint){
        return `<div>Stage ${this.stage}</div>`;
    }
};

Stage.maxStage = 20;

const Score = class{
        init(listener){
            this.listener = listener;
        }
        clear(){
            this.curr = this.total = 0;
        }
        add(line, stage){
            const score = parseInt((stage * 5) * (2 * line));
            this.curr += score, this.total += score;
            this.listener();
        }
        [Symbol.toPrimitive](hint){
            return `<div>Stage ${this.curr} / ${this.total}</div>`;
        }
};
```
블록 부모 클래스 정의

```javascript

const Block  = class{
    constructor(color){
        Object.assign(this,{color, rotate:0});
    }
    left(){
        if(--this.rotate <0){
            this.rotate = 3;
        }
    }
    right(){
        if(++this.rotate <3){
            this.rotate = 0;
        }
    }
    getBlock(){
        throw 'override!';
    }
};

```

블록 자식클래스 정의

```javascript

const blocks = [class extends Block, ....];

class extends Block{
    constructor(){
        super('#f8cbad');
    }
    getBlock(){
        return this.rotate % 2 ? [[1],[1],[1],[1]] : [[1,1,1,1]] 
    }

};


class extends Block{
    constructor(){
        super('#ffe699');
    }
    getBlock(){
        switch (this.rotate){
            case 0:return [[0,1,0],[1,1,1]];
            case 1:return [[1,0],[1,1],[1,0]];
            case 2:return [[1,1,1],[0,1,0]];
            case 3:return [[0,1],[1,1],[0,1]];
        }
    }

};

```

위에서 자식 클래스에서 중복이 생김 
부모 클래스에 추가작업

```javascript

const Block  = class{
    constructor(color){
        Object.assign(this,{color, rotate:0});
    }
    left(){
        if(--this.rotate <0){
            this.rotate = 3;
        }
    }
    right(){
        if(++this.rotate <3){
            this.rotate = 0;
        }
    }
    getBlock(){
        return this.blocks[this.rotate];
    }
};

```

랜더러 생성

```javascript

const Renderer = class{
    constructor(col, row, base, back){
        Object.assign(this,{col, row, base, back, blocks:[]});
    }
    
    clear(){
        throw 'override!';
    }
    
    render(data){
        if(!(data instanceof Data)) throw 'invalid data';
        this._render(data);
    }
    _render(data){
        throw 'override!';
    }
};

```

데이터 생성

```javascript

const Data = class extends Array{
    constructor(col, row,){
        Object.assign(this,{col, row});
    }
    
    cell(row,col,color){
        if(row > this.row || col > this.col) throw 'invalid';
        (this[row] || (this[row] = []))[col] = color;
    }
    
    row(row, ...color){
        color.forEach((v, i)=> this.cell(row,i,v));
    }
    
    all(...rows){
        rows.forEach((v, i)=> this.row(i, ...v));
    }
};

```

랜더러 상속후 구현

```javascript

const el = el=>document.createElement(el);
const back = (s, v){
    s.backgroundColor = v;
};

const TableRenderer = class extends Renderer{
    constructor(col, row, base, back, style){
        super(col, row, el('table'), back)
        const {col, base, blocks} = this;
        base.style.cssText = style;
        let i = this.row;
        while (i--){
            const tr = base.appendChild(el('tr'));
            const curr = [];
            let j = col;
            blocks.push(curr);
            while (j--) curr.push(tr.appendChild(el('td')).style);
        }
    }
    clear(){
        this.blocks.forEach(curr=>curr.forEach(s=>back(s,this.back)));
    }
    _render(v){
        this.blocks.forEach((curr,i)=>curr.forEach((s,j)=>back(s, v[i][j])));
    }
    
};

```
캔버스

```javascript

const el = el=>document.createElement(el);
const back = (s, v){
    s.backgroundColor = v;
};

const CanvasRenderer = class extends Renderer{
    constructor(col, row, back, style){
        super(col, row, el('canvas'))
        const {col, base, blocks} = this;
        base.style.cssText = style;
        Object.assign(this, {
            width:base.width = parseInt(base.style.width),
            height:base.height = parseInt(base.style.height),
            cellSize:[base.width/col,base.height/row],
            ctx:base.getContext('2D')
        });
    }
    clear(){
        this.ctx.clearRect(0,0,this.width, this.height);
    }
    _render(v){
      this.clear();
      const {col, ctx, cellSize:[w,h]} = this;
      let {row:i} = this;
      while (i--){
          let j = col;
          while (j--){
              ctx.fillStyle = v[i][j];
              ctx.fillRect(j*w,I*h,w,h);
          }
      }
    }
    
};

```

# 참조 
-----

* [코드스피츠74 - ES6+ 함수와 OOP 4회차](https://www.youtube.com/watch?v=0FvkW7P2WEY)
* [코드스피츠74 - 4회차 교안](https://onedrive.live.com/?cid=ae0bf2746200b9cd&id=AE0BF2746200B9CD%2156359&authkey=%21AOUeFW79sTXjKqs)