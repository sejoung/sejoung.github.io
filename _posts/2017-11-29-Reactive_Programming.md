---
layout: post
title: "Reactive Programming"
date: 2017-11-29 14:26:00 +0900
comments: false
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


# 참조 
-----

* [토비의 봄 TV 5회 스프링 리액티브 프로그래밍](https://www.youtube.com/watch?v=8fenTR3KOJo)

* [reactive-streams](http://www.reactive-streams.org/)

* [reactivex](http://reactivex.io/)

* [grpc](https://grpc.io/)
