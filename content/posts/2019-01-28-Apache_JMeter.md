---
layout: post
title: "Apache JMeter로 부하테스트 하기"
date: 2019-01-28 16:27 +0900
comments: true
tags : ["Apache JMeter"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### Apache JMeter로 부하테스트 하기

![UI1](https://sejoung.github.io/images/2019_01_28_01.jpg)

위에 제이미터 사이트에서 다운로드를 합니다.

![UI2](https://sejoung.github.io/images/2019_01_28_02.jpg)


파일 압축을 풀고 폴더에 들어가서 jmeter.bat를 실행합니다.

![UI3](https://sejoung.github.io/images/2019_01_28_03.jpg)

그럼 실행이 되는데 전 tps 그래프가 보고 싶으니 플러그인을 깔겠습니다

![UI4](https://sejoung.github.io/images/2019_01_28_04.jpg)

위에 사이트에서 다운로드를 받고

![UI5](https://sejoung.github.io/images/2019_01_28_05.jpg)

lib/ext 폴더에 넣어 준다 다시 실행하면

![UI6](https://sejoung.github.io/images/2019_01_28_06.jpg)

Options 에 들어가 보면 플러그인 매니저가 생겼다.

![UI7](https://sejoung.github.io/images/2019_01_28_07.jpg)

간단 하게 httpbin을 통해서 get 메소드를 처리 해보겠다.

![UI8](https://sejoung.github.io/images/2019_01_28_08.jpg)

선택 후 화면을 보면 

![UI9](https://sejoung.github.io/images/2019_01_28_09.jpg)

위에서 쓰레드 갯수를 선택하고 

![UI10](https://sejoung.github.io/images/2019_01_28_10.jpg)

그다음에는 http로 테스트를 할꺼니 선택

![UI11](https://sejoung.github.io/images/2019_01_28_11.jpg)

도메인 및 정보를 넣고 전 http://httpbin.org/ip로 테스트 할것이라서 입력함

![UI12](https://sejoung.github.io/images/2019_01_28_12.jpg)

위에서 헤더정보를 받고 있다.

![UI13](https://sejoung.github.io/images/2019_01_28_13.jpg)

헤더 정보 입력

![UI14](https://sejoung.github.io/images/2019_01_28_14.jpg)

tps 그래프로 보고 싶으니 

![UI15](https://sejoung.github.io/images/2019_01_28_15.jpg)

그럼 아래창이 됨 선택 다되면 테스트
 
![UI16](https://sejoung.github.io/images/2019_01_28_16.jpg)


# 참조
-----
* [Apache JMeter](http://jmeter.apache.org/)
* [jmeter-plugins Install](https://jmeter-plugins.org/install/Install/)
* [httpbin](http://httpbin.org/)


