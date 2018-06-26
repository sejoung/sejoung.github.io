---
layout: post
title: "vagrant_redis"
date: 2018-06-25 15:30:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### vagrant로 레디스 설치하기 

첨에 Vagrantfile 파일을 만들이 위해서 만들어질 폴더에서 아래 명령어를 입력한다.

```

$ vagrant init

```

위에 명령어가 실행되면 파일이 만들어진다 그럼 준비가 된것이다 그럼 box를 사용할꺼니 우분투 박스를 아래에 명령어로 추가한다.

```

$ vagrant box add ubuntu/trusty64

```

위처럼 추가 하면 준비가 되었다 그럼 Vagrantfile을 열어서 아래처럼 수정을 할것이다.

```

  config.vm.box = "ubuntu/trusty64"
  # 포트포워딩 추가 레디스용
  config.vm.network "forwarded_port", guest: 6379, host: 6379
  # 메모리 사이즈 지정
  config.vm.provider "virtualbox" do |vb|
     vb.memory = "1024"
  end
  
  
  
```

또 redis.conf 파일도 수정하겠다.

```
# 바인드 되는 host를 전체로 하기 위해 주석
# bind 127.0.0.1

# 작업 디렉토리 수정
dir /var/redis/

# 외부접속을 위해 
protected-mode no

```
실행 고고 씽

```

$ vagrant up

```

현재 실행 상태가 저장되고 중지
 
```

$ vagrant suspend

```
정상적으로 게스트 머신 다운 게스트 운영 체제 및 전원을 차단

```

$ vagrant halt

```
시스템에서 게스트 시스템의 모든 흔적이 제거

```

$ vagrant destroy

```

위에 파일은 아래의 깃허브에 저장했다.

# 참조 
-----
* [vagrant](https://www.vagrantup.com)
* [sejoung github vagrant_redis repo](https://github.com/sejoung/vagrant_redis)

