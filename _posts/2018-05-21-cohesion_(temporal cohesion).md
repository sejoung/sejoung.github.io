---
layout: post
title: "cohesion_(logical cohesion)"
date: 2018-05-21 14:46:00 +0900
comments: false
---

### 응집도 (cohesion)

#### 시간 응집도 (temporal)

특정 실행 시점으로 그룹화 될때 생깁니다. 

하지만 이것은 주석으로만 설명 할수 있습니다. 코드로는 설명이 안됨(주석은 코드가 아니라 썩어버림)

아래의 예제이다.

```java

	public void init()  {
		
        loadPropertiesData();
        loadFrameData();
        loadXmlData();
        MongoManager.load();
	}

```

