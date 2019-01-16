---
layout: post
title: "레디스 접속용 클라이언트"
date: 2018-12-28 13:30 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 레디스 접속용 클라이언트

레디스 접속용 클라이언트가 몇개 없는데 그중에 RedisDesktopManager가 제일 편한거 같은데 
언제부터인지 클러스터 모드로 셋팅된 레디스에 접속시에 데이터가 모든 node에 있는것 처럼보이고 
데이터도 잘보이지 않는다.

버전 별로 테스트 해보니 [0.8.8](https://github.com/uglide/RedisDesktopManager/releases/tag/0.8.8) 버전이 제일 맘에 들어서 사용중이다.

위 버전으로 사용해보자 오늘기준으로 0.9.9 버전까지 제대로 안된다.

# 참조
-----
* [RedisDesktopManager](https://github.com/uglide/RedisDesktopManager)