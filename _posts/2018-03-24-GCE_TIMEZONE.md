---
layout: post
title: "GCE_TIMEZONE"
date: 2018-03-24 18:29:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

## GCE_TIMEZONE

sql을 사용했는데 select now() 시간이 한국 시간이 아니였다 해당 설정은 

sql 설정에 들어가서 수정을 누른 다음 데이터베이스 플래그 추가에 default_time_zone 설정을 +09:00 항목을 추가했다.

또 서버 인스턴스에서도 타임존이 맞지 않아 rdate를 이용해서 맞출려고 했지만 맞지 않았다. 

해당 설정은 .bash_profile 에서 export TZ='Asia/Seoul' 를 추가해서 해결을 하였다.

