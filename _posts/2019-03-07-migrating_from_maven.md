---
layout: post
title: "Apache Maven에서 빌드 마이그레이션하기"
date: 2019-03-07 14:50 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## Apache Maven에서 빌드 마이그레이션하기

Apache Maven 은 널리 사용되는 Java 및 기타 JVM 기반 프로젝트 용 빌드 도구이므로 Gradle을 사용하려는 사람들은 종종 기존 Maven 빌드를 마이그레이션해야합니다. 
이 가이드는 두 도구 모델 간의 차이점과 유사점을 설명하고 프로세스를 쉽게 수행 할 수있는 단계를 제공함으로써 이러한 마이그레이션을 지원합니다.

빌드를 변환하는 것은 무서울 수 있지만 혼자 할 필요는 없습니다. 
help.gradle.org 에서 문서, 포럼 및 StackOverflow를 검색 하거나 포럼 에서 Gradle 커뮤니티에 문의 할 수 있습니다.

### 마이그레이션 사례 만들기

Gradle과 Maven의 가장 큰 차이점은 유연성, 성능, 사용자 경험 및 종속성 관리입니다.
이러한 측면에 대한 시각적 개요는 [Maven 대 Gradle 기능 비교](https://sejoung.github.io/2019/03/Gradle_vs_Maven_Comparison)에서 사용할 수 있습니다.

Gradle 3.0 이후 Gradle은 빌드 캐싱, 컴파일 회피 및 개선 된 Java 컴파일러와 같은 기능을 사용하여 Gradle 빌드를 훨씬 빠르게 만드는 데 많은 투자를했습니다.
Gradle은 빌드 캐시를 사용하지 않고도 대다수 프로젝트에서 Maven보다 2-10 배 빠릅니다.
Maven에서 Gradle 로의 전환을위한 심층적 인 성능 비교 및 ​​비즈니스 사례는 여기 에서 찾을 수 있습니다.

### 일반적인 가이드라인

Gradle과 Maven은 프로젝트를 빌드하는 방법에 근본적으로 다른 견해를 가지고 있습니다.
Gradle은 실제 작업을 작업 종속성 그래프로 위임하는 유연하고 확장 가능한 빌드 모델을 제공합니다.
Maven은 목표를 첨부 할 수있는 고정 된 선형 단계의 모델을 사용합니다 (작업을 수행하는 것들).
이 두 가지 사이의 마이그레이션은 위협적으로 보일 수 있지만 Gradle은 Maven은 표준 프로젝트 구조 와 같은 및 종속성 관리가 비슷한 방식으로 작동하는 것과 동일한 규칙을 따르기 때문에 마이그레이션이 놀라 울 정도로 쉬울 수 있습니다.

다음은 Maven 빌드를 Gradle로 쉽게 마이그레이션 할 수 있도록 도와 줄 일련의 단계를 설명합니다.

* 이전 Maven 빌드와 새 Gradle 빌드를 나란히 유지합니다.

Maven 빌드 작업을 알기 때문에 Gradle 빌드가 모든 동일한 아티팩트를 생성하고 필요한 작업을 수행 할 때까지 그대로 유지해야합니다. 
이는 또한 사용자가 소스 트리의 새 복사본을 가져 오지 않고도 Gradle 빌드를 시도 할 수 있음을 의미합니다.

* 두 빌드가 동일한 아티팩트를 생성하는지 확인하는 메커니즘을 개발하십시오.

이는 배포 및 테스트가 중단되지 않도록하는 매우 중요한 단계입니다. 
JAR의 매니페스트 파일 내용과 같은 작은 변경 사항도 문제를 일으킬 수 있습니다. 
귀하의 Gradle 빌드가 Maven 빌드와 동일한 출력을 생성한다면, 
이것은 여러분과 다른 사람들이 전환하는 것에 대한 자신감을 가지게 될 것이고, 
가장 큰 이점을 제공 할 큰 변경을보다 쉽게 ​​구현할 수있게 할 것입니다.

모든 단계에서 모든 이슈를 확인해야한다는 의미는 아니지만 문제의 원인을 신속하게 파악하는 데 도움이됩니다. 
최종 보고서 및 게시되거나 배포 된 아티팩트와 같은 중요한 출력에만 집중할 수 있습니다.

Gradle이 Maven에 비해 생성하는 빌드 출력의 고유 한 차이점을 고려해야합니다. 
생성 된 POM에는 소비에 필요한 정보 만 포함되며 해당 시나리오에서 올바르게 사용 <compile>하고 <runtime>범위를 지정합니다. 
또한 아카이브에있는 파일 순서와 클래스 경로에있는 파일 순서의 차이점을 볼 수도 있습니다. 
대부분의 차이는 양성 일 수 있지만 확인하고 확인하는 것이 좋습니다.

* 자동 변환 실행

이렇게하면 다중 모듈 빌드의 경우에도 필요한 모든 Gradle 빌드 파일이 만들어 집니다. 
보다 단순한 Maven 프로젝트의 경우, Gradle 빌드를 실행할 준비가되었습니다!

* 빌드 스캔 만들기

빌드 스캔을 사용하면 빌드에서 발생하는 상황을 쉽게 시각화 할 수 있습니다. 
특히 프로젝트 구조, 의존성 (정규 및 프로젝트 간 프로젝트), 사용중인 플러그인 및 빌드의 콘솔 출력을 볼 수 있습니다.

마이그레이션 중에 문제를 확인하고 문제를 해결하는 데 도움이되는 빌드 검색을 정기적으로 생성하는 것이 좋습니다. 
원하는 경우이를 사용하여 빌드 성능을 향상시킬 수있는 기회를 식별 할 수 있으며, 성능은 처음부터 Gradle로 전환해야하는 큰 이유입니다.

* 의존성을 확인하고 문제를 해결하십시오.

* 통합 및 기능 테스트 구성

많은 테스트는 추가 소스 세트를 구성하여 간단하게 마이그레이션 할 수 있습니다. 
FitNesse 와 같은 타사 라이브러리를 사용하는 경우 Gradle Plugin Portal 에서 적절한 커뮤니티 플러그인이 있는지 확인하십시오 .

* Maven 플러그인을 Gradle에 해당하는 것으로 교체하십시오
  
인기있는 플러그인 의 경우 Gradle에는 사용할 수있는 동등한 플러그인이있는 경우가 많습니다. 
또한 플러그인을 내장 된 Gradle 기능으로 대체 할 수 있습니다. 
최후의 수단으로, 커스텀 플러그인과 태스크 유형을 통해 Maven 플러그인을 다시 구현해야 할 수도 있습니다.

이 장의 나머지 부분에서는 Maven에서 Gradle로 빌드를 마이그레이션하는 특정 측면에 대해 자세히 설명합니다.

### build lifecycle 이해하기

Maven 빌드는 일련의 고정 된 단계로 구성된 빌드 수명주기 개념을 기반으로합니다. 
Gradle 빌드가 초기화, 구성 및 실행 단계의 구조에 어떻게 맞는지 이해하는 것이 중요하지만 빌드 수명주기가 다른 점 때문에 Gradle로 마이그레이션하는 사용자에게는 장애가 될 수 있습니다. 
다행스럽게도 Gradle에는 라이프 사이클 작업 인 Maven의 단계를 모방 할 수있는 기능이 있습니다.

이를 통해 관심있는 작업에 단순히 의존하는 작업 없음 작업을 생성하여 자신의 "라이프 사이클"을 정의 할 수 있습니다. 
Maven 사용자가 Gradle로 쉽게 전환 할 수 있도록  모든 JVM 언어에서 적용된 기본 플러그인 Java Library Plugin 과 같은 플러그인은 주요 Maven 단계에 해당하는 일련의 라이프 사이클 태스크를 제공합니다.

주요 Maven 단계 및 매핑되는 Gradle 작업의 목록은 다음과 같습니다.

* clean - cleanBase Plugin에서 제공 하는 작업을 사용하십시오 .
        
* compile - Java Plugin 및 기타 JVM 언어 플러그인에서 제공 하는 classes 태스크를 사용하십시오. 
이것은 모든 언어의 모든 소스 파일에 대한 모든 클래스를 컴파일 하고 processResources 작업을 통해 자원 필터링 을 수행 합니다 .

* test - test자바 플러그인에서 제공 하는 작업을 사용하십시오 . 단위 테스트 만 실행하거나 test소스 집합 을 구성하는 테스트를 실행합니다 .

* package - assemble Base Plugin에서 제공 하는 작업을 사용하십시오. 
이것은 프로젝트에 적합한 패키지가 무엇이든 구축합니다. 
예를 들어 Java 라이브러리 용 JAR 또는 전통적인 Java 웹 어플리케이션 용 WAR와 같습니다.

* verify - check Base Plugin에서 제공 하는 작업을 사용하십시오. 
이것은 일반적으로 단위 테스트, Checkstyle 과 같은 정적 분석 작업 등을 포함하여 연결된 모든 확인 작업을 실행합니다.
통합 테스트를 포함하려면 이러한 테스트를 수동으로 구성해야합니다 . 이는 간단한 프로세스입니다.
         
* install - Maven Publish Plugin 에서 제공 하는 publishToMavenLocal 태스크를 사용하십시오 .
Gradle 빌드에서는 프로젝트 간 종속성 및 복합 빌드 와 같은보다 적합한 기능에 액세스 할 때 이슈를 "install"할 필요가 없습니다.
publishToMavenLocalMaven 빌드와의 상호 운용 에만 사용해야 합니다.
또한 Gradle을 사용하면 저장소 선언 섹션 에서 설명한대로 로컬 Maven 캐시에 대한 종속성을 해결할 수 있습니다 .

* deploy - Maven Publish Plugin 에서 제공 하는 publish 태스크를 사용 하십시오. 
빌드가  이전 Maven Plugin (ID :) 에서 변경되었는지 확인하십시오.
이렇게하면 패키지가 구성된 모든 게시 저장소에 게시됩니다.
여러 태스크가 정의되어 있어도 단일 리포지토리에 게시 할 수있는 다른 maven 태스크가 있습니다.
Maven Publish Plugin은 기본적으로 소스 및 Javadoc JAR 을 게시하지 않지만 사용자 설명서의 다른 곳에서 설명한 것처럼 쉽게 구성 할 수 있습니다 .

### 자동 변환 수행

Gradle의 init작업 은 일반적으로 새로운 뼈대 프로젝트를 만드는 데 사용되지만, 기존의 Maven 빌드를 Gradle로 자동 변환 할 때도 사용할 수 있습니다.
Gradle이 시스템에 설치 되면 명령을 실행하기 만하면 됩니다.

`gradle init`

루트 프로젝트 디렉토리에서 Gradle이 그 일을하도록하십시오. 
이는 기본적으로 기존 POM을 구문 분석하고 해당 Gradle 빌드 스크립트를 생성하는 것으로 구성됩니다. 
Gradle은 다중 프로젝트 빌드를 마이그레이션하는 경우 설정 스크립트를 작성합니다 .

새로운 Gradle 빌드에는 다음이 포함되어 있습니다.

* POM에 지정된 모든 사용자 지정 리포지토리
  
* 외부 및 프로젝트 간 의존성
  
* 프로젝트를 빌드하기위한 적절한 플러그인 ( Maven Publish, Java 및 War 플러그인 중 하나 이상으로 제한됨 )
  
자동 변환 기능의 전체 목록은 Build Init Plugin 장 을 참조하십시오 .

어셈블리에서 자동으로 변환되지 않는다는 점을 명심해야합니다. 
변환에 반드시 문제가있는 것은 아니지만 수동 작업을해야합니다. 
옵션에는 다음이 포함됩니다.

* Distribution Plugin
* Java Library Distribution Plugin
* Application Plugin
* 사용자 지정 아카이브 작업 만들기
* Gradle Plugin Portal 에서 적절한 커뮤니티 플러그인 사용

운좋게도 플러그인이 많지 않거나 Maven 빌드에서 커스터마이징을 많이하지 않는다면 간단히

`gradle build`

마이그레이션이 완료되면 이렇게하면 테스트가 실행되고 사용자의 개입없이 필요한 인공물이 생성됩니다.


### 의존성 변환

Gradle의 의존성 관리 시스템은 Maven의 것보다 융통성이 있지만 저장소, 선언 된 종속성, 범위 ( Gradle의 종속성 구성 ) 및 전이 종속성과 같은 개념을 여전히 지원합니다.
실제로 Gradle은 Maven 호환 리포지토리와 완벽하게 호환되므로 종속성을 쉽게 마이그레이션 할 수 있습니다.

```
두 도구의 한 가지 주목할만한 차이점은 버전 충돌을 관리하는 방법에 있습니다. 
Maven은 "가장 가까운"일치 알고리즘을 사용하지만 Gradle은 최신 알고리즘을 선택합니다. 
Transitive Dependencies 관리에 설명되어있는 것처럼 어떤 버전을 선택할지에 대해 많은 제어 권한을 갖고 있습니다 .
```
다음 섹션에서는 Maven 빌드의 종속성 관리 정보의 가장 일반적인 요소를 마이그레이션하는 방법을 설명합니다.

#### 종속성 선언
Gradle은 Maven과 동일한 종속성 식별자 구성 요소 인 그룹 ID, 이슈 ID 및 버전을 사용합니다. 
또한 분류자를 지원합니다. 
따라서 Gradle의 구문에 대한 종속성에 대한 식별자 정보를 대체해야합니다.
이 정보는 종속성 선언 장에 설명되어 있습니다.

예를 들어 Log4J에 대한 Maven 스타일의 의존성을 생각해보십시오.

```xml
<dependencies>
    <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
        <version>1.2.12</version>
    </dependency>
</dependencies>
```

이 종속성은 Gradle 빌드 스크립트에서 다음과 같이 보입니다.

build.gradle
```groovy

dependencies {
    implementation 'log4j:log4j:1.2.12'  // (1)
}

```
1. Log4J의 버전 1.2.12를 implementation구성 (범위)에 연결합니다.
 
Gradle은 "group", "module"및 "version"을 참조하지만 문자열 식별자의 형식은 " <groupId> : <artifactId> : <version> "입니다.

Maven의 스코프와 Gradle의 표준 구성 사이의 차이점 중 몇 가지는 Gradle이 모듈을 빌드하는 데 필요한 종속성과 의존하는 모듈을 빌드하는 데 필요한 종속성을 구분하는 것입니다. 
메이븐 (Maven)은 그런 구분을하지 않기 때문에, 출판 된 POM은 일반적으로 라이브러리 소비자가 실제로 필요로하지 않는 의존성을 포함합니다.

다음은 주요 Maven 종속 범위와 마이그레이션을 처리하는 방법입니다.

* compile - Gradle을은 대신에 사용할 수있는 두 가지 구성이 compile범위를 : implementation와 api. 전자는 Java Plugin을 적용하는 모든 프로젝트에서 api사용할 수 있지만 Java 라이브러리 Plugin 을 특별히 적용하는 프로젝트에서만 사용할 수 있습니다 .

대부분의 경우 implementation, 특히 응용 프로그램이나 웹 응용 프로그램을 만드는 경우 구성을 사용하면 됩니다. 
그러나 라이브러리를 빌드하는 경우 Java 라이브러리 빌드api 절에서 어떤 종속성을 선언해야 하는지를 배울 수 있습니다 . 
api implementation 의 차이점에 대한 더 많은 정보 와 위의 연결 자바 라이브러리 플러그인 장에서 제공됩니다.

```groovy

dependencies {
    api 'commons-httpclient:commons-httpclient:3.1'
    implementation 'org.apache.commons:commons-lang3:3.5'
}

```

* runtime - runtimeOnly 구성을 사용하십시오 .
            
```groovy

dependencies {
    runtimeOnly 'commons-httpclient:commons-httpclient:3.1'
}

```

* test - Gradle 은 프로젝트의 테스트 를 컴파일 하는 데 필요한 의존성 과 이를 실행 하는 데 필요한 종속성을 구별 합니다.
         
테스트 컴파일에 필요한 종속성은 testImplementation구성 에 대해 선언되어야 합니다. testRuntimeOnly 테스트를 실행하는 데 필요한 것만 사용해야합니다 

```groovy

dependencies {
    testRuntimeOnly 'commons-httpclient:commons-httpclient:3.1'
}

```
* provided - compileOnly구성을 사용하십시오 .
             
War Plugin은 추가 providedCompile및 providedRuntime종속성 설정을 유의하십시오. 
이들은 compileOnlyWAR 파일과 는 약간 다른 방식으로 동작 합니다.
그러나 종속성은 런타임 및 테스트 런타임 클래스 경로에 포함되므로 필요한 경우 이러한 구성을 사용하십시오.

```groovy

dependencies {
    compileOnly 'commons-httpclient:commons-httpclient:3.1'
}

```

* import - import 범위는 대부분 내에서 사용되는 <dependencyManagement>블록과 POM 전용 출판물에만 적용됩니다. 
이 동작을 복제하는 방법에 대한 자세한 내용은 BOM 사용 섹션을 참조하십시오.
           
POM 전용 발행에 정기적 인 종속성을 지정할 수도 있습니다. 이 경우 해당 POM에 선언 된 종속성은 빌드의 일반적인 전 이적 종속성으로 취급됩니다.

예를 들어, groovy-allPOM을 테스트 에 사용한다고 가정 해보십시오. POM 전용 발행물로 <dependencies>블록 내부에 자체 의존성이 나열되어 있습니다.
Gradle 빌드의 적절한 구성은 다음과 같습니다.

```groovy

dependencies {
    testImplementation 'org.codehaus.groovy:groovy-all:2.5.4'
}

```

이 결과는 POM의 모든 compile및 runtime범위 종속성 groovy-all이 테스트 런타임 클래스 경로에 추가되는 반면 compile 범위 종속성 만 테스트 컴파일 클래스 경로에 추가됩니다. 
다른 범위와의 종속성은 무시됩니다.

#### 저장소 선언

Gradle을 사용하면 Maven 호환 또는 Ivy 호환 저장소에서 선언 된 종속성을 검색 할 수 있습니다. 
Maven과는 달리 기본 저장소가 없으므로 적어도 하나는 선언해야합니다. 
Maven 빌드와 동일한 동작을하려면 다음 과 같이 Gradle 빌드에서 Maven Central 을 구성 하십시오.

```groovy

repositories {
    mavenCentral()
}

```

또한 리포지토리 유형 장에 repositories {}설명 된대로 블록을 사용하여 사용자 정의 리포지토리를 구성 할 수 있습니다 .

마지막으로 Gradle을 사용하면 로컬 Maven 캐시 / 저장소 에 대한 종속성을 해결할 수 있습니다. 
이것은 Gradle이 Maven 빌드와 상호 운용하도록 도와 주지만, 당신이 그 상호 운용성을 필요로하지 않는다면 당신이 사용하는 기술이되어서는 안됩니다. 
파일 시스템을 통해 게시 된 아티팩트를 공유하려면 file : // URL을 사용하여 사용자 정의 Maven 저장소 를 구성하는 것을 고려 하십시오.

Maven의 것보다 더 안정적으로 동작하고 여러 동시 Gradle 프로세스에서 안전하게 사용할 수있는 Gradle의 자체 의존성 캐시 에 대해 배우고 싶을 수도 있습니다.

#### 종속성 버전 제어

전 이적 종속성의 존재는 의존성 그래프에서 동일한 종속성의 여러 버전으로 쉽게 끝날 수 있음을 의미합니다. 
기본적으로 Gradle은 그래프에서 종속성의 최신 버전을 선택하지만 항상 올바른 솔루션은 아닙니다. 
따라서 특정 종속성의 버전을 확인하는 여러 메커니즘을 제공합니다.

프로젝트별로 다음과 같이 사용할 수 있습니다.

* 종속성 제약 조건

* 재료의 법안 (Maven을 BOM에)

* 버전 강제

종속성 해결 동작 사용자 정의 장에 나열된 더 많은 특수 옵션이 있습니다 .

다중 프로젝트 빌드에서 모든 프로젝트의 버전 일관성을 유지하려는 경우 <dependencyManagement>Maven 의 블록 작동 방식과 마찬가지로 Java Platform Plugin을 사용할 수 있습니다.
이를 통해 여러 프로젝트에 적용 할 수있는 종속성 제약 조건 집합을 선언 할 수 있습니다.
Maven BOM 또는 Gradle의 메타 데이터 형식을 사용하여 플랫폼을 게시 할 수도 있습니다.
이를 수행하는 방법에 대한 자세한 내용은 플러그인 페이지를 참조하십시오.
특히 동일한 플랫폼에서 다른 플랫폼에 플랫폼을 적용 할 수있는 방법을 확인하려면 플랫폼 사용 섹션 을 참조하십시오.

#### 전이 종속성 제외

Maven은 의존성 그래프에서 불필요한 종속성 또는 불필요한 종속성 버전 을 유지하기 위해 제외를 사용 합니다. 
Gradle을 사용하여 똑같은 작업을 수행 할 수 있지만, 반드시 올바른 작업 은 아닙니다.
Gradle은 특정 상황에 더 적합한 기타 옵션을 제공하므로 올바르게 마이그레이션하기위한 제외가 필요한 이유 를 실제로 이해해야 합니다.

버전과 관련이없는 이유로 종속성을 제외하려면 전 이적 모듈 종속성 제외 섹션을 확인하십시오.
전체 구성 (종종 가장 적합한 솔루션) 또는 종속성에 제외를 첨부하는 방법을 보여줍니다.
모든 구성에 쉽게 제외를 적용 할 수도 있습니다.

#### 선택적 종속성 처리

선택적 종속성에는 두 가지 측면이 있습니다.

* 빌드가 전이 종속성으로 처리하는 방법
  
* 선언 된 종속성이 선택 사항으로 게시되는 방법
  
첫 번째 시나리오에서 Gradle은 Maven과 같은 방식으로 동작하고 선택적으로 선언 된 전이 종속성을 무시합니다. 
종속성 그래프의 다른 위치에 동일한 종속성이 선택 사항이 아닌 것으로 판별되면 해결되지 않으며 선택한 버전에 영향을 미치지 않습니다.

종속성을 선택 사항으로 게시하는 경우, Gradle에는 현재로서는 내장 된 지원이 없습니다. 
그러나 Nebula Optional Base Plugin 을 사용하여 필요한 동작을 얻을 수 있습니다. 
또는 MavenPom.withXML () 메서드를 사용하여 생성 된 POM을 사용자 정의 할 수 있습니다 .

### BOM (bill of materials) 사용

Maven을 사용하면 <dependencyManagement>패키지 유형이 POM 파일 의 섹션 내부에 종속성을 정의하여 종속성 제약 조건을 공유 할 수 있습니다 pom. 
이 특수 유형의 POM (BOM)을 다른 POM으로 가져와 프로젝트 전체에서 일관된 라이브러리 버전을 유지할 수 있습니다.

Gradle은 platform () 및 enforcedPlatform () 메소드를 기반으로하는 특수 종속성 구문을 사용하여 같은 목적으로 이러한 BOM을 사용할 수 있습니다. 
단순히 일반적인 방법으로 의존성을 선언하지만, 적절한 방법으로 의존성 식별자를 감싸는 것은이 예제에서 볼 수 있듯이 Spring Boot Dependencies BOM을 "가져 오기"합니다 :

```groovy

dependencies {
    implementation platform('org.springframework.boot:spring-boot-dependencies:1.5.8.RELEASE') // (1)

    implementation 'com.google.code.gson:gson' // (2)
    implementation 'dom4j:dom4j'
}

```
1. 스프링 부트 종속성 BOM 적용
2. 해당 BOM으로 정의 된 버전의 종속성을 추가합니다.

이 기능과의 차이점에 대해 자세히 배울 수 platform()및 enforcedPlatform()섹션에서 메이븐 BOM에서 버전 권장 가져 오기를 .

```
이 기능을 사용 <dependencyManagement>하여 패키지 유형이없는 경우에도 종속성의 POM에서 Gradle 빌드로 정보 를 적용 할 수 있습니다 pom. 
모두 platform()와 enforcedPlatform()에  <dependencies>블록을 선언 종속성 무시.
```

### 다중 모듈 빌드 마이그레이션 (프로젝트 집계)

Maven의 다중 모듈 빌드는 Gradle의 다중 프로젝트 빌드와 잘 일치 합니다.
해당 튜토리얼 을 통해 기본 멀티 프로젝트 Gradle 빌드가 어떻게 설정되는지 보십시오 .

다중 모듈 Maven 빌드를 이전하려면 다음 단계를 따르십시오.

1. <modules>루트 POM 의 블록 과 일치하는 설정 스크립트를 만듭니다 .
   
예를 들어, 다음 <modules>블록 :

```xml

<modules>
    <module>simple-weather</module>
    <module>simple-webapp</module>
</modules>

```
설정 스크립트에 다음 줄을 추가하여 마이그레이션 할 수 있습니다.

```groovy

rootProject.name = 'simple-multi-module'  // (1)

include 'simple-weather', 'simple-webapp'  // (2)

```

1. 전체 프로젝트의 이름을 설정합니다.
2. 이 빌드의 일부로 두 개의 하위 프로젝트를 구성합니다.
3. 교차 모듈 종속성을 프로젝트 종속성으로 바꿉니다.
4. 프로젝트 간 구성으로 프로젝트 상속을 복제 합니다. 이것은 기본적으로 공유 구성을 적절한 하위 프로젝트에 주입하는 루트 프로젝트 빌드 스크립트를 만드는 작업과 관련됩니다.
                                
`gradle projects` 의 실행결과

```

gradle projects

------------------------------------------------------------
Root project
------------------------------------------------------------

Root project 'simple-multi-module'
+--- Project ':simple-weather'
\--- Project ':simple-webapp'

To see a list of the tasks of a project, run gradle <project-path>:tasks
For example, try running gradle :simple-weather:tasks

```

주목할만한 주목할만한 기능 중 하나는 다중 프로젝트 빌드에서 프로젝트간에 종속성 버전을 공유하는 표준 방법입니다. 
일반적인 접근법은 버전을 저장하기 위해 루트 빌드 스크립트에서 추가 속성 을 사용 하는 것입니다. 
그 속성은 하위 프로젝트에서도 볼 수 있기 때문입니다.

### 메이븐 프로파일과 프로퍼티의 마이그레이션

Maven을 사용하면 다양한 종류의 속성을 사용하여 빌드를 매개 변수화 할 수 있습니다. 
일부는 프로젝트 모델의 읽기 전용 속성이고 다른 항목은 POM에서 사용자 정의됩니다. 
심지어 시스템 속성을 프로젝트 속성으로 처리 할 수도 있습니다.

Gradle은 시스템 속성과 시스템 속성을 구별하지만 프로젝트 속성과 비슷한 시스템을 가지고 있습니다. 

예를 들어 다음에서 속성을 정의 할 수 있습니다.

* 빌드 스크립트

* gradle.properties 루트 프로젝트 디렉토리에 있는 파일

* 디렉토리 의 gradle.properties파일 $HOME/.gradle

그것들은 유일한 옵션이 아니기 때문에 속성을 정의 할 수있는 방법과 위치에 대해 더 알고 싶다면 Build Environment 장을 확인하십시오.

중요한 특성 중 하나는 동일한 특성이 빌드 스크립트와 외부 특성 파일 중 하나에서 정의 될 때 일어나는 일입니다. 
빌드 스크립트 값이 우선합니다. 항상. 
다행스럽게도 프로파일의 개념을 모방하여 대체 가능한 기본값을 제공 할 수 있습니다.

Maven 프로필로 연결됩니다. 
이는 환경, 대상 플랫폼 또는 기타 유사한 요소를 기반으로 다양한 구성을 활성화 및 비활성화하는 방법입니다. 
논리적으로 그들은 제한된 'if'진술 일뿐입니다. 
그리고 Gradle은 조건을 선언하는 훨씬 더 강력한 방법을 가지고 있기 때문에, 
프로파일에 대한 공식적인 지원은 필요하지 않습니다 (의존성의 POM 제외). 
두 번째 빌드 스크립트와 조건을 결합하여 쉽게 동일한 동작을 얻을 수 있습니다.

환경에 따라 다른 배포 설정 (로컬 개발 (기본값), 테스트 환경 및 프로덕션)이 있다고 가정 해 보겠습니다. 
프로필 같은 동작을 추가하려면 먼저 프로젝트 루트에서 각 환경에 빌드 스크립트를 만들 : profile-default.gradle, profile-test.gradle,와 profile-prod.gradle. 
그런 다음 자신이 선택한 프로젝트 속성 을 기반으로 해당 프로파일 스크립트 중 하나를 조건부로 적용 할 수 있습니다 .

다음의 예는라는 프로젝트 속성을 사용하여 기본 기술을 보여줍니다 buildProfile단순히 초기화 및 프로필 스크립트 추가 프로젝트  

build.gradle

```groovy

if (!hasProperty('buildProfile')) ext.buildProfile = 'default'  // (1)

apply from: "profile-${buildProfile}.gradle"  // (2)

task greeting {
    doLast {
        println message  // (3)
    }
}

```

profile-default.gradle
```groovy

ext.message = 'foobar'  // (4)

```

profile-test.gradle
```groovy

ext.message = 'testing 1 2 3'  // (4)

```

profile-prod.gradle
```groovy

ext.message = 'Hello, world!'  // (4)

```

1. buildProfile프로젝트 속성 (Groovy) 또는 바인딩 (Kotlin) 존재 여부를 확인합니다.
2. buildProfile스크립트 파일 이름 의 값을 사용하여 적절한 프로필 스크립트를 적용합니다.
3. message추가 프로젝트 속성 의 값을 인쇄합니다.
4. message기본 빌드 스크립트에서 값을 사용할 수 있는 추가 프로젝트 속성을 초기화합니다.

이 설정을 사용하면 사용중인 프로젝트 속성에 대한 값 ( buildProfile이 경우) 을 전달하여 프로파일 중 하나를 활성화 할 수 있습니다.

Output of gradle greeting
```
> gradle greeting
foobar

```

Output of gradle -PbuildProfile=test greeting
```
> gradle -PbuildProfile=test greeting
testing 1 2 3
```

프로젝트 속성을 확인하는 데에만 국한되지 않습니다. 
환경 변수, JDK 버전, 빌드가 실행되는 OS 또는 상상할 수있는 다른 것을 확인할 수도 있습니다.

한 가지 명심해야 할 것은 높은 수준의 조건문을 사용하면 객체 지향 코드를 복잡하게 만드는 것과 유사하게 빌드를 이해하고 유지 관리하기가 더 어렵다는 것입니다. 
프로파일에도 동일하게 적용됩니다. 
Gradle은 Maven이 종종 필요로하는 프로필의 광범위한 사용을 피하기위한 여러 가지 더 좋은 방법을 제공합니다 (예 : 서로 다른 여러 작업 구성). 
Maven Publish Plugin에 의해 생성 된 작업을 보십시오 .publishPubNamePublicationToRepoNameRepository

Gradle의 Maven 프로파일 작업에 대한 더 자세한 설명은 이 블로그[maven-pom-profiles](https://blog.gradle.org/maven-pom-profiles) 게시물을 참고하십시오 .

### 리소스 필터링

Maven에는 기본적으로 process-resources목표가 resources:resources바인딩되어 있는 단계 가 있습니다.
이렇게하면 빌드 작성자가 웹 리소스, 패키지 속성 파일 등과 같은 다양한 파일에서 변수 대체를 수행 할 수 있습니다.

Gradle 용 Java 플러그인 processResources은 동일한 작업을 수행 하는 태스크를 제공합니다. 
구성된 자원 디렉토리 (기본적으로 src/main/resources)에서 출력 디렉토리로 파일을 복사 하는 복사 작업입니다. 
또한 모든 Copy작업 과 마찬가지로 파일 필터링 , 이름 바꾸기 및 콘텐츠 필터링 을 수행하도록 구성 할 수 있습니다 .

예를 들어, 여기로 소스 파일을 처리하는 구성이다 그루비 SimpleTemplateEngine 제공, 템플릿 version과 buildNumber그 템플릿에 속성 :

```groovy

processResources {
    expand(version: version, buildNumber: currentBuildNumber)
}

```

### 통합 테스트 구성

많은 Maven은 메이븐이 추가 단계의 집합을 통해 지원하는 어떤 종류의 통합 테스트 통합 빌드 pre-integration-test, integration-test, post-integration-test,와 verify.
또한 Surefire 대신 Failsafe 플러그인을 사용하므로 실패한 통합 테스트가 자동으로 빌드를 실패하지는 않습니다 
(실행중인 응용 프로그램 서버와 같은 자원을 정리해야 할 수도 있기 때문에).

이 동작은 Java 및 JVM 프로젝트의 테스트 장에서 설명한대로 소스 세트가있는 Gradle에서 쉽게 복제 할 수 있습니다. 
그런 다음 Task.finalizedBy ()를 사용하여 성공 여부에 관계없이 통합 테스트 후에 항상 실행되도록 테스트 서버를 종료하는 것과 같은 정리 작업을 구성 할 수 있습니다.

통합 테스트에서 빌드가 실패하지 않게 하려면 Java 테스트 장의 테스트 실행 섹션에 설명 된 Test.ignoreFailures 설정을 사용할 수 있습니다 .

소스 세트는 또한 통합 테스트를 위해 소스 파일을 배치하는 위치에 많은 유연성을 제공합니다. 
단위 테스트와 같은 디렉토리에 쉽게 저장할 수 있으며, 더 바람직하게는 별도의 소스 디렉토리에 보관할 수 있습니다 src/integTest/java. 
다른 유형의 테스트를 지원하려면 소스 세트와 테스트 태스크를 추가 하십시오!

### 일반적인 플러그인 마이그레이션

Maven과 Gradle은 플러그인을 통해 빌드를 확장하는 일반적인 방법을 공유합니다. 
플러그인 시스템은 표면 아래 매우 다르지만 다음과 같은 많은 기능 기반 플러그인을 공유합니다.

* Shade/Shadow
* Jetty
* Checkstyle
* JaCoCo
* AntRun (see further down)

왜이 문제가 중요할까요? 많은 플러그인이 표준 Java 규칙에 의존하므로 마이그레이션은 Gradle에서 Maven 플러그인의 구성을 복제하는 문제 일뿐입니다. 예를 들어, 다음은 간단한 Maven Checkstyle 플러그인 설정입니다.

```xml

<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-checkstyle-plugin</artifactId>
  <version>2.17</version>
  <executions>
    <execution>
      <id>validate</id>
      <phase>validate</phase>
      <configuration>
        <configLocation>checkstyle.xml</configLocation>
        <encoding>UTF-8</encoding>
        <consoleOutput>true</consoleOutput>
        <failsOnError>true</failsOnError>
        <linkXRef>false</linkXRef>
      </configuration>
      <goals>
        <goal>check</goal>
      </goals>
    </execution>
  </executions>
</plugin>

```
Gradle로 마이그레이션 할 때 구성 블록 외부의 모든 항목을 무시해도 안전합니다.
이 경우 해당 받침대 구성은 다음과 같습니다.

Gradle Checkstyle 플러그인 구성

```groovy

checkstyle {
    config = resources.text.fromFile('checkstyle.xml', 'UTF-8')
    showViolations = true
    ignoreFailures = false
}

```

Checkstyle 작업은 check포함 된 작업의 종속성으로 자동 추가 됩니다 test. 
테스트 전에 Checkstyle이 실행되도록하려면 mustRunAfter () 메소드를 사용하여 순서를 지정하십시오.

```groovy

test.mustRunAfter checkstyleMain, checkstyleTest

```

보시다시피, Gradle 구성은 Maven에 비해 훨씬 짧습니다. 
또한 Maven의 고정 된 단계에 더 이상 제약받지 않으므로 훨씬 더 유연한 실행 모델을 사용할 수 있습니다.

Maven에서 프로젝트를 이전하는 동안 소스 세트를 잊지 마세요. 
이것들은 Maven이 제공 할 수있는 것보다 통합 테스트 또는 생성 된 소스를 처리하기위한보다 우아한 솔루션을 제공하기 때문에 마이그레이션 계획에 반영해야합니다.

#### Ant goals

많은 Maven 빌드는 AntRun 플러그인을 사용하여 커스텀 Maven 플러그인을 구현하는 오버 헤드없이 빌드를 커스터마이징합니다. 
Ant를 ant객체 를 통해 Gradle 빌드의 일급 시민으로 만들기 때문에 Gradle에는 동등한 플러그인이 없습니다. 
예를 들어 Ant의 Echo 작업을 다음과 같이 사용할 수 있습니다.

```groovy

task sayHello {
    doLast {
        ant.echo message: 'Hello!'
    }
}

```

Ant 속성과 파일 세트조차 기본적으로 지원됩니다. 자세한 내용은 Using Ant Using Gradle을 참조하십시오 .

```

Ant가 당신을 위해 수행하는 작업을 대체하기 위해 커스텀 작업 유형 을 생성 하는 것이 더 간단하고 깨끗할 수 있습니다. 
그런 다음 점진적 빌드 및 기타 유용한 Gradle 기능 을보다 쉽게 ​​활용할 수 있습니다.

```

### 필요없는 플러그인 이해하기

Gradle 빌드는 일반적으로 Maven 빌드보다 확장 및 사용자 정의가 더 쉽다는 것을 기억해야합니다. 
이 맥락에서, Maven을 대체하기 위해 Gradle 플러그인이 필요 없다는 것을 의미합니다. 
예를 들어 Maven Enforcer 플러그인을 사용하면 종속성 버전 및 환경 요인을 제어 할 수 있지만 
이러한 기능은 일반 Gradle 빌드 스크립트에서 쉽게 구성 할 수 있습니다.

### 드문 플러그인과 커스텀 플러그인 다루기

특히 Gradle에있는 상대방이없는 Maven 플러그인을 방문 할 수 있습니다. 
특히 조직의 사용자 또는 다른 사용자가 맞춤 플러그인을 작성한 경우 더욱 그렇습니다. 
이러한 경우는 Gradle (및 잠재적으로 Maven)이 어떻게 작동 하는지를 이해하는 데 의존합니다. 
일반적으로 자신의 플러그인을 작성해야하기 때문입니다.

마이그레이션을 위해 두 가지 주요 유형의 Maven 플러그인이 있습니다.

* Maven 프로젝트 객체를 사용하는 사람들.
* 그렇지 않은 사람들.

왜 이것이 중요한가요? 후자 중 하나를 사용하면 사용자 정의 Gradle 작업 유형 으로 쉽게 재 구현할 수 있습니다. 
mojo 매개 변수에 해당하는 작업 입력 및 출력을 정의하고 실행 논리를 작업 동작으로 변환하십시오.

플러그인이 Maven 프로젝트에 의존하는 경우 플러그인을 다시 작성해야합니다. 
메이븐 플러그인이 어떻게 작동하는지 생각해 보는 것으로 시작하지 말고 해결하려고하는 문제를 살펴보십시오. 
그런 다음 Gradle에서 문제를 해결하는 방법을 찾으십시오. 
아마도 두 빌드 모델이 Maven 플러그인 코드를 Gradle 플러그인으로 "옮겨 쓰기"만으로는 효과가 없을 것입니다. 
더하기 측면에서, Gradle은 훨씬 풍부한 빌드 모델과 API를 가지고 있기 때문에, 플러그인은 원래 Maven보다 훨씬 쉽게 작성할 수 있습니다.

빌드 스크립트 나 플러그인을 통해 커스텀 로직을 구현할 필요가 있다면, 플러그인 개발과 관련된 가이드를 확인하십시오. 
또한 작업 할 API에 대한 포괄적 인 문서를 제공하는 Gradle의 Groovy DSL Reference 를 숙지해야합니다. 
그것은 시스템 (의 표준 구성 블록 (및 백업 개체), 핵심 유형을 자세히 Project, Task등) 및 작업 유형의 표준 세트. 
주요 진입 점은 빌드 스크립트를 뒷받침하는 최상위 객체 인 Project 인터페이스입니다.

### 추가 읽기

이 장에서는 Maven 빌드를 Gradle로 이주하는 것과 관련된 주요 주제에 대해 다루었습니다. 
나머지는 마이그레이션 중 또는 마이그레이션 후에 유용 할 수있는 몇 가지 다른 영역입니다.

* Gradle 빌드 환경 을 실행하는 데 사용되는 JVM 설정을 포함하여 Gradle 빌드 환경 을 구성하는 방법에 대해 배웁니다.
* 빌드를 효과적으로 구조화 하는 방법 배우기
* Gradle의 로깅을 구성 하고 빌드에서 사용하십시오

# 참조
-----
* [migrating_from_maven](https://docs.gradle.org/current/userguide/migrating_from_maven.html)
* [Gradle Plugin Portal](https://plugins.gradle.org/)
* [maven-pom-profiles](https://blog.gradle.org/maven-pom-profiles)