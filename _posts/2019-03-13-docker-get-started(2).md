---
layout: post
title: "도커 처음 시작하기(컨테이너)"
date: 2019-03-13 14:55 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 도커 처음 시작하기(컨테이너)

### 전제조건

* Docker 버전 1.13 이상을 설치하십시오 .
* [도커 처음 시작하기(오리엔테이션 및 설정)](https://sejoung.github.io/2019/03/docker-get-started(1))에서 사용방법을 익히세요
* 환경을 신속하게 테스트 하여 모든 설정이 완료 되었는지 확인 

`docker run hello-world`

```
C:\Users\ASUS>docker run hello-world

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

### 소개

Docker 방식으로 앱을 제작할 차례입니다. 
이 페이지가 다루는 컨테이너 인 해당 앱의 계층 구조 맨 아래부터 시작합니다. 
이 레벨의 위에는 파트 3 에서 다룰 컨테이너가 프로덕션 환경에서 어떻게 작동하는지 정의하는 서비스가 있습니다. 
마지막으로 최상위 단계는 스택이며 파트 5 에서 다루는 모든 서비스의 상호 작용을 정의합니다 .

* 스택
* 서비스
* 컨테이너 (여기에 있습니다)

### 새로운 개발 환경

과거에는 Python 응용 프로그램을 작성하기 시작한 경우 비즈니스의 첫 번째 순서는 Python 런타임을 시스템에 설치하는 것이 었습니다. 
하지만, 이것은 여러분의 컴퓨터에서 환경이 앱이 예상대로 돌아가고 또한 프로덕션 환경과 일치해야 할 필요가있는 상황을 만듭니다.

Docker를 사용하면 이식 가능한 Python 런타임을 이미지로 가져올 수 있으며 설치가 필요하지 않습니다. 
그런 다음 빌드는 앱 코드와 함께 기본 Python 이미지를 포함 할 수 있으므로 앱, 해당 종속성 및 런타임이 함께 ​​여행 할 수 있습니다.

이 휴대용 이미지는 `Dockerfile` 라는 이름으로 정의됩니다 .

### 컨테이너 정의하기 Dockerfile

`Dockerfile`은 컨테이너 내부의 환경을 정의합니다.
시스템의 나머지 부분과 격리되어있는 리소스들을 접속합니다. 
예를 들면 가상화 되어있는 환경안의 네트워킹 인터페이스 및 디스크 드라이브 그리고 복사할 파일 또는 환경
그러나 리소스들만 Dockerfile에 정의 되어있으면 어디서나 똑같이 작동합니다.

#### Dockerfile

로컬 컴퓨터에 빈 디렉터리를 만듭니다. 
디렉토리 (cd)를 새 디렉토리로 변경 Dockerfile 생성 하고 다음 내용을 해당 파일에 복사하여 붙여 넣은 파일을 작성하고 저장하십시오. 
새로운 Dockerfile 의 각 문장을 설명하는 주석을 기록하십시오.

```

# Use an official Python runtime as a parent image
FROM python:2.7-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV NAME World

# Run app.py when the container launches
CMD ["python", "app.py"]

```

이 Dockerfile 파일이 우리가 아직 작성하지 않은 몇 가지를 파일을 보고 있다. 
app.py 하고 requirements.txt 파일. 
그것들을 다음 단계로 만들어 보겠습니다.

### 어플리케이션 만들기

두 개의 파일 app.py,requirements.txt 더 만들고 Dockerfile 과 같은 폴더에 넣으십시오. 

이것으로 우리의 앱을 완성 시켰는데, 당신이 볼 수있는 것처럼 그것은 아주 간단합니다.

#### requirements.txt

```

Flask
Redis

```

#### app.py

```pyhon 

from flask import Flask
from redis import Redis, RedisError
import os
import socket

# Connect to Redis
redis = Redis(host="redis", db=0, socket_connect_timeout=2, socket_timeout=2)

app = Flask(__name__)

@app.route("/")
def hello():
    try:
        visits = redis.incr("counter")
    except RedisError:
        visits = "<i>cannot connect to Redis, counter disabled</i>"

    html = "<h3>Hello {name}!</h3>" \
           "<b>Hostname:</b> {hostname}<br/>" \
           "<b>Visits:</b> {visits}"
    return html.format(name=os.getenv("NAME", "world"), hostname=socket.gethostname(), visits=visits)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
    
```

`pip install -r requirements.txt` 는 Python을위한 Flask와 Redis 라이브러리를 설치하고, app은 환경 변수 NAME와 호출 결과를 출력합니다 socket.gethostname(). 
마지막으로 Redis가 실행되지 않기 때문에 (Redis 자체가 아닌 Python 라이브러리 만 설치했기 때문에) 여기에서 사용하려는 시도가 실패하고 오류 메시지가 표시되어야합니다.

```

참고 : 컨테이너 내부에서 호스트 이름에 액세스하면 실행중인 실행 파일의 프로세스 ID와 같은 컨테이너 ID가 검색됩니다.


```
그게 다야! requirements.txt시스템에 Python이나 다른 것이 필요 하지 않으며이 이미지를 빌드하거나 실행해도 시스템에 설치되지 않습니다. 
파이썬과 플라스크로 환경을 설정 한 것처럼 보이지는 않습니다.

### 어플리케이션 빌드하기


우리는 앱을 만들 준비가되었습니다. 새 디렉토리의 최상위 레벨에 있는지 확인하십시오. 다음과 같이 ls(dir) 표시되어야합니다.

```

C:\Users\ASUS\docker>dir
 C 드라이브의 볼륨에는 이름이 없습니다.
 볼륨 일련 번호: C4C7-4AA3

 C:\Users\ASUS\docker 디렉터리

2019-03-13  오후 03:13    <DIR>          .
2019-03-13  오후 03:13    <DIR>          ..
2019-03-13  오후 03:13               687 app.py
2019-03-13  오후 03:12               531 Dockerfile
2019-03-13  오후 03:13                12 requirements.txt
               3개 파일               1,230 바이트
               2개 디렉터리  196,209,758,208 바이트 남음

```

이제 빌드 명령을 실행하십시오. 
이렇게하면 Docker 이미지가 만들어지며 이 이미지는 --tag옵션을 사용하여 이름을 지정합니다. 
사용 -t하면 짧은 옵션을 사용하십시오.

`docker build --tag=friendlyhello .`

```

C:\Users\ASUS\docker>docker build --tag=friendlyhello .
Sending build context to Docker daemon   5.12kB
Step 1/7 : FROM python:2.7-slim
2.7-slim: Pulling from library/python
f7e2b70d04ae: Pull complete
1e9214730e83: Pull complete
5bd4ec081f7b: Pull complete
be26b369a1e7: Pull complete
Digest: sha256:93ca4e4b10c596d5f656ed9d9634df1ef166e7a808b445b48011c89cb98c8c85
Status: Downloaded newer image for python:2.7-slim
 ---> 8559620b5b0d
Step 2/7 : WORKDIR /app
 ---> Running in f80fbaa8e148
Removing intermediate container f80fbaa8e148
 ---> 5d236ccc224d
Step 3/7 : COPY . /app
 ---> e253996b809e
Step 4/7 : RUN pip install --trusted-host pypi.python.org -r requirements.txt
 ---> Running in ba22b075d9d7
DEPRECATION: Python 2.7 will reach the end of its life on January 1st, 2020. Please upgrade your Python as Python 2.7 won't be maintained after that date. A future version of pip will drop support for Python 2.7.
Collecting Flask (from -r requirements.txt (line 1))
  Downloading https://files.pythonhosted.org/packages/7f/e7/08578774ed4536d3242b14dacb4696386634607af824ea997202cd0edb4b/Flask-1.0.2-py2.py3-none-any.whl (91kB)
Collecting Redis (from -r requirements.txt (line 2))
  Downloading https://files.pythonhosted.org/packages/d0/8b/c43ef27d02382853b22c49bc41a8389e47d60811dd1d72b9a45bc905a5f8/redis-3.2.0-py2.py3-none-any.whl (65kB)
Collecting itsdangerous>=0.24 (from Flask->-r requirements.txt (line 1))
  Downloading https://files.pythonhosted.org/packages/76/ae/44b03b253d6fade317f32c24d100b3b35c2239807046a4c953c7b89fa49e/itsdangerous-1.1.0-py2.py3-none-any.whl
Collecting Jinja2>=2.10 (from Flask->-r requirements.txt (line 1))
  Downloading https://files.pythonhosted.org/packages/7f/ff/ae64bacdfc95f27a016a7bed8e8686763ba4d277a78ca76f32659220a731/Jinja2-2.10-py2.py3-none-any.whl (126kB)
Collecting Werkzeug>=0.14 (from Flask->-r requirements.txt (line 1))
  Downloading https://files.pythonhosted.org/packages/20/c4/12e3e56473e52375aa29c4764e70d1b8f3efa6682bef8d0aae04fe335243/Werkzeug-0.14.1-py2.py3-none-any.whl (322kB)
Collecting click>=5.1 (from Flask->-r requirements.txt (line 1))
  Downloading https://files.pythonhosted.org/packages/fa/37/45185cb5abbc30d7257104c434fe0b07e5a195a6847506c074527aa599ec/Click-7.0-py2.py3-none-any.whl (81kB)
Collecting MarkupSafe>=0.23 (from Jinja2>=2.10->Flask->-r requirements.txt (line 1))
  Downloading https://files.pythonhosted.org/packages/fb/40/f3adb7cf24a8012813c5edb20329eb22d5d8e2a0ecf73d21d6b85865da11/MarkupSafe-1.1.1-cp27-cp27mu-manylinux1_x86_64.whl
Installing collected packages: itsdangerous, MarkupSafe, Jinja2, Werkzeug, click, Flask, Redis
Successfully installed Flask-1.0.2 Jinja2-2.10 MarkupSafe-1.1.1 Redis-3.2.0 Werkzeug-0.14.1 click-7.0 itsdangerous-1.1.0Removing intermediate container ba22b075d9d7
 ---> 4fb7c8c139c4
Step 5/7 : EXPOSE 80
 ---> Running in efffb3a878de
Removing intermediate container efffb3a878de
 ---> 7dafa617e1ea
Step 6/7 : ENV NAME World
 ---> Running in ba6ae9a6dc5d
Removing intermediate container ba6ae9a6dc5d
 ---> d89bd552c7e5
Step 7/7 : CMD ["python", "app.py"]
 ---> Running in 3af3ab42bfb1
Removing intermediate container 3af3ab42bfb1
 ---> 9652d1a9e17a
Successfully built 9652d1a9e17a
Successfully tagged friendlyhello:latest
SECURITY WARNING: You are building a Docker image from Windows against a non-Windows Docker host. All files and directories added to build context will have '-rwxr-xr-x' permissions. It is recommended to double check and reset permissions for sensitive files and directories.

```

귀하의 내장 이미지는 어디에 있습니까? 컴퓨터의 로컬 Docker 이미지 레지스트리에 있습니다.

`docker image ls`

```

C:\Users\ASUS\docker>docker image ls
REPOSITORY          TAG                 IMAGE ID            CREATED              SIZE
friendlyhello       latest              9652d1a9e17a        About a minute ago   131MB
jenkins/jenkins     latest              a5e18ff4fa3b        46 hours ago         702MB
python              2.7-slim            8559620b5b0d        8 days ago           120MB
jenkins/jenkins     lts                 806f56c84444        3 weeks ago          703MB
hello-world         latest              fce289e99eb9        2 months ago         1.84kB

```

태그의 기본 설정 방법에 유의하십시오 latest. 태그 옵션의 전체 구문은 다음과 같습니다 --tag=friendlyhello:v0.0.1.

### 어플리케이션 실행

다음을 -p 사용하여 기기의 포트 4000을 컨테이너의 게시 된 포트 80에 매핑하여 앱을 실행합니다.

`docker run -p 4000:80 friendlyhello`

```

C:\Users\ASUS\docker>docker run -p 4000:80 friendlyhello
 * Serving Flask app "app" (lazy loading)
 * Environment: production
   WARNING: Do not use the development server in a production environment.
   Use a production WSGI server instead.
 * Debug mode: off
 * Running on http://0.0.0.0:80/ (Press CTRL+C to quit)

```
파이썬이 앱을 제공하고 있다는 메시지가 나타납니다 http://0.0.0.0:80. 
하지만 그 메시지는 컨테이너 내부에서 들어 오는데, 컨테이너의 포트 80을 4000으로 매핑하여 올바른 URL을 작성했는지 알지 못합니다 

http://localhost:4000로 브라우저로 접속하면 

```

Hello World!
Hostname: 4a514c214c68
Visits: cannot connect to Redis, counter disabled

```

쉘에서 curl 명령을 사용 하여 동일한 내용을 볼 수도 있습니다.

`curl http://localhost:4000`

이 포트 재매핑은 에서 실행중인 값 과 실행 되는 값 4000:80의 차이 를 보여줍니다. 
나중 단계에서 호스트의 포트 4000을 컨테이너의 포트 80에 매핑하고 사용하십시오.

종료하려면 터미널에서 CTRL+C 누르 십시오.

```
Windows에서 명시 적으로 컨테이너를 중지하십시오.

Windows 시스템에서는 CTRL+C컨테이너를 중지하지 않습니다. 
따라서 먼저 CTRL+C 프롬프트를 다시 가져 오거나 
다른 쉘을 여는 데 docker container ls 를 입력 한 다음 실행중인 컨테이너 목록 보고 
다음 명령어로 docker container stop <Container NAME or ID> 컨테이너를 중지하십시오. 
그렇지 않으면 다음 단계에서 컨테이너를 다시 실행하려고 시도 할 때 데몬에서 오류 응답을받습니다.

```

이제 백그라운드에서 분리 모드로 앱을 실행 해 봅시다. `-d` 

`docker run -d -p 4000:80 friendlyhello`

```

C:\Users\ASUS>docker run -d -p 4000:80 friendlyhello
1eb0b982beb5dc58783e8d3f815c292622bd9e1c27364fa1b81b396e33931429

```

앱의 긴 컨테이너 ID를 얻은 다음 터미널로 다시 가져옵니다. 
컨테이너가 백그라운드에서 실행 중입니다. 
단축 된 컨테이너 ID를 볼 수 있습니다 (또한 docker container ls 명령을 실행할 때 둘 다 교환 가능하게 작동합니다).

```
C:\Users\ASUS>docker container ls
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS                  NAMES
1eb0b982beb5        friendlyhello       "python app.py"     35 seconds ago      Up 34 seconds       0.0.0.0:4000->80/tcp   lucid_wiles

```

http://localhost:4000 접속하면 Hostname이 컨테이너 id와 일치한다.
 
`docker container stop <CONTAINER ID>` 명령어를 사용하여 프로세스를 종료하세요

```
C:\Users\ASUS>docker container stop 1eb0b982beb5
1eb0b982beb5
C:\Users\ASUS>docker container ls
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```

### image 공유하기

방금 만든 이미지의 이식성을 보여주기 위해 빌드 된 이미지를 업로드하고 다른 곳으로 실행 해 봅시다. 
결국 프로덕션에 컨테이너를 배포하려는 경우 레지스트리로 푸시하는 방법을 알아야합니다.

레지스트리는 저장소의 모음이고 저장소는 GitHub 저장소와 같은 종류의 이미지 모음입니다. 
단, 코드는 이미 작성되어 있습니다. 
레지스트리의 계정은 많은 리포지토리를 생성 할 수 있습니다. 
docker CLI는 기본적으로 Docker’s 의 공개 레지스트리를 사용합니다.

```

참고 : Docker의 공용 레지스트리는 무료이며 미리 구성되어 있기 때문에 여기에서 사용하지만 
선택할 수있는 공용 레지스트리가 많으며 Docker Trusted Registry를 사용하여 개인 레지스트리를 설정할 수도 있습니다 .

```

#### Docker ID로 로그인하십시오.

Docker 계정이 없다면 hub.docker.com 에 가입하십시오 . 사용자 이름을 메모하십시오.

로컬 시스템의 Docker 공용 레지스트리에 로그인하십시오.

`docker login`

#### 이미지에 태그 달기

로컬 이미지를 레지스트리의 저장소와 연관시키는 표기법은 다음과 같습니다 username/repository:tag. 
이 태그는 선택 사항이지만 Docker 이미지에 버전을 제공하는 데 사용되는 메커니즘이기 때문에 권장됩니다. 
저장소와 같은 문맥에 의미있는 이름을 붙이십시오 get-started:part2. 
그러면 이미지가 get-started 저장소에 저장되고 part2 태그가 붙습니다.

이제 이미지를 모두 태그를 추가하십시오. 
실행 docker tag image 사용자 이름, 저장소 및 태그 이름과 원하는 목적지로 이미지 업로드 있도록. 

명령 구문은 다음과 같습니다.

`docker tag image username/repository:tag`

예:

`docker tag friendlyhello sejoung/get-started:part2`

`docker image ls` 를 실행 하여 새로 태그가 지정된 이미지를 확인하십시오.

```java

C:\Users\ASUS>docker image ls
REPOSITORY            TAG                 IMAGE ID            CREATED             SIZE
friendlyhello         latest              9652d1a9e17a        About an hour ago   131MB
sejoung/get-started   part2               9652d1a9e17a        About an hour ago   131MB
python                2.7-slim            8559620b5b0d        8 days ago          120MB
hello-world           latest              fce289e99eb9        2 months ago        1.84kB

```

#### 이미지 등록

태그가 지정된 이미지를 저장소에 업로드하십시오.

`docker push username/repository:tag`

```
C:\Users\ASUS>docker push sejoung/get-started:part2
The push refers to repository [docker.io/sejoung/get-started]
1267c452c64b: Pushed
0bad7be22877: Pushed
010bef00fd56: Pushed
c39d784764e0: Pushed
4bad4dc0f0f2: Pushed
d443bc70f9c5: Pushed
6744ca1b1190: Pushed
part2: digest: sha256:cb271f352727ff1087c08042a69ed0b83a0f750a33bff62da6229da1fea291ff size: 1787

```

도커 허브에서 확인가능하다.

#### 원격 저장소에서 이미지를 당겨 실행하십시오.

이제부터는 docker run 다음 명령을 사용하여 모든 컴퓨터에서 앱을 사용 하고 실행할 수 있습니다.



다음을 확인하기 전에 로컬에 있는 값을 지워주겠다.

`docker image ls`를 실행

```
C:\Users\ASUS>docker image ls
REPOSITORY            TAG                 IMAGE ID            CREATED             SIZE
friendlyhello         latest              9652d1a9e17a        About an hour ago   131MB
sejoung/get-started   part2               9652d1a9e17a        About an hour ago   131MB
python                2.7-slim            8559620b5b0d        8 days ago          120MB
hello-world           latest              fce289e99eb9        2 months ago        1.84kB

```

여기서 sejoung/get-started:part2 를 삭제

`docker image rm sejoung/get-started:part2` 명령어 실행

```
C:\Users\ASUS>docker image rm sejoung/get-started:part2
Untagged: sejoung/get-started:part2
Untagged: sejoung/get-started@sha256:cb271f352727ff1087c08042a69ed0b83a0f750a33bff62da6229da1fea291ff

C:\Users\ASUS>docker image rm 9652d1a9e17a
Untagged: friendlyhello:latest
Deleted: sha256:9652d1a9e17ae9cff12aa014c6537f99f0f46610dfed4c35cef6932402210a1b
Deleted: sha256:d89bd552c7e522f02c862026b50a9a3a8436f128a52cf96c4f1b20d6c3b92fcc
Deleted: sha256:7dafa617e1ea5049790323017839af6c6a851a47761388664f364dc72a09c6ff
Deleted: sha256:4fb7c8c139c4a4658f44e5ba2c43ab760ac056505d28e7406f0416d3e4b36b41
Deleted: sha256:b7a9d1594598aaac29bd0b08f00b231542164690e63a3f43c367c60bb78832f9
Deleted: sha256:e253996b809e5368e7f54e6cdce25f2bc31c935ae6b671cae73064ecba2b402e
Deleted: sha256:4b32811fa6849a7d2304aac94c06a4853a7fa8fea3821b5e0a390c49f408b397
Deleted: sha256:5d236ccc224d6f699c09f618d98a3419ce83aa584b62149dd8366e2a979abdcf
Deleted: sha256:fb293ad6e6d7788e4e5eecd834af46f5501c10fccbc940efd9ab1e9ded8d4886


```

`docker run -p 4000:80 username/repository:tag` 

`docker run -p 4000:80 sejoung/get-started:part2` 실행

이미지가 컴퓨터에서 로컬로 사용할 수없는 경우 Docker는 저장소에서 이미지를 가져옵니다.

```
C:\Users\ASUS>docker run -p 4000:80 sejoung/get-started:part2
Unable to find image 'sejoung/get-started:part2' locally
part2: Pulling from sejoung/get-started
f7e2b70d04ae: Already exists
1e9214730e83: Already exists
5bd4ec081f7b: Already exists
be26b369a1e7: Already exists
f9511e19f0ce: Pull complete
d5ad1634dfa1: Pull complete
cf95792ceffa: Pull complete
Digest: sha256:cb271f352727ff1087c08042a69ed0b83a0f750a33bff62da6229da1fea291ff
Status: Downloaded newer image for sejoung/get-started:part2
 * Serving Flask app "app" (lazy loading)
 * Environment: production
   WARNING: Do not use the development server in a production environment.
   Use a production WSGI server instead.
 * Debug mode: off
 * Running on http://0.0.0.0:80/ (Press CTRL+C to quit)

```

### Recap and cheat sheet

```

docker build -t friendlyhello .  # Create image using this directory's Dockerfile
docker run -p 4000:80 friendlyhello  # Run "friendlyname" mapping port 4000 to 80
docker run -d -p 4000:80 friendlyhello         # Same thing, but in detached mode
docker container ls                                # List all running containers
docker container ls -a             # List all containers, even those not running
docker container stop <hash>           # Gracefully stop the specified container
docker container kill <hash>         # Force shutdown of the specified container
docker container rm <hash>        # Remove specified container from this machine
docker container rm $(docker container ls -a -q)         # Remove all containers
docker image ls -a                             # List all images on this machine
docker image rm <image id>            # Remove specified image from this machine
docker image rm $(docker image ls -a -q)   # Remove all images from this machine
docker login             # Log in this CLI session using your Docker credentials
docker tag <image> username/repository:tag  # Tag <image> for upload to registry
docker push username/repository:tag            # Upload tagged image to registry
docker run username/repository:tag                   # Run image from a registry

```


# 참조
-----
* [docker-get-started](https://docs.docker.com/get-started/part2/)
* [도커 처음 시작하기(오리엔테이션 및 설정)](https://sejoung.github.io/2019/03/docker-get-started(1))


