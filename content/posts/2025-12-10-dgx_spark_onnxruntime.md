---
layout: post
title: "DGX SPARK에서 ONNX Runtime 설치 및 설정하기"
date: 2025-12-10 14:47 +0900
comments: true
tags: [ "onnxruntime", "DGX SPARK", "ai-toolkit" ]
categories: [ "linux" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# DGX SPARK에서 ONNX Runtime 설치 및 설정하기

onnxruntime 패키지는 ONNX(Open Neural Network Exchange) 모델을 실행하기 위한 고성능 런타임입니다.

DGX SPARK 환경에서 onnxruntime를 설치하고 설정하는 방법을 안내합니다. DGX SPARK는 arm64 아키텍처를 기반으로 하므로, 해당 아키텍처에 맞는 onnxruntime 패키지를 설치해야 합니다.
하지만 지금 pip 저장소에는 arm64 아키텍처용 onnxruntime 패키지가 없습니다. 따라서 소스에서 빌드하여 설치해야 합니다.

## 1. 의존성 패키지 설치

저는 3.10 버전의 Python을 사용하고 있습니다.(3.11도 가능한데 이상하게 3.12는 안되더군요)
먼저, onnxruntime 빌드에 필요한 의존성 패키지를 설치합니다. 터미널에서 다음 명령어를 실행하세요:

```bash
pip install cmake ninja packaging numpy

```

## 2. onnxruntime 소스 코드 클론

onnxruntime의 소스 코드를 GitHub에서 클론합니다. 터미널에서 다음 명령어를 실행하세요:

```bash
git clone https://github.com/microsoft/onnxruntime.git
```

## 3. onnxruntime 빌드 및 설치

클론한 onnxruntime 디렉토리로 이동한 후, 다음 명령어를 실행하여 onnxruntime를 빌드하고 설치합니다:

```bash

cd onnxruntime
./build.sh --config Release --build_dir build/cuda13 --parallel 4 --nvcc_threads 1 --use_cuda  \
           --cuda_version 13.0 --cuda_home /usr/local/cuda-13.0/  \
           --cudnn_home /usr/local/cuda-13.0/  \
           --build_wheel --skip_tests  \
           --cmake_generator Ninja  \
           --use_binskim_compliant_compile_flags  \
           --cmake_extra_defines CMAKE_CUDA_ARCHITECTURES=121 onnxruntime_BUILD_UNIT_TESTS=OFF
```

빌드가 완료되면, 생성된 휠 파일을 설치합니다:

```bash

pip install -U build/cuda13/Release/dist/onnxruntime_gpu-1.24.0-cp310-cp310-linux_aarch64.whl

``` 

# 참조
-----

* [Pip cannot find package for Nvidia DGX Spark (arm linux)](https://github.com/microsoft/onnxruntime/issues/26351)
