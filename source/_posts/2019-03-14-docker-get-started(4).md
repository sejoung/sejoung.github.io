---
layout: post
title: "도커 처음 시작하기part4(Swarm)"
date: 2019-03-14 14:07 +0900
comments: true
tags : ["docker"]
categories : ["tool"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 도커 처음 시작하기(Swarm)

### 전제조건

* Docker 버전 1.13 이상을 설치하십시오.
* [도커 처음 시작하기part1(오리엔테이션 및 설정)](https://sejoung.github.io/2019/03/2019-03-13-docker-get-started(1)/) 에서 방향을 읽으십시오 .
* [도커 처음 시작하기part2(컨테이너)](https://sejoung.github.io/2019/03/2019-03-13-docker-get-started(2)/) 에서 컨테이너를 만드는 방법에 대해 알아보십시오.
* [도커 처음 시작하기part3(서비스)](https://sejoung.github.io/2019/03/2019-03-14-docker-get-started(3)/) 에서 서비스를 만드는 방법에 대해 알아보십시오 .
* friendlyhello 이미지를 레지스트리 로 푸시 하여 게시했는지 확인하십시오. 우리는 여기에 그 공유 된 이미지를 사용합니다.
* 이미지가 배포 된 컨테이너로 작동하는지 확인하십시오. docker run -p 4000:80 username/repo:tag 이 명령을 실행 다음 방문 http://localhost:4000/.
* 파트3 의 docker-compose.yml 파일을 가지고 있으면 편하다.

### 소개

파트 3 에서는 파트 2 에서 작성한 애플리케이션을 가져 와서 서비스로 전환하여 프로덕션 환경에서 실행하는 방법을 정의하고 프로세스에서 5 배로 확장했습니다.

여기 4 부에서는이 응용 프로그램을 여러 컴퓨터에서 실행하는 클러스터에 배포합니다. 
멀티 컨테이너, multi-machine applications은 swarm이라는 "Dockerized"클러스터에 여러 시스템을 결합함으로써 가능하게된다 .

### Swarm clusters 의 이해

Swarm는 Docker를 실행하고 클러스터에 합류 한 컴퓨터 그룹입니다.
그런 일이 발생하면, 이전에 사용하던 Docker 명령을 계속 실행하지만, 이제는 swarm manager 가 클러스터에서 실행합니다 .
Swarm 에있는 기계는 물리적 또는 가상 일 수 있습니다. 
swarm 에 join 하면 그것들은 노드라고 불린다.

Swarm 관리자는 활용도가 가장 낮은 머신을 컨테이너로 채우는 "emptiest node"와 "global" 같은 컨테이너를 실행하기위한 몇 가지 전략을 사용할 수 있습니다. 
각 기계가 지정된 컨테이너의 인스턴스를 정확히 하나씩 가져옵니다. 
웜 관리자가 이미 사용하고있는 것과 마찬가지로 작성 전략에서이 전략을 사용하도록 지시합니다.

Swarm managers는 swarm에 명령을 내릴 수있는 유일한 장비입니다. 
또는 다른 장비가 swarm에 workers 으로 참여할 수있는 권한을 부여 합니다. 
workers는 수용 능력을 제공하기 위해 존재하며, 다른 기계에 무엇을 할 수 있고 할 수 없는지를 말할 권한이 없습니다.

지금까지 로컬 컴퓨터에서 단일 호스트 모드로 Docker 를 사용 해왔다. 
그러나 Docker는 swarm mode 로 전환 할 수 있기 때문에 Swarm 을 사용할 수 있습니다. 
swarm mode를 즉시 활성화하면 현재 시스템이 Swarm managers 가 됩니다. 
그때부터 Docker는 현재 컴퓨터에서만 관리하는 것이 아니라 관리중인 명령에서 실행하는 명령을 실행합니다

### Set up your swarm

swarm는 여러 노드로 구성되며 물리적 또는 가상 시스템이 될 수 있습니다. 
기본적인 개념은 간단합니다 : `docker swarm init` 명령어로 swarm mode를 활성화하고 현재 머신을 웜 매니저로 만든 다음 
`docker swarm join` 명령어로 다른 머신에서 실행 하여 swarm을 Docker로 참여시킵니다. 
아래에서 탭을 선택하여 다양한 상황에서 이것이 어떻게 진행되는지 확인하십시오. 
우리는 VM을 사용하여 2 대의 기계 클러스터를 신속하게 만들고 이를 swarm로 만듭니다.

#### Create a cluster

로컬 컴퓨터의 VM (MAC, LINUX, WINDOWS 7 및 8)
가상 머신 (VM)을 생성 할 수있는 하이퍼 바이저가 필요하므로 머신의 OS 용 Oracle VirtualBox 를 설치 하십시오.

이제 노드 관리 도구(docker-machine)를 사용하여 몇 가지 VM을 만듭니다.

```
docker-machine create --driver virtualbox myvm1
docker-machine create --driver virtualbox myvm2
```

로컬 컴퓨터의 VM (WINDOWS 10)
먼저 가상 컴퓨터 (VM)가 공유 할 수 있도록 가상 스위치를 신속하게 만들어서 서로 연결할 수 있도록하십시오.

1. Hyper-V 관리자 시작
1. 오른쪽 메뉴에서 Virtual Switch Manager 를 클릭하십시오.
1. 유형 외부의 가상 스위치 만들기를 클릭합니다.
1. 이름을 지정 myswitch하고 호스트 컴퓨터의 활성 네트워크 어댑터를 공유하려면 확인란을 선택하십시오

이제 노드 관리 도구(docker-machine)를 사용하여 몇 가지 VM을 만듭니다.

```
docker-machine create -d hyperv --hyperv-virtual-switch "myswitch" myvm1
docker-machine create -d hyperv --hyperv-virtual-switch "myswitch" myvm2

```

저는 Oracle VirtualBox를 사용하는 방법을 썼습니다.

```
C:\Users\ASUS>docker-machine create --driver virtualbox myvm1
Running pre-create checks...
(myvm1) No default Boot2Docker ISO found locally, downloading the latest release...
(myvm1) Latest release for github.com/boot2docker/boot2docker is v18.09.3
(myvm1) Downloading C:\Users\ASUS\.docker\machine\cache\boot2docker.iso from https://github.com/boot2docker/boot2docker/releases/download/v18.09.3/boot2docker.iso...
Creating machine...
(myvm1) Copying C:\Users\ASUS\.docker\machine\cache\boot2docker.iso to C:\Users\ASUS\.docker\machine\machines\myvm1\boot2docker.iso...
(myvm1) Creating VirtualBox VM...
(myvm1) Creating SSH key...
(myvm1) Starting the VM...
(myvm1) Check network to re-create if needed...
(myvm1) Windows might ask for the permission to create a network adapter. Sometimes, such confirmation window is minimized in the taskbar.
(myvm1) Found a new host-only adapter: "VirtualBox Host-Only Ethernet Adapter #2"
(myvm1) Windows might ask for the permission to configure a network adapter. Sometimes, such confirmation window is minimized in the taskbar.
(myvm1) Windows might ask for the permission to configure a dhcp server. Sometimes, such confirmation window is minimized in the taskbar.
(myvm1) Waiting for an IP...
Waiting for machine to be running, this may take a few minutes...
Detecting operating system of created instance...
Waiting for SSH to be available...
Detecting the provisioner...
Provisioning with boot2docker...
Copying certs to the local machine directory...
Copying certs to the remote machine...
Setting Docker configuration on the remote daemon...
Checking connection to Docker...
Docker is up and running!
To see how to connect your Docker Client to the Docker Engine running on this virtual machine, run: docker-machine env myvm1

C:\Users\ASUS>docker-machine create --driver virtualbox myvm2
Running pre-create checks...
Creating machine...
(myvm2) Copying C:\Users\ASUS\.docker\machine\cache\boot2docker.iso to C:\Users\ASUS\.docker\machine\machines\myvm2\boot2docker.iso...
(myvm2) Creating VirtualBox VM...
(myvm2) Creating SSH key...
(myvm2) Starting the VM...
(myvm2) Check network to re-create if needed...
(myvm2) Windows might ask for the permission to configure a dhcp server. Sometimes, such confirmation window is minimized in the taskbar.
(myvm2) Waiting for an IP...
Waiting for machine to be running, this may take a few minutes...
Detecting operating system of created instance...
Waiting for SSH to be available...
Detecting the provisioner...
Provisioning with boot2docker...
Copying certs to the local machine directory...
Copying certs to the remote machine...
Setting Docker configuration on the remote daemon...
Checking connection to Docker...
Docker is up and running!
To see how to connect your Docker Client to the Docker Engine running on this virtual machine, run: docker-machine env myvm2

```

boot2docker.iso 파일이 다운로드가 엄청 느립니다 ㅜㅜ

VM을 나열하고 IP 주소를 가져옵니다.
이제, 창조라는 두 개의 VM을 가지고 myvm1와 myvm2.

이 명령을 사용하여 시스템을 나열하고 IP 주소를 가져옵니다.

참고 : 관리자 권한으로 다음을 실행해야합니다. 그렇지 않으면 아무런 결과가 없습니다 ( "알 수 없음").

`docker-machine ls`

```
C:\Users\ASUS>docker-machine ls
NAME    ACTIVE   DRIVER       STATE     URL                         SWARM   DOCKER     ERRORS
myvm1   -        virtualbox   Running   tcp://192.168.99.100:2376           v18.09.3
myvm2   -        virtualbox   Running   tcp://192.168.99.101:2376           v18.09.3
```

#### swarm를 초기화하고 노드를 추가하십시오.

첫 번째 기계는 관리자로 작동하며 관리 명령을 실행하고 작업자가 swarm에 가입하도록 인증하고 두 번째 시스템은 작업자입니다.

`docker-machine ssh` 를 사용하여 VM에 명령을 보낼 수 있습니다. 다음과 같이 출력을 찾아 myvm1 swarm manager가되도록 지시 docker swarm init 하십시오 :

`docker-machine ssh myvm1 "docker swarm init --advertise-addr <myvm1 ip>"`

```
C:\Users\ASUS>docker-machine ssh myvm1 "docker swarm init --advertise-addr 192.168.99.100"
Swarm initialized: current node (id5k1wtqkx9wy5y6j79xpib5d) is now a manager.

To add a worker to this swarm, run the following command:

    

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.

```

* Ports 2377 and 2376
  
항상 실행 docker swarm init및 docker swarm join모두에서 포트 2377 (swarm management port), 또는 전혀 포트하고 기본을 보자.

docker-machine lsDocker 데몬 포트 인 2376 포트 를 포함 하여 반환 된 컴퓨터 IP 주소 입니다. 
이 포트를 사용하지 마십시오. 
오류가 발생할 수 있습니다 .

* SSH를 사용하는 데 문제가 있습니까? --native-ssh 플래그를 사용해보십시오.
  
Docker Machine에는 Swarm 관리자에게 명령을 보내는 데 문제가있는 경우 사용자 시스템의 SSH를 사용할 수있는 옵션이 있습니다. 
명령을 --native-ssh 호출 할 때 ssh 플래그를 지정하십시오.

`docker-machine --native-ssh ssh myvm1 ...`

보시다시피 응답 docker swarm init 에는 docker swarm join 추가 할 노드에서 실행할 수 있도록 미리 구성된 명령이 포함되어 있습니다. 
이 명령을 복사 한 후 myvm2via docker-machine ssh로 보내면 myvm2 새 군대에 작업자로 참여하십시오.

```
C:\Users\ASUS>docker-machine ssh myvm2 "docker swarm join --token SWMTKN-1-3ohkmwcvngzqohawxtcx23jk7dhzwgvigfqsoke0ddmkv2vx4x-4x1rrb52hezxpeuab5l2jbd1u 192.168.99.100:2377"
This node joined a swarm as a worker.

```
축하합니다, 당신은 첫 번째 군대를 만들었습니다!

docker node ls이 스웜의 노드를 보려면 관리자를 실행하십시오 .

`docker-machine ssh myvm1 "docker node ls"`

```
C:\Users\ASUS>docker-machine ssh myvm1 "docker node ls"
ID                            HOSTNAME            STATUS              AVAILABILITY        MANAGER STATUS      ENGINE VERSION
id5k1wtqkx9wy5y6j79xpib5d *   myvm1               Ready               Active              Leader              18.09.3
am5wqkn1yrkje4qjnol0fhqub     myvm2               Ready               Active                                  18.09.3
```

* Leaving a swarm

처음부터 다시 시작하려면 docker swarm leave 각 노드에서 실행할 수 있습니다 

### Deploy your app on the swarm cluster

어려운 부분은 끝났어. 
이제 Part 3 에서 사용한 프로세스를 새 swarm 에 배치하기 만하면됩니다. 
swarm managers(myvm1)만 Docker 명령을 실행 하는 것을 기억하십시오. 
workers는 단지 capacity을위한 것입니다.

#### Configure a docker-machine shell to the swarm manager

지금까지는 `docker-machine ssh` VM과 통신하기 위해 Docker 명령을 래핑했습니다. 
또 다른 옵션은 `docker-machine env <machine>` 현재 셸을 구성하여 VM의 Docker 데몬과 통신하도록 명령을 실행하는 것입니다. 
이 방법은 로컬 docker-compose.yml 파일을 사용하여 어디에서나 복사 할 필요없이 "원격"으로 응용 프로그램을 배포 할 수 있으므로 다음 단계에서 더 잘 작동합니다 .

입력 docker-machine env myvm1 한 다음 출력의 마지막 줄에 제공된 명령을 복사하여 붙여 넣고 실행하여 셸이 대화하도록 구성합니다 (myvm1 swarm manager).

* MAC 또는 LINUX에서 도커 시스템 쉘 환경

docker-machine env myvm1쉘이 대화 할 수 있도록 명령을 실행 하려면 실행하십시오 myvm1.

```
$ docker-machine env myvm1
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://192.168.99.100:2376"
export DOCKER_CERT_PATH="/Users/sam/.docker/machine/machines/myvm1"
export DOCKER_MACHINE_NAME="myvm1"
# Run this command to configure your shell:
# eval $(docker-machine env myvm1)
```
주어진 명령을 실행하여 쉘이 대화 할 수 있도록 구성하십시오 myvm1.

`eval $(docker-machine env myvm1)`

옆에 별표가 표시된대로 실행 중인 컴퓨터인지 docker-machine ls확인 myvm1합니다.

```
$ docker-machine ls
NAME    ACTIVE   DRIVER       STATE     URL                         SWARM   DOCKER        ERRORS
myvm1   *        virtualbox   Running   tcp://192.168.99.100:2376           v17.06.2-ce
myvm2   -        virtualbox   Running   tcp://192.168.99.101:2376           v17.06.2-ce

```

* WINDOWS에서 도커 시스템 쉘 환경

docker-machine env myvm1쉘이 대화 할 수 있도록 명령을 실행 하려면 실행하십시오 myvm1.

```

C:\Users\ASUS>docker-machine env myvm1
SET DOCKER_TLS_VERIFY=1
SET DOCKER_HOST=tcp://192.168.99.100:2376
SET DOCKER_CERT_PATH=C:\Users\ASUS\.docker\machine\machines\myvm1
SET DOCKER_MACHINE_NAME=myvm1
SET COMPOSE_CONVERT_WINDOWS_PATHS=true
REM Run this command to configure your shell:
REM     @FOR /f "tokens=*" %i IN ('docker-machine env myvm1') DO @%i

```
주어진 명령을 실행하여 쉘이 대화 할 수 있도록 구성하십시오 myvm1.

`@FOR /f "tokens=*" %i IN ('docker-machine env myvm1') DO @%i`

```
C:\Users\ASUS> @FOR /f "tokens=*" %i IN ('docker-machine env myvm1') DO @%i
```

실행 옆에있는 별표로 표시된 활성 컴퓨터인지 docker-machine ls 확인 myvm1하십시오.

```
C:\Users\ASUS>docker-machine ls
NAME    ACTIVE   DRIVER       STATE     URL                         SWARM   DOCKER     ERRORS
myvm1   *        virtualbox   Running   tcp://192.168.99.100:2376           v18.09.3
myvm2   -        virtualbox   Running   tcp://192.168.99.101:2376           v18.09.3

```

#### Deploy the app on the swarm manager

이제 당신이 가진 것을 myvm1, 같은 사용하여 응용 프로그램을 배포 할 떼 관리자로서의 능력을 사용할 수 있습니다 
docker stack deploy 당신에게 part 3 에 사용되는 명령 myvm1, 그리고 로컬 복사본을 docker-compose.yml.. 
이 명령을 완료하는 데 몇 초가 걸릴 수 있으며 배포에 시간이 걸릴 수 있습니다. 
docker service ps <service_name> swarm manager 명령을 사용하여 모든 서비스가 재배포되었는지 확인하십시오.

쉘 구성 을 사용 myvm1하여 에 연결되어 있으며 docker-machine 로컬 호스트의 파일에 계속 액세스 할 수 있습니다. 
docker-compose.yml part 3에서 작성한 파일 을 포함하여 이전과 같은 디렉토리에 있는지 확인하십시오 .

이전과 마찬가지로 다음 명령을 실행하여 앱을 배포합니다 myvm1.

`docker stack deploy -c docker-compose.yml getstartedlab`

```
C:\Users\ASUS>docker stack deploy -c docker-compose.yml getstartedlab
Creating network getstartedlab_webnet
Creating service getstartedlab_web
```
바로 응용프로그램이 클러스터에 배포됩니다.

이제 파트 3에서 사용한 것과 같은 도커 명령을 사용할 수 있습니다. 
이번에 만 서비스 (및 관련 컨테이너)가 둘 다 myvm1와 사이에 분산되어 있음 을 알 수 myvm2있습니다.

`docker stack ps getstartedlab`

```
C:\Users\ASUS> docker stack ps getstartedlab
ID                  NAME                  IMAGE                       NODE                DESIRED STATE       CURRENT STATE            ERROR               PORTS
o3mrvpl2f21k        getstartedlab_web.1   sejoung/get-started:part2   myvm2               Running             Running 33 seconds ago                    
lcyvs8ohs91r        getstartedlab_web.2   sejoung/get-started:part2   myvm2               Running             Running 33 seconds ago                    
041vpxpnhec4        getstartedlab_web.3   sejoung/get-started:part2   myvm1               Running             Running 36 seconds ago                    
```

### 클러스터 접속

당신의 IP 주소에서 응용 프로그램에 액세스 할 수 있습니다 중 하나 myvm1 또는 myvm2.

사용자가 만든 네트워크는 네트워크간에 공유되며로드 균형 조정을 수행합니다. 
docker-machine ls 실행 하여 VM의 IP 주소를 얻고 브라우저에서 새로 고침 (또는 새로 고침) 중 하나를 방문하십시오 curl.
```
C:\Users\ASUS>docker-machine ls
NAME    ACTIVE   DRIVER       STATE     URL                         SWARM   DOCKER     ERRORS
myvm1   *        virtualbox   Running   tcp://192.168.99.100:2376           v18.09.3
myvm2   -        virtualbox   Running   tcp://192.168.99.101:2376           v18.09.3
```
* http://192.168.99.101:4000/
* http://192.168.99.101:4000/


모든 사이클링 가능한 임의의 3 개의 컨테이너 ID가 로드 밸런싱을 보여줍니다.

두 IP 주소가 작동하는 이유는 한 무리의 노드가 진입 라우팅 메쉬에 참여하기 때문입니다. 
이렇게하면 실제로 컨테이너를 실행중인 노드가 무엇이든 관계없이 swarm에있는 특정 포트에 배포 된 서비스가 항상 해당 포트를 소유하도록 할 수 있습니다. 
다음 은 3 노드 군대의 my-web포트 8080에서 게시 된 서비스의 라우팅 메쉬가 어떻게 보이는지에 대한 다이어그램입니다 .


### Iterating and scaling your app

parts 2 and 3 에서 배운 모든 것을 할 수 있습니다.

docker-compose.yml파일 을 변경하여 응용 프로그램의 크기를 조정 하십시오.

코드를 편집하여 응용 프로그램 동작을 변경 한 다음 새 이미지를 다시 작성하고 푸시합니다. 
(이렇게하려면 이전에 앱 을 제작하고 이미지를 게시하는 데 사용한 것과 동일한 단계를 따르십시오 ).

두 경우 모두 단순히 docker stack deploy다시 실행 하여 변경 사항을 배포하면됩니다.

사용했던 동일한 docker swarm join 명령을 사용 하여 실제 또는 가상 머신을이 스웜에 가입시킬 수 있으며 myvm2클러스터에 용량이 추가됩니다. 
docker stack deploy 이후에 실행하면 앱이 새로운 리소스를 이용할 수 있습니다.

### Cleanup and reboot

#### Stacks and swarms

스택을 찢을 수 있습니다 docker stack rm. 예 :

```
C:\Users\ASUS>docker stack rm getstartedlab
Removing service getstartedlab_web
Removing network getstartedlab_webnet
```

#### docker-machine 셸 변수 설정 해제하기

docker-machine현재 쉘 의 환경 변수를 주어진 명령으로 설정 해제 할 수 있습니다 .

맥 또는 리눅스 명령은 다음과 같습니다

`eval $(docker-machine env -u)`

윈도우 명령은 다음과 같습니다
 
`@FOR /f "tokens=*" %i IN ('docker-machine env -u') DO @%i`

이렇게하면 docker-machine 만들어진 가상 컴퓨터 에서 셸의 연결이 끊어 지며 동일한 셸에서 계속 작업 할 수 있습니다. 
docker 예를 들어 Mac 용 Docker Desktop 또는 Windows 용 Docker Desktop 에서와 같은 기본 명령을 사용 합니다. 
자세한 내용은 환경 변수 설정 해제에 대한 Machine 주제를 참조하십시오 .

#### Docker 컴퓨터 다시 시작

`docker-machine stop` 명령어를 사용하면 시스템이 중지 됩니다.

```
C:\Users\ASUS>docker-machine stop myvm1
Stopping "myvm1"...
Machine "myvm1" was stopped.

C:\Users\ASUS>docker-machine stop myvm2
Stopping "myvm2"...
Machine "myvm2" was stopped.

C:\Users\ASUS>docker-machine ls
NAME    ACTIVE   DRIVER       STATE     URL   SWARM   DOCKER    ERRORS
myvm1   -        virtualbox   Stopped                 Unknown
myvm2   -        virtualbox   Stopped
```
중지 된 시스템을 다시 시작하려면 다음을 실행하십시오.

`docker-machine start <machine-name>`

예 : 

```
C:\Users\ASUS>docker-machine start myvm1
Starting "myvm1"...
(myvm1) Check network to re-create if needed...
(myvm1) Windows might ask for the permission to configure a dhcp server. Sometimes, such confirmation window is minimized in the taskbar.
(myvm1) Waiting for an IP...
Machine "myvm1" was started.
Waiting for SSH to be available...
Detecting the provisioner...
Started machines may have new IP addresses. You may need to re-run the `docker-machine env` command.

C:\Users\ASUS>docker-machine start myvm2
Starting "myvm2"...
(myvm2) Check network to re-create if needed...
(myvm2) Windows might ask for the permission to configure a dhcp server. Sometimes, such confirmation window is minimized in the taskbar.
(myvm2) Waiting for an IP...
Machine "myvm2" was started.
Waiting for SSH to be available...
Detecting the provisioner...
Started machines may have new IP addresses. You may need to re-run the `docker-machine env` command.

```

### Recap and cheat sheet
파트 4에서는 떼가 무엇인지, 웜 노드가 관리자 또는 작업자가 될 수 있는지, 떼를 만들어서 응용 프로그램을 배포했는지를 배웠습니다. 
Docker의 핵심 명령이 파트 3에서 변경되지 않았 음을 알았습니다. 
단지 늪지대 주인을 목표로 삼아야했습니다. 
또한 Docker의 네트워킹이 실제로 작동하는 것을 보았습니다. 
Docker 네트워킹은 다른 컴퓨터에서 실행 중이더라도 컨테이너간에로드 균형 조정 요청을 유지했습니다. 
마지막으로, 클러스터에서 앱을 반복하고 크기를 조정하는 방법을 배웠습니다.

다음은 swarm 및 VM과 상호 작용하기 위해 실행할 수있는 몇 가지 명령입니다.

```

docker-machine create --driver virtualbox myvm1 # Create a VM (Mac, Win7, Linux)
docker-machine create -d hyperv --hyperv-virtual-switch "myswitch" myvm1 # Win10
docker-machine env myvm1                # View basic information about your node
docker-machine ssh myvm1 "docker node ls"         # List the nodes in your swarm
docker-machine ssh myvm1 "docker node inspect <node ID>"        # Inspect a node
docker-machine ssh myvm1 "docker swarm join-token -q worker"   # View join token
docker-machine ssh myvm1   # Open an SSH session with the VM; type "exit" to end
docker node ls                # View nodes in swarm (while logged on to manager)
docker-machine ssh myvm2 "docker swarm leave"  # Make the worker leave the swarm
docker-machine ssh myvm1 "docker swarm leave -f" # Make master leave, kill swarm
docker-machine ls # list VMs, asterisk shows which VM this shell is talking to
docker-machine start myvm1            # Start a VM that is currently not running
docker-machine env myvm1      # show environment variables and command for myvm1
eval $(docker-machine env myvm1)         # Mac command to connect shell to myvm1
@FOR /f "tokens=*" %i IN ('docker-machine env myvm1') DO @%i   # Windows command to connect shell to myvm1
docker stack deploy -c <file> <app>  # Deploy an app; command shell must be set to talk to manager (myvm1), uses local Compose file
docker-machine scp docker-compose.yml myvm1:~ # Copy file to node's home dir (only required if you use ssh to connect to manager and deploy the app)
docker-machine ssh myvm1 "docker stack deploy -c <file> <app>"   # Deploy an app using ssh (you must have first copied the Compose file to myvm1)
eval $(docker-machine env -u)     # Disconnect shell from VMs, use native docker
docker-machine stop $(docker-machine ls -q)               # Stop all running VMs
docker-machine rm $(docker-machine ls -q) # Delete all VMs and their disk images

```

# 참조
-----
* [docker-get-started](https://docs.docker.com/get-started/part4/)
* [virtualbox Downloads](https://www.virtualbox.org/wiki/Downloads)

