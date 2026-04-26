---
layout: post
title: "Docker build 시 SSH 키 설정 사용"
date: 2025-04-07 14:24 +0900
comments: true
tags: [ "dockerfiles", "SSH", "ssh", "ssh key", "private git hub" ]
categories: [ "docker" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# Docker build 시 SSH 키 설정 사용

컴파일 언어를 사용해서 배포할때는 바이너리만 배포하면 되니깐 문제가 없는데(모든 의존성을 build 시점에 같이 묶임)
파이썬 같은 인터프리터 언어를 사용할때는 배포할 시점에 의존성 파일을 다운받아야 된다. 
venv를 사용해서 가상환경을 만들고, 그 안에 의존성 파일을 다운받는 경우가 많다.

이시점에 pip를 사용해서 의존성 파일을 다운받는데, private git hub에 있는 의존성 파일을 다운받아야 하는 경우가 있다.

이때는 SSH 키를 사용해서 private git hub에 접근해야 한다.

이 문제를 해결하기 위해서 Dockerfile에서 SSH 키를 사용해서 private git hub에 접근하는 방법을 알아보자.

## Dockerfile

처리 방법이 여러 방법이 있는데 저는 기본적인 방법을 사용했다.

```dockerfile

FROM python:3.11

ENV ROOT=/test

RUN mkdir -p $ROOT

RUN mkdir -p /root/.ssh
COPY id_ed25519 /root/.ssh/id_ed25519
RUN chmod 600 /root/.ssh/id_ed25519 && \
    ssh-keyscan github.com >> /root/.ssh/known_hosts

WORKDIR $ROOT

COPY . .

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

RUN rm -rf /root/.ssh

ENTRYPOINT ["python3.11", "src/main.py"]

```

위와 같이 ssh 키를 복사하고, 권한을 설정하고, ssh-keyscan을 사용해서 github.com의 공개키를 known_hosts에 추가한다.

이렇게 하면 ssh 키를 사용해서 private git hub에 접근할 수 있다.

그리고 코드가 다 동작하면 ssh 키를 삭제한다.

# 참고

-----
