---
layout: post
title: "오드로이드 고"
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

아래의 메시지는 전원을 안켜서 나옴 전원을 꼭 키고 해야 됨

```
C:\Users\sjkim3\Downloads\odroid-go-firmware-20181001\tools\esp32img>esptool.py write_flash 0 odroid-go-firmware-20181001.img
esptool.py v2.5.1-dev
Found 1 serial ports
Serial port COM3
Connecting........_____....._____....._____....._____....._____....._____....._____
COM3 failed to connect: Failed to connect to Espressif device: Timed out waiting for packet header

A fatal error occurred: All of the 1 available serial ports could not connect to a Espressif device.

```

정상 메시지

```

C:\Users\sjkim3\Downloads\odroid-go-firmware-20181001\tools\esp32img>esptool.py write_flash 0 odroid-go-firmware-20181001.img
esptool.py v2.5.1-dev
Found 1 serial ports
Serial port COM3
Connecting....
Detecting chip type... ESP32
Chip is ESP32D0WDQ5 (revision 1)
Features: WiFi, BT, Dual Core, 240MHz, VRef calibration in efuse
MAC: 30:ae:a4:c3:e4:38
Uploading stub...
Running stub...
Stub running...
Configuring flash size...
Auto-detected Flash size: 16MB
Compressed 301920 bytes to 146523...
Wrote 301920 bytes (146523 compressed) at 0x00000000 in 13.0 seconds (effective 185.8 kbit/s)...
Hash of data verified.

Leaving...
Hard resetting via RTS pin...

```

# 참조 
-----
* [wiki.odroid firmware_update](https://wiki.odroid.com/odroid_go/firmware_update)
* [odroid-go-firmware github](https://github.com/OtherCrashOverride/odroid-go-firmware)
* [go-play github](https://github.com/OtherCrashOverride/go-play)
* [pyserial github](https://github.com/pyserial/pyserial)