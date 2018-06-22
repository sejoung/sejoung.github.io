---
layout: post
title: "cohesion_(coincidental cohesion)"
date: 2018-05-08 15:38:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 응집도 (cohesion)

응집도란 결합도와 대조적인 관계로 높은 응집력은 낮은 결합도와 상호 관련이 있다.

회사 코드를 보면서 응집도에 대해 설명할수 있는 코드가 나오면 하나씩 해보려고 한다.

#### 우연히 (Coincidental)

우연히 응집했다는것은 응집도 타입에 최악의 경우이다.

아래의 코드로 설명을 하겠다. 아래는 광고 배너를 송출 하는 서블릿인데 

그 서블릿안에 아래와 같은 메소드들이 우연히 응집되 있다.

parseIwh, adjustTypes, requestCrawling

 ```java
 
 public class AdBanner extends HttpServlet {
	private ImageSize parseIwh(String sIwh) {
        ...
	} // parseIwh()

	private String adjustTypes(String sTypes, String sDefault) {
        ...
	} // adjustTypes()
	
	private void requestCrawling(String mediaReferer, String sKeyword) {
        ...
	}
}

```

심지어 requestCrawling 같은 메소드가 여러군데 생성되 있었다. 

코드 수정 필요

