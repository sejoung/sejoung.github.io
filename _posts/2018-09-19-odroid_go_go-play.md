---
layout: post
title: "odroid_go_go-play"
date: 2018-09-19 12:23 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 오드로이드 고

에뮬레이터에서 특정 롬 실행시 먹통현상 -> 메뉴버튼을 누르면서 전원을 껐다 킨다.

화면 사이즈 조절 -> 스타트버튼을 누르고 오른쪽 버튼으로 조절 

화면 밝기 조절 -> 스타트버튼을 누르고 위아래 버튼으로 조절

펌웨어 변경 -> B 버튼을 누르면서 전원을 껐다 킨다.


20180915일 펌웨어 부터 .img 파일로 제공함 esptool.py을 사용하는데 파이썬 3 버전을 사용하고 pyserial을 사용함 

파이썬 최신버전을 설치하고 아래의 명령어를 cmd 창에 적음 준비끝

```

pip install pyserial


```

최신 펌웨어 설치는 아래의 명령어로 하면됨

```

esptool.py write_flash 0 odorid-go-firmware-20180915.img

```
# 참조 
-----
* [wiki.odroid firmware_update](https://wiki.odroid.com/odroid_go/firmware_update)
* [odroid-go-firmware github](https://github.com/OtherCrashOverride/odroid-go-firmware)
* [go-play github](https://github.com/OtherCrashOverride/go-play)
* [pyserial github](https://github.com/pyserial/pyserial)