---
layout: post
title: "jbpm rest api 파라미터 전달"
date: 2016-08-09 14:06:00 +0900
comments: false
---

jbpm rest api 호출시 파라미터 전달 방법

파라미터는 키벨류 형식으로 전달하는데 앞에 map_ 를 붙혀서 map_key=value 형태로 전달 되며

프로세스에서 변수를 total로 정했을때 map_total=5000 처럼 전달한다.

jbpm 문서 17.1.1.3.에 위에 내용을 나타내고 있다. 
