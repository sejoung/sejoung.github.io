---
layout: post
title: "우분투에 CUDA 11.8 설치"
date: 2023-10-18 10:50 +0900
comments: true
tags: [ "CUDA","우분투"]
categories: [ "tool" ]
sitemap:
changefreq: daily
priority: 1.0
---

# 우분투에 CUDA 11.8 설치


## GPU가 있는지 확인

```shell
lspci | grep -i nvidia
```

## 기존의 설치된것 삭제

```shell

sudo apt-get purge `.*nvidia.*`
sudo apt remove `.*nvidia.*`
sudo rm /etc/apt/sources.list.d/cuda*
sudo apt-get autoremove && sudo apt-get autoclean
sudo rm -rf /usr/local/cuda*

```

## system update

```shell

sudo apt-get update
sudo apt-get upgrade

```

## install other import packages

```shell
sudo apt-get install g++ freeglut3-dev build-essential libx11-dev libxmu-dev libxi-dev libglu1-mesa libglu1-mesa-dev
```

## PPA repository driver 추가

```shell

sudo add-apt-repository ppa:graphics-drivers/ppa
sudo apt update

```

## install nvidia driver with dependencies

```shell

sudo apt install libnvidia-common-515
sudo apt install libnvidia-gl-515
sudo apt install nvidia-driver-515

sudo wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-ubuntu2204.pin
sudo mv cuda-ubuntu2204.pin /etc/apt/preferences.d/cuda-repository-pin-600
sudo apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/3bf863cc.pub
sudo add-apt-repository "deb https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/ /"

```

## system update

```shell

sudo apt-get update
sudo apt-get upgrade

```

## installing CUDA-11.8

```shell
sudo apt install cuda-11-8
```

아래의 오류가 나면 처리 방법

```
The following packages have unmet dependencies:
 libnvidia-extra-525 : Conflicts: libnvidia-extra
 libnvidia-extra-535 : Conflicts: libnvidia-extra
```

```shell
sudo apt full-upgrade

```

## paths 설정

```shell

echo 'export PATH=/usr/local/cuda-11.8/bin:$PATH' >> ~/.bashrc
echo 'export LD_LIBRARY_PATH=/usr/local/cuda-11.8/lib64:$LD_LIBRARY_PATH' >> ~/.bashrc
source ~/.bashrc
sudo ldconfig

```

## cuda 버전이 불일치 함?

```shell
nvcc -V

nvidia-smi
```

문제 없다고 함???

# 참조
-----

* [cuda_11.8_installation_on_Ubuntu_22.04](https://gist.github.com/MihailCosmin/affa6b1b71b43787e9228c25fe15aeba)
* [Different CUDA versions shown by nvcc and NVIDIA-smi](https://itecnote.com/tecnote/different-cuda-versions-shown-by-nvcc-and-nvidia-smi/)

