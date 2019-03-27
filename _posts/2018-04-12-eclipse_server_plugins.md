---
layout: post
title: "이클립스 SERVER 플러그인"
date: 2018-04-12 11:30:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 이클립스 SERVER 플러그인


이클립스 WTP에 server 플러그인에서 아래 이미지 처럼  serve modules without publshing 설정을 체크 했을때 디플로이가 어떻게 되는지 찾아 보았다.


![serve modules without publshing](https://sejoung.github.io/images/2018_04_12_01.jpg){: width="100%"}

먼저 이클립스의 workspace 에서 server.xml에 아래 처럼 지정이 된다. 위치는 아래이다.


```

{workspace}\Servers\Tomcat v8.5 Server at localhost-config/server.xml

  <Context docBase="test" path="/test" reloadable="true" source="org.eclipse.jst.jee.server:test"/>

```

위에 설정 처럼 지정이 되는데 이것은 serve modules without publshing 설정을 추가 해도 바뀌지 않는다.
설정을 추가 하면 아래의 경로에 아래 설정이 true로 바뀌고 있었다

```

{workspace}\.metadata\.plugins\org.eclipse.wst.server.core/servers.xml

serveModulesWithoutPublish="true"  

```
그럼 해당 톰캣의 CATALINA_BASE는 어디에 설정되어 있냐면 아래의 xml에 설정이 되어 있다.

```

{workspace}\.metadata\.plugins\org.eclipse.wst.server.core/tmp-data.xml

```

설정된 폴더에 들어가면 톰캣 폴더리스트들이 보이는데 

conf폴더에 server.xml을 보면 아래 처럼 설정이 된다.

```xml

<Context docBase="{workspace}\.metadata\.plugins\org.eclipse.wst.server.core\tmp1\wtpwebapps\ROOT" path="" reloadable="false" />
				<Context docBase="{workspace}\test\src\main\webapp"
					path="/test" reloadable="true" source="org.eclipse.jst.jee.server:test">
					<Resources>
						<PreResources base="{workspace}\test\target\classes"
							classLoaderOnly="false" className="org.apache.catalina.webresources.DirResourceSet"
							internalPath="/" webAppMount="/WEB-INF/classes" />
					
						<JarResources
							base="{maven_repo}\.m2\repository\asm\asm\1.5.3\asm-1.5.3.jar"
							classLoaderOnly="true" className="org.apache.catalina.webresources.JarResourceSet"
							internalPath="/" webAppMount="/WEB-INF/classes" />
					
						<PreResources
							base="{workspace}\test\target\m2e-wtp\web-resources"
							classLoaderOnly="false" className="org.apache.catalina.webresources.DirResourceSet"
							internalPath="/" webAppMount="/" />
					</Resources>
				</Context>
```


# 참조 
-----
* [eclipse code Tomcat85PublishModuleVisitor](http://git.eclipse.org/c/gerrit/servertools/webtools.servertools.git/tree/plugins/org.eclipse.jst.server.tomcat.core/tomcatcore/org/eclipse/jst/server/tomcat/core/internal/Tomcat85PublishModuleVisitor.java)
* [tomcat-options-Serve-modules-without-publishing-이란](http://reimaginer.tistory.com/entry/tomcat-options-Serve-modules-without-publishing-%EC%9D%B4%EB%9E%80)

