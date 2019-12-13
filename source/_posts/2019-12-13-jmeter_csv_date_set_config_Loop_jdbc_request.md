---
layout: post
title: "jmeter를 활용한 sql 평균 실행시간 체크"
date: 2019-12-13 15:20 +0900
comments: true
tags : ["성능테스트","jmeter","sql 평균 실행시간 체크"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## jmeter를 활용한 sql 평균 실행시간 체크


### CSV Data Set Config


![UI1](https://sejoung.github.io/images/2019_12_13_01.png)

![UI2](https://sejoung.github.io/images/2019_12_13_02.png)

위에 설정에서 중요한 부분을 설명하면 

* Variable Name: 여기서 사용할 변수명을 입력해주면 된다. 위에 csv 파일은 3가지가 있으니 pid,username,count 로 설정함
* Recycle on EOF: JMeter가 파일의 끝에 도달 할 때 true로 설정되면 시작으로 이동하여 CSV 파일을 반복합니다.
* Stop Thread on EOF: JMeter가 파일 끝에 도달하면 스레드가 실행을 중지합니다. 
루프에서 20 번의 반복과 10 줄의 데이터가있는 경우 JMeter는 10 번째 요청에서 실행을 중지합니다. 따라서 반복 번호를 무시합니다.
* Sharing Mode: 구성에 따라 다른 스레드 그룹에서 CSV 파일을 사용할 수 있는지 여부를 결정합니다.


### JDBC Connection Configuration

그럼 위에 설정을 기준으로 보면 저는 JDBC를 사용하여 쿼리를 날릴 예정이라 JDBC Connection Configuration 설정을 함

JDBC를 사용할 예정이니 JDBC 드라이버를 다운 받아서 lib 폴더에 넣어주셔야 됩니다. 


![UI3](https://sejoung.github.io/images/2019_12_13_03.png)

![UI4](https://sejoung.github.io/images/2019_12_13_04.png)

### 구성

그러면 구성은 전 아래처럼 했습니다.

![UI5](https://sejoung.github.io/images/2019_12_13_05.png)

Loop Controller 에서 무한으로 설정하고 

![UI6](https://sejoung.github.io/images/2019_12_13_06.png)

CSV Data Set Config 설정에서 Stop Thread on EOF true 로 설정하여 csv 파일 내용만큼만 loop 를 돌게 하려고 설정했습니다.

### JDBC Request

위에 JDBC Connection Configuration 을 설정할때 설정했던 conettion properties 이름을 아래에 적어준다 ex) oracle

![UI6](https://sejoung.github.io/images/2019_12_13_07.png)



# 참조
-----
* [How to Work With CSV Files in JMeter](https://dzone.com/articles/how-to-work-with-csv-files-in-jmeter)

