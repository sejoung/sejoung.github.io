---
layout: post
title: "singleton_pattern"
date: 2018-04-17 16:30:00 +0900
comments: false
---

### singleton_pattern

싱글턴 패턴은 안티패턴?

싱글톤 패턴의 나쁜점은 단일 책임원칙을 위반한다.

그리고 코드의 결합도를 높힌다.

테스트시에 다른 시스템에 영향을 줄수 있다.(공유되고 있는 객체이기 때문에)

하지만 싱글톤을 사용해야 되는경우에는 꼭 사용해야 된다고 생각이 된다.

싱글톤으로 했을때 멀티쓰레드에서 아래 처럼 슬립을 걸면 병목현상이 일어나는것을 확인했다.

해결 해야될것 같다.....

scouter로는 정상처리 되는것 처럼 보이는데 딜레이가 걸리고 있다. 좀 더 봐야 될것 같다.

```java

  private static AtomicInteger ai = new AtomicInteger();

    public List<String> selADEXSortList(String key) {
        if (ai.intValue() == 3) {
            System.out.println("1################################# "+ai.getAndIncrement());
            try {
                Thread.sleep(90000000);
            } catch (Exception e) {
                // TODO: handle exception
            }
        }else {
            System.out.println("2################################# "+ai.getAndIncrement());

        }

        return adexSortPattern.retrieveData(key, null);
    }

```


# 참조 
-----
* [java singleton pattern (싱글톤 패턴)](https://blog.seotory.com/post/2016/03/java-singleton-pattern)
* [Singleton Anti-Pattern - Michael Safyan](https://www.michaelsafyan.com/tech/design/patterns/singleton)
* [what-is-so-bad-about-singletons](https://stackoverflow.com/questions/137975/what-is-so-bad-about-singletons)
* [Java의 동기화 Synchronized 개념 정리#2](http://tourspace.tistory.com/55)
