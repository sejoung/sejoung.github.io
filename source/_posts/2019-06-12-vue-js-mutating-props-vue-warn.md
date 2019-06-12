---
layout: post
title: "Mutating props vue-warn"
date: 2019-06-12 18:16 +0900
comments: true
tags : ["vuejs","Mutating props vue-warn"]
categories : ["javascript"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## Mutating props vue-warn

뷰에서 컴포넌트를 선언후 props로 값을 부모로 부터 받을때 해당 값을 직접 변경 할려고 할때 warn이 나타납니다.

아래의 코드를 보면 v-model="propsData"로 직접 select 값을 바꾸는데 값을 바꿀수 있다 이때 warn 메시지가 나타난다.


```javascript

const selectDiscountByShowYnIsN ={
    data: function(){
        return {
            discounts: [],
        }
    },
    props: {
        propsData: String
    },
    template:`
    <select class="form-control" name="discountByShowYnIsN" v-model="propsData">
          <option value="">선택해주세요</option>
          <option v-for="discount in discounts" v-bind:value="discount.discSeq" v-text="discount.discName">
          </option>
    </select>
    `,
    created: function () {
        this.getDiscountByShowYnIsN();
    },
    methods:{
        getDiscountByShowYnIsN: async function () {
            let response = await fetch(
                '/api/test');
            let data = await response.json();
            this.discounts = data;
        }
    }
};


```

이렇게 다시 변수를 선언해서 쓰는 방법

```javascript

const selectDiscountByShowYnIsN ={
    data: function(){
        return {
            discounts: [],
            data : this.propsData
        }
    },
    props: {
        propsData: String
    },
    template:`
    <select class="form-control" name="discountByShowYnIsN" v-model="data">
          <option value="">선택해주세요</option>
          <option v-for="discount in discounts" v-bind:value="discount.discSeq" v-text="discount.discName">
          </option>
    </select>
    `,
    created: function () {
        this.getDiscountByShowYnIsN();
    },
    methods:{
        getDiscountByShowYnIsN: async function () {
            let response = await fetch(
                '/api/test');
            let data = await response.json();
            this.discounts = data;
        }
    }
};


```


# 참조
-----
* [vue-2-mutating-props-vue-warn](https://stackoverflow.com/questions/39868963/vue-2-mutating-props-vue-warn)
