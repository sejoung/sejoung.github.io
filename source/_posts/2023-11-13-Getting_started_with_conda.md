---
layout: post
title: "getting started with conda"
date: 2023-10-18 10:50 +0900
comments: true
tags: [ "conda","anaconda",'python']
categories: [ "tool" ]
sitemap:
changefreq: daily
priority: 1.0
---

# getting started with conda


Conda는 Windows용 Anaconda Prompt나 macOS 또는 Linux용 터미널 창에서 명령줄 명령과 함께 사용하는 강력한 패키지 관리자이자 환경 관리자입니다.

Conda 시작을 위한 이 20분 가이드를 통해 Conda의 주요 기능을 시험해 볼 수 있습니다. 이 가이드를 마치면 conda가 어떻게 작동하는지 이해해야 합니다.


## 콘다 관리

다음을 입력하여 시스템에 conda가 설치되어 실행되고 있는지 확인하세요.

```shell
conda --version
```

Conda를 최신 버전으로 업데이트합니다. 다음을 입력하세요.

```shell
conda update conda
```

## 환경 관리

Conda를 사용하면 다른 환경과 상호 작용하지 않는 파일, 패키지 및 해당 종속성을 포함하는 별도의 환경을 만들 수 있습니다.

conda를 사용하기 시작하면 이미 이라는 기본 환경이 있습니다 base. 하지만 기본 환경에 프로그램을 넣고 싶지는 않습니다. 프로그램을 서로 격리하려면 별도의 환경을 만드세요.


새 환경을 만들고 여기에 패키지를 설치합니다.

환경 이름을 지정 snowflakes하고 BioPython 패키지를 설치하겠습니다. Anaconda 프롬프트 또는 터미널 창에 다음을 입력하십시오.

```shell
conda create --name snowflakes biopython
```

새 환경을 사용하거나 "활성화"하려면 다음을 입력하십시오.

```shell

conda activate snowflakes

```

모든 환경 목록을 보려면 다음을 입력하세요.

```shell
conda info --envs
```

현재 환경을 기본값(base)으로 다시 변경합니다. 

```shell
conda activate
```


## Python 관리

새 환경을 생성하면 conda는 Anaconda를 다운로드하고 설치할 때 사용한 것과 동일한 Python 버전을 설치합니다. 
Python 3.5와 같은 다른 버전의 Python을 사용하려면 새 환경을 만들고 원하는 Python 버전을 지정하기만 하면 됩니다.


Python 3.9가 포함된 "snakes"라는 새 환경을 만듭니다.

```shell
conda create --name snakes python=3.9
```

새 환경을 활성화합니다.

```shell
conda activate snakes
```

snakes 환경이 추가되었고 활성화되었는지 확인합니다.

```shell
conda info --envs
```

활성 환경은 프롬프트 앞에 다음과 같이 (괄호) 또는 [괄호]로 표시됩니다.

```shell
(snakes) $
```

현재 환경에 어떤 버전의 Python이 있는지 확인합니다.

```shell
python --version
```

## 패키지 관리

이미 설치한 패키지를 찾으려면 먼저 검색하려는 환경을 활성화하세요. 위에서 스네이크 환경을 활성화 하는 명령을 찾아보세요.

설치하지 않은 "beautifulsoup4" 패키지가 Anaconda 저장소에서 사용 가능한지 확인하십시오(인터넷에 연결되어 있어야 함).

```shell
conda search beautifulsoup4
```

현재 환경에 이 패키지를 설치합니다.

```shell
conda install beautifulsoup4
```

새로 설치된 프로그램이 이 환경에 있는지 확인하십시오.

```shell
conda list
```

# 참조
-----

* [콘다 시작하기](https://conda.io/projects/conda/en/latest/user-guide/getting-started.html)
