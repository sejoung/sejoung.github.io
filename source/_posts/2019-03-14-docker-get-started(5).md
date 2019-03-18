---
layout: post
title: "도커 처음 시작하기part5(Stacks)"
date: 2019-03-14 16:21 +0900
comments: true
tags : ["Docker"]
categories : ["tool"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 도커 처음 시작하기(Stacks)

### 전제조건

* Docker 버전 1.13 이상을 설치하십시오.
* [도커 처음 시작하기part1(오리엔테이션 및 설정)](https://sejoung.github.io/2019/03/2019-03-13-docker-get-started(1)/) 에서 방향을 읽으십시오 .
* [도커 처음 시작하기part2(컨테이너)](https://sejoung.github.io/2019/03/2019-03-13-docker-get-started(2)/) 에서 컨테이너를 만드는 방법에 대해 알아보십시오.
* [도커 처음 시작하기part3(서비스)](https://sejoung.github.io/2019/03/2019-03-14-docker-get-started(3)/) 에서 서비스를 만드는 방법에 대해 알아보십시오 .
* friendlyhello 이미지를 레지스트리 로 푸시 하여 게시했는지 확인하십시오. 우리는 여기에 그 공유 된 이미지를 사용합니다.
* 이미지가 배포 된 컨테이너로 작동하는지 확인하십시오. docker run -p 4000:80 username/repo:tag 이 명령을 실행 다음 방문 http://localhost:4000/.
* 파트3 의 docker-compose.yml 파일을 가지고 있으면 편하다.
* [도커 처음 시작하기part4(Stacks)](https://sejoung.github.io/2019/03/2019-03-14-docker-get-started(4)/) 에서 설정 한 기계 가 작동하고 준비 상태 인지 확인하십시오
이를 실행 docker-machine ls하여이를 확인하십시오. 시스템이 중지 된 경우, docker-machine start myvm1 관리자 를 부트 한 후 docker-machine start myvm2 작업자를 부트하십시오.
* [도커 처음 시작하기part4(Stacks)](https://sejoung.github.io/2019/03/2019-03-14-docker-get-started(4)/) 에서 작성한 Swarm를 준비하고 준비하십시오.
이를 실행 docker-machine ssh myvm1 "docker node ls"하여이를 확인하십시오. 집단이 가동되면 두 노드 모두 ready상태를 보고합니다.
그렇지 않으면 떼를 다시 초기화에 설명 된대로 근로자에 가입 하여 떼를 설정합니다.



### 소개
파트 4에서는 Docker를 실행하는 시스템 클러스터 인 swarm을 설정하고 컨테이너를 여러 컴퓨터에서 동시에 실행하여 응용 프로그램을 배포하는 방법을 배웠습니다.

여기 5 부에서는 분산 응용 프로그램 계층 구조의 최상위 인 스택에 도달했습니다. 
스택은 종속성을 공유하고 함께 조정 및 확장 될 수있는 상호 연관된 서비스 그룹입니다. 
단일 스택은 전체 응용 프로그램의 기능을 정의하고 조정할 수 있습니다 (매우 복잡한 응용 프로그램이 여러 스택을 사용할 수도 있음).

좋은 소식은 Compose 파일을 만들고 사용할 때 파트 3 이후로 스택을 사용하여 기술적으로 작업 한 것입니다 docker stack deploy. 
그러나 이것은 단일 호스트에서 실행되는 단일 서비스 스택이었습니다. 
이는 일반적으로 프로덕션 환경에서 발생하지 않습니다. 
여기서 배운 것을 취하고 여러 서비스를 서로 관련 시키며 여러 시스템에서 실행할 수 있습니다.

너는 위대한 일을하고있다, 이것은 홈 스트레칭이다!

### 새 서비스 추가 및 재배포

docker-compose.yml파일 에 서비스를 추가하는 것은 쉽습니다. 
먼저, 우리의 떼가 컨테이너를 어떻게 스케쥴 하는지를 볼 수있는 무료 시각화 서비스를 추가합시다.

* docker-compose.yml편집기에서 열어 내용을 다음과 같이 바꿉니다. username/repo:tag이미지 세부 정보 로 바꾸 십시오.


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
      - "80:80"
    networks:
      - webnet
  visualizer:
    image: dockersamples/visualizer:stable
    ports:
      - "8080:8080"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
    deploy:
      placement:
        constraints: [node.role == manager]
    networks:
      - webnet
networks:
  webnet:

```

여기에 새로운 유일하게 할 수있는 피어 서비스입니다 web, 이름 visualizer. 
A : 여기에 두 가지 새로운 것을 주목 volumes 호스트의 소켓 고정 표시기에 대한 파일과의 비주얼 액세스 제공 키를 placement 결코 노동자 -이 서비스는 오직 떼 관리자에서 실행 보장, 키를 누릅니다. 
Docker 에 의해 생성 된 오픈 소스 프로젝트를 기반으로 구축 된이 컨테이너 는 다이어그램의 덩치에서 실행되는 Docker 서비스를 표시하기 때문입니다.

우리는 잠시 배치 제약과 볼륨에 대해 더 자세히 이야기합니다.

* 셸이 대화 할 수 있도록 구성되어 있는지 확인하십시오 myvm1(전체 예제는 여기에 있습니다 ).
  
  * 실행 옆에있는 별표로 표시된대로 docker-machine ls기계를 나열하고 연결되어 있는지 확인하십시오 myvm1
  * 필요한 경우 다시 실행 docker-machine env myvm1한 다음 주어진 명령을 실행하여 셸을 구성하십시오.

* docker stack deploy관리자 에게 명령을 다시 실행하고 업데이트가 필요한 서비스를 업데이트합니다.
  
`docker stack deploy -c docker-compose.yml getstartedlab`

```

C:\Users\ASUS>docker stack deploy -c docker-compose.yml getstartedlab
Creating network getstartedlab_webnet
Creating service getstartedlab_visualizer
Creating service getstartedlab_web

```

* 시각화 프로그램을 살펴보십시오.

당신은 visualizer포트 8080에서 실행 되는 작성 파일을 보았습니다 docker-machine ls. 
실행하여 노드 중 하나의 IP 주소를 가져옵니다 . 
포트 8080의 IP 주소로 가면 다음과 같이 실행중인 visualizer를 볼 수 있습니다.

```
C:\Users\ASUS>docker-machine ls
NAME    ACTIVE   DRIVER       STATE     URL                         SWARM   DOCKER     ERRORS
myvm1   *        virtualbox   Running   tcp://192.168.99.100:2376           v18.09.3
myvm2   -        virtualbox   Running   tcp://192.168.99.101:2376           v18.09.3

```

* http://192.168.99.100:8080/

visualizer예상대로 관리자 의 단일 복사본 이 실행 중이며 5 개의 인스턴스가 web웜 전체에 퍼져 있습니다. 
다음을 실행하여이 시각화를 확인할 수 있습니다 docker stack ps <stack>.

`docker stack ps getstartedlab`

```

C:\Users\ASUS>docker stack ps getstartedlab
ID                  NAME                         IMAGE                             NODE                DESIRED STATE       CURRENT STATE                ERROR               PORTS
y67cyv06zqo0        getstartedlab_web.1          sejoung/get-started:part2         myvm2               Running             Running 2 minutes ago        
me02mia19ocr        getstartedlab_visualizer.1   dockersamples/visualizer:stable   myvm1               Running             Running about a minute ago   
trl14ue06ed2        getstartedlab_web.2          sejoung/get-started:part2         myvm2               Running             Running 2 minutes ago        
a194uv4k9e2a        getstartedlab_web.3          sejoung/get-started:part2         myvm1               Running             Running 2 minutes ago        
oxq1qres79rs        getstartedlab_web.4          sejoung/get-started:part2         myvm2               Running             Running 2 minutes ago        
tey916ohzm52        getstartedlab_web.5          sejoung/get-started:part2         myvm1               Running             Running 2 minutes ago   

```

비주얼 라이저는 스택에 포함 된 모든 앱에서 실행할 수있는 독립 실행 형 서비스입니다. 
그것은 다른 것에 의존하지 않습니다. 
이제 서비스를 만들 수 않는 방문자 카운터를 제공하는 레디 스 서비스 : 종속성을 가지고 있습니다.

### 데이터 유지

다시 한 번 같은 워크 플로우를 통해 앱 데이터 저장을위한 Redis 데이터베이스를 추가하십시오.

* 이 새 docker-compose.yml파일을 저장하면 마지막으로 Redis 서비스가 추가됩니다. username/repo:tag이미지 세부 정보 로 바꾸 십시오.

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
      - "80:80"
    networks:
      - webnet
  visualizer:
    image: dockersamples/visualizer:stable
    ports:
      - "8080:8080"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
    deploy:
      placement:
        constraints: [node.role == manager]
    networks:
      - webnet
  redis:
    image: redis
    ports:
      - "6379:6379"
    volumes:
      - "/home/docker/data:/data"
    deploy:
      placement:
        constraints: [node.role == manager]
    command: redis-server --appendonly yes
    networks:
      - webnet
networks:
  webnet:

```
Redis는 Docker 라이브러리에 공식 이미지가 있으며 여기 에는 image그냥 짧은 이름 이 부여 redis되어 있으므로 username/repo여기 에는 표기가 없습니다 . 
Redis 포트 6379는 컨테이너에서 호스트로 노출되도록 Redis에 의해 사전 구성되어 있습니다. 
여기에서 Compose 파일에는 호스트에서 전세계로 노출되므로 실제로 호스트의 IP 주소를 입력 할 수 있습니다. 
노드를 Redis Desktop Manager로 가져 와서 Redis 인스턴스를 관리하십시오.

가장 중요한 redis점 은이 스팩의 배치 사이에 데이터를 지속 시키는 두 가지 사항 이있다.

  * redis 항상 매니저에서 실행되므로 항상 동일한 파일 시스템을 사용합니다.
  * redis/dataRedis가 데이터를 저장하는 컨테이너 내부 에서 호스트의 파일 시스템에있는 임의의 디렉토리에 액세스합니다 .

함께, Redis 데이터를위한 호스트의 물리적 파일 시스템에 "진실의 근원"을 만듭니다. 
이 기능이 없으면 Redis는 /data 컨테이너의 파일 시스템 내부에 데이터를 저장 합니다. 
컨테이너의 파일 시스템이 재배포 된 경우에는 사라집니다.

이 진리의 근원에는 두 가지 구성 요소가 있습니다.

  * Redis 서비스에 배치 한 배치 제약 조건. 항상 동일한 호스트를 사용합니다.
  * 컨테이너가 ./data(호스트에서) 액세스 할 수있게 만든 볼륨 /data(Redis 컨테이너 내부). 컨테이너가오고가는 동안 ./data지정된 호스트에 저장된 파일이 계속 유지되어 연속성을 유지합니다

새로운 Redis-using 스택을 배포 할 준비가되었습니다.

* ./data관리자에 디렉토리를 만듭니다 .

`docker-machine ssh myvm1 "mkdir ./data"`

```
C:\Users\ASUS>docker-machine ssh myvm1 "mkdir ./data"

```

* 셸이 대화 할 수 있도록 구성되어 있는지 확인하십시오 myvm1(전체 예제는 여기에 있습니다 ).
  
  * 실행 옆에있는 별표로 표시된대로 docker-machine ls기계를 나열하고 연결되어 있는지 확인하십시오 myvm1.
    
  * 필요한 경우 다시 실행 docker-machine env myvm1한 다음 주어진 명령을 실행하여 셸을 구성하십시오.
    
* docker stack deploy한 번 더 실행하십시오 .

`docker stack deploy -c docker-compose.yml getstartedlab`

```
C:\Users\ASUS>docker stack deploy -c docker-compose.yml getstartedlab
Updating service getstartedlab_visualizer (id: b2tkyi7pce9x7a172ifvfmhty)
Creating service getstartedlab_redis
Updating service getstartedlab_web (id: 6ctq2dzu0xjvjznqsg11fplxi)

```

* 실행 docker service ls 하여 세 가지 서비스가 예상대로 실행되는지 확인합니다.
  
```
C:\Users\ASUS>docker service ls
ID                  NAME                       MODE                REPLICAS            IMAGE                             PORTS
tpjcqpbuxzz4        getstartedlab_redis        replicated          1/1                 redis:latest                      *:6379->6379/tcp
b2tkyi7pce9x        getstartedlab_visualizer   replicated          1/1                 dockersamples/visualizer:stable   *:8080->8080/tcp
6ctq2dzu0xjv        getstartedlab_web          replicated          5/5                 sejoung/get-started:part2         *:80->80/tcp
```

* http://192.168.99.100 와 같은 노드 중 하나에서 웹 페이지를 확인하고 현재 살아있는 방문자 카운터 결과를보고 Redis에 대한 정보를 저장하십시오.

또한 노드의 IP 주소에서 포트 8080의 비주얼 라이저를 확인 redis하고 web및 visualizer서비스 와 함께 실행중인 서비스를 확인하십시오 .


### Recap and cheat sheet

스택은 상호 연관성이있는 모든 서비스가 콘서트에서 실행된다는 것을 배웠습니다. 
-이 튜토리얼의 3 부 이후로 스택을 사용 해왔다. 
스택에 더 많은 서비스를 추가하려면 Compose 파일에 서비스를 삽입하는 방법을 배웠습니다. 
마지막으로, 배치 제약 조건과 볼륨의 조합을 사용하면 데이터를 영구 저장하기위한 영구적 인 홈을 생성 할 수 있으므로 컨테이너가 해체되어 재배치 될 때도 앱의 데이터가 유지됩니다

# 참조
-----
* [docker-get-started](https://docs.docker.com/get-started/part4/)
* [virtualbox Downloads](https://www.virtualbox.org/wiki/Downloads)

