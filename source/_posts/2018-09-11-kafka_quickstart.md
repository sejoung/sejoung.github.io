---
layout: post
title: "카프카 Quickstart"
date: 2018-09-11 15:38 +0900
comments: true
tags : ["kafka","Quickstart"]
categories : ["Kafka"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 카프카 Quickstart

이 튜토리얼은 당신이 기존의 Kafka 또는 ZooKeeper 데이터가 없다고 가정합니다. 
Kafka 콘솔 스크립트는 Unix 기반 및 Windows 플랫폼에서 서로 다르므로 Windows 플랫폼에서는 bin/대신 bin\windows\ 경로를 사용하고 
스크립트 확장자는 .sh 대신 .bat 사용합니다.

### 1단계 : 코드 다운로드

[kafka2.0 릴리즈](https://www.apache.org/dyn/closer.cgi?path=/kafka/2.0.0/kafka_2.11-2.0.0.tgz)를 다운로드 하고 압출을 품니다.

```
> tar -xzf kafka_2.11-2.0.0.tgz
> cd kafka_2.11-2.0.0
```

### 2단계 : 서버 시작

카프카는 주키퍼 서버를 사용합니다 주키퍼서버가 기동되있지 않으면 주키퍼를 먼저 시작해 주세요

```
> bin/zookeeper-server-start.sh config/zookeeper.properties
[2013-04-22 15:01:37,495] INFO Reading configuration from: config/zookeeper.properties (org.apache.zookeeper.server.quorum.QuorumPeerConfig)
...
```

카프카 서버 시작

```
> bin/kafka-server-start.sh config/server.properties
[2013-04-22 15:01:47,028] INFO Verifying properties (kafka.utils.VerifiableProperties)
[2013-04-22 15:01:47,051] INFO Property socket.send.buffer.bytes is overridden to 1048576 (kafka.utils.VerifiableProperties)
...
```

### 3단계 : 토픽 생성

싱글 파티션에 하나의 리플리카의 토픽을 test라는 이름으로 만든다.

```
> bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test
```

list 토픽 명령을 실행해보면 토픽을 확인 할수 있다.

```
> bin/kafka-topics.sh --list --zookeeper localhost:2181
test
```

### 4단계 : 메시지 전송

카프카 (Kafka)는 파일 또는 표준 입력에서 입력을 받아 카프카 클러스터에 메시지로 보내는 명령 행 클라이언트와 함께 제공됩니다. 기본적으로 각 줄은 별도의 메시지로 전송됩니다.

생성자를 실행 한 다음 콘솔에 몇 개의 메시지를 입력하여 서버에 보내십시오.

```
> bin/kafka-console-producer.sh --broker-list localhost:9092 --topic test
This is a message
This is another message
```

```
{test=LEADER_NOT_AVAILABLE} (org.apache.kafka.clients.NetworkClient)
org.apache.kafka.common.KafkaException: Producer closed while send in progress

```

위에 메시지를 입력할때 위에 로그처럼 에러 메시지가 나옴 처음에 kafka서버를 로드 할때 localhost:9092로 서버가 기동 되는게 아니였다
아래의 로그는 카프카 서버를 기동했을때 나오는 메시지 였다 설정을 하지 않으면 DESKTOP-EHS95QM:9092  처럼 컴퓨터 이름으로 셋팅되는데
원도우에서는 host에 선언 되있지 않았다.

```
WARN [KafkaServer id=0] Error during controlled shutdown, possibly because leader movement took longer than the configured controller.socket.timeout.ms and/or request.timeout.ms: Connection to DESKTOP-EHS95QM:9092 (id: 0 rack: null) failed. (kafka.server.KafkaServer)
```

그래서 server.properties 에 설정에 보면 아래의 설정이 주석 되있는데 메시지를 풀었다

```
advertised.listeners=PLAINTEXT://localhost:9092
```

### 5단계 : 컨슈머 시작

Kafka는 표준 출력으로 메시지를 덤프하는 명령 행 사용자도 있습니다.

```
> bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test --from-beginning
This is a message
This is another message
```
위의 각 명령을 다른 터미널에서 실행하면 이제는 생산자 터미널에 메시지를 입력 할 수 있어야하며이를 소비자 터미널에 표시 할 수 있습니다.

모든 명령 행 도구에는 추가 옵션이 있습니다. 인수없이 명령을 실행하면 자세한 사용법 정보가 표시됩니다.

### 6단계 : multi-broker cluster 셋팅하기

지금까지 우리는 하나의 broker를 사용했지만, 그건 재미가 없습니다. Kafka의 경우 단일 브로커는 크기가 하나 인 클러스터이므로 브로커 인스턴스를 몇 개 더 시작하는 것 외에는 큰 변화가 없습니다. 
그러나 그것을 느끼기 위해 우리 클러스터를 3 개의 노드로 확장 해 봅시다 (여전히 모든 것이 로컬 머신에 있습니다).

먼저 각 브로커에 대한 설정 파일을 만듭니다 (Windows에서는 copy대신 명령을 사용합니다).

```
> cp config/server.properties config/server-1.properties
> cp config/server.properties config/server-2.properties
```
이제 새 파일을 편집하고 다음 등록 정보를 설정하십시오.

```
config/server-1.properties:
    broker.id=1
    listeners=PLAINTEXT://:9093
    log.dirs=/tmp/kafka-logs-1
 
config/server-2.properties:
    broker.id=2
    listeners=PLAINTEXT://:9094
    log.dirs=/tmp/kafka-logs-2
```

이 broker.id등록 정보는 클러스터의 각 노드에 대한 고유하고 영구적 인 이름입니다. 
우리는 포트와 로그 디렉토리를 오버라이드해야합니다. 왜냐하면 같은 머신에서 이들을 모두 실행하기 때문에 브로커가 모두 같은 포트에 등록하거나 서로의 데이터를 덮어 쓰려고하지 않기 위해서입니다.

우리는 이미 주키퍼와 단일 노드를 시작 했으므로 두 개의 새로운 노드를 시작하면됩니다.

```
> bin/kafka-server-start.sh config/server-1.properties &
...
> bin/kafka-server-start.sh config/server-2.properties &
...
```

이제 replication-factor가 3 인 새로운 토픽을 만듭니다.

```
> bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 3 --partitions 1 --topic my-replicated-topic
```

좋아요,하지만 지금은 우리가 클러스터를 가지고있어서 브로커가 무엇을하고 있는지 어떻게 알 수 있습니까? "주제 설명"명령을 실행하려면 다음을 수행하십시오.

```
> bin/kafka-topics.sh --describe --zookeeper localhost:2181 --topic my-replicated-topic
Topic:my-replicated-topic   PartitionCount:1    ReplicationFactor:3 Configs:
    Topic: my-replicated-topic  Partition: 0    Leader: 1   Replicas: 1,2,0 Isr: 1,2,0

```
다음은 출력에 대한 설명입니다. 첫 번째 줄은 모든 파티션의 요약을 제공하고, 각 추가 줄은 하나의 파티션에 대한 정보를 제공합니다. 이 주제에 대해 하나의 파티션 만 있기 때문에 한 줄만 있습니다.

```
"leader"는 주어진 파티션에 대한 모든 읽기 및 쓰기를 담당하는 노드입니다. 각 노드는 임의로 선택된 파티션 부분의 리더가됩니다.
"Replicas"은 해당 파티션이 리더인지 또는 현재 살아 있는지 여부에 관계없이이 파티션의 로그를 복제하는 노드 목록입니다.
"isr"은 "동기화 된"복제본 집합입니다. 이것은 현재 살아 있고 리더에게 잡힌 복제본 목록의 하위 집합입니다.
```

제 예제에서 노드 1은 주제의 유일한 파티션에 대한 리더입니다.

우리는 원래 작성한 주제에 대해 동일한 명령을 실행하여 그것이 어디에 있는지 알 수 있습니다.

```
> bin/kafka-topics.sh --describe --zookeeper localhost:2181 --topic test
Topic:test  PartitionCount:1    ReplicationFactor:1 Configs:
    Topic: test Partition: 0    Leader: 0   Replicas: 0 Isr: 0
```
따라서 원래의 주제에는 복제본이없고 우리 클러스터를 만들 때 서버의 유일한 서버 인 서버 0에 있습니다.

새로운 주제에 대해 몇 가지 메시지를 게시 해 보겠습니다.

```
> bin/kafka-console-producer.sh --broker-list localhost:9092 --topic my-replicated-topic
...
my test message 1
my test message 2
^C
```
이제 이러한 메시지를 사용합시다.


```
> bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --from-beginning --topic my-replicated-topic
...
my test message 1
my test message 2
^C
```
이제 내결함성을 테스트 해 봅시다. 브로커 1이 리더 역할을 했으므로이를 죽이자.

리눅스 사용시:
```
> ps aux | grep server-1.properties
7564 ttys002    0:15.91 /System/Library/Frameworks/JavaVM.framework/Versions/1.8/Home/bin/java...
> kill -9 7564
```
Windows 사용시 :
```
> wmic process where "caption = 'java.exe' and commandline like '%server-1.properties%'" get processid
ProcessId
6016
> taskkill /pid 6016 /f
```
리더십이 슬레이브 중 하나로 전환되고 노드 1은 더 이상 동기화 복제본 세트에 없습니다.

```
> bin/kafka-topics.sh --describe --zookeeper localhost:2181 --topic my-replicated-topic
Topic:my-replicated-topic   PartitionCount:1    ReplicationFactor:3 Configs:
    Topic: my-replicated-topic  Partition: 0    Leader: 2   Replicas: 1,2,0 Isr: 2,0
```
그러나 메시지를 원래 가지고 있던 지도자가 원래 아래로 있더라도 메시지는 소비를 위해 아직도 유효하다 

```
> bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --from-beginning --topic my-replicated-topic
...
my test message 1
my test message 2
^C
```

### 7단계 : Use Kafka Connect to import/export data

솔에서 데이터를 작성하고 다시 콘솔에 기록하는 것이 편리하지만 다른 소스의 데이터를 사용하거나 Kafka의 데이터를 다른 시스템으로 내보낼 수 있습니다. 많은 시스템에서 사용자 정의 통합 코드를 작성하는 대신 Kafka Connect를 사용하여 데이터를 가져 오거나 내보낼 수 있습니다.

Kafka Connect는 Kafka에 데이터를 가져오고 내보내는 Kafka에 포함 된 도구입니다. 외부 시스템과 상호 작용할 수있는 사용자 지정 논리를 구현하는 커넥터 를 실행하는 확장 가능한 도구입니다 . 이 빠른 시작에서는 파일에서 Kafka 항목으로 데이터를 가져오고 Kafka 항목의 데이터를 파일로 내보내는 간단한 커넥터를 사용하여 Kafka Connect를 실행하는 방법을 살펴 봅니다.

먼저 테스트 할 시드 데이터를 작성합니다.

리눅스 :
```
> echo -e "foo\nbar" > test.txt
```
 Windows :
 ```
 > echo foo> test.txt
 > echo bar>> test.txt
 ```
그런 다음 독립 실행 형 모드 에서 실행 되는 두 개의 커넥터를 시작 합니다. 
즉, 단일 로컬 전용 프로세스에서 실행됩니다. 
우리는 세 가지 구성 파일을 매개 변수로 제공합니다. 
첫 번째는 항상 Kafka Connect 프로세스의 구성이며, Kafka 브로커와 같은 공통 구성과 데이터의 직렬화 형식을 포함합니다. 나머지 구성 파일 각각은 작성할 커넥터를 지정합니다. 
이 파일에는 고유 한 커넥터 이름, 인스턴스화 할 커넥터 클래스 W 커넥터에 필요한 기타 구성이 포함됩니다.

```
> bin/connect-standalone.sh config/connect-standalone.properties config/connect-file-source.properties config/connect-file-sink.properties
```
Kafka에 포함 된이 샘플 구성 파일은 이전에 시작한 기본 로컬 클러스터 구성을 사용하여 두 개의 커넥터를 만듭니다. 첫 번째는 입력 파일에서 행을 읽고 각각을 Kafka 항목으로 생성하고 두 번째는 싱크 커넥터입니다. 카프카 (Kafka) 주제에서 메시지를 읽고 각각을 출력 파일의 한 줄로 만듭니다.

시작 중에 커넥터가 인스턴스화 중임을 나타내는 메시지를 포함하여 여러 로그 메시지가 표시됩니다. Kafka Connect 프로세스가 시작되면 원본 커넥터는 test.txt해당 항목을 connect-test읽고 읽는 작업을 시작해야하며 싱크 커넥터는 항목에서 메시지를 읽고 connect-test 파일에 쓰기 시작해야 합니다 test.sink.txt. 출력 파일의 내용을 검사하여 데이터가 전체 파이프 라인을 통해 전달되었는지 확인할 수 있습니다.

```
> more test.sink.txt
foo
bar
```
데이터가 Kafka 항목에 저장 connect-test되므로 콘솔 소비자를 실행하여 항목의 데이터를 보거나 사용자 정의 소비자 코드를 사용하여 처리 할 수도 있습니다.

```
> bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic connect-test --from-beginning
{"schema":{"type":"string","optional":false},"payload":"foo"}
{"schema":{"type":"string","optional":false},"payload":"bar"}
...
```
커넥터는 계속해서 데이터를 처리하므로 파일에 데이터를 추가하고 파이프 라인을 통해 이동하는 것을 확인할 수 있습니다.

```
> echo Another line>> test.txt
```
콘솔 소비자 출력 및 싱크 파일에 해당 행이 표시되어야합니다.


### 8단계 : Kafka Streams to process data

Kafka Streams는 입력 및 / 또는 출력 데이터가 카프카 클러스터에 저장되는 
미션 크리티컬 실시간 애플리케이션 및 마이크로 서비스를 구축하기위한 클라이언트 라이브러리입니다.
Kafka Streams는 클라이언트 측에서 표준 Java 및 Scala 응용 프로그램을 작성하고 배포하는 단순성과 Kafka의 서버 측 클러스터 기술의 이점을 결합하여 
이러한 응용 프로그램의 확장 성, 탄력성, 내결함성, 분산 성 등을 향상시킵니다. 
이 빠른 시작 예제 에서는이 라이브러리에 코딩 된 스트리밍 응용 프로그램을 실행하는 방법을 보여줍니다.


# 참조
-----
* [kafka-quickstart](https://kafka.apache.org/quickstart)
* [streams-quickstart](https://kafka.apache.org/20/documentation/streams/quickstart)
