---
layout: post
title: "Details_of_the_Object_Model[1]"
date: 2017-01-24 15:29:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---


클래스 기반 언어와 프로토 타입 기반 언어(Class-based vs. prototype-based languages)

Java 및 C ++와 같은 클래스 기반 객체 지향 언어는 클래스와 인스턴스라는 두 개의 별개의 엔티티 개념을 기반으로합니다.

클래스는 객체의 특정을 결정짓는 모든 속성들의 집합이다.(java의 메소드와 필드)

인스턴스는 클래스의 인스턴스이다.

아래의 소스를 보면 Animal은 클래스 이고 dog는 Animal의 인스턴스이다.

```java

public class Animal {

}

Animal dog = new Animal();

```

JavaScript와 같은 프로토 타입 언어는 위에서 처럼 클래스와 인스턴스를 구분짓지 않습니다.

또 상속을 프로토타입 복제를 통해서 구현 하고 있습니다. 

Douglas Crockford가 한 말 입니다.

프로토 타입을 만들고 객체를 생성 합니다. JavaScript에서는 객체를 변경할수있으니 인자에 새로운 인스턴스와 메소드를 제공하여 객체를 보강할수도 있다.

심지어 새로 보강된 객체가 새로운 프로토타입이 될수도 있다. 객체가 객체를 상속 받는데 어떤것이 더 객체지향이냐?

위에 내용을 이해하기 위해서 다음 포스트에서 자바스크립트에 상속에 대해서 설명하겠습니다.

```javascript

var o = {
  a: 2,
  m: function(b){
    return this.a + 1;
  }
};

console.log(o.m()); // 3
// o.m을 호출하면 'this' 는 o를 가리킨다.

var p = Object.create(o);
// p 는 프로토타입을 o로 가지는 오브젝트이다.

p.a = 12; // p 에 'a'라는 새로운 속성을 만들었다.
console.log(p.m()); // 13
// p.m이 호출 될 때 'this' 는 'p'를 가리킨다. 'this.a'는 p의 속성이다.


function Graph() {
  this.vertexes = [];
  this.edges = [];
}

Graph.prototype = {
  addVertex: function(v){
    this.vertexes.push(v);
  }
};

var g = new Graph();


```

# 참조 
-----

* [mozilla Details_of_the_Object_Model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Details_of_the_Object_Model)
