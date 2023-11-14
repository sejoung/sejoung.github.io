---
layout: post
title: "cuDNN 설치"
date: 2023-11-14 13:50 +0900
comments: true
tags: [ "conda","anaconda",'python']
categories: [ "tool" ]
sitemap:
changefreq: daily
priority: 1.0
---

# cuDNN 설치

[CUDA Toolkit 12.3 Downloads](https://developer.nvidia.com/cuda-downloads) 링크에 따라 설치 하면 됨

나는 runfile(local)로 설치함

```bash
wget https://developer.download.nvidia.com/compute/cuda/12.3.0/local_installers/cuda_12.3.0_545.23.06_linux.run
sudo sh cuda_12.3.0_545.23.06_linux.run

```

여기서 드라이브는 이미 설치했으니 툴킷만 설치하면 됨 

아래의 명령어로 설치 확인

```shell
nvcc -V
```


```shell

tar -xvf cudnn-linux-x86_64-8.9.6.50_cuda12-archive.tar.xz

sudo cp cudnn-*-archive/include/cudnn*.h /usr/local/cuda/include

sudo cp -P cudnn-*-archive/lib/libcudnn* /usr/local/cuda/lib64

sudo chmod a+r /usr/local/cuda/include/cudnn*.h /usr/local/cuda/lib64/libcudnn*

```

```shell
 git clone https://github.com/sejoung/cudnn_samples_v8.git
 
 cd cudnn_samples_v8/mnistCUDNN

make all TARGET_ARCH=x86_64

```

```shell

sudo apt-get install g++ freeglut3-dev build-essential libx11-dev libxmu-dev libxi-dev libglu1-mesa libglu1-mesa-dev

sudo apt-get install libfreeimage3 libfreeimage-dev

```

```shell
nvcc fatal   : Unsupported gpu architecture 'compute_35'
```



# 참조
-----

* [CUDA Compatibility](https://docs.nvidia.com/deploy/cuda-compatibility/)
* [Your GPU Compute Capability](https://developer.nvidia.com/cuda-gpus)
* [CUDA Toolkit 12.3 Downloads](https://developer.nvidia.com/cuda-downloads)
* [CUDA](https://www.wikiwand.com/en/CUDA)
* [Installation Guide](https://docs.nvidia.com/deeplearning/cudnn/install-guide/index.html)
* [Nvcc fatal : Unsupported gpu architecture ‘compute_35’](https://forums.developer.nvidia.com/t/nvcc-fatal-unsupported-gpu-architecture-compute-35/247815)
