---
layout: post
title: "stable-diffusion-webui docker 설치"
date: 2023-10-26 10:27 +0900
comments: true
tags: [ "stable-diffusion-webui","stable diffusion","docker" ]
categories: [ "tool" ]
sitemap:
changefreq: daily
priority: 1.0
---

# stable-diffusion-webui docker 설치

먼저 docker를 설치해야 한다.

## docker 설치

도커의 자동 설치 스크립트 사용

```shell
sudo wget -qO- http://get.docker.com/ | sh
```

우분투 직접 설치

```shell
sudo apt-get update
sudo apt-get install docker.io
sudo ln -sf /usr/bin/docker.io /usr/local/bin/docker
```

도커 권한 부여

```shell

# docker group 추가
sudo groupadd docker

# docker group에 현재의 사용자 추가
sudo usermod -aG docker $USER

```

## docker-compose 설치

[docker compose releases](https://github.com/docker/compose/releases) 여기에서 최신버전을 확인후에 설치한다.

```shell
sudo curl -L "https://github.com/docker/compose/releases/download/${최신버전}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

```

권한추가

```shell

sudo chmod +x /usr/local/bin/docker-compose

```

## NVIDIA Container Toolkit 설치

그리고 엔비디아의 NVIDIA Container Toolkit을 설치해야 한다.

저장소 등록 및 업데이트

```shell
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
  && curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list \
  && \
    sudo apt-get update

```

설치
```shell
sudo apt-get install -y nvidia-container-toolkit
```

```shell
sudo systemctl restart docker
```

## stable-diffusion-webui-docker 설치


```shell

git clone https://github.com/AbdBarho/stable-diffusion-webui-docker.git

cd stable-diffusion-webui-docker

docker compose --profile download up --build
# wait until its done, then:
docker compose --profile [ui] up --build
# where [ui] is one of: invoke | auto | auto-cpu | comfy | comfy-cpu

```

위에 도커 컴포즈 파일에서는 같은 포트를 사용해서 기동하도록 되어 있다 여러개를 동시해 실행하고 싶으면 포트를 변경해야 한다. 
아래 처럼 실행 가능하다

```shell
 
 WEBUI_PORT=7861 docker compose --profile comfy up --build
 
```

# 참조
-----

* [Installing the NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)
* [docker compose releases](https://github.com/docker/compose/releases)
* [stable-diffusion-webui-docker](https://github.com/AbdBarho/stable-diffusion-webui-docker)
