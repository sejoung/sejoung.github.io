---
layout: post
title: "java 객체 타입 확인"
date: 2019-09-20 12:23 +0900
comments: true
tags : ["instanceof"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
## java 객체 타입 확인

```java

import org.json.simple.JSONObject;

public class Test {

    public static void main(String[] args) {
        Object jsonObject = new JSONObject();

        if ("class org.json.simple.JSONObject".equals(jsonObject.getClass().toString())) {
            System.out.println("여기");
        }

        if(jsonObject instanceof JSONObject ){
            System.out.println("여기2");

        }

    }

}



```

위와 같은 코드로 확인을 할수있는데 instanceof를 쓰는것이 장황하지않아서 좋은것 같다.

# 참조
----- 
