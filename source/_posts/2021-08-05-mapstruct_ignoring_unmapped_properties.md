---
layout: post
title: "mapstruct Ignoring Unmapped Properties"
date: 2021-08-05 10:46 +0900
comments: true
tags : ["mapstruct","Ignoring Unmapped Properties"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
--->
# mapstruct Ignoring Unmapped Properties

mapstruct를 사용하다 보면 아래같은 오류가 발생한다. mapper에서 맴핑되지 않은 속성이 있으면 메시지가 출력된다 

```
Warning:(X,X) java: Unmapped target property: "propertyName".
```

## 해결방법

@Mapping에 속성으로 ignore = true 로 처리
```
@Mapping(target = "comments", ignore = true)
```

unmappedTargetPolicy 적용 

ERROR : 매핑되지 않은 대상 속성은 빌드에 실패합니다. 이는 실수로 매핑되지 않은 필드를 방지하는 데 도움이 됩니다.
WARN : (기본값) 빌드 중 경고 메시지
IGNORE : 출력 또는 오류 없음

@Mapper에 적용 
```
@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE)
```

@MapperConfig에 적용하여 @Mapper에서 config 로드
```java
@MapperConfig(unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface IgnoreUnmappedMapperConfig {
}

@Mapper(config = IgnoreUnmappedMapperConfig.class)
public interface Test { 
}
```

# 참고자료

-----
* [mapstruct reference](https://mapstruct.org/documentation/stable/reference/html/)
