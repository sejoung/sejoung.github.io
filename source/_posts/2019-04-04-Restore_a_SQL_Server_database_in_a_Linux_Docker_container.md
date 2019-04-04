---
layout: post
title: "Docker SQL Server 컨테이너 이미지에 데이터 베이스 백업 복원하기"
date: 2019-04-04 16:43 +0900
comments: true
tags : ["개발디비","mssql","docker", "restore"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## Docker SQL Server 컨테이너 이미지에 데이터 베이스 백업 복원하기

### 다운로드

```
docker pull mcr.microsoft.com/mssql/server:2017-latest

```

### 실행

`<YourStrong!Passw0rd>` 이부분을 자기가 아는 패스워드로 바꾸면 된다.

```
docker run -e 'ACCEPT_EULA=Y' -e 'MSSQL_SA_PASSWORD=<YourStrong!Passw0rd>' \
   --name 'sql1' -p 1401:1433 \
   -v sql1data:/var/opt/mssql \
   -d mcr.microsoft.com/mssql/server:2017-latest

```

```
sudo docker ps -a
```

그리고 일단 윈도우용 bak 파일을 복원 시킬때 정상적으로 동작하지 않았다. 
그래서 mdf파일과 ldf을 직접 임포트 시킬려고 했다.

일단 데이터 베이스를 생성 시켰다. 내가 만들고자고 하는 파일을명을 데이터 베이스와 동일하기에 데이터 베이스를 먼저 만들었다.

```
CREATE DATABASE TEST
```
그런 다음 도커 컨테이너 파일에 가서 살펴 보면
```
docker exec -i -t sql1 /bin/bash
```
지금 로그인 하면 쉘로 들어가는데 아래의 커멘드를 입력해보면

```
cd /var/opt/mssql/data

```
해당 폴더에 아래의 파일들이 생겼을것이다.
```
TEST.mdf
TEST_log.ldf
```

그다음에 도커 정지

```
docker stop sql1

```

그 다음에 도커로 파일 복사

```
docker cp TEST.mdf sql1:/var/opt/mssql/data

docker cp TEST_log.ldf sql1:/var/opt/mssql/data
```

다시 실행
```
docker start sql1

```

### 삭제
```
sudo docker stop sql1
sudo docker rm sql1
```

# 참조
-----
* [Restore a SQL Server database in a Linux Docker container](https://docs.microsoft.com/en-us/sql/linux/tutorial-restore-backup-in-sql-server-container?view=sql-server-2017)

