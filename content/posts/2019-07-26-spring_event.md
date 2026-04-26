---
layout: post
title: "spring 이벤트"
date: 2019-07-26 18:27 +0900
comments: true
tags : ["spring","이벤트","event","EventListener"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
## 스프링 이벤트 

스프링에서 ApplicationEvent를 상속받아서 구현된 이벤트를 수신할수 있는 방법이 여러가지 있다.

기본적으로 ApplicationListener를 상속 받아서 구현하는 방법

```java

@Slf4j
@Component
public class TestSpringEventApplicationListener implements ApplicationListener<TestSpringEvent> {
  @Override
  public void onApplicationEvent(TestSpringEvent event) {
    log.debug("Received spring custom event - {}", event);
  }
}

```

두번째로 @EventListener 어너테이션을 사용해서 처리하는 방법

```java

@Slf4j
@Component
public class TestSpringEventListener {

  @EventListener
  public <T> void handleTestSpringEvent(TestSpringEvent<T> event) {
    log.debug("event listener {}", event);
  }

}

```

세번째로 @TransactionalEventListener 어너테이션을 사용하는 방법 

```java
@Slf4j
@Component
public class TestSpringTransactionalEventListener {

  @TransactionalEventListener
  public <T> void handleAfterCommit(TestSpringEvent<T> event) {
    log.debug("AFTER COMMIT {}", event);
  }

  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMPLETION)
  public <T> void handleAfterCompletion(TestSpringEvent<T> event) {
    log.debug("AFTER COMPLETION {}", event);
  }

  @TransactionalEventListener(phase = TransactionPhase.AFTER_ROLLBACK)
  public <T> void handleAfterRollback(TestSpringEvent<T> event) {
    log.debug("AFTER ROLLBACK {}", event);
  }

  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public <T> void handleBeforeCommit(TestSpringEvent<T> event) {
    log.debug("BEFORE COMMIT {}", event);
  }

}

```

# 참조
-----

* [spring-events-test](https://github.com/sejoung/spring-events-test/)

