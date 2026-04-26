---
layout: post
title: "fortiClient VPN 시작 프로그램에서 제거 하기"
date: 2020-04-17 12:18 +0900
comments: true
tags : ["맥북 시작 프로그램","fortiClient VPN","시작 프로그램"]
categories : ["mac"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## fortiClient VPN 시작 프로그램에서 제거 하기

```
cd /Library/LaunchAgents/

```

위에 폴더에 접속하면 아래의 파일들이 존재 한다.

```

com.fortinet.forticlient.credential_store.plist
com.fortinet.forticlient.fct_launcher.plist
com.fortinet.forticlient.vpn.vpn_control.plist

```

해당 파일을 열어서 `RunAtLoad` 에 `<true/>`를 `<false/>`로 수정해주면 시작되지 않는다.

```

<key>RunAtLoad</key>
<false/>

```

# 참조 
-----
* [disable_autorun_on_macos_forticlient_56](https://www.reddit.com/r/fortinet/comments/7vunxu/disable_autorun_on_macos_forticlient_56/)


