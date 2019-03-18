---
layout: post
title: "도커 처음 시작하기part1(오리엔테이션 및 설정)"
date: 2019-03-13 14:02 +0900
comments: true
tags : ["Docker"]
categories : ["tool"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 도커 처음 시작하기(오리엔테이션 및 설정)

환영! 우리는 Docker를 배우고 싶어서 기쁩니다. 도커 시작하기 자습서 하는 방법을 배웁니다 :

1. Docker 환경 설정 (이 페이지에서)
1. 이미지를 빌드하고 하나의 컨테이너로 실행하십시오.
1. 여러 컨테이너를 실행하도록 앱 크기 조정
1. 클러스터에 앱 배포
1. 백엔드 데이터베이스를 추가하여 서비스 스택
1. 프로덕션 환경에 앱 배포

### Docker concepts

Docker는 개발자와 시스템 관리자 가 컨테이너를 사용하여 응용 프로그램 을 개발, 배포 및 실행 하기 위한 플랫폼입니다. 
Linux 컨테이너를 사용하여 응용 프로그램을 배포하는 것을 컨테이너 화(containerization) 라고 합니다. 
컨테이너는 새로운 것은 아니지만 쉽게 응용 프로그램을 배포하는 데 사용됩니다.

아래의 이유가 있기 때문에 컨테이너 화가 점점 더 인기를 얻고 있습니다.

* Flexible : 가장 복잡한 애플리케이션조차도 컨테이너화할 수 있습니다.
* Lightweight : 컨테이너는 호스트 커널을 활용하고 공유합니다.
* Interchangeable : 업데이트 및 업그레이드를 즉시 배포 할 수 있습니다.
* Portable : 로컬로 구축하고, 클라우드에 배치하고, 어디서나 실행할 수 있습니다.
* Scalable : 컨테이너 복제본을 늘리고 자동으로 배포 할 수 있습니다.
* Stackable : 서비스를 세로 및 가로로 쌓을 수 있습니다.

### Images and containers

컨테이너는 이미지를 실행하여 시작됩니다.
 
이미지는 코드, 런타임, 도서관, 환경 변수 및 구성 파일 응용 프로그램을 실행하는 데 필요한 모든 것을 포함하는 실행 가능한 패키지입니다.

컨테이너는 이미지의 runtime instance 이고 image 의 실행시 메모리에 저장됩니다.(즉 상태가있는 이미지 또는 사용자 프로세스)

Linux에서 와 마찬가지로 `docker ps` 명령을 사용하여 실행중인 컨테이너 목록을 볼 수 있습니다 .

### Containers and virtual machines

컨테이너는 실행 기본적으로 리눅스와 다른 컨테이너와 호스트 시스템의 커널을 공유합니다. 
다른 실행 파일보다 더 많은 메모리를 사용하지 않고 별도의 프로세스를 실행하여 가볍게 만듭니다.

반대로 가상 컴퓨터(VM)는 하이퍼 바이저를 통해 호스트 리소스에 가상으로 액세스 할 수있는 본격적인 "게스트"운영 체제를 실행합니다. 
일반적으로 VM은 대부분의 응용 프로그램에 필요한 것보다 많은 리소스를 환경에 제공합니다.

### Docker 환경 준비

Docker Community Edition (CE) 또는 Enterprise Edition (EE) 의 유지 관리 버전 을 지원되는 플랫폼에 설치하십시오 .

#### Test Docker version

콘솔을 열고 `docker --version` Docker의 지원되는 버전이 있는지 확인하고 실행하십시오 .

```

C:\Users\ASUS>docker --version
Docker version 18.09.2, build 6247962

```

`docker info` 또는 (`docker version` -- 없이) 실행 당신의 화면에 설치에 대한 더 많은 세부 정보를 볼 수 있다.

```

C:\Users\ASUS>docker info
Containers: 0
 Running: 0
 Paused: 0
 Stopped: 0
Images: 2
Server Version: 18.09.2
Storage Driver: overlay2
 Backing Filesystem: extfs
 Supports d_type: true
 Native Overlay Diff: true
Logging Driver: json-file
Cgroup Driver: cgroupfs
Plugins:
 Volume: local
 Network: bridge host macvlan null overlay
 Log: awslogs fluentd gcplogs gelf journald json-file local logentries splunk syslog
Swarm: inactive
Runtimes: runc
Default Runtime: runc
Init Binary: docker-init
containerd version: 9754871865f7fe2f4e74d43e2fc7ccd237edcbce
runc version: 09c8266bf2fcf9519a651b04ae54c967b9ab86ec
init version: fec3683
Security Options:
 seccomp
  Profile: default
Kernel Version: 4.9.125-linuxkit
Operating System: Docker for Windows
OSType: linux
Architecture: x86_64
CPUs: 2
Total Memory: 1.934GiB
Name: linuxkit-00155d849805
ID: Y5SB:P2YY:WHOA:3M7R:TDMB:5PRS:WKGL:J43N:AJLM:LCJK:4BLF:P2J5
Docker Root Dir: /var/lib/docker
Debug Mode (client): false
Debug Mode (server): true
 File Descriptors: 22
 Goroutines: 46
 System Time: 2019-03-13T05:16:44.0431877Z
 EventsListeners: 1
Registry: https://index.docker.io/v1/
Labels:
Experimental: false
Insecure Registries:
 127.0.0.0/8
Live Restore Enabled: false
Product License: Community Engine

C:\Users\ASUS>docker version
Client: Docker Engine - Community
 Version:           18.09.2
 API version:       1.39
 Go version:        go1.10.8
 Git commit:        6247962
 Built:             Sun Feb 10 04:12:31 2019
 OS/Arch:           windows/amd64
 Experimental:      false

Server: Docker Engine - Community
 Engine:
  Version:          18.09.2
  API version:      1.39 (minimum version 1.12)
  Go version:       go1.10.6
  Git commit:       6247962
  Built:            Sun Feb 10 04:13:06 2019
  OS/Arch:          linux/amd64
  Experimental:     false

```

아래는 리눅스 나 mac 사용자를 위한 tip

```

권한 오류를 피하려면 (그리고 sudo 사용하려면) 사용자를 docker그룹에 추가하십시오.

```

#### Test Docker installation

간단한 Docker 이미지 hello-world 를 실행하여 설치가 제대로 작동하는지 테스트하십시오 .

`docker run hello-world`

```

C:\Users\ASUS>docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
1b930d010525: Pull complete
Digest: sha256:2557e3c07ed1e38f26e389462d03ed943586f744621577a99efb77324b0fe535
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/

```

컴퓨터에 다운로드한 이미지를 보기

`docker image ls`

```

C:\Users\ASUS>docker image ls
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
jenkins/jenkins     latest              a5e18ff4fa3b        45 hours ago        702MB
jenkins/jenkins     lts                 806f56c84444        3 weeks ago         703MB
hello-world         latest              fce289e99eb9        2 months ago        1.84kB


```

hello-world 메시지를 표시 한 후에 종료되는 컨테이너 (이미지로 생성됨)를 나열하십시오. 
아직 실행 중이면 --all 옵션이 필요하지 않습니다 .

`docker container ls --all`

```
C:\Users\ASUS>docker container ls --all
CONTAINER ID        IMAGE               COMMAND             CREATED              STATUS                          PORTS               NAMES
646b6ac41c0e        hello-world         "/hello"            About a minute ago   Exited (0) About a minute ago                       brave_banach

```

### Recap and cheat sheet

```

## List Docker CLI commands
docker
docker container --help

## Display Docker version and info
docker --version
docker version
docker info

## Execute Docker image
docker run hello-world

## List Docker images
docker image ls

## List Docker containers (running, all, all in quiet mode)
docker container ls
docker container ls --all
docker container ls -aq

```

# 참조
-----
* [docker-get-started](https://docs.docker.com/get-started/)
* [hello-world docker images](https://hub.docker.com/_/hello-world/)


