---
layout: post
title: "vagrant 처음 사용해 보기"
date: 2018-06-25 11:30:00 +0900
comments: true
tags : ["GETTING STARTED"]
categories : ["vagrant"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### vagrant 처음 사용해 보기

vagrant는 부랑자, 방랑자? 라고 뜻 가상환경을 편하게 관리 할수 있는 툴이다.
인턴분들이 이것으로 셋팅해서 접속이 안된다고 해서 한번 테스트 해볼려고 셋팅 중입니다.

사용하기 쉬운 워크플로우 자동화에 중점을 둔 기능이며 개발환경 셋팅시간을 단축시키고 생산 패리티를 높이며,
내컴터에서 동작합니다 라는 말을 과거에 유물로 변화게 합니다. ^^

여기서는 virtualbox 함께 사용합니다. 왜냐하면 무료이고 모든 주요 플랫폼에서 사용할수 있고 vagrant에 내장 되어 있기 때문입니다.

첫번째 프로젝트를 시작하기 전에 최신버전에 vagrant를 설치 하세요

#### 설치 및 실행

```

$ vagrant init hashicorp/precise64
$ vagrant up

```
위에 두 명령을 실행하면 Ubuntu 12.04 LTS 64 비트를 실행하는 VirtualBox 에서 완전히 실행되는 가상 시스템을 갖게됩니다.
SSH를 사용하여이 컴퓨터에 vagrant ssh연결할 수 있으며 주변에서 재생을 마쳤 으면 가상 컴퓨터를 종료 할 수 있습니다 vagrant destroy.

이제는 쉽게 작업 할 수있는 모든 프로젝트를 쉽게 상상할 수 있습니다! 
Vagrant를 사용하면 vagrant up프로젝트에 필요한 모든 의존성을 설치하고 네트워킹 또는 동기화 된 폴더를 설정하기 때문에 모든 프로젝트에서 작업하고 자신의 컴퓨터에서 편안하게 작업 할 수 있습니다.

이 가이드의 나머지 부분에서는 Vagrant의 더 많은 기능을 다루는보다 완벽한 프로젝트를 설정하는 과정을 안내합니다.

#### 프로젝트 설정

모든 Vagrant 프로젝트를 구성하는 첫 번째 단계는 Vagrantfile 을 만드는 것 입니다 . Vagrantfile의 목적은 두 가지입니다.

프로젝트의 루트 디렉토리를 표시하십시오. Vagrant에있는 많은 구성 옵션은이 루트 디렉토리에 상대적입니다.
프로젝트를 실행하는 데 필요한 장비 및 리소스의 종류와 설치할 소프트웨어 및 액세스 방법에 대해 설명하십시오.

Vagrant에는 Vagrant와 함께 사용할 디렉토리를 초기화하는 명령이 내장되어 vagrant init있습니다. 이 시작 안내서의 목적을 위해 터미널에서 따라하십시오 :

```

$ mkdir vagrant_getting_started
$ cd vagrant_getting_started
$ vagrant init

```
그러면 Vagrantfile 현재 디렉토리에 표시됩니다. 원하는 경우 Vagrantfile을 살펴볼 수 있습니다. 

또한 vagrant init기존 디렉토리에서 실행 하여 기존 프로젝트에 대한 Vagrant를 설정할 수 있습니다.

Vagrantfile은 버전 제어를 사용하는 경우 프로젝트에서 버전 제어를 위해 커밋됩니다. 이 방법으로, 그 프로젝트를 작업하는 모든 사람들은 사전 연구없이 Vagrant의 혜택을 볼 수 있습니다.

#### Box

Vagrant는 느리고 지루한 과정 인 처음부터 가상 머신을 구축하는 대신 기본 이미지를 사용하여 가상 시스템을 신속하게 복제합니다. 
이러한 기본 이미지는 Vagrant에서 "Box"로 알려져 있으며 Vagrant 환경에 사용할 상자를 지정하면 항상 새로운 Vagrantfile을 만든 후 첫 번째 단계가됩니다.

##### Box 설치
시작하기 개요 페이지 에서 명령을 실행 한 경우 이미 상자를 이미 설치 했으므로 아래 명령을 다시 실행할 필요가 없습니다. 그러나 상자를 관리하는 방법에 대해 자세히 알아 보려면이 섹션을 읽는 것이 좋습니다.

박스는 Vagrant에 추가됩니다 vagrant box add. 이렇게하면 여러개의 Vagrant 환경에서 재사용 할 수 있도록 특정 이름 아래에 상자가 저장됩니다. 아직 상자를 추가하지 않았다면 지금 그렇게 할 수 있습니다.

```

$ vagrant box add hashicorp/precise64

```

HashiCorp의 Vagrant Cloud box 카탈로그 에서 "hashicorp / precise64"라는 상자를 다운로드합니다.이 카탈로그 는 상자 를 찾고 호스팅 할 수있는 곳입니다. HashiCorp의 Vagrant Cloud에서 상자를 다운로드하는 것이 가장 쉽지만 로컬 파일, 사용자 정의 URL 등에서 상자를 추가 할 수도 있습니다.

상자는 현재 사용자에 대해 전역으로 저장됩니다. 각 프로젝트는 복제 할 초기 이미지로 상자를 사용하고 실제 기본 이미지는 수정하지 않습니다. 즉 hashicorp/precise64 , 방금 추가 한 상자를 사용하는 두 개의 프로젝트가있는 경우 한 게스트 시스템에 파일을 추가해도 다른 시스템에는 영향을주지 않습니다.

위의 명령에서 상자가 네임 스페이스임을 알 수 있습니다. 상자는 슬래시로 구분 된 사용자 이름과 상자 이름의 두 부분으로 나뉩니다. 위의 예에서 사용자 이름은 "hashicorp"이고 상자는 "precise64"입니다. URL 또는 로컬 파일 경로를 통해 상자를 지정할 수도 있지만 시작 안내서에서 다루지는 않습니다.

네임 스페이스는 표준 상자를 보장하지 않습니다! 일반적인 오해는 "우분투"와 같은 네임 스페이스가 우분투 상자의 표준 공간을 나타냅니다. 이것은 사실이 아닙니다. Vagrant Cloud의 네임 스페이스는 GitHub의 네임 스페이스와 매우 유사하게 동작합니다. GitHub의 지원 팀이 누군가의 저장소에있는 문제를 지원할 수없는 것처럼 HashiCorp의 지원 팀은 제 3 자 게시 상자를 지원할 수 없습니다.

##### Box 사용

Vagrant에 상자가 추가되었으므로 프로젝트를 기본으로 사용하도록 구성해야합니다. 를 열고 Vagrantfile내용을 다음과 같이 변경하십시오

```

Vagrant.configure("2") do |config|
  config.vm.box = "hashicorp/precise64"
end

```

이 경우 "hashicorp / precise64"는 위의 상자를 추가하는 데 사용한 이름과 일치해야합니다. 이것은 어떻게 방글리언트가 어떤 상자를 사용할 것인지를 안다는 것입니다. 상자가 이전에 추가되지 않은 경우, Vagrant는 자동으로 상자를 다운로드하여 추가합니다.

config.vm.box_version 예를 들어 다음을 지정하여 명시 적 버전의 상자를 지정할 수 있습니다 .

```

Vagrant.configure("2") do |config|
  config.vm.box = "hashicorp/precise64"
  config.vm.box_version = "1.1.0"
end

```

다음을 사용하여 직접 상자에 URL을 지정할 수도 있습니다 config.vm.box_url.

```

Vagrant.configure("2") do |config|
  config.vm.box = "hashicorp/precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"
end

```

#### Up And SSH

첫 번째 Vagrant 환경을 부팅 할 차례입니다. 터미널에서 다음을 실행하십시오.


```

$ vagrant up

```

1 분 안에이 명령이 완료되고 우분투를 실행하는 가상 머신을 갖게됩니다. Vagrant가 UI없이 가상 시스템을 실행하기 때문에 실제로 는 아무 것도 볼 수 없습니다 . 실행중인 것을 증명하기 위해 시스템에 SSH를 넣을 수 있습니다.

```

$ vagrant ssh

```

이 명령은 본격적인 SSH 세션으로 당신을 끌어 들일 것입니다. 기계와 상호 작용하고 원하는대로하십시오. rm -rf /Vagrant가 /vagrant Vagrantfile이 들어있는 호스트의 디렉토리와 디렉토리를 공유하기 때문에 유혹 될 수도 있지만주의 해야합니다. 그러면 모든 파일을 삭제할 수 있습니다. 공유 폴더는 다음 섹션에서 다룹니다.

방금 일어난 일을 생각해보십시오. 터미널에 구성 및 명령이 한 줄만 있으면 모든 기능을 갖춘 SSH 액세스 가능 가상 시스템을 사용할 수 있습니다. 시원한. SSH 세션은로 끝날 수 있습니다 CTRL+D.

```

vagrant@precise64:~$ logout
Connection to 127.0.0.1 closed.

```
시스템을 둘러 vagrant destroy 보면서 호스트 시스템에서 다시 실행 하면 Vagrant가 가상 시스템에서 모든 리소스의 사용을 종료합니다.

이 vagrant destroy명령은 실제로 다운로드 한 상자 파일을 제거하지 않습니다. 상자 파일 을 완전히 제거 하려면 이 vagrant box remove 명령을 사용하십시오 .

#### Synced Folders

가상 머신을 사용하는 것이 쉽지만 SSH를 통한 일반 터미널 기반 편집기를 사용하여 파일을 편집하는 사람은 많지 않습니다. 운 좋게도 당신은 할 필요가 없습니다. Vagrant는 동기화 된 폴더 를 사용 하여 파일을 게스트 시스템과 자동으로 동기화합니다.

기본적으로 Vagrant는 /vagrant게스트 시스템 의 디렉토리에 프로젝트 디렉토리 (Vagrantfile이있는 디렉토리 )를 공유합니다 .

당신 vagrant ssh이 당신의 기계에 들어갔 을 때 , 당신은 들어 /home/vagrant있습니다. /home/vagrant동기화 된 /vagrant디렉토리 와 다른 디렉토리입니다 .

터미널에 호환되지 않는 게스트 추가에 대한 오류 (또는 게스트 추가 없음)가 표시되면 상자를 업데이트하거나와 같은 다른 상자를 선택해야 할 수 있습니다 hashicorp/precise64. 일부 사용자는 vagrant-vbguest 플러그인을 사용해도 성공 했지만 Vagrant 핵심 팀에서 공식적으로 지원하지는 않습니다.

다음 vagrant up과 같이 SSH를 다시 실행 하여 다음을 확인하십시오.

```
$ vagrant up
...
$ vagrant ssh
...
vagrant@precise64:~$ ls /vagrant
Vagrantfile

```

실제로 가상 시스템 내부에있는 Vagrantfile은 실제 호스트 시스템에있는 Vagrantfile과 동일합니다. 파일을 터치하여 자신에게 증명할 수 있습니다.
 
```

vagrant@precise64:~$ touch /vagrant/foo
vagrant@precise64:~$ exit
$ ls
foo Vagrantfile

``` 

우와! "foo"가 호스트 시스템에 있습니다. 보시다시피, Vagrant는 폴더를 동기화 된 상태로 유지했습니다.

로 동기화 된 폴더 , 당신은 당신의 호스트 컴퓨터에 자신의 편집기를 사용하여 파일을 게스트 컴퓨터에 동기화가 계속 할 수 있습니다.

#### Provisioning

자, 우리는 우분투의 기본 복사본을 실행하는 가상 머신을 가지고 있으며 우리 머신에서 파일을 편집하여 가상 머신에 동기화 할 수 있습니다. 이제 웹 서버를 사용하여 파일을 제공하겠습니다.

우리는 SSH를 사용하여 웹 서버를 설치하고 진행할 수 있습니다. 그러나 Vagrant를 사용하는 모든 사람들은 똑같은 일을해야합니다. 대신 Vagrant는 자동 프로비저닝 을 기본적으로 지원합니다 . 이 기능을 사용 vagrant up 하면 손님 시스템을 반복적으로 만들고 사용할 준비가 될 때마다 Vagrant가 자동으로 소프트웨어를 설치 합니다.

##### 아파치 설치하기 

우리는 기본 프로젝트를 위해 아파치 를 셋업 할 것이고 쉘 스크립트를 사용하여 그렇게 할 것이다. 다음 쉘 스크립트를 작성 bootstrap.sh하여 Vagrantfile과 동일한 디렉토리에 저장하십시오.

```

#!/usr/bin/env bash

apt-get update
apt-get install -y apache2
if ! [ -L /var/www ]; then
  rm -rf /var/www
  ln -fs /vagrant /var/www
fi

```
다음으로 우리 머신을 설정할 때이 쉘 스크립트를 실행하도록 Vagrant를 설정합니다. Vagrantfile을 편집하면 다음과 같이됩니다.

```

Vagrant.configure("2") do |config|
  config.vm.box = "hashicorp/precise64"
  config.vm.provision :shell, path: "bootstrap.sh"
end

```

"provision"라인은 새로운 것으로, Vagrant에게 파일 을 사용 shell하여 머신을 설정 하기 위해 프로 바이더를 사용하도록 지시 bootstrap.sh합니다. 파일 경로는 프로젝트 루트 (Vagrantfile이있는 위치)의 위치에 상대적입니다.

##### Provision!

제공!
모든 것이 구성되면, vagrant up당신의 머신을 만들기 위해 실행 하고 Vagrant가 자동으로 프로비저닝 할 것입니다. 쉘 스크립트의 출력이 터미널에 표시되어야합니다. 게스트 시스템이 이미 이전 단계에서 실행 중이면 실행 vagrant reload --provision하십시오. 그러면 가상 시스템이 신속하게 재시작되며 초기 가져 오기 단계는 건너 뜁니다. 
reload 명령의 준비 플래그는 일반적으로 Vagrant가 처음에이 작업을 수행하기 때문에 Vagrant가 공급자를 실행하도록 지시합니다 vagrant up.

Vagrant가 실행을 완료하면 웹 서버가 실행됩니다. 자신의 브라우저에서 웹 사이트를 볼 수는 없지만 시스템에서 SSH의 파일을로드하여 프로비저닝이 작동하는지 확인할 수 있습니다.

```

$ vagrant ssh
...
vagrant@precise64:~$ wget -qO- 127.0.0.1


```

이는 위의 쉘 스크립트에서 Apache를 설치하고 DocumentRootApache /vagrant 의 기본 설정이 Vagrant의 기본 동기화 된 폴더 설정 인 Google 디렉토리 를 가리 키기 때문에 작동합니다 .

더 많은 파일을 만들어 터미널에서 볼 수 있지만, 다음 단계에서는 네트워킹 옵션을 다루기 때문에 자체 브라우저를 사용하여 게스트 시스템에 액세스 할 수 있습니다.

복잡한 프로비저닝 스크립트의 경우 매번 빌드하지 않고 미리 설치된 패키지로 사용자 정의 Vagrant 상자를 패키지하는 것이 더 효율적일 수 있습니다. 이 항목은 시작 안내서에서 다루지 않지만 포장 사용자 지정 상자 설명서 에서 찾을 수 있습니다 

#### Networking

이 시점에서 우리는 호스트의 파일을 수정하고 게스트와 자동으로 동기화 할 수있는 기능을 갖춘 웹 서버를 가동했습니다. 그러나 단순히 기계 내부의 단말기에서 웹 페이지에 액세스하는 것은별로 만족스럽지 않습니다. 이 단계에서는 Vagrant의 네트워킹 기능을 사용하여 호스트 시스템에서 시스템에 액세스하기위한 추가 옵션을 제공합니다.

##### Port Forwarding

하나의 옵션은 포트 포워딩 을 사용 하는 것 입니다. 포트 전달을 사용하면 게스트 시스템의 포트를 지정하여 호스트 시스템의 포트를 통해 공유 할 수 있습니다. 이렇게하면 자신의 컴퓨터에있는 포트에 액세스 할 수 있지만 실제로 모든 네트워크 트래픽은 게스트 시스템의 특정 포트로 전달됩니다.

우리가 손님의 아파치에 접근 할 수 있도록 전달 된 포트를 설정합시다. 그렇게하면 다음과 같은 Vagrantfile을 간단하게 편집 할 수 있습니다.

```

Vagrant.configure("2") do |config|
  config.vm.box = "hashicorp/precise64"
  config.vm.provision :shell, path: "bootstrap.sh"
  config.vm.network :forwarded_port, guest: 80, host: 4567
end

```

을 실행 vagrant reload또는 vagrant up이러한 변경 사항을 적용 할 수 있도록 (기계가 이미 실행중인 경우에 따라).

컴퓨터가 다시 실행되면 http://127.0.0.1:4567브라우저에 로드 하십시오. Vagrant가 자동으로 설정 한 가상 시스템에서 제공되는 웹 페이지가 표시되어야합니다.

##### Other Networking

또한 Vagrant에는 다른 유형의 네트워킹 기능이있어 게스트 시스템에 고정 IP 주소를 할당하거나 게스트 시스템을 기존 네트워크에 연결할 수 있습니다. 다른 옵션에 관심이 있으시면 네트워킹 페이지를 읽으십시오


#### Share

이제 우리는 웹 서버를 설치하여 실행하고 액세스 할 수있게되었으므로, 우리는 상당히 기능적인 개발 환경을 가지고 있습니다. 그러나 개발 환경을 제공하는 것 외에도 Vagrant는 이러한 환경에서 쉽게 공유하고 공동 작업 할 수있게 해줍니다. Vagrant에서 이것을 수행하는 주요 기능을 Vagrant Share 라고 합니다.

Vagrant Share를 사용하면 인터넷에 연결된 전세계 어느 누구에게도 Vagrant 환경을 공유 할 수 있습니다. 인터넷에 연결된 전세계 모든 장치에서 Vagrant 환경으로 직접 연결되는 URL을 제공합니다.

실행 vagrant share:

```

$ vagrant share
...
==> default: Creating Vagrant Share session...
==> default: HTTP URL: http://b1fb1f3f.ngrok.io
...

```

귀하의 URL은 다를 수 있으므로 위의 URL을 시도하지 마십시오. 대신 vagrant share출력 된 URL을 복사하여 웹 브라우저에서 방문하십시오. 이전에 설정 한 Apache 페이지를로드해야합니다.

공유 폴더의 파일을 수정하고 URL을 새로 고치면 업데이트가 표시됩니다! URL은 사용자의 Vagrant 환경으로 직접 라우팅되며 인터넷에 연결된 전세계 모든 장치에서 작동합니다.

공유 세션을 끝내 Ctrl+C려면 터미널을 누르 십시오. 환경을 더 이상 공유하지 않도록 URL을 다시 새로 고칠 수 있습니다.

방랑자 공유는 단순히 HTTP 공유보다 훨씬 강력합니다. 자세한 내용은 전체 Vagrant Share 문서를 참조하십시오 .

상용 수준의 많은 트래픽을 받도록 설계 되어 있지는 않다.

#### Teardown

이제 기본 웹 개발에 사용할 수있는 완전한 기능을 갖춘 가상 시스템을 갖게되었습니다. 그러나 이제는 기어 전환, 어쩌면 다른 프로젝트에 대한 작업, 점심 식사로 나가기, 어쩌면 집에 갈 시간이라고 말할 수 있습니다. 우리는 어떻게 우리의 개발 환경을 정리합니까?

Vagrant를 사용 하면 게스트 시스템 을 일시 중단 , 중지 또는 파기 할 수 있습니다. 
각 옵션에는 장단점이 있습니다. 자신에게 가장 적합한 방법을 선택하십시오.

Suspending : 호출하여 가상 시스템을 일시 중단 하면 시스템 vagrant suspend의 현재 실행 상태가 저장되고 중지됩니다. 
작업을 다시 시작할 준비가되면 그냥 실행 vagrant up하면 중단했던 부분부터 다시 시작됩니다. 이 방법의 가장 큰 장점은 초고속이며 일반적으로 작업을 중지하고 시작하는 데 5 ~ 10 초 밖에 걸리지 않는다는 것입니다. 단점은 가상 컴퓨터가 여전히 디스크 공간을 차지하고 디스크에 가상 컴퓨터 RAM의 모든 상태를 저장하는 데 더 많은 디스크 공간이 필요하다는 것입니다.

Halting : 정지 호출하여 가상 머신을 vagrant halt정상적으로 게스트 머신 다운 게스트 운영 체제 및 전원을 차단합니다. 
vagrant up다시 부팅 할 준비가되면 사용할 수 있습니다 . 이 방법의 장점은 디스크의 내용을 보존하고 다시 시작되도록하여 시스템을 완전히 종료하는 것입니다. 단점은 콜드 부팅에서 시작하는 데 약간의 시간이 걸리고 게스트 컴퓨터는 여전히 디스크 공간을 소모한다는 것입니다.

Destroying : 전화로 가상 시스템을 삭제 하면 vagrant destroy시스템에서 게스트 시스템의 모든 흔적이 제거됩니다. 게스트 시스템을 중지하고 전원을 끄고 모든 게스트 하드 디스크를 제거합니다. 다시 일할 준비가되면 다시 a를 발행하십시오 vagrant up. 이것의 장점은 기계에 벼랑 이 남지 않는다는 것입니다. 
게스트 시스템에서 사용하는 디스크 공간 및 RAM을 회수하고 호스트 시스템을 깨끗하게 유지합니다. 단점은 기계를 vagrant up다시 가져와 다시 공급 해야 하기 때문에 작업을 다시 시작하는 데 약간의 시간이 걸리는 것입니다.

#### Rebuild

프로젝트가 시작되면 언제든 리빌드 할수 있다 명령어는 

```

$ vagrant up

```

#### Providers

이 시작 안내서에서 프로젝트는 항상 VirtualBox로 백업되었습니다 . 그러나 Vagrant는 VMware , AWS 등과 같은 다양한 백엔드 공급자와 함께 작업 할 수 있습니다 . 설정하는 방법에 대한 자세한 내용은 각 공급자의 페이지를 참조하십시오.

일단 공급자가 설치되면 vagrant up적절한 공급자와 함께 Vagrantfile을 수정하지 않아도 되고 Vagrant가 나머지 작업을 수행합니다.

```

$ vagrant up --provider=vmware_fusion

```

이를 클라우드로 옮길 준비가 되셨습니까? AWS로 가져 가십시오.

```

$ vagrant up --provider=aws

```

vagrant up다른 공급자로 실행 하면 다른 모든 Vagrant 명령에 사용할 공급자를 알 필요가 없습니다. 
Vagrant가 자동으로 알아낼 수 있습니다. 그래서 당신이 SSH 또는 파괴 또는 다른 어떤 준비가되면 그냥 같은 명령을 실행합니다 vagrant destroy. 추가 플래그가 필요하지 않습니다.


# 참조 
-----
* [vagrant](https://www.vagrantup.com)
* [virtualbox](https://www.virtualbox.org/)
* [Vagrant Boxes](https://app.vagrantup.com/boxes/search)
