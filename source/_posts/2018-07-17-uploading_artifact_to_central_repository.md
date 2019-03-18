---
layout: post
title: "메이븐 중앙 저장소에 업로드 하기"
date: 2018-07-17 11:55:00 +0900
comments: true
tags : ["maven","maven upload"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### 메이븐 중앙 저장소에 업로드 하기

예전에 중앙 저장소에 하나의 라이브러리는 배포한적이 있다. 

그래서 다시 따라하는 도중 막혀서 삽질 후에 다시 정리중이다.

첫번째는 [메이븐 중앙 저장소에 아티팩트 업로딩](https://www.lesstif.com/pages/viewpage.action?pageId=30277671) 이 링크에 잘 정리가 되어 있다.

하지만 처음 사용자를 위한 방법이다. 키 생성부분인데 여기서 막혀서 삽질을 엄청 했다. pgp에 대해서 깊게 공부해야 될꺼 같다.

일단 기존 발급한 키로는 임포트후에 시크릿 키가 생성 되지 않아서 시크릿키 에러가 난다. 
``` 

gpg: no default secret key: No secret key
gpg: signing failed: No secret key

```
여기서 부터 삽질에 시작임 그래서 키를 다시 생성 시켰더니 아래의 에러가 나기 시작함

``` 
[ERROR] Rule failure while trying to close staging repository with ID "comgithubsejoung-1013".
[ERROR]
[ERROR] Nexus Staging Rules Failure Report
[ERROR] ==================================
[ERROR]
[ERROR] Repository "comgithubsejoung-1013" failures
[ERROR]   Rule "signature-staging" failures
[ERROR]     * No public key: Key with id: (cc8b9e31f89ec675) was not able to be located on &lt;a href=http://keys.gnupg.net:11371/&gt;http://keys.gnupg.net:11371/&lt;/a&gt;. Upload your public key and try the operation again.
[ERROR]     * No public key: Key with id: (cc8b9e31f89ec675) was not able to be located on &lt;a href=http://pool.sks-keyservers.net:11371/&gt;http://pool.sks-keyservers.net:11371/&lt;/a&gt;. Upload your public key and try the operation again.
[ERROR]     * No public key: Key with id: (cc8b9e31f89ec675) was not able to be located on &lt;a href=http://keyserver.ubuntu.com:11371/&gt;http://keyserver.ubuntu.com:11371/&lt;/a&gt;. Upload your public key and try the operation again.
[ERROR]     * No public key: Key with id: (cc8b9e31f89ec675) was not able to be located on &lt;a href=http://keys.gnupg.net:11371/&gt;http://keys.gnupg.net:11371/&lt;/a&gt;. Upload your public key and try the operation again.
[ERROR]     * No public key: Key with id: (cc8b9e31f89ec675) was not able to be located on &lt;a href=http://pool.sks-keyservers.net:11371/&gt;http://pool.sks-keyservers.net:11371/&lt;/a&gt;. Upload your public key and try the operation again.
[ERROR]     * No public key: Key with id: (cc8b9e31f89ec675) was not able to be located on &lt;a href=http://keyserver.ubuntu.com:11371/&gt;http://keyserver.ubuntu.com:11371/&lt;/a&gt;. Upload your public key and try the operation again.
[ERROR]     * No public key: Key with id: (cc8b9e31f89ec675) was not able to be located on &lt;a href=http://keys.gnupg.net:11371/&gt;http://keys.gnupg.net:11371/&lt;/a&gt;. Upload your public key and try the operation again.
[ERROR]     * No public key: Key with id: (cc8b9e31f89ec675) was not able to be located on &lt;a href=http://pool.sks-keyservers.net:11371/&gt;http://pool.sks-keyservers.net:11371/&lt;/a&gt;. Upload your public key and try the operation again.
[ERROR]     * No public key: Key with id: (cc8b9e31f89ec675) was not able to be located on &lt;a href=http://keyserver.ubuntu.com:11371/&gt;http://keyserver.ubuntu.com:11371/&lt;/a&gt;. Upload your public key and try the operation again.
[ERROR]     * No public key: Key with id: (cc8b9e31f89ec675) was not able to be located on &lt;a href=http://keys.gnupg.net:11371/&gt;http://keys.gnupg.net:11371/&lt;/a&gt;. Upload your public key and try the operation again.
[ERROR]     * No public key: Key with id: (cc8b9e31f89ec675) was not able to be located on &lt;a href=http://pool.sks-keyservers.net:11371/&gt;http://pool.sks-keyservers.net:11371/&lt;/a&gt;. Upload your public key and try the operation again.
[ERROR]     * No public key: Key with id: (cc8b9e31f89ec675) was not able to be located on &lt;a href=http://keyserver.ubuntu.com:11371/&gt;http://keyserver.ubuntu.com:11371/&lt;/a&gt;. Upload your public key and try the operation again.
[ERROR]
[ERROR]
[ERROR] Cleaning up local stage directory after a Rule failure during close of staging repositories: [comgithubsejoung-1013]
[ERROR]  * Deleting context 47fc7f6b9d80d6.properties
[ERROR] Cleaning up remote stage repositories after a Rule failure during close of staging repositories: [comgithubsejoung-1013]
[ERROR]  * Dropping failed staging repository with ID "comgithubsejoung-1013" (Rule failure during close of staging repositories: [comgithubsejoung-1013]).

```

여기서 여러가지 삽질을 했는데 위에 링크에 나와 있는 등록사이트 [pgp.mit.edu](http://pgp.mit.edu/) 
여기서 등록을 계속해도 해당에러가 나왔다.

여기서 검색을 해보면 등록된 키가 하나 밖에 나오질 않았다. 그래서 다시 windows 용 gpg 툴에 서버에 업로드 기능을 실행 시켰더니 
업로드 완료라고 표시가 되었다.

그래도 다시 검색을 해보면 등록 되지 않았다. 인터넷을 검색하니 다른 등록사이트가 나왔는데 [PGP Public Key Server](https://pgp.key-server.io)에 
키를 등록하니 정상 표시가 되고 해당 에러 없이 업로드 완료가 되었다.

삽질을 3시간 정도 한것 같다. ㅜㅜ


아 그리고 배포는 먼저 SNAPSHOP을 등록 후에 릴리스 서버에 배포가 가능하다.

--------------------------

위에 문제 사항이 키를 만들때 id랑 이메일까지 똑같으니 서버에 등록이 되지 않았다. 아이디 바꾸고 다시 만듬





# 참조 
-----
* [메이븐 중앙 저장소에 아티팩트 업로딩](https://www.lesstif.com/pages/viewpage.action?pageId=30277671)
* [Working with PGP Signatures](https://central.sonatype.org/pages/working-with-pgp-signatures.html)
* [PGP Public Key Server](https://pgp.key-server.io)