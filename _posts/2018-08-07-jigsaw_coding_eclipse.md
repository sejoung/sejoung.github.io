---
layout: post
title: "이클립스에서 jigsaw 코딩하기"
date: 2018-08-07 10:20:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 이클립스에서 jigsaw 코딩하기

[이클립스 직쏘코딩 준비하기](https://sejoung.github.io/2018/08/jigsaw_eclipse)이 포스트를 따라하면 준비는 끝

그럼 자바 프로젝트 생성

![jigsaw UI1](https://sejoung.github.io/images/2018_08_07_01.jpg){: width="100%"}{: .center}

프로젝트명 입력하고

![jigsaw UI2](https://sejoung.github.io/images/2018_08_07_02.jpg){: width="100%"}{: .center}

아래 보면 create module-info.java file에 체크되어 있음 모듈프로그램에 기본인 module-info 생성

![jigsaw UI3](https://sejoung.github.io/images/2018_08_07_03.jpg){: width="100%"}{: .center}

모듈명 입력

![jigsaw UI4](https://sejoung.github.io/images/2018_08_07_04.jpg){: width="100%"}{: .center}

모듈 info가 생겼습니다.

![jigsaw UI5](https://sejoung.github.io/images/2018_08_07_05.jpg){: width="100%"}{: .center}


일단 그럼 두번째 second 프로젝트 생성시키고

module-info.java 에 

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

![jigsaw UI6](https://sejoung.github.io/images/2018_08_07_06.jpg){: width="100%"}{: .center}

아래 메뉴 클릭

![jigsaw UI7](https://sejoung.github.io/images/2018_08_07_07.jpg){: width="100%"}{: .center}

못보던 module path 생김 add 버튼 클릭

![jigsaw UI8](https://sejoung.github.io/images/2018_08_07_08.jpg){: width="100%"}{: .center}

second 프로젝트 체크박스 선택

![jigsaw UI9](https://sejoung.github.io/images/2018_08_07_09.jpg){: width="100%"}{: .center}

module path에 추가 완료 됨 에러가 사라짐

![jigsaw UI10](https://sejoung.github.io/images/2018_08_07_10.jpg){: width="100%"}{: .center}

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

zolla

```

저는 인텔리제이와 지금 이클립스를 통해서 기본 적인 직쏘 코딩을 해봄

인텔리제이의 기본적인 사상인 프로젝트 단위에 개발에 대해서 저는 약깐의 불편함을 느낄때가 많이 있다.

먼저 maven에 예를 들면 maven에서도 모듈단위에 코딩이 가능한데 전체 기능을 봐야 되는경우 여러 프로젝트들의 의존 관계 때문에 
저는 멀티프로젝트 환경이 더 좋게 느껴질때가 많이 있다.

이번 모듈단위에 코딩에서도 모듈단위를 프로젝트로 빼서 코딩을 하면서 전체적인 그림을 봐야 되는것은 이클립스가 좀더 나을수도 있지 않나 생각이 듬

물론 단위모듈만 코딩하는데에서는 모듈만 바라보고 하는 인텔리제이가 좀더 나을수있겠지만 그냥 난 전반적인것을 봐야 될때 답답한 마음이 생김

물론 인텔리제이는 정말 좋은 IDE이다.

위에 예제 코드는 [Java9ModuleProgramming](https://github.com/sejoung/Java9ModuleProgramming) 올려놓음

아 이클립스 버전은 photon을 사용해서 해봄


# 참조 
-----
* [Java9/Examples](https://wiki.eclipse.org/Java9/Examples)
* [Java9ModuleProgramming](https://github.com/sejoung/Java9ModuleProgramming)

