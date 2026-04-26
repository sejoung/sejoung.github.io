---
layout: post
title: "PermGen Elimination project is promoting"
date: 2019-05-13 09:51 +0900
comments: true
tags : ["PermGen","jdk 8","Metaspace"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## PermGen 제거 프로젝트 추진 중

우리는 
이번 주 JDK8로 perm gen 삭제 변경 으로 핫스팟을 홍보하기를 기대하고있다. 
핫스팟으로의 초기 통합을위한 마지막 webrev는 http://cr.openjdk.java.net/~coleenp/metadata8/입니다. 
기본적으로 이는 핫스팟의 클래스 메타 데이터 표현을위한 영구 메모리 생성 및 원시 메모리 사용 입니다. 
일반적으로이 변경 사항은 Java 응용 프로그램에서 볼 수 없습니다. 
그러나 할당 동작 에 따라 더 많은 Java 힙을 사용할 수 있습니다. 
또한 클래스 메타 데이터에 사용 된 원시 메모리 의 양은 영구 생성 
에 의해 이전에 사용 된 메모리보다 작거나 클 수 있습니다. 

기본적으로 메시지는 당신은 차이점을 보지 말아야하지만 다시는 차이를보아야합니다. 

이 변화는 hsx 25 b2이며 jdk8 b58 로 승격 될 것으로 예상됩니다 . 

이것들은 몇 가지 세부 사항입니다. 

영구 생성에서 이전에 수행 된 클래스 메타 데이터에 대한 대부분의 할당 은 이제 기본 메모리에서 할당 됩니다. 
기타 데이터가 Java 힙으로 이동되었습니다. 

영구 세대(PermGen)가 제거되었습니다. 
PermSize와를 MaxPermSize는 무시되고 경고가되어 
그들이 명령 행에있는 경우 발표했다. 

클래스 메타 데이터 를 설명하는 데 사용 된 klks 가 제거되었습니다 (klassKlass 및 파생 클래스 ).

기본적으로 클래스 메타 데이터 할당은 사용 가능한 원시 메모리의 양에 의해서만 제한 됩니다. 
MaxMetaspaceSize 플래그 를 사용 하여 클래스 메타 데이터에 사용되는 기본 메모리 양을 제한하십시오. 
MaxPermSize와 유사합니다. 

64 비트 VM에서 압축 된 oops가 사용되는 경우 객체의 헤더에 
압축 된 클래스 포인터 를 설정하는 클래스에 특수 고정 크기 공간이 사용됩니다. 
클래스 공간 의 크기는 ClassMetaspaceSize 플래그에 의해 
기본값 2Mbyte로 제어됩니다 . 

가비지 수집은 불필요한 클래스 로더 및 클래스 를 수집하도록 유도 될 수 있습니다 . 
클래스 메타 데이터 사용량이 도달하면 첫 번째 가비지 수집 이 유도됩니다.
MetaspaceSize (32 비트 클라이언트 VM에서는 12MB, 64 비트 VM에서는 32 비트 서버 VM에서 16MB ). 
유도 된 가비지 콜렉션 을 지연 시키려면 MetaspaceSize를 높은 값으로 설정하십시오. 
유도 된 가비지 콜렉션 후에 다음 가비지 콜렉션 을 유도하는 데 필요한 클래스 메타 데이터 사용 이 증가 될 수 있습니다. 

영구 생성없이 클래스 메타 데이터가 이전에 가비지 수집 된 반면, 클래스 메타 데이터에 대한 저장소 
는 명시 적으로 관리됩니다. C 힙 할당은 사용되지 않습니다. 

메타 데이터 할당에 대한 jstat 카운터 이름 이 업데이트되지 않았습니다. 
오래된 영구 세대 이름 가까운 장래에 업데이트 될 예정입니다.

# 참조
-----
* [PermGen Elimination project is promoting](http://mail.openjdk.java.net/pipermail/hotspot-dev/2012-September/006679.html)


