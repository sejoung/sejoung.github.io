---
layout: post
title: "응집도_(procedural cohesion)"
date: 2018-05-21 15:42:00 +0900
comments: true
tags : ["응집도"]
categories : ["study"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### 응집도 (cohesion)

#### 절차적 응집도 (procedural)

절차 적 응집은 모듈의 일부가 특정 실행 순서 (예 : 파일 사용 권한을 확인한 다음 파일을 여는 기능)를 따르기 때문에 그룹화되는 경우입니다.


```java


    public void login()  {
		
        if(isLogin()) duplicationLogin();
        else{ 
            User user = newLogin();
            // 여기 아래 두줄이 절차적 응집
            userCookie(user);
            userData(user);
        }
	}


```

