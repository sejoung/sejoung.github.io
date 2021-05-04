---
layout: post
title: "scouter-paper 설치"
date: 2021-05-04 11:10 +0900
comments: true
tags : ["scouter","scouter-paper","scouter client"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
--->
# scouter-paper 설치
먼저 스카우터 서버에 scouter.conf 값을 설정해줘야 된다.

`scouter/server/conf/scouter.conf`에 아래의 설정값을 주면서 활성화를 시켜줘야 된다.

```
net_http_server_enabled=true
net_http_api_enabled=true
net_http_port=6188
```

위 처럼 설정해주면 스카우터의 웹 API를 사용할수 있게 된다.
테스트는 브라우저에 `http://{SERVER-ADDRESS}:{PORT}/scouter/v1/info/server` 입력해보면 정상적이면 아래처럼 json을 리턴한다.

```json
{
    "status":"200",
    "requestId":"#q168",
    "resultCode":"0",
    "message":"success",
    "result":[
        {
            "id":"-1082951330",
            "name":"server",
            "connected":true,
            "serverTime":"1620094974758",
            "version":"2.12.0.1.SNAPSHOT 2021-01-24 06:45 GMT"
        }
    ]
}
```
따로 서비스를 띄어서 페이퍼가 정상 동작하는것을 확인 할수있다.

## docker-compose 형태로 서버와 같이 설치 하기

```yaml

version: '3.2'
services:
  scouter-paper:
    image : scouterapm/scouter-paper:2.6.4
    restart : always
    ports:
      - 8080:80
  scouter:
    image : scouterapm/scouter-server:2.10.2
    restart : always
    environment:
      - SC_SERVER_ID=SCCOUTER-COLLECTOR 
      - NET_HTTP_SERVER_ENABLED=true
      - NET_HTTP_API_SWAGGER_ENABLED=true
      - NET_HTTP_API_ENABLED=true
      - MGR_PURGE_PROFILE_KEEP_DAYS=2
      - MGR_PURGE_XLOG_KEEP_DAYS=5
      - MGR_PURGE_COUNTER_KEEP_DAYS=15
      - JAVA_OPT=-Xms1024m -Xmx1024m
    volumes:
      - ./logs:/home/scouter-server/logs
      - ./sc-data:/home/scouter-server/database
    ports:
      - 6188:6180
      - 6100:6100
      - 6100:6100/udp

```

위에서 기본에서 하나 바꾼값은 api 서버 포트를 6180 에서 6188로 바꾸었다 페이퍼 기본 포트가 6188이라서 이렇게 수정처리 함



# 참고자료
* [scouter-paper manual](https://scouter-contrib.github.io/scouter-paper/manual.html)
* [docker scouter-server](https://hub.docker.com/r/scouterapm/scouter-server)
* [docker scouter-paper](https://hub.docker.com/r/scouterapm/scouter-paper)
