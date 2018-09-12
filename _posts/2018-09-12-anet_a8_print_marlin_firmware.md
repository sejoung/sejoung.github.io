---
layout: post
title: "anet_a8_print_marlin_firmware"
date: 2018-09-12 11:35 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### anet a8 print marlin firmware 업데이트

A8 프린터에 펌웨어 업데이트를 했습니다. 

업데이트 환경은 windows 10에서 했으면 arduino IDE 버전은 1.8.6을 사용했습니다.

펌웨어 업데이트를 위해서 arduinoIDE를 다운 받으시면 됩니다.[arduino ide download](https://www.arduino.cc/en/Main/Software)

전 window 스토어에서 검색을 해서 다운로드 했습니다.

다운 받고 설치를 하시고 두번째는 arduino에 board를 인식시켜야 됩니다. 그러기 위해서 [SkyNet3D/anet-board](https://github.com/SkyNet3D/anet-board) 다운로드 하시고

Windows:
```
DocumentsWindows 탐색기에서 폴더 열기
Arduino폴더를 연 다음 hardware하위 폴더를 엽니 다 . 이러한 폴더가 없으면 폴더를 만듭니다.
2 단계에서 다운로드 한 anet-board zip 파일을 열고 'anet'폴더를 Documents\Arduino\hardware
```
OS X:
```
Finder에서 "Documents"를 클릭하고 그 Arduino안에 있는 디렉토리를 찾으 십시오. 전체 경로는입니다.~/Documents/Arduino/hardware
2 단계에서 다운로드 한 anet-board zip 파일을 열고 'anet'폴더를 ~/Documents/Arduino/hardware
```


```
Arduino IDE 열기
Tools-> Board 메뉴를 열고 Anet V1.0 보드 중 하나를 선택하십시오.
도구 -> 포트 메뉴를 열고 적합한 COM 포트 (USB 포트에 프린터를 연결했을 때 나타나는 COM 포트)를 선택하십시오.
참고 : Optiboot 보드 옵션은 Optiboot 부트 로더가 표준 Atmega 1284p 부트 로더보다 훨씬 적은 공간을 사용하므로 펌웨어를위한 더 많은 플래시 공간을 허용하므로 적극 권장됩니다. Optiboot 옵션을 사용하기로 결정했다면, 반드시 펌웨어를 업로드하기 전에 Optiboot 부트 로더를 구워야합니다. 그렇지 않으면 부트 로더를 덮어 쓸 위험이 있습니다.

펌웨어를 업로드 할 때 실제로 Arduino 프로그래머를 사용하고 있고 무엇을하고 있는지 알지 못하는 한 Sketch-> Upload Using Programmer가 아닌 USB 연결을 통해 업로드하는 Sketch-> Upload (Ctrl + U)를 사용하십시오.

```

```

말린 (Arduino) 설치
이 기사를 읽기 전에, 당신은 이미 말린 설치 하기를 읽고 말린 소스 코드를 다운로드해야합니다. 아직이 단계를 수행하지 않았다면 한 걸음 뒤로 물어보고이 페이지로 돌아 가기 링크를 따라 과정을 계속하십시오.

Arduino IDE 설치
다른 작업을하기 전에 Arduino 웹 사이트 에서 Arduino IDE를 다운로드하고 OS에 맞는 일반적인 절차에 따라 설치하십시오. Marlin은 Linux, Windows, macOS 및 Unix에서 컴파일 할 수 있습니다.

Arduino IDE는 Marlin 2.0에 포함 된 ARM 기반 보드 용으로 빌드 할 수 없습니다. 참조 마린 (재 ARM)을 설치 또는 말린 (PlatformIO)를 설치 PlatformIO와 말린 구축에 대한 지침.

프린터에는 비표준 Arduino 코어 (예 : Sanguino , Teensy ++ ) 또는 추가 라이브러리 가 필요할 수 있습니다 . 참조 구성 마린 과 논평을 Configuration.h/ Configuration_adv.h하드웨어 및 추가 기능에 관한. 각 기능은 관련 리소스에 대한 링크를 제공합니다.

예비
Marlin.ino파일을 두 번 클릭하여 Arduino IDE에서 엽니 다.

Arduino IDE의 Tools> Boards 메뉴 에서 보드를 선택하십시오 .

Tools> Serial Port 메뉴 에서 보드가 연결된 직렬 (USB) 포트를 선택하십시오 .

검증 / 컴파일
구성 오류를 테스트하려면 창 상단의 확인 / 컴파일 단추를 클릭 하십시오 . (말린은 일반적인 오류와 오래된 설정에 대한 몇 가지 테스트를 포함합니다.)
모든 오류가 수정되면 업로드 버튼 을 클릭하여 업로드를 진행하십시오 .
Marlin이 너무 많은 프로그램 메모리 또는 SRAM을 필요로하여 보드에 장착 할 수없는 경우, 공간을 회수하기 위해 기능을 비활성화하십시오. 다음으로 2.0 코드베이스를 시험해보십시오. 그런 다음 필요한 경우 1.0.2-2 또는 1.0.1 과 같은 이전 버전을 사용해보십시오 . (Marlin의 이전 버전은 SRAM을 덜 사용합니다.)

업로드
위에 설명한 준비 단계 1-3을 따릅니다 .
보드에 필요한 경우 "프로그램 모드"를 설정하십시오. (대부분은 그렇지 않습니다.)
게시판을 플래시 하려면 업로드 를 클릭하십시오 . 업로드 중에 보드의 컬러 LED가 빠르게 깜박입니다.
그게 다야! 말린을 설치하면 부드러운 부드러운 인쇄를 즐길 수 있습니다!

```

컴파일 검증을 하니 아래 에러가 납니다. 

```
error "Oops!  Make sure you have 'Arduino Mega' selected from the 'Tools -> Boards' menu.
```

그럼 다운 받은 소스폴더에 가서 보면 example_configurations이라는 폴더가 있습니다. 여기서 자신에 프린터에 맞는 Configuration.h 와 Configuration_adv.h를 찾아서 메인 폴더로 먼저 옴겨야 됩니다.

다시 또 아래의 에러가 납니다.

```
pasting "/* SPI Master In Slave Out pin*/" and "_DDR" does not give a valid preprocessing token a8
```

이것은 펌웨어에 이슈로 등록 되 있는 내용 입니다. 이슈는 링크를 찾아들어가시면 됩니다 [cant compile marlin 1.1.9](https://github.com/MarlinFirmware/Marlin/issues/11751)
 
 ```
 일부 Arduino 및 일부 PlatformIO 환경에서 사용하는 C 사전 처리기의 버그입니다. 그냥 주석을 제거하면 ( //앞으로) 주석 이 컴파일되고 작동합니다.
 ```
위에 Arduino 버전 문제인거 같습니다. 주석들을 제거 하고 컴파일 하니 문제가 없습니다.

다시 업데이트 할수도 있어서 텍스트로 기록 합니다.

# 참조 
-----
* [marlinfw homepage install](http://marlinfw.org/docs/basics/install.html)
* [SkyNet3D/anet-board](https://github.com/SkyNet3D/anet-board)
* [MarlinFirmware github](https://github.com/MarlinFirmware/Marlin)
* [arduino ide download](https://www.arduino.cc/en/Main/Software)
