---
layout: post
title: "jbpm 프로세스 진행상태 조회 rest api"
date: 2016-08-09 13:29:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

jbpm에서는 해당 정보를 가지고 오기위해 아래의 rest api를 제공하고 있다.
참고로 아래 url은 오픈소스 jbpms에서 url이고 레드햇 버전은 /jbpm-console/을 /business-central/로 수정해서 호출해야 된다

프로세스 이미지정보 가지고 오기:
        {server}/jbpm-console/rest/runtime/{deploymentId}/process/{processDefId}/image
진행상태 표시한 이미지 정보 가지고 오기:
        {server}/jbpm-console/rest/runtime/{deploymentId}/process/{processDefId}/image/{procInstId}
        
        
하지만 호출하면 에러가 나올것이다. 우리가 bpmn을 그리면 프로세스 모양이 저장되는데 
기본으로 아래 옵션이 꺼져있어서 파일을 못찾는 에러가 난다. 그럼 해당 옵션을 수정해 주면 되는데 파일 경로는 

jboss EAP 디플로이 된 폴더에서 jbpm-console.war/org.kie.workbench.KIEWebapp/profiles/jbpm.xml을 열고

```xml
<storesvgonsave enabled="false"/> 
```

위에 내용을 아래의 내용으로 수정후에 서버 재기동 후 호출하면 정상적으로 나올것이다.

```xml
<storesvgonsave enabled="true"/>
```
아래는 jqurey로 rest api 호출 한 것이다.

```javascript
var getSvgProcessImg = function() {
	$.ajax({
		method : "GET",
		async : false,
		url : '/rest/runtime/{deploymentId}/process/{processDefId}/image/{procInstId}',
		beforeSend : function(xhr) {					
		        //btoa(사용자ID + ":" + 패스워드)
		        xhr.setRequestHeader('Authorization', 'Basic '+ btoa("jboss" + ":" + "1234"));
		},
		complete : function(response) {
			$('#output').html(response.responseText);
		},
		error : function() {
		        $('#output').html('Bummer: there was an error!');
		}
});
```
아래의 쓰레드를 참조 함
	[여기](https://developer.jboss.org/thread/263215?start=0&tstart=0)
	[여기](https://developer.jboss.org/thread/262604?start=0&tstart=0)
