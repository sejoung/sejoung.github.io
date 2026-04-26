---
layout: post
title: "리눅스에서 java_home 셋팅"
date: 2018-10-29 11:53 +0900
comments: true
tags : ["java_home"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### 리눅스에서 java_home 셋팅


리눅스에서 java_home 셋팅

전체 유저한테 주기위해서 아래처럼 셋팅함

```
vim /etc/profile

export JAVA_HOME="/usr/local/src/jdk-11.0.1"

export PATH=$JAVA_HOME/bin:$PATH

```

jdk는 오픈 jdk로 셋팅 끝

```

which java

```

# 참조 
-----
* [openjdk-install](https://openjdk.java.net/install/)
* [how-to-set-java-home-in-linux-for-all-users](https://stackoverflow.com/questions/24641536/how-to-set-java-home-in-linux-for-all-users)