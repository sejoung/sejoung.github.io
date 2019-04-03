---
layout: post
title: "Docker를 사용하여 SQL Server 컨테이너 이미지 실행"
date: 2019-04-03 17:49 +0900
comments: true
tags : ["개발디비","mssql","docker"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## Docker를 사용하여 SQL Server 컨테이너 이미지 실행


```
sudo docker pull mcr.microsoft.com/mssql/server:2017-latest

```

```
sudo docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=<YourStrong!Passw0rd>' \
   -p 1433:1433 --name sql1 \
   -d mcr.microsoft.com/mssql/server:2017-latest

```

```
sudo docker ps -a
```

# 참조
-----
* [quickstart-install-connect-docker](https://docs.microsoft.com/ko-kr/sql/linux/quickstart-install-connect-docker?view=sql-server-2017&pivots=cs1-bash)



