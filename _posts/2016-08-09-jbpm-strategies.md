---
layout: post
title: "jbpm 실행전략"
date: 2016-08-09 16:41:00 +0900
comments: false
---

## jbpm Runtime strategy


총 3가지가 있는데 디폴트는 Singleton이다 
성능테스트시에 was 쪽에 병목 현상이 일어나서 확인해본결과 아래의 내용대로 실행전략을 잘짜야겠다는 생각을 했다.
성능테스트를 위해 Per request로 모두 수정하여 테스트를 진행하였다.

Singleton stratege
=====================

KieSession 및 TaskService의 단일 인스턴스를 유지 합니다. 동기화로 인해서 성능이 저하되어 있긴 하지만 Thread safe하고 엑세스를 동기화 합니다. 아래와 같은 특징을 제공합니다.

- RuntimeEngine 및 taskService의 단일 인스턴스.
- 간단한 디자인과 컴팩트.
- 동기화 액세스 하는 프로세스 엔진중 괜챃음
- 하나의 KieSession instance의 모든 상태 object를 알수 있다.
- RuntimeManager간에 사용되는 KieSession의 ID 추적은 같은 세션을 사용합니다. 아래 설정의 임시위치에 이 ID가 저장이 됩니다.
    - jbpm.data.dir
    - jboss.server.data.dir
    - java.io.tmpdir

Per request strategy
=====================

모든 요청에 대해 RuntimeEngine의 새로운 객체를 제공합니다. 요청이 완료되면 RuntimeEngine이 영구적으로 제거 됩니다. 
- KieSession 정보가 DB에서 제거됨.
아래와 같은 특징을 제공합니다

- 모든 요청에 대해 완전히 격리된 프로세스 엔진 및 태스트 서비스를 운영함.
- 높은 부하에 대한 적합
- KieSession 요청의 수명 시간 동안 만 사용할 수 있음.

Per process instance strategy
=====================

KieSession과 ProecssInstance사이의 엄격환 관계를 유지합니다. 이 전력은 최대의 성능 및 가장 유연한 접근 방식을 제공.
아래와 같은 특징을 제공합니다.

- ProcessInstance에 대해 동일한 KieSession을 제공하는것을 보장한다
- ProcessInstance는 모든 프로세스 인스턴스 완료/중단 시 KieSession의 라이프 사이클을 병합
- 프로세스 인스턴스는 해당 데이터에 액세스 할 수 있습니다.
- Context instance 허용
    - EmptyContext 나 null : 사용가능한 프로세스 인스턴스 ID가 없다
    - ProcessInstanceIDContext : 프로세스 인스턴스가 생성된 후 사용
    - CorrelationKeyContext - 프로세스 InstanceID의 키를 대신해서 사용
