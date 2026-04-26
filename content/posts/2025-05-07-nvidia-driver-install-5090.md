---
layout: post
title: "우분투 에서 5090 driver 설치"
date: 2025-05-07 18:37 +0900
comments: true
tags: [ "nvidia-smi", "5090", "nvidia 5090", "driver", "nvidia", "우분투", "ubuntu", "드라이버" ]
categories: [ "ubuntu" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# 우분투 에서 5090 driver 설치

## 기존 드라이버 삭제
```
sudo apt-get remove --purge '^nvidia-.*'
sudo apt purge nvidia* -y
sudo apt remove nvidia* -y
sudo apt autoremove && sudo apt autoclean

```

[geforce/drivers](https://www.nvidia.com/ko-kr/geforce/drivers/) 여기서 최신 드라이버 다운로드

```
sudo apt install pkg-config libglvnd-dev build-essential
```

```
sudo ./NVIDIA-Linux-x86_64-570.144.run --no-kernel-modules
```

driver 설치때 MIT/GPL 라이센스 동의 해야함

```
sudo apt install git
```

```
git clone https://github.com/NVIDIA/open-gpu-kernel-modules
```

```
cd open-gpu-kernel-modules
```

```
git checkout 570.144
```

```
make modules -j$(nproc)
```

```
sudo make modules_install -j$(nproc)
```

```
sudo depmod
```

```
sudo reboot -n
```

# 참고

-----

* [geforce/drivers](https://www.nvidia.com/ko-kr/geforce/drivers/)
* [How to install Nvidia drivers on Ubuntu 24.04](https://hiseon.me/general/how-to-install-nvidia-drivers-on-ubuntu-24-04/)
