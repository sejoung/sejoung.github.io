---
layout: post
title: "spring kafka dead letter queue 설정"
date: 2022-02-10 09:29 +0900
comments: true
tags : ["dead-letter-queue","kafka","spring","DLQ"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
--->
# spring kafka dead letter queue 설정

kafka 커넥터를 사용해서 dlq를 설정하는 방법이 있고 spring을 사용해서 컨슈머를 만들었으면 스프링을 통해서 dlq를 설정 하는 방법이 있다.
spring에서 dlq를 설정하는 방법에 대해서 알아 보겠다.

```java

package io.github.sejoung.kafka.consumer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaOperations;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.SeekToCurrentErrorHandler;

import io.github.sejoung.kafka.dto.CustomMessage;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class DLQConsumer {

    @Bean
    public SeekToCurrentErrorHandler errorHandler(DeadLetterPublishingRecoverer deadLetterPublishingRecoverer) {
        return new SeekToCurrentErrorHandler(deadLetterPublishingRecoverer);
    }

    @Bean
    public DeadLetterPublishingRecoverer publisher(KafkaOperations<String, Object> operations) {
        return new DeadLetterPublishingRecoverer(operations);
    }

    @KafkaListener(id = "test-dlq", topics = "custom-message-topic")
    public void listen(CustomMessage value) {
        log.info("listen {}", value);
    }

}


```

스프링 부트를 사용하면 위와 같은 코드를 통해서 dlq를 설정할수 있다. 간단하게 bean 2개를 더 설정해주면 dlq를 설정할수 있는데 
저기서 생성되는 dlq의 이름은 토픽명.DLQ로 생성이 된다.(여기선 custom-message-topic.DLQ로 값이 생성됨)

만약 파티션을 지정하려면 위에 코드에서 한부분만 바꿔서 처리할수 있다.

```java

package io.github.sejoung.kafka.consumer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaOperations;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.SeekToCurrentErrorHandler;

import io.github.sejoung.kafka.dto.CustomMessage;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class DLQConsumer {

    @Bean
    public SeekToCurrentErrorHandler errorHandler(
        DeadLetterPublishingRecoverer deadLetterPublishingRecoverer) {
        return new SeekToCurrentErrorHandler(
            deadLetterPublishingRecoverer);
    }

    @Bean
    public DeadLetterPublishingRecoverer publisher(
        KafkaOperations<String, Object> operations) {
        return new DeadLetterPublishingRecoverer(operations,(r, e) -> new TopicPartition(r.topic() + ".Foo.failures", r.partition()));
    }

    @KafkaListener(id = "test-dlq", topics = "custom-message-topic")
    public void listen(
        CustomMessage value) {
        log.info("listen {}", value);
    }

}


```

위에 코드와 같은 방법으로 파티션 명을 지정할수 있다.

# 참고

------

* [kafka connector dlq](https://docs.confluent.io/cloud/current/connectors/dead-letter-queue.html)
* [Kafka Connect Deep Dive – Error Handling and Dead Letter Queues](https://www.confluent.io/blog/kafka-connect-deep-dive-error-handling-dead-letter-queues/)
* [KIP-610: Error Reporting in Sink Connectors](https://cwiki.apache.org/confluence/display/KAFKA/KIP-610%3A+Error+Reporting+in+Sink+Connectors)
* [Kafka Connect Dead Letter Queues](https://devidea.tistory.com/111)
* [dead-letters](https://docs.spring.io/spring-kafka/docs/current/reference/html/#dead-letters)
