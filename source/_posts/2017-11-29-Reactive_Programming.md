---
layout: post
title: "Reactive Programming"
date: 2017-11-29 14:26:00 +0900
comments: true
tags : ["토비의 봄 TV 5회","Reactive","Iterable(PULL) vs Observable(PUSH)"]
categories : ["study"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# Iterable(PULL) vs Observable(PUSH)




```

 Iterable<Integer> iter = () ->
                new Iterator<Integer>() {
                    int i = 0;
                    final static int MAX = 10;

                    @Override
                    public boolean hasNext() {
                        return i < MAX;
                    }

                    @Override
                    public Integer next() {
                        return ++i;
                    }
                };


        for (Integer i : iter) {
            System.out.println(i);
        }

        for (Iterator<Integer> it = iter.iterator(); it.hasNext() ;) {
            System.out.println(it.next());
        }


```

```

	Observer ob = new Observer() {
            @Override
            public void update(Observable o, Object arg) {
                System.out.println(Thread.currentThread().getName() + " " + arg);
            }
        };

        IntObservable io = new IntObservable();
        io.addObserver(ob);
        ExecutorService es = Executors.newSingleThreadExecutor();
        es.execute(io);
        System.out.println(Thread.currentThread().getName() + " EXIT ");
        es.shutdown();
		
	static class IntObservable extends Observable implements Runnable{

        @Override
        public void run() {
            for (int i = 0; i <= 10; i++) {
                setChanged();
                notifyObservers(i); 		//push
				//int i = it.next();        //pull
            }
        }
    }
	
	
```

옵저버 패턴의 단점


1. Complete 이라는것이 없다. 이벤트를 대기 하고있다.


2. Error 에 대한 처리가 어렵다.

```

package com.github.sejoung.hystrix;

import org.reactivestreams.Publisher;
import org.reactivestreams.Subscriber;
import org.reactivestreams.Subscription;

import java.util.Arrays;
import java.util.Iterator;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class PubSub {
    public static void main(String[] args) throws InterruptedException {
        //Publisher <- Observable
        //Subscriber <- Observer

        Iterable<Integer> iter = Arrays.asList(1, 2, 3, 4, 5);
        ExecutorService es = Executors.newSingleThreadExecutor();

        Publisher p = new Publisher() {
            @Override
            public void subscribe(Subscriber subscriber) {
                Iterator<Integer> it = iter.iterator();

                subscriber.onSubscribe(new Subscription() {
                    @Override
                    public void request(long l) {
                        es.execute(() -> {
                            int i = 0;
                            try {
                                while (i++ < l) {
                                    if (it.hasNext()) {
                                        subscriber.onNext(it.next());

                                    } else {
                                        subscriber.onComplete();
                                        break;
                                    }
                                }
                            } catch (RuntimeException e) {
                                subscriber.onError(e);
                            }

                        });

                    }

                    @Override
                    public void cancel() {

                    }
                });
            }
        };


        Subscriber<Integer> s = new Subscriber<Integer>() {
            Subscription subscription;

            @Override
            public void onSubscribe(Subscription subscription) {
                System.out.println("onSubscribe");
                this.subscription = subscription;
                this.subscription.request(2);

            }

            @Override
            public void onNext(Integer integer) {
                System.out.println(Thread.currentThread().getName()+" onNext " + integer);

                this.subscription.request(1);

            }

            @Override
            public void onError(Throwable throwable) {
                System.out.println("onError "+throwable.getMessage());
            }

            @Override
            public void onComplete() {
                System.out.println("onComplete");

            }
        };

        p.subscribe(s);
        es.awaitTermination(10, TimeUnit.HOURS);
    }
}


```

쌍대성

```

대충 두 구조가 있고 한쪽 구조에서 성립하는 모든 관계가 자동으로 다른 구조에서도 성립하고..
한쪽 구조를 다른쪽 구조로 변환하는 일관된 규칙이 있고..
뭐 그러면 서로를 dual 관계라고 하는데.. 자세한 수학적 정의는 공부를 열심히 안해서 ^^;;
대표적인게   비트 and <-> or
1을 0으로, 0을 1로 바꾸면 and의 세계와 or의 세계는 서로 똑같죠..
전자과에선  저항 <-> 컨덴서,
직렬 병렬이 뒤집히고, 전압과 전류가 서로 대응하던가... 뭐 그런..
여기 있는 쌍대성은 informal하게
방향을 뒤집고
합성 방향도 뒤집자는거니까요.

오현석님의 말을 가지고 왔습니다.

```


# 참조 
-----

* [토비의 봄 TV 5회 스프링 리액티브 프로그래밍](https://www.youtube.com/watch?v=8fenTR3KOJo)

* [reactive-streams](http://www.reactive-streams.org/)

* [reactivex](http://reactivex.io/)

* [grpc](https://grpc.io/)

* [Subject/Observer is Dual to Iterator](http://csl.stanford.edu/~christos/pldi2010.fit/meijer.duality.pdf)

* [reactivemanifesto](https://www.reactivemanifesto.org/)

* [에릭마이어 리엑티브 강의](https://channel9.msdn.com/Events/Lang-NEXT/Lang-NEXT-2014/Keynote-Duality)

* [category theory](https://en.wikipedia.org/wiki/Dual_(category_theory))

* [쌍대성](http://www.wikiwand.com/ko/%EC%8C%8D%EB%8C%80%EC%84%B1)

* [[Reactive] Reactive Programming 배우는 방법](http://mobicon.tistory.com/m/467)

* [NDC14 - Rx와 Functional Reactive Programming으로 고성능 서버 만들기](https://www.slideshare.net/jongwookkim/ndc14-rx-functional-reactive-programming)
