---
layout: post
title: "언리얼 Python 스크립트로 에디터 자동화하기"
date: 2025-10-17 14:28 +0900
comments: true
tags: [ "unreal", "언리얼", "python", "에디터 자동화" ]
categories: [ "unreal" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# 언리얼 Python 스크립트로 에디터 자동화하기

언리얼 엔진은 C++와 블루프린트 외에도 Python 스크립팅을 지원하여 에디터 작업을 자동화할 수 있습니다.

그중에서도 python 스크립트의 장점인 번거러운 컴파일 과정이 없다는것이 큰 장점입니다.

만드는 방법은 언리얼에 설명이 되어 있고 [Unreal Python API Documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/index?application_version=5.6)에서 다양한 API를 확인할 수 있습니다.


## Python 플러그인 개발시에 활용 방법

```
pip install unreal-stub
```

가이드에도 stub 설치 방법이 나와 있지만, `unreal-stub` 패키지를 설치하면 언리얼 파이썬 API에 대한 자동 완성 기능을 IDE에서 사용할 수 있습니다.



# 참조
-----

* [Scripting the Unreal Editor Using Python](https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-the-unreal-editor-using-python?application_version=5.6)
* [Unreal Python API Documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/index?application_version=5.6)
* [vfxplatform](https://vfxplatform.com/)
* [Setting up Autocomplete for Editor Python Scripting](https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-autocomplete-for-unreal-editor-python-scripting)
* [unreal-stub](https://pypi.org/project/unreal-stub/)
