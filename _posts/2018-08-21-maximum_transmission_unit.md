---
layout: post
title: "maximum_transmission_unit"
date: 2018-08-21 15:36 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### maximum_transmission_unit

os를 설치하고 처음 OS 파라미터들을 셋팅 할때 필요한것을 하나씩 정리 해 나갈려고 한다. 

MTU란 네트워크에서 최대전송단위로 단위가 커질수록 효율성이 높아집니다. 이렇게 효율이 올라가면 대량 프로토콜 처리량이 올라가는것 입니다.

여기서 단점은  큰 패킷은 작은 패킷보다 더 오랜 시간 동안 느린 링크를 차지하므로 후속 패킷에 더 많은 지연이 발생하고 네트워크 지연 과 지연 변동이 증가 합니다 .

이더넷에 최대크기 MTU는 1500 입니다.

변경 방법은 OS 별로 틀립니다. 리눅스 기준으로 적어 놓습니다.

CentOS / RHEL / Fedora Linux

```
vi /etc/sysconfig/network-scripts/ifcfg-eth0

MTU="9000"

service network restart

IPV6_MTU="1280"
```

Debian / Ubuntu Linux

```
vi /etc/network/interfaces

mtu 9000

/etc/init.d/networking restart

```
other Linux 

```

/sbin/ifconfig eth1 mtu 9000 up

```


# 참조 
-----
* [Maximum_transmission_unit](https://en.wikipedia.org/wiki/Maximum_transmission_unit)
* [centos-rhel-redhat-fedora-debian-linux-mtu-size](https://www.cyberciti.biz/faq/centos-rhel-redhat-fedora-debian-linux-mtu-size/)