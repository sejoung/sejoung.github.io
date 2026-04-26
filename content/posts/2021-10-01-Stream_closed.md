---
layout: post
title: "org.yaml.snakeyaml.error.YAMLException: java.io.IOException: Stream closed"
date: 2021-10-01 11:00 +0900
comments: true
tags : ["snakeyaml","Stream closed","postgresql"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
--->
# org.yaml.snakeyaml.error.YAMLException: java.io.IOException: Stream closed


```java
@Getter
@Setter
@ToString
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ErrorMessage {
	private NotFound notFound;

	public static ErrorMessage getInstance() {
		var yaml = new Yaml(new Constructor(ErrorMessage.class));
		try (var inputStream = ClassLoader.getSystemResourceAsStream("error/error.message.yml")) {

			return yaml.load(inputStream);
		} catch (IOException e) {
			throw new UndefinedException("product.error.message.yml 파일을 찾을수 없습니다.", e);
		}
	}

}

```

이렇게 ClassLoader 에서 Stream을 얻어서 사용하고 있었다 이렇게 했을때 test code도 모두 통과 하고 정상적인것 처럼 보였다.

서버에서 실행을 해봤더니 error가 나왔다. 

```
org.yaml.snakeyaml.error.YAMLException: java.io.IOException: Stream closed
```

보니 error/error.message.yml의 스트림을 못연것이 였다. 
멀티모듈을 사용하고 있었고 ClassLoader는 상위 모듈의 위치를 가르키고 있던것이 였다 하위 모듈을 가르키게 하기위에 아래 처럼 로드를 했다.

```java
@Getter
@Setter
@ToString
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ErrorMessage {
	private NotFound notFound;

	public static ErrorMessage getInstance() {
		var yaml = new Yaml(new Constructor(ErrorMessage.class));
		try (var inputStream = ErrorMessage.class.getClassLoader()
			.getResourceAsStream("error/product.error.message.yml")) {

			return yaml.load(inputStream);
		} catch (IOException e) {
			throw new UndefinedException("product.error.message.yml 파일을 찾을수 없습니다.", e);
		}
	}
}
```

# 참고자료

-----
