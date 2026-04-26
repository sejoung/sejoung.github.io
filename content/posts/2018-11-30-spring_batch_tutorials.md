---
layout: post
title: "스프링 배치 처음 따라하기 튜토리얼"
date: 2018-11-30 09:56 +0900
comments: true
tags : ["spring","spring batch"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### 스프링 배치 처음 따라하기 튜토리얼

먼저 지금 회사에 배치서비스를 만드는데 corontab에 등록을 시켜서 java main을 실행
그것을 통해서 배치 서비스를 실행 시킨다 해당 코드는 전체 백엔드와 통합이 되어 실행이 되며
그것으로 인해 의존성 라이브러리등 값을 vm 옵션을 통해서 주고 있다.

위에 방법을 하니 매번 배포나 서비스가 환경을 바뀔때 마다 재배포를 해야 되는 문제점이 있다.

그래서 12factor를 준수하고 di를 할수있는 프레임워크로 바꿀려고 한다. 
전반적으로 한국 자바 개발자들은 Spring에 익숙하기 때문에 Spring batch 프레임워크를 적용하여 
배치를 실행 하려고 하고 있다. 스프링 배치는 JSR352(Spring Batch 에서 영감을 받음)를 준수 하고 있다. 이것은 배치 어플리게이션에 대한 자바에 표준입니다.

스프링 배치 프레임워크를 적용하기 위해서는 여러 설정이 있는데 
설정보다 관례(CoC; Convention over Configuration) 패러다임에 맞춘 spring boot 프레임워크를 사용하려 한다.

![spring batch UI1](https://sejoung.github.io/images/2018_11_30_01.png)

JSR 352는 일괄 처리 비즈니스 로직을 구현할 수있는 수많은 일괄 프로그래밍 API를 정의합니다. 이 중에서 일반적으로 사용되는 ItemReader, ItemProcessor 및 ItemWriter는 배치 단계의 데이터 항목을 읽고, 처리하고, 쓰는 기본 런타임 계약을 정의합니다.

Reader-Processor-Writer 패턴은 기본 패턴 이며 청크 지향 처리 라고 합니다.

* job에는 작업의 논리적 이름 을 정의하고 식별 목적으로 사용되는 "id"속성이 있습니다.
* 각 job은 여러 step 할 수 있습니다. 각  step은 작업 단계와 특성을 나타냅니다. 각 step에는 작업 의 논리적 이름 을 정의하고 식별 목적으로 사용되는 "id"속성이 있습니다.
* step은 chunk 또는 tasklet 요소를 가질 수 있습니다 .이 step에는 chunk가 있습니다. chunk 는  chunk type step을 식별하고 reader-processor-writer pattern을 구현합니다 .

위에 내용을 기반으로 reader-processor-writer pattern을 구현한 간단한 어플리케이션을 구현하겠습니다.

ItemReader의 구현체의 방식이 2가지 있는데 Cursor기반과 Paging기반이 있습니다.

저는 기본구현된 reader와 writer를 사용하지 않았습니다. 저희 회사에서 사용하고 있는 mybatis에 익숙한 개발자들이 많아서 예제를 
MyBatisReader를 사용해서 구현하려고 합니다.

전체를 구현한 소스는 아래의 예제 코드가 있고 reader-processor-writer pattern이 보이는 코드를 보여주겠습니다.


```java

    @Bean(name ="myBatisPagingItemReader")
    @StepScope
    public MyBatisPagingItemReader<Test> adbRead(@Qualifier("sqlSessionAdbFactory") SqlSessionFactory sqlSessionFactory) {
        MyBatisPagingItemReader<Test> myBatisPagingItemReader = new MyBatisPagingItemReader<Test>();
        myBatisPagingItemReader.setQueryId("selectTest2");
        myBatisPagingItemReader.setSqlSessionFactory(sqlSessionFactory);
        return myBatisPagingItemReader;
    }

```

```java

    @Bean(name ="myBatisBatchItemWriter")
    @StepScope
    public MyBatisBatchItemWriter<Test> writer(@Qualifier("sqlSessionBdbFactory")SqlSessionFactory sqlSessionFactory){
        MyBatisBatchItemWriter<Test> myBatisBatchItemWriter = new MyBatisBatchItemWriter<Test>();
        myBatisBatchItemWriter.setSqlSessionFactory(sqlSessionFactory);
        myBatisBatchItemWriter.setStatementId("insertTest");
        return myBatisBatchItemWriter;
    }

```

```java

package com.github.sejoung.configuration;

import com.github.sejoung.Incrementer.CurrentTimeIncrementer;
import com.github.sejoung.listener.JobCompletionNotificationListener;
import com.github.sejoung.processor.ChunkTestItemProcessor;
import org.mybatis.spring.batch.MyBatisBatchItemWriter;
import org.mybatis.spring.batch.MyBatisPagingItemReader;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author kim se joung
 */
@Configuration
public class ChunkBatchConfiguration {

    @Autowired
    public JobBuilderFactory jobBuilderFactory;

    @Autowired
    public StepBuilderFactory stepBuilderFactory;

    @Bean("mySqlBatchProcess")
    @StepScope
    public ItemProcessor mySqlBatchProcess() {
        return new ChunkTestItemProcessor();
    }

    @Bean
    public Job importUserJob(JobCompletionNotificationListener listener, Step stepChunk1) {
        return jobBuilderFactory.get("testChunkJob").incrementer(new CurrentTimeIncrementer()).listener(listener).flow(stepChunk1).end().build();
    }

    @Bean
    public Step stepChunk1(@Qualifier("myBatisPagingItemReader") MyBatisPagingItemReader myBatisPagingItemReader, @Qualifier("mySqlBatchProcess") ItemProcessor mySqlBatchProcess, @Qualifier("myBatisBatchItemWriter") MyBatisBatchItemWriter myBatisBatchItemWriter) {
        return stepBuilderFactory.get("stepChunk1").chunk(1).reader(myBatisPagingItemReader).processor(mySqlBatchProcess).writer(myBatisBatchItemWriter).build();
    }
}


```

위에 방식을 보면 Job을 선언 했고 그안에 step이 있고 step 안에 reader-processor-writer pattern이 보이는 형태 입니다.

위에는 처음 시작하는 간단한 샘플입니다. 처음 시작 해보시죠 ^^ 

# 참조
-----
* [12factor](https://12factor.net/ko/)
* [JSR 352: Batch Applications for the Java Platform](https://jcp.org/en/jsr/detail?id=352)
* [spring-batch](https://spring.io/projects/spring-batch)
* [spring-boot-batch-mybatis 예제코드](https://github.com/sejoung/spring-boot-batch-mybatis)