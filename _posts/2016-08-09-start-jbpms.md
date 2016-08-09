---
layout: post
title: "jbpm CustomWorkItemHandler 만드는 방법"
date: 2016-08-09 11:28:00 +0900
comments: false
---
사용법 

maven 빌드후에 jbpm 워크밴치 화면으로가서 메뉴 Authoring -> Artifact Repository 로 이동후 jar파일 업로드

프로젝트 생성 후 Tools -> Project Editor에서 왼쪽 Project Settings 메뉴를 Dependencies로 변경

Add from repository버튼을 클릭후에 내가 업로드한 jar파일을 추가 후 저장

다시 Tools -> Project Editor 화면으로 가서 Project Settings 메뉴를 Knowledge base and sessions으로 선택

Add 버튼을 클릭해서 새로운 knowledge base 생성한다. 

Equals Behavior는 Identity 
Event Processing Mode는 Stream

Knowledge Sessions는 새로 추가후에 type="stateful" default="true" clockType="realtime" 으로 선택

```xml
  <kmodule xmlns="http://jboss.org/kie/6.0.0/kmodule" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
 <kbase name="mykbase" default="true" eventProcessingMode="stream" equalsBehavior="identity">
    <ksession name="mykasession" type="stateful" default="true" clockType="realtime">
        <workItemHandlers>
          <workItemHandler type="kr.co.killers.jbpm.customWorkItemHandler.HelloWorkItemHandler" name="HelloWorkItemHandler"/>
        </workItemHandlers>
      </ksession>
    </kbase>
  </kmodule>
```



WorkDefinitions.wid를 클릭해서 아래 내욜을 추가 

 [
   "name" : "HelloWorkItemHandler",
    "displayName" : "Hello World!",
    "icon" : "defaultservicenodeicon.png"
  ] 
  
이제 bpmn을 생성시켜서 확인 

이내용은 이블로그를 참고[여기](http://fxapps.blogspot.kr/2015/04/creating-custom-work-item-handler-in.html)

위에 내용으로 구현한 소스는 아래의 저장소에 있다. [github](https://github.com/sejoung/jbpmCustomWorkItemHandler).



