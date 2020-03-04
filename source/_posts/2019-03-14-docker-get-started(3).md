---
layout: post
title: "도커 처음 시작하기part3(서비스)"
date: 2019-03-14 10:49 +0900
comments: true
tags : ["docker"]
categories : ["tool"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 도커 처음 시작하기(서비스)

### 전제조건

* Docker 버전 1.13 이상을 설치하십시오.
* [도커 처음 시작하기part1(오리엔테이션 및 설정)](https://sejoung.github.io/2019/03/2019-03-13-docker-get-started(1)/) 에서 방향을 읽으십시오 .
* [도커 처음 시작하기part2(컨테이너)](https://sejoung.github.io/2019/03/2019-03-13-docker-get-started(2)/) 에서 컨테이너를 만드는 방법에 대해 알아보십시오 .
* friendlyhello 이미지를 레지스트리 로 푸시 하여 게시했는지 확인하십시오. 우리는 여기에 그 공유 된 이미지를 사용합니다.
* 이미지가 배포 된 컨테이너로 작동하는지 확인하십시오. docker run -p 4000:80 username/repo:tag 이 명령을 실행 다음 방문 http://localhost:4000/.
  
### 소개

3 부에서는 응용 프로그램을 확장하고로드 균형 조정을 활성화합니다. 
이렇게하려면, 우리는 분산 응용 프로그램의 계층 구조에서 한 단계 위로 이동해야 서비스 .

* 스택
* 서비스 (현재 위치)
* 컨테이너 ( 2 부 적용 )

### services 란?

분산 응용 프로그램에서 응용 프로그램의 다른 부분을 "서비스"라고합니다. 
예를 들어 비디오 공유 사이트를 상상하면 데이터베이스에 응용 프로그램 데이터를 저장하는 서비스, 
사용자가 무언가를 업로드 한 후 백그라운드에서 비디오 트랜스 코딩을 위한 서비스, 프런트 엔드를위한 서비스 등이 포함됩니다.

서비스는 실제로 "프로덕션 컨테이너"입니다. 
서비스는 하나의 이미지 만 실행하지만 이미지를 실행하는 방식을 체계화합니다. 
사용할 포트 수, 실행해야하는 컨테이너의 복제본 수, 서비스에 필요한 용량이 있습니다. 
곧. 서비스를 확장하면 해당 소프트웨어를 실행하는 컨테이너 인스턴스 수가 변경되어 프로세스의 서비스에 더 많은 컴퓨팅 리소스가 할당됩니다.

다행히도 Docker 플랫폼으로 서비스를 정의, 실행 및 확장하는 것은 매우 쉽습니다. 단지 `docker-compose.yml` 파일을 작성하는 것뿐입니다.

### 당신의 첫번째 docker-compose.yml

`docker-compose.yml` 파일은 도커 용기 생산에서 행동하는 방법을 정의하는 YAML 파일입니다.

당신이 2 부에서 레지스트리에 이미지 밀어넣어 만든을 username/repo:tag 이미지의 세부 사항을 대체하여 docker-compose.yml 파일로 저장하십시오.


```yaml

version: "3"
services:
  web:
    # replace username/repo:tag with your name and image details
    image: sejoung/get-started:part2
    deploy:
      replicas: 5
      resources:
        limits:
          cpus: "0.1"
          memory: 50M
      restart_policy:
        condition: on-failure
    ports:
      - "4000:80"
    networks:
      - webnet
networks:
  webnet:

```

이 docker-compose.yml 파일은 Docker에게 다음을 수행하도록 지시합니다.

* 2 단계 에서 업로드 한 이미지를 레지스트리 에서 당겨 냅니다.
* 해당 이미지의 인스턴스 5 개를 호출 한 서비스로 실행합니다. 
web 각 프로세스마다 최대 CPU 시간의 10 %를 사용하도록 제한합니다 (예를 들어 1.5는 1 그리고 절반의 core를 의미 할 수 있음) 
그리고 메모리는 50MB 로 제한.
* 컨테이너가 실패하면 즉시 다시 시작하십시오.
* 호스트의 포트 4000을 web 포트 80 에 매핑하십시오 .
* web 로드 밸런싱 네트워크를 통해 포트 80을 공유하도록 지시 webnet합니다. 
(내부적으로 컨테이너 자체 web는 임시 포트에서 80 번 포트에 게시합니다.)
* webnet기본 설정 (로드 균형 조정 된 오버레이 네트워크)으로 네트워크를 정의합니다.

### 당신의 새롭게 load-balanced app을 실행 

`docker stack deploy` 명령을 사용하기 전에 먼저 다음을 실행합니다.

`docker swarm init`

```
C:\Users\ASUS>docker swarm init
Swarm initialized: current node (jhdqx8g4oy354du0w0zruox2d) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-6bh8cw13hw27w6mi4brpn9b75c6i9tb7xu7cxmg19gdlqikaz7-cm5437fthnhpl4ekp92taggfm 192.168.65.3:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.

```
```
참고 : 우리는 4 장 에서 그 명령의 의미를 이해합니다. 
docker swarm init 실행하지 않으면 "이 노드는 군집 관리자가 아닙니다."라는 오류가 표시됩니다.
```

이제 실행 해 봅시다. 앱에 이름을 지정해야합니다. 여기서는 다음과 같이 설정됩니다 getstartedlab.

`docker stack deploy -c docker-compose.yml getstartedlab`

```

C:\Users\ASUS>docker stack deploy -c docker-compose.yml getstartedlab
Creating network getstartedlab_webnet
Creating service getstartedlab_web

```

단일 서비스 스택은 배포 된 이미지의 컨테이너 인스턴스 5 개를 하나의 호스트에서 실행합니다. 
조회 해보자.

애플리케이션에서 하나의 서비스에 대한 서비스 ID를 얻습니다.

`docker service ls`

```

C:\Users\ASUS>docker service ls
ID                  NAME                MODE                REPLICAS            IMAGE                       PORTS
4v3l89msqs5q        getstartedlab_web   replicated          5/5                 sejoung/get-started:part2   *:4000->80/tcp

```

web앱 이름이 앞에 붙은 출력을 찾으십시오. 
이 예제에서와 같이 이름을 지정한 경우 이름은 getstartedlab_web입니다. 
서비스 ID는 복제본 수, 이미지 이름 및 노출 된 포트와 함께 나열됩니다.

또는 실행 한 `docker stack services` 다음 스택 이름을 입력 할 수도 있습니다. 
다음 예제 명령을 사용하면 getstartedlab스택 과 관련된 모든 서비스를 볼 수 있습니다 .

`docker stack services getstartedlab`

```
C:\Users\ASUS>docker stack services getstartedlab
ID                  NAME                MODE                REPLICAS            IMAGE                       PORTS
4v3l89msqs5q        getstartedlab_web   replicated          5/5                 sejoung/get-started:part2   *:4000->80/tcp

```
서비스에서 실행되는 단일 컨테이너를 태스크 라고합니다. 
작업에는 replicas 정의 된 번호까지 숫자가 증가하는 고유 ID가 부여 됩니다 docker-compose.yml. 
서비스 작업을 나열하십시오.

`docker service ps getstartedlab_web`

```
C:\Users\ASUS>docker service ps getstartedlab_web
ID                  NAME                  IMAGE                       NODE                    DESIRED STATE       CURRENT STATE           ERROR               PORTS
i5e11rbs5vsx        getstartedlab_web.1   sejoung/get-started:part2   linuxkit-00155d849805   Running             Running 3 minutes ago
qxkkd1tvv04a        getstartedlab_web.2   sejoung/get-started:part2   linuxkit-00155d849805   Running             Running 3 minutes ago
y82ouma09vkp        getstartedlab_web.3   sejoung/get-started:part2   linuxkit-00155d849805   Running             Running 3 minutes ago
mih5f81tkv37        getstartedlab_web.4   sejoung/get-started:part2   linuxkit-00155d849805   Running             Running 3 minutes ago
ze8zvepzzfwu        getstartedlab_web.5   sejoung/get-started:part2   linuxkit-00155d849805   Running             Running 3 minutes ago

```
또한 서비스에 의해 필터링되지 않지만 시스템의 모든 컨테이너를 나열하면 작업도 표시됩니다.

`docker container ls -q`

```

C:\Users\ASUS>docker container ls -q
8c5cbf9e90ec
d6be9f49b9b5
fe5bf146e643
b1128e43062c
a659caef8af4

```
curl -4 http://localhost:4000를 여러번 실행하거나 
브라우저에서 http://localhost:4000 접속해 새로고침을 몇번 누릅니다.

어느 쪽이든 컨테이너 ID가 변경되어로드 밸런싱을 시연합니다. 
각 요청마다 5 가지 작업 중 하나가 라운드 로빈 방식으로 응답하도록 선택됩니다. 
컨테이너 ID는 이전 명령 ( docker container ls -q) 의 결과와 일치합니다 .

스택의 모든 작업을 보려면 docker stack ps 다음 예제와 같이 앱 이름을 실행하면 됩니다.

`docker stack ps getstartedlab`

```

C:\Users\ASUS>docker stack ps getstartedlab
ID                  NAME                  IMAGE                       NODE                    DESIRED STATE       CURRENT STATE           ERROR               PORTS
e0gkjae059wp        getstartedlab_web.1   sejoung/get-started:part2   linuxkit-00155d849806   Running             Running 2 minutes ago
z8y4larl3i4n        getstartedlab_web.2   sejoung/get-started:part2   linuxkit-00155d849806   Running             Running 2 minutes ago
9lfo61f811oy        getstartedlab_web.3   sejoung/get-started:part2   linuxkit-00155d849806   Running             Running 2 minutes ago
vim5d0qer25e        getstartedlab_web.4   sejoung/get-started:part2   linuxkit-00155d849806   Running             Running 2 minutes ago
iz4nckx24brq        getstartedlab_web.5   sejoung/get-started:part2   linuxkit-00155d849806   Running             Running 2 minutes ago

```

### Scale the app

docker-compose.yml의 replicas값을 변경하고 변경 사항을 저장하고 
docker stack deploy 명령을 다시 실행하여 앱의 크기를 조절할 수 있습니다 .

```yaml

version: "3"
services:
  web:
    # replace username/repo:tag with your name and image details
    image: sejoung/get-started:part2
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: "0.1"
          memory: 50M
      restart_policy:
        condition: on-failure
    ports:
      - "4000:80"
    networks:
      - webnet
networks:
  webnet:

```

3개로 조절함

`docker stack deploy -c docker-compose.yml getstartedlab` 실행

```
C:\Users\ASUS>docker stack deploy -c docker-compose.yml getstartedlab
Updating service getstartedlab_web (id: 6mvrx34uhboi9ft8592ald5pg)
```
Docker는 전체 업데이트를 수행하므로 먼저 스택을 떼어 내거나 컨테이너를 제거 할 필요가 없습니다.

이제 재실행 docker container ls -q하여 배포 된 인스턴스가 재구성되었는지 확인하십시오. 
복제본을 확장하면 더 많은 태스크가 생겨서 더 많은 컨테이너가 시작됩니다.

```
C:\Users\ASUS>docker container ls -q
1c24aa19ea07
44ec1a846e85
c5fe0fb3e6ba

```

#### app 과 swarm를 중지하는법

앱 중지 `docker stack rm`

`docker stack rm getstartedlab`

```
C:\Users\ASUS>docker stack rm getstartedlab
Removing service getstartedlab_web
Removing network getstartedlab_webnet

```
swarm 중지 

`docker swarm leave --force`

```

C:\Users\ASUS>docker swarm leave --force
Node left the swarm.

```

Docker로 앱을 세우고 확장하는 것은 간단합니다.
프로덕션 환경에서 컨테이너를 실행하는 방법을 배우는 데 큰 걸음을 딛었습니다. 
다음으로, Docker 시스템 클러스터에서이 애플리케이션을 보나 피드 뭉치로 실행하는 법을 배웁니다.


### Recap and cheat sheet

다시 말해, 입력 docker run이 간단하면서도 프로덕션에서 컨테이너를 실제로 구현하면 서비스로 실행됩니다. 
서비스는 Compose 파일의 컨테이너 동작을 코드화하며, 이 파일을 사용하여 앱을 확장, 제한 및 재배포 할 수 있습니다. 
서비스 변경은 서비스를 시작한 동일한 명령을 사용하여 실행하면서 그대로 적용 할 수 있습니다 docker stack deploy.

이 단계에서 탐색 할 수있는 명령은 다음과 같습니다.

```

docker stack ls                                            # List stacks or apps
docker stack deploy -c <composefile> <appname>  # Run the specified Compose file
docker service ls                 # List running services associated with an app
docker service ps <service>                  # List tasks associated with an app
docker inspect <task or container>                   # Inspect task or container
docker container ls -q                                      # List container IDs
docker stack rm <appname>                             # Tear down an application
docker swarm leave --force      # Take down a single node swarm from the manager

```

# 참조
-----
* [docker-get-started](https://docs.docker.com/get-started/part3/)
* [Docker Compose 개요](https://sejoung.github.io/2019/03/Overview_of_Docker_Compose)

