---
layout: post
title: "fiddler remote debuger 방법"
date: 2018-07-26 19:26:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### fiddler remote debuger 방법

원도우 컴퓨터에서 핸드폰이나 다른 스마트 기기에서 호출하는것을 디버깅 하기 위해 사용하는 방법 이다.

먼저 [fiddler](https://www.telerik.com/fiddler)를 다운로드 받는다. 설치후에 피들러를 기동


![fiddler UI1](https://sejoung.github.io/images/2018_07_50_01.jpg){: width="100%"}{: .center}

위에 처럼 Tool -> fiddler option 선택


![fiddler UI2](https://sejoung.github.io/images/2018_07_50_02.jpg){: width="100%"}{: .center}

위에 처럼 화면에 팝업이 등장 connents 선택 

Allow remote computers to connect 체크박스 선택 아래 메시지 등장

```
Enabling Remote Access

WARNING: This option allows remote clients to 'bounce' traffic through your PC's network connection.

Fiddler must be restarted for this change to take effect.

You may see a prompt from your Firewall requesting permission to Allow Remote Access after restarting Fiddler. If you do not, you may need to reconfigure your firewall manually.

```

확인후 재기동

그런 다음 원도우 cmd 창에서 ipconfig에 ip를 알아 둔다.

그러면 폰으로 

```

1.환경설정
2.Wi-Fi
3.연결된 AP를 꾸~욱 누르고 있습니다.
4.네트워크 수정 
5.최하단 고급옵션표시 체크
6.프록시 설정을 수동
7.프록시 호스트 이름(위에서 알아 본 내컴퓨터 ip)/프록시 포트 입력(피들러에서 설정한 포트번호 기본:8888)

```

이렇게 되면 피들러로 스마트 디바이스에서 올라오는 모든 네트워크 요청을 확인 할수 있다.

# 참조 
-----
* [fiddler](https://www.telerik.com/fiddler)
