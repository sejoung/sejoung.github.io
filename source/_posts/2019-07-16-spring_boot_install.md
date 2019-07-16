---
layout: post
title: "스프링 부트 애플리케이션 설치하기"
date: 2019-07-16 17:35 +0900
comments: true
tags : ["spring","spring-boot","install"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
## 스프링 부트 애플리케이션 설치하기

Spring Boot 응용 프로그램을 사용하여 실행하는 것 외에도 java -jarUnix 시스템에 대해 완벽하게 실행 가능한 응용 프로그램을 만들 수도 있습니다. 
완전히 실행 jar는 다른 실행 가능한 바이너리처럼 수행 할 수 있거나 할 수 있습니다 에 등록 init.d하거나systemd . 
따라서 공통 프로덕션 환경에서 Spring Boot 애플리케이션을 쉽게 설치하고 관리 할 수 ​​있습니다.

Maven을 사용하여 '완전히 실행 가능한'jar 파일을 만들려면 다음 플러그인 구성을 사용하십시오.

```xml

<plugin>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-maven-plugin</artifactId>
	<configuration>
		<executable>true</executable>
	</configuration>
</plugin>

```

다음 예제는 해당하는 Gradle 구성을 보여줍니다.

```

bootJar {
	launchScript ()
}

```
### 지원 되는 운영체제

기본 스크립트는 대부분의 Linux 배포판을 지원하며 CentOS 및 Ubuntu에서 테스트됩니다. 
OS X 및 FreeBSD와 같은 다른 플랫폼에서는 사용자 정의를 사용해야합니다 embeddedLaunchScript.

### Unix / Linux

Spring 부트 애플리케이션은 init.d또는 을 사용하여  서비스로 쉽게 시작할 수 있습니다 systemd.

### init.d서비스 로 설치 (시스템 V)

Spring Boot의 Maven이나 Gradle 플러그인이 완전히 실행 가능한 jar 를 생성 하도록 설정하고 커스텀을 사용하지 않으면 
embeddedLaunchScript애플리케이션을 init.d서비스 로 사용할 수 있습니다 . 
이렇게하려면에 항아리를 심볼릭 링크 init.d표준 지원 start, stop, restart, 및 status명령.

스프링 부트 애플리케이션이 설치되어 있다고 가정하고 /var/myapp, 스프링 부트 애플리케이션을 init.d서비스 로 설치하려면 다음과 같이 심볼릭 링크를 생성하십시오.

```
sudo ln -s /var/myapp/myapp.jar /etc/init.d/myapp
```

일단 설치되면 일반적인 방법으로 서비스를 시작하고 중지 할 수 있습니다. 예를 들어 데비안 기반 시스템에서는 다음 명령을 사용하여 시작할 수 있습니다.

```
service myapp start
```

응용 프로그램이 시작되지 않으면 `/var/log/<appname>.log` 오류로 기록 된 로그 파일을 확인하십시오.


#### init.d서비스 보안

다음은 init.d 서비스로 실행되는 Spring Boot 애플리케이션의 보안을 유지하는 방법에 대한 가이드 라인이다. 
응용 프로그램과 응용 프로그램이 실행되는 환경을 강화하기 위해 수행해야하는 모든 작업을 포괄적으로 나열하지는 않습니다.


root로 실행될 때 root가 init.d 서비스를 시작하는 데 사용되는 경우처럼 기본 실행 가능 스크립트는 jar 파일을 소유 한 사용자로 응용 프로그램을 실행합니다. 
Spring 부트 애플리케이션을 결코 실행해서는 안되므로 root, 애플리케이션의 jar 파일은 절대로 루트가 소유해서는 안됩니다. 
대신 chown다음 예제와 같이 응용 프로그램을 실행 하고 jar 파일의 소유자로 만드는 특정 사용자를 만드십시오.

```
chown bootapp : bootapp your-app.jar

```
이 경우 기본 실행 스크립트는 응용 프로그램을 bootapp사용자 로 실행합니다 .

응용 프로그램의 사용자 계정이 손상 될 가능성을 줄이려면 로그인 셸을 사용하지 못하게해야합니다. 예를 들어, 계정 쉘을로 설정할 수 있습니다 /usr/sbin/nologin.

또한 응용 프로그램의 jar 파일 수정을 방지하기위한 조치를 취해야합니다. 먼저 다음 예제와 같이 쓰기 권한이없고 해당 소유자 만 읽거나 실행할 수 있도록 권한을 구성합니다.

```

chmod 500 your-app.jar

```

둘째, 응용 프로그램이나 응용 프로그램을 실행하는 계정이 손상된 경우에도 피해를 최소화하는 조치를 취해야합니다. 
공격자가 액세스 권한을 획득하면 jar 파일을 쓰기 가능으로 만들고 내용을 변경할 수 있습니다. 
이를 방지하는 한 가지 방법 chattr은 다음 예제와 같이 using을 사용하여 변경하지 못하게하는 것입니다 .

```

sudo chattr + i your-app.jar

```
이렇게하면 루트를 포함한 모든 사용자가 jar를 수정하지 못하게됩니다.

root가 응용 프로그램의 서비스를 제어하고 파일 을 사용하여.conf 시작을 사용자 정의하는 경우, .conf파일은 루트 사용자가 읽고 평가합니다. 
그에 따라 보안되어야합니다. 사용하여 chmod파일이 소유자 만 읽고 사용 할 수 있도록 다음 예 chown에서와 같이, 
루트 소유자 만들기 위해 :

```
chmod 400 your-app.conf
sudo chown root:root your-app.conf
```

### systemd서비스 로 설치

systemdSystem V init 시스템의 후속 버전이며 현재 많은 현대 리눅스 배포판에서 사용되고 있습니다. 
init.d스크립트를 계속해서 사용할 수 있지만 '서비스'스크립트를 systemd사용하여 스프링 부트 응용 프로그램을 시작할 수도 있습니다 systemd.

당신이 봄 부팅 응용 프로그램에 설치되어 있다고 가정하면 /var/myapp, 
A와 같은 봄 부팅 응용 프로그램 설치 systemd, 서비스라는 이름의 스크립트를 작성 myapp.service하고에 배치 /etc/systemd/system디렉토리. 

다음 스크립트는 예제를 제공합니다.

```

[Unit]
Description=myapp
After=syslog.target

[Service]
User=myapp
ExecStart=/var/myapp/myapp.jar
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target

```

```
이 ExecStart필드는 script action 명령을 선언하지 않습니다. 즉, run명령이 기본적으로 사용됩니다.

```

init.d서비스 로 실행될 때와 달리 응용 프로그램, 
PID 파일 및 콘솔 로그 파일을 실행하는 사용자는 systemd자체적 으로 관리 되므로 'service'스크립트의 해당 필드를 사용하여 구성해야합니다. 
자세한 내용은 서비스 단위 구성 매뉴얼 페이지 를 참조하십시오.

시스템 부팅시 자동으로 응용 프로그램이 시작되도록 플래그를 지정하려면 다음 명령을 사용하십시오.


```

systemctl enable myapp.service

```

# 참조
-----
* [spring-boot deployment-install](https://docs.spring.io/spring-boot/docs/current/reference/html/deployment-install.html)



