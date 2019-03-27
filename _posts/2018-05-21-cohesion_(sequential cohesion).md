---
layout: post
title: "응집도_(sequential cohesion)"
date: 2018-05-21 16:34:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 응집도 (cohesion)

#### 실행순서 응집도 (sequential)

한 부분의 출력이 조립 라인과 같은 다른 부분의 입력 (예 : 파일에서 데이터를 읽고 데이터를 처리하는 기능)이기 때문에 모듈의 일부가 그룹화되는 경우입니다. 
일반적으로 커플 링이 좋으며 쉽게 유지 관리됩니다. 일반적으로 유용하지 않은 활동 때문에 쉽게 재사용 할 수 없습니다. 

위에 내용은 절차적에서 설명했던부분에 예제로 아래 의 예제의 처음 두줄에 관한 내용입니다.

isLogin()과 duplicationLogin() 그리고 newLogin()의 응집은 실행순서 응집입니다.

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

