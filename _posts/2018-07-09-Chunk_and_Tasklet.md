---
layout: post
title: "Chunk_and_Tasklet"
date: 2018-07-09 10:55:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 스프링 배치 Step 에 Chunk 처리와 Tasklet 처리의 차이

Step 일괄 작업의 독립적 연속 상을 캡슐화 정의와 실제 배치 공정을 제어하는 데 필요한 모든 정보를 포함하는 도메인 객체이다. 

Step 다음 두 가지 방법 중 하나로 처리 할 수 있습니다.
    
    Chunk : Spring Batch는 가장 일반적인 구현 내에서 'Chunk Oriented'처리 스타일을 사용
    
    Tasklet : 하나의 메소드를 가지고있는 간단한 인터페이스입니다.이 메소드 는 실패를 알리기 위해 예외를 던지 거나 반환 할 때까지 execute반복하여 호출


Parameter | Tasklet | Chunk
---- | ---- | ---- 
When to use	 | 작업을 단일 세부 작업으로 실행 한 다음 태스크 릿 처리를 사용한다고 가정합니다. | 실행할 작업이 복잡하고 읽기, 처리 및 쓰기와 관련된 작업을 실행한다고 가정하자. 청크 지향 처리를 사용합니다. 
How it works | 집계가 없으면 작업 만 실행됩니다. | 입력을 읽은 다음 비즈니스 로직을 기반으로 처리 한 다음 커밋 간격에 도달 할 때까지 집계하고 마지막으로 데이터 출력 청크를 파일 또는 데이터베이스 테이블에 쓰는 작업이 포함됩니다. 
Usage |  일반적으로 사용되지 않습니다. | Step을 실행하는 가장 일반적인 방법. 
Use Case | 일반적으로 리소스를 삭제하거나 쿼리를 실행하는 것과 같은 단일 태스크를 호출하는 시나리오에 사용됩니다. | 일반적으로 여러 집계 된 단계를 복사, 처리 및 데이터 전송과 같이 실행해야하는 경우에 사용됩니다 


# 참조 
-----
* [spring batch Chunk](https://docs.spring.io/spring-batch/trunk/reference/html/configureStep.html#chunkOrientedProcessing)
* [spring batch tasklet](https://docs.spring.io/spring-batch/trunk/reference/html/configureStep.html#taskletStep)
* [batchtaskchunk](http://www.javainuse.com/spring/batchtaskchunk)