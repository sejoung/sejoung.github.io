---
layout: post
title: "3d 프린터 사용하기(anet a8)"
date: 2018-08-22 14:46 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 3d 프린터 사용하기(anet a8)

회사에서 동호회를 하고 있는데 동호회비로 가성비(?) 좋은 3d 프린터를 구입했습니다 그것이 anet사에 A8입니다.

조립이 쉽다고 해서 하는데 저같은 똥손은 조립이 너무 어려운것 같습니다. 동호회원 분들의 도움으로 겨우 조립에 성공해서
오늘 첫프린트물을 실행했습니다. 그런데 샘플로 온 gcode는 딱 중앙에서 출력이 되지 않는것입니다. 
저는 지금까지 싱기버스에서  다운 받아서 그냥 일반 프린터 처럼 뽑으면 되는줄 알았습니다. 하지만 프린터가 출력 되지 않고
x축과 y축이 맞지 않았습니다. 그리고 x축까지 알고 보았는데 레벨링을 해줘야 되는것이 였습니다.

먼저 그럼 첫번째 출력하기 위해서 cura를 깔아야 됩니다. [cura](https://ultimaker.com/en/products/ultimaker-cura-software) 사이트에서 다운로드 받으시면 됩니다.

인스톨후에 실행 시킨후 아래에 절차를 따라서 셋팅 해줘야 됩니다. 

![cura UI1](https://sejoung.github.io/images/2018_08_22_01.jpg)

일단 프린터를 진행하기 위해 프린터를 추가 할려고 합니다. 아래의 이미지를 보시면 setting -> printer -> add printer

![cura UI2](https://sejoung.github.io/images/2018_08_22_02.jpg)

버튼을 누르면 아래의 팝업 창이 나타 납니다.

![cura UI3](https://sejoung.github.io/images/2018_08_22_03.jpg)

거기서 other를 누르면 프린터 목록이 나타 납니다.

![cura UI4](https://sejoung.github.io/images/2018_08_22_04.jpg)

그러면 거기서 prusa i3를 클릭 해서 add printer를 해주시면 됩니다.

![cura UI5](https://sejoung.github.io/images/2018_08_22_05.jpg)

추가 되면 전 싱기버스에서 주사위를 하나 받았습니다. 주사위 파일을 로드 시키기 위해 아래의 이미지 처럼
file -> open file 클릭

![cura UI6](https://sejoung.github.io/images/2018_08_22_06.jpg)

다운 받은 stl 파일 위치로 이동

![cura UI7](https://sejoung.github.io/images/2018_08_22_07.jpg)

로드 하면 아래의 화면이 나타납니다. 왼쪽에 여러가지 옵션을 컨트롤후 prepare 버튼을 누르면 시간이 계산되고 

![cura UI8](https://sejoung.github.io/images/2018_08_22_08.jpg)

아래처럼 파일을 save 할수있는 버튼이 나온다.

![cura UI9](https://sejoung.github.io/images/2018_08_22_09.jpg)

파일을 save 후에 sd카드에 담아서 프린터에서 프린트를 실행하면 프린터가 된다.

![cura UI10](https://sejoung.github.io/images/2018_08_22_10.jpg)



# 참조 
-----
* [Anet 3D printer A8](http://www.anet3d.com/ProductsStd_182.html)
* [thingiverse](https://www.thingiverse.com)
* [cura](https://ultimaker.com/en/products/ultimaker-cura-software)
