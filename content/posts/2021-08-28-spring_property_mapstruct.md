---
layout: post
title: "mapstruct에서 프로퍼티 값을 로드해서 맵핑하기"
date: 2021-08-28 10:02 +0900
comments: true
tags : ["mapstruct spring","mapstruct","@Value","@propertysource"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
--->
# mapstruct에서 프로퍼티 값을 로드해서 맵핑하기

mapper의 componentModel = "spring" 으로 사용하면 bean으로 등록하고 di를 사용할수 있다.

```java
@Mapper(componentModel = "spring", uses = TestMapper2.class)
public interface TestMapper {
	
}

@Component
public class TestMapper2 {
    @Value("${file.base-url}")
    private String imageBaseUrl;
	
	public TestDto toTestDto(TestEntity entity){
		return TestDto.builder()
            .url(imageBaseUrl+entity.getFilePath())
            .build();
    }
	
}

```
이 내용을 활용해서 @Component로 등록한 다른 mapper를 uses에 등록해주면 해당 부분을 di 활용해서 사용할수 있다. 컴파일후 빌드된 코드는 아래처럼 나타난다.

```java
@Component
public class TestMapperImpl implements TestMapper {

	@Autowired
	private ProductResourceMapper TestMapper2;

	
}

```

# 참고자료

-----
