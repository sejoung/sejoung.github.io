---
layout: post
title: "ErrorHandlingDeserializer 설정"
date: 2022-02-10 09:02 +0900
comments: true
tags : ["ErrorHandlingDeserializer","kafka","spring","This error handler cannot process 'SerializationException's directly"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
--->
# ErrorHandlingDeserializer 설정

poll() 시에 deserializer가 메시지를 deserialize하는 데 실패하면 반환 전에 발생하기 때문에 Spring은 문제를 처리할 방법이 없다.

```java


    @KafkaListener(topicPattern = "test.message")
    public void listen(List<TestMessage> list) {
        ...
    }

```

위에 코드처럼 처음부터 객체를 받을때를 말하는것이다. 이런 문제를 해결하기 위해 ErrorHandlingDeserializer 가 도입이 되었다.

spring boot에서 설정을 하는 법은 간단한데 

```yaml
spring:
  kafka:
    consumer:
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.ErrorHandlingDeserializer
      properties:
        spring:
          deserializer:
            value:
              delegate:
                class: org.springframework.kafka.support.serializer.JsonDeserializer
          json:
            value:
              default:
                type: io.github.sejoung.kafka.dto.CustomMessage
            trusted:
              packages: io.github.sejoung.kafka.dto
```

위와 같이 yaml 파일에 value-deserializer를 ErrorHandlingDeserializer로 지정해주고 설정으로 delegate class를 지정해주면 처리가 된다.

# 참고

------

* [spring-kafka error-handling-deserializer](https://docs.spring.io/spring-kafka/docs/current/reference/html/#error-handling-deserializer)
