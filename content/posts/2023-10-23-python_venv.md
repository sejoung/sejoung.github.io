---
layout: post
title: "PEP 405 – Python Virtual Environments"
date: 2023-10-23 11:19 +0900
comments: true
tags: [ "venv","virtual environments","PEP 405" ]
categories: [ "python" ]
sitemap:
changefreq: daily
priority: 1.0
---

# Python Virtual Environments

## Abstract

이 PEP는 자체 사이트 디렉토리가 있는 경량 "가상 환경"을 위한 메커니즘을 Python에 추가하고 선택적으로 시스템 사이트 디렉토리에서 격리할 것을 제안합니다. 
각 가상 환경에는 고유한 Python 바이너리(다양한 Python 버전으로 환경 생성 가능)가 있으며 사이트 디렉터리에 독립적으로 설치된 Python 패키지 세트가 있을 수 있지만 
기본 설치된 Python과 표준 라이브러리를 공유합니다.

## Motivation

Python 가상 환경의 유용성은 주로 Ian Bicking의 virtualenv와 같은 기존 타사 가상 환경 도구의 인기로 인해 이미 잘 확립되었습니다. 
가상 환경은 종속성 관리 및 격리, 시스템 관리자 액세스 없이 Python 패키지를 쉽게 설치 및 사용하고 
여러 Python 버전에 걸쳐 Python 소프트웨어를 자동으로 테스트하는 등의 용도로 이미 널리 사용되고 있습니다.

기존 가상 환경 도구는 Python 자체의 동작으로 인한 지원 부족으로 어려움을 겪습니다. 
Python 바이너리를 가상 환경에 복사하지 않는 virtualenv 와 같은 도구는 시스템 사이트 디렉터리로부터 안정적인 격리를 제공할 수 없습니다. 
sitePython 바이너리를 복사하는 Virtualenv는 시작할 때마다 섬세한 부트 스트랩 댄스를 수행하기 위해 Python 모듈의 대부분을 복제하고 끊임없이 변화하는 
표준 라이브러리 모듈 세트를 가상 환경에 수동으로 심볼릭 링크/복사해야 합니다.
(Virtualenv는 격리를 제공하기 위해 바이너리를 복사해야 합니다.)

PYTHONHOME가상 환경을 위한 Python의 유일한 기존 내장 솔루션인 환경 변수는 전체 표준 라이브러리를 모든 환경에 복사/심볼링 연결해야 합니다. 
전체 표준 라이브러리를 복사하는 것은 간단한 솔루션이 아니며 심볼릭 링크에 대한 크로스 플랫폼 지원은 일관성이 없습니다
(심지어 이를 지원하는 Windows 플랫폼에서도 이를 생성하려면 관리자 권한이 필요한 경우가 많습니다).

Python과 통합되고 기존 타사 도구에 대한 수년간의 경험을 활용하는 가상 환경 메커니즘은 유지 관리를 줄이고 안정성을 높이며 모든 Python 사용자가 더 쉽게 사용할 수 있습니다.


## Specification

Python 바이너리가 실행되면 접두사(에 저장됨 sys.prefix)를 결정하려고 시도한 다음 표준 라이브러리 및 기타 주요 파일을 찾는 데 사용되며 
모듈은 site사이트 패키지 디렉터리의 위치를 결정합니다. 
현재 접두사는 먼저 표준 라이브러리의 존재를 나타내는 PYTHONHOME마커 파일(os.py바이너리)

이 PEP는 이 검색에 새로운 첫 번째 단계를 추가할 것을 제안합니다. 
파일 pyvenv.cfg이 Python 실행 파일 옆에 있거나 그 위의 한 디렉터리에서 
발견되면(실행 파일이 심볼릭 링크인 경우 역참조되지 않음) 이 파일에서 형식의 줄을 검색합니다. 
키가 발견 되면 이는 Python 바이너리가 가상 환경에 속하고 키의 값이 이 가상 환경을 만드는 데 사용된 Python 실행 파일이 포함된 디렉터리임을 의미합니다. key = valuehomehome

home이 경우 접두사 찾기 는 기본 설치의 접두사를 찾는 효과적인 Python 바이너리 위치로 키 값을 사용하여 정상적으로 계속됩니다. 
sys.base_prefix은 이 값으로 설정되고 는 가 sys.prefix포함된 디렉터리로 설정됩니다 pyvenv.cfg.
(pyvenv.cfg가 발견되지 않거나 키를 포함하지 않는 경우 home접두사 찾기는 정상적으로 계속되며 와 sys.prefix같습니다 sys.base_prefix.)

또한 sys.base_exec_prefix가 추가되고 와 관련하여 유사하게 처리됩니다 sys.exec_prefix.
(sys.exec_prefix와 동일 sys.prefix하지만 플랫폼별 파일의 경우 기본적으로 와 동일한 값을 갖습니다 sys.prefix.)

및 표준 라이브러리 모듈은 표준 라이브러리와 헤더 파일이 / 를 기준으로 검색되는 반면 사이트 패키지 디렉터리("purelib" 및 "platlib") 
site는 여전히 / 를 기준으로 검색되도록 수정됩니다 .sysconfigsys.base_prefixsys.base_exec_prefixsysconfigsys.prefixsys.exec_prefix

pyvenv.cfg따라서 가장 간단한 형태의 Python 가상 환경은 파일 및 사이트 패키지 디렉터리 와 함께 제공되는 Python 바이너리의 복사본 또는 심볼릭 링크로만 구성됩니다 .


### 시스템 사이트 패키지로부터 격리

기본적으로 가상 환경은 시스템 수준 사이트 패키지 디렉터리와 완전히 격리됩니다.

파일에 값이 대소문자를 구분하지 않는 pyvenv.cfg키가 포함되어 있는 경우 모듈은 가상 환경 사이트 디렉터리 뒤에 시스템 사이트 디렉터리도 추가합니다. 
따라서 시스템에 설치된 패키지는 계속 가져올 수 있지만 가상 환경에 설치된 동일한 이름의 패키지가 우선적으로 적용됩니다.include-system-site-packagestruesitesys.path

PEP 370 사용자 수준 사이트 패키지는 venv 목적을 위한 시스템 사이트 패키지의 일부로 간주됩니다. 
격리된 venv에서는 사용할 수 없지만 venv에서는 사용할 수 있습니다 .include-system-site-packages = true

### 가상 환경 만들기
venv또한 이 PEP 에서는 가상 환경 생성을 구현하는 표준 라이브러리에 새 모듈을 추가할 것을 제안합니다. 
이 모듈은 다음 플래그를 사용하여 실행할 수 있습니다 -m

```shell
python3 -m venv /path/to/new/virtual/environment
```

이를 더욱 편리하게 하기 위해 설치된 스크립트 pyvenv도 제공됩니다.

```shell
pyvenv /path/to/new/virtual/environment
```

이 명령을 실행하면 대상 디렉터리가 생성되고(아직 존재하지 않는 상위 디렉터리 생성) 해당 디렉터리 pyvenv.cfg에 home명령이 실행된 Python 설치를 가리키는 키가 포함된 파일이 배치됩니다.
또한 실행 파일 의 복사본(또는 심볼릭 링크) 과 표준 라이브러리 모듈 의 스크립트가 포함된 하위 디렉터리 bin/(또는 Windows의 경우) 를 생성합니다 
(PyPI에서 새 venv로 패키지를 쉽게 설치할 수 있도록 함). 
그리고 (처음에는 비어 있는) (또는 Windows의 경우) 하위 디렉터리를 만듭니다

대상 디렉터리가 이미 존재하는 경우 옵션이 제공되지 않는 한 오류가 발생하며, --clear이 경우 대상 디렉터리가 삭제되고 가상 환경 생성이 평소대로 진행됩니다.

생성된 파일에는 기본적으로 옵션과 함께 실행되는 경우 로 설정된 키 pyvenv.cfg도 포함됩니다

에 여러 경로를 지정할 수 있으며 pyvenv, 이 경우 제공된 각 경로에 지정된 옵션에 따라 동일한 가상 환경이 생성됩니다.

이 모듈은 또한 venv의 또는 디렉터리 venv에 POSIX 및 Windows 시스템용 "셸 활성화 스크립트"를 배치합니다. 이러한 스크립트는 단순히 가상 환경의 (또는 ) 
디렉터리를 사용자의 셸 PATH 앞에 추가합니다. 이는 가상 환경을 사용하는 데 반드시 필요한 것은 아니지만
(venv의 Python 바이너리 또는 스크립트에 대한 명시적 경로를 사용할 수도 있으므로) 편리합니다.


pysetup다른 Python 패키지 관리자가 일반 Python 설치에 설치하는 것과 동일한 방식으로 가상 환경에 패키지를 
설치할 수 있도록 허용 하고 적절한 경우 sysconfig대신 사용할 수 있는 특수한 가상 환경을 피하기 위해 내부 가상 환경 레이아웃은 다음을 모방 합니다. 
각 플랫폼의 Python 설치 자체 레이아웃. 따라서 POSIX 시스템의 일반적인 가상 환경 레이아웃은 다음과 같습니다.

가상 환경에 설치된 타사 패키지의 Python 모듈은 디렉터리에 배치되고 site-packages해당 실행 파일은 bin/또는 에 배치됩니다 Scripts.

### Sysconfig 설치 구성표 및 사용자 사이트

이 접근 방식은 venvs에 대한 새로운 sysconfig 설치 체계를 도입하지 않도록 명시적으로 선택합니다. 
오히려 수정을 통해 sys.prefix위치 기반이 되는 기존 설치 구성표가 sys.prefix가상 환경에서 작동하도록 보장합니다. 
경로가 에 상대적이지 않은 다른 설치 구성표(예: 사용자 사이트 구성표)에 대한 설치는 sys.prefixvenv의 영향을 전혀 받지 않습니다.

가상 특정 sysconfig 체계를 기반으로 Python 가상 환경의 대체 구현을 만드는 것이 가능할 수 있지만 가상 환경 내에서 작동하는지 여부를 인식하려면 더 많은 코드가 필요하므로 덜 강력합니다.

### 복사본과 심볼릭 링크

이 PEP의 기술은 일반적으로 복사되거나 심볼릭 링크된 Python 바이너리(및 Windows에서 필요한 기타 DLL)와 동일하게 작동합니다. 
기본 Python 설치로 업그레이드하는 경우 venv에 복사된 Python 실행 파일이 설치된 표준 라이브러리와 동기화되지 않아 수동 업그레이드가 필요할 수 있으므로 가능한 경우 
Symlinking을 사용하는 것이 좋습니다.

심볼릭 링크에는 몇 가지 크로스 플랫폼 문제가 있습니다.

* 모든 Windows 버전이 심볼릭 링크를 지원하는 것은 아니며, 지원하는 경우에도 심볼릭 링크를 생성하려면 관리자 권한이 필요한 경우가 많습니다.
* Python의 OS X 프레임워크 빌드에서 sys.executable은 실제 Python 바이너리를 실행하는 스텁일 뿐입니다. 
이 스텁을 심볼릭 링크하는 것은 작동하지 않습니다. 복사해야 합니다. 
(다행히도 스텁도 작고 Python으로의 버그 수정 업그레이드로 변경되지 않으므로 복사하는 것은 문제가 되지 않습니다.)

따라서 이 PEP는 Windows 및 OS X 프레임워크 빌드를 제외한 모든 플랫폼에서 바이너리를 심볼릭 링크하도록 제안합니다. --symlink 
적절한 권한이 있는 경우 이를 지원하는 Windows 버전에서 심볼릭 링크를 강제로 사용하도록 하는 옵션을 사용할 수 있습니다. 
(이 옵션은 OS X 프레임워크 빌드에 영향을 미치지 않습니다. 왜냐하면 심볼릭 링크는 그곳에서 작동할 수 없고 이점도 없기 때문입니다.)


Windows에서 가 --symlink사용되지 않는 경우 이는 기본 Python 설치가 업그레이드되면 venv의 Python 바이너리 및 DLL이 업데이트되어야 함을 의미합니다. 
그렇지 않으면 업그레이드된 표준 라이브러리와 불일치 문제가 발생할 수 있습니다. pyvenv 스크립트는 --upgrade기존 venv에서 이 업그레이드를 쉽게 수행하기 위한 옵션을 허용합니다.

### Include files

현재 virtualenv 핸들에는 다음과 같은 방식으로 파일이 포함됩니다.

설치된 Python의 포함 파일이 에 있는 POSIX 시스템 에서 ${base_prefix}/include/pythonX.Xvirtualenv ${venv}/include/는. 
Python의 포함 파일이 있고 심볼릭 링크를 안정적으로 사용할 수 없는 Windows에서는 virtualenv 가. 
이렇게 하면 virtualenv 내에 빌드되고 설치된 확장 모듈이 항상

이 솔루션은 확장 모듈이 자체 헤더 파일을 설치할 때 이상적이지 않습니다. 
해당 헤더 파일의 기본 설치 위치가 쓰기 불가능한 시스템 디렉터리에 대한 심볼릭 링크일 수 있기 때문입니다. 
한 설치 프로그램인 pip는 헤더 파일을 비표준 위치에 설치하여 명시적으로 이 문제를 해결합니다 ${venv}/include/site/pythonX.X/. Python에는 
현재 사이트별 포함 디렉터리에 대한 표준 추상화가 없기 때문입니다.

이 PEP는 약간 다른 접근 방식을 제안하지만 본질적으로 동일한 효과와 동일한 장단점을 갖습니다. 
포함 파일을 venv에 심볼릭 링크하거나 복사하는 대신 헤더 파일이 base_prefix항상 prefix. 
(우리는 또한 include/venv 내에 디렉토리를 생성하므로 설치 프로그램은 env 내에 설치된 포함 파일을 저장할 위치를 갖습니다.)

distutils/packaging 및 확장에 따라 pyvenv의 포함 파일을 더 잘 처리하는 것은 자체 미래 PEP를 받을 자격이 있는 영역입니다. 
지금은 virtualenv의 동작이 실제로 적어도 "충분히 좋은" 것으로 입증되었다고 제안합니다.

### API

위에 설명된 상위 수준 방법은 타사 가상 환경 생성자가 필요에 따라 환경 생성을 사용자 정의할 수 있는 메커니즘을 제공하는 간단한 API를 사용합니다.

모듈 에는 인스턴스화 시 다음 키워드 인수를 허용하는 클래스가 venv포함되어 있습니다 .EnvBuilder

* system_site_packages- 시스템 Python 사이트 패키지를 환경에서 사용할 수 있어야 함을 나타내는 부울 값입니다. 기본값은 False.
* clear- true인 경우 예외를 발생시키는 대신 기존 대상 디렉터리를 삭제하는 부울 값입니다. 기본값은 False.
* symlinkspythonw.exe- 복사하는 대신 Python 바이너리(및 필요한 DLL 또는 기타 바이너리(예: ))를 심볼릭 링크할지 여부를 나타내는 부울 값입니다 . 기본값은 False.


인스턴스화된 env-builder에는 create가상 환경을 포함할 대상 디렉터리의 경로(현재 디렉터리에 대한 절대 또는 상대 경로)를 필수 인수로 사용하는 메서드가 있습니다. 
이 create메서드는 지정된 디렉터리에 환경을 생성하거나 적절한 예외를 발생시킵니다.

모듈 은 편의를 위해 venv모듈 수준 기능도 제공합니다 .create

```python
def create(env_dir,
           system_site_packages=False, clear=False, use_symlinks=False):
    builder = EnvBuilder(
        system_site_packages=system_site_packages,
        clear=clear,
        use_symlinks=use_symlinks)
    builder.create(env_dir)
```

타사 가상 환경 도구 작성자는 제공된 EnvBuilder클래스를 기본 클래스로 자유롭게 사용할 수 있습니다.

create클래스 의 메소드는 사용자 EnvBuilder정의에 사용할 수 있는 후크를 보여줍니다.

```python
def create(self, env_dir):
    """
    Create a virtualized Python environment in a directory.

    :param env_dir: The target directory to create an environment in.

    """
    env_dir = os.path.abspath(env_dir)
    context = self.create_directories(env_dir)
    self.create_configuration(context)
    self.setup_python(context)
    self.post_setup(context)
```

create_directories, create_configuration, setup_python및 각 메소드는 post_setup재정의될 수 있습니다. 이러한 메소드의 기능은 다음과 같습니다.

* create_directories- 환경 디렉터리와 필요한 모든 디렉터리를 생성하고 컨텍스트 개체를 반환합니다. 이는 다른 메소드에서 사용하기 위한 속성(예: 경로)의 홀더일 뿐입니다.

* create_configuration- pyvenv.cfg환경에 구성 파일을 생성합니다.

* setup_python- 환경에 Python 실행 파일(및 Windows에서는 DLL)의 복사본을 생성합니다.

* post_setup- 패키지를 사전 설치하거나 가상 환경에 스크립트를 설치하기 위해 타사 서브클래스에서 재정의할 수 있는(기본적으로 무작동) 후크 방법입니다.


또한 가상 환경에 사용자 정의 스크립트를 설치하는 데 도움이 되도록 하위 클래스 EnvBuilder에서 호출할 수 있는 유틸리티 메서드를 제공합니다. 
post_setup이 메서드는 개체(위 참조)와 디렉터리 경로를 install_scripts인수로 받아들입니다. 
context디렉터리에는 하위 디렉터리 "common", "posix", "nt"가 포함되어야 하며 각 디렉터리에는 환경의 bin 디렉터리로 향하는 스크립트가 포함되어 있습니다. 
"common"의 내용과 해당 디렉터리는 os.name자리 표시자의 일부 텍스트 교체를 수행한 후 복사됩니다.

* __VENV_DIR__환경 디렉터리의 절대 경로로 대체됩니다.
* __VENV_NAME__환경 이름(환경 디렉터리의 최종 경로 세그먼트)으로 대체됩니다.
* __VENV_BIN_NAME__은 bin 디렉토리의 이름(또는 bin) 으로 대체됩니다 Scripts.
* __VENV_PYTHON__환경 실행 파일의 절대 경로로 대체됩니다.

참조 구현의 서브 클래스 DistributeEnvBuilder는 가상 환경에 Distribute를 사전 설치하기 위해 실제로 사용자 정의 후크를 사용하는 방법을 보여줍니다. 
Python 코어에 실제로 추가될 것이라고 는 예상되지 않지만 DistributeEnvBuilder참조 구현을 테스트 및 탐색 목적에 더 즉각적으로 유용하게 만듭니다.


## Backwards Compatibility

### sys.prefix 의미를 나누다 

이 라인에 따른 모든 가상 환경 도구(사이트 패키지를 분리하려고 시도하면서 가상 환경에 심볼릭 링크할 필요 없이 기본 Python의 표준 라이브러리를 계속 사용함)는 
두 가지 다른 의미 사이의 분할을 제안합니다. )는 현재 둘 다 sys.prefix"표준 라이브러리는 어디에 있습니까?"라는 질문에 대한 답변으로 요약되어 있습니다. 
및 "타사 모듈을 설치해야 하는 사이트 패키지 위치는 어디에 있습니까?"

sys이 분할은 전자 접두사 또는 후자 접두사에 대한 새 속성을 도입하여 처리할 수 있습니다. 
어느 옵션이든 sys.prefix. (이러한 소프트웨어는 이러한 질문에 대답하기 위해 직접 사용하는 것보다 site및 모듈 의 API를 사용하는 것이 바람직합니다. 
이 경우 이전 버전과의 호환성 문제는 없지만 실제로는 때때로 사용됩니다.)

sys.prefix 에 대한 문서 에서는 이를 "플랫폼 독립적인 Python 파일이 설치된 사이트별 디렉터리 접두사를 제공하는 문자열"이라고 설명하고, 
에 있는 표준 라이브러리 및 헤더 파일을 구체적으로 언급합니다 sys.prefix. 에 대해서는 언급하지 않습니다 site-packages.

sys.prefix이 문서화된 정의를 유지한다는 것은 기본 시스템 설치(표준 라이브러리와 헤더 파일이 있는 위치)를 가리키는 것을 그대로 두고 의 접두사를 가리키도록 에 새 값 sys(예: )을 
도입하는 것을 의미합니다 . 이렇게 하면 문서화된 의미 체계가 유지되지만 타사 코드에서 적절한 API를 사용 하여 사이트 패키지 디렉터리를 찾는 경우 
격리가 중단될 위험이 있습니다.

가장 주목할만한 사례는 아마도 API를 주로 사용 하지만 파일을 유용하게 배치할 수 있는 비행 전 확인을 위해 사이트 디렉터리 목록을 작성하는 데 직접 사용하는 
setuptools 및 해당 포크 배포 일 것입니다.


sys.prefix그렇지 않으면 Google 코드 검색 은 사이트 패키지 경로를 구축하는 데 사용하는 패키지와 이를 사용하여 코드 실행 추적에서 표준 라이브러리를 제거하는 데 
사용하는 패키지 간의 사용법이 대략 균일하게 혼합된 것처럼 보이는 것을 나타냅니다 .

의 문서화된 정의를 수정해야 하지만 sys.prefix이 PEP는 sys.prefix가상 환경(이 site-packages발견된 위치) 을 가리키고 sys.base_prefix표준 라이브러리 및 
Python 헤더 파일을 가리키도록 소개하는 것을 선호합니다. 이 선택의 근거:

* 가상 환경을 더 많이 격리하는 편이 더 좋습니다.
* Virtualenv는 이미 sys.prefix가상 환경을 가리키도록 수정되었으며 실제로는 문제가 되지 않았습니다.
* setuptools/distribute에는 수정이 필요하지 않습니다.

### 다른 Python 구현에 미치는 영향

이 PEP 변경 사항의 대부분은 다른 Python 구현과 공유되는 표준 라이브러리에서 발생하며 문제가 발생하지 않습니다.

다른 Python 구현에서는 파일 찾기 및 구문 분석(있는 경우)을 sys.prefix포함하여 인터프리터 부트스트랩의 새로운 찾기 동작을 복제해야 합니다 .pyvenv.cfg

## Reference Implementation

참조 구현은 CPython Mercurial 저장소의 복제본 에서 찾을 수 있습니다. 테스트하려면 빌드하고 실행하여 가상 환경을 만듭니다.bin/pyvenv /path/to/new/venv

# 참조
-----
* [PEP 405 – Python Virtual Environments](https://peps.python.org/pep-0405/)
* [venv](https://docs.python.org/ko/3/library/venv.html)

