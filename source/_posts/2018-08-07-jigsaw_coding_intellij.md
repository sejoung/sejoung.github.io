---
layout: post
title: "인텔리제이에서 jigsaw 코딩하기"
date: 2018-08-07 11:46:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 인텔리제이에서 jigsaw 코딩하기

인텔리제이에서는 일단 이클립스처럼 사전작업? 이런것은 할것이 없다. 물론 JDK는 9버전 이상으로 되야 된다.

먼저 프로젝트 생성후에 모듈 클릭

![jigsaw UI11](https://sejoung.github.io/images/2018_08_07_11.jpg)

next

![jigsaw UI12](https://sejoung.github.io/images/2018_08_07_12.jpg)

모듈명 입력 이클립스랑 똑같이 고고

![jigsaw UI13](https://sejoung.github.io/images/2018_08_07_13.jpg)

module-info.java 가 생김

![jigsaw UI14](https://sejoung.github.io/images/2018_08_07_14.jpg)

그럼 다시 2번째 모듈인 second를 생성


```java

/**
 * @author kim se joung
 *
 */
module second {
	exports second;
}

```


그담에 second 패키지 생성후 아래의 코드를 작성함

```java

/**
 * @author kim se joung
 *
 */
package second;

public class User {
	private String name = "zolla";

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}


```

그담에 first 프로젝트에 module-info.java 에 의존성 추가

```java

/**
 * @author kim se joung
 *
 */
module first {
	requires second;
}

```

아래처럼 에러가남 

![jigsaw UI15](https://sejoung.github.io/images/2018_08_07_15.jpg)

그럼 아래의 메뉴에 프로젝트 스트럭쳐 클릭

![jigsaw UI16](https://sejoung.github.io/images/2018_08_07_16.jpg)

그다음에 전 first에 의존성을 추가할꺼니 

![jigsaw UI17](https://sejoung.github.io/images/2018_08_07_17.jpg)

모듈 디펜던시 클릭

![jigsaw UI18](https://sejoung.github.io/images/2018_08_07_18.jpg)

난 second가 필요하니 클릭

![jigsaw UI19](https://sejoung.github.io/images/2018_08_07_19.jpg)

그럼 아래처럼 메뉴가 나온다

![jigsaw UI20](https://sejoung.github.io/images/2018_08_07_20.jpg)

이렇게 되면 에러가 사라지고 다시 이클립스에서 했던것 처럼

나머지 코드는 first 프로젝트에 first 패키지에 아래 코드 생성후 테스트

```java

/**
 * @author kim se joung
 *
 */
package first;

import second.User;

public class Test {

	public static void main(String[] args) {
		User zolla = new User();
		System.out.println(zolla.getName());
	}

}


```
터미널에 아래처럼 찍힘

```

"C:\Program Files\Java\jdk-10.0.2\bin\java.exe" "-javaagent:C:\Program Files\JetBrains\IntelliJ IDEA 2018.1.2\lib\idea_rt.jar=7607:C:\Program Files\JetBrains\IntelliJ IDEA 2018.1.2\bin" -Dfile.encoding=UTF-8 -p D:\jigsaw\IDEA\out\production\first;D:\jigsaw\IDEA\out\production\second -m first/first.Test
zolla

Process finished with exit code 0


```

인텔리제이는 명시적으로 실행 명령어를 보여줘서 좋다고 생각함

그럼 끝

# 참조 
-----
* [Java9ModuleProgramming](https://github.com/sejoung/Java9ModuleProgramming)

