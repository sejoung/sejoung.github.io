---
layout: post
title: "java9_module_programming"
date: 2018-08-05 13:00:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### Java9 모듈 프로그래밍(유동환) - 비긴 메이트

#### 기본작업 

jdk 10 

```

brew install gradle

gradle wrapper --gradle-version 4.9 --distribution-type all

```

gradle을 잘 사용 안했는데 예제가 이걸로 되 있음 포크한 후에 설정 파일들 커밋 되어 있길래 다 삭제함 


#### 환영사

도착 후 샌드위치 전달 받음 커피는 100잔만 준비되어 먹지 못함

B 스티커가 있어서 비트코인인줄 알고 가지고 왔는데 비긴 메이트 ㅜㅜ

13시 30분에 되어서 비긴메이트 대표의 소개사 정윤석


#### 세미나 시작 project jigsaw

카톡 오픈채팅방 java9 모듈 프로그래밍

자바 버전별로 히스토리 설명

언어의 모듈화 -> java9 관련해서 책은 잘 찾아 보기 힘듬

순환 참조를 다 끊어냈다.

simple-project 하다가 안되서 삽질 함 ㅋㅋㅋ

왜 인텔리제이가 더 편하게 적용했다는지 알겠음

gradle에서 build를 하면 에러가 남 이부분은 ide에서 제공해주는 module위치가 

gradle에서 인식하는데와 틀려서 그렇다는데 이부분은 좀더 찾아 봐야겠음

모듈서비스도 잼있네요 구현체가 없어도 에러가 안나는게 신기함

module resolution로 불필요한 모듈은 제거가능 custom jdk를 만들수 있음

```

jlink [options] —module-path modulepath —add-modules module [,module…]

```

# 참조 
-----
* [Java9ModuleProgramming 예제](https://github.com/sejoung/Java9ModuleProgramming)
* [gradle/issues](https://github.com/gradle/gradle/issues/4503)