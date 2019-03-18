---
layout: post
title: "응집도_(commincation cohesion)"
date: 2018-05-21 16:34:00 +0900
comments: true
tags : ["응집도"]
categories : ["study"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### 응집도 (cohesion)

#### 통신(?) 대화(?)응집도 (commincation/informational)

통신 응집력이란 모듈의 일부가 동일한 데이터 (예 : 동일한 정보 기록에서 작동하는 모듈)에서 작동하기 때문에 그룹화 된 부분입니

예제는 java Deque 클래스를 들겠다.

여기서 OOP 냄새가 나기 시작함


```java

package java.util;

public interface Deque<E> extends Queue<E> {
    
    void addFirst(E e);

    void addLast(E e);

    boolean offerFirst(E e);

    boolean offerLast(E e);

  
    E removeFirst();

   
    E removeLast();

   
    E pollFirst();

   
    E pollLast();

   
    E getFirst();

   
    E getLast();

    E peekFirst();

 
    E peekLast();

   
    boolean removeFirstOccurrence(Object o);

  
    boolean removeLastOccurrence(Object o);

  
    boolean add(E e);

  
    boolean offer(E e);

  
    E remove();

   
    E poll();

   
    E element();
    
    E peek();

    void push(E e);

    E pop();


    boolean remove(Object o);

  
    boolean contains(Object o);

    public int size();
   
    Iterator<E> iterator();

    Iterator<E> descendingIterator();

}


```

