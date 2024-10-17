---
layout: post
title: "CHAPTER 1 파이썬다운 생각"
date: 2024-10-15 22:40 +0900
comments: true
tags: [ "파이썬 코딩의 기술", "Effective Python" ]
categories: [ "books" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# 1장 파이썬답게 생각하기
가장 파이썬 다운 방식을 알아야 된다

## Better way 1 사용 중인 파이썬의 버전을 알아두라
파이썬 2는 수명이 다됨 백포팅이 이루어지지 않음
* backporting: 새로운 기능을 이전 버전에서도 사용할 수 있게 하는 것

```

import sys

print(sys.version_info)
print(sys.version)

```

## Better way 2 PEP 8 스타일 가이드를 따르라
파이썬 개선 제안(Python Enhancement Proposal) 8은 파이썬 코드를 어떻게 구성할지에 대한 스타일 가이드를 제공한다.

### 공백(Whitespace)

* 탭 대신 스페이스를 사용하라
* 문법적으로 의미 있는 들여쓰기는 4개의 스페이스로 한다
* 한 줄의 문자 길이가 79자 이하여야 한다
* 긴 식을 다음 줄에 이어서 쓸 때는 일반적인 들여쓰기 보다 4개의 스페이스를 더 들여써야 한다
* 파일에서 함수와 클래스는 빈 줄 두개로 구분해야 한다
* 딕셔너리(dictionsry)에서 키와 콜론(:) 사이에는 공백을 넣지 않고 한 줄 안에 키와 값을 같이 넣는 경우에는 콜론 다음에 스페이스를 하나 넣는다
* 변수 대입에서 = 전후에는 스페이스를 하나씩만 넣는다
* 타입 표기를 덧붙이는 경우에는 변수 이름과 콜론사이에 공백을 넣지 않도록 주의하고 콜론과 타입 정보 사이에는 스페이스를 하나 넣어라

### 명명(Naming)

* 함수, 변수, 속성은 lowercase_underscore 형식을 따른다
* 보호(protected) 인스턴스 속성은 _leading_underscore 형식을 따른다
* 비공개(private) 인스턴스 속성은 __double_leading_underscore 형식을 따른다
* 클래스와 예외는 CapitalizedWord 형식을 따른다
* 모듈 수준 상수는 ALL_CAPS 형식을 따른다
* 클래스의 인스턴스 메서드에서 첫 번째 파라미터의 이름은 self를 사용한다
* 클래스 메서드에서 첫 번째 파라미터의 이름은 cls를 사용한다

### 표현식과 문장(Expressions and Statements)

* 긍정적인 표현식을 부정하지 말고(if not a is b) 부정을 내부에 넣어라 (if a is not b)
* 빈 컨테이너(container)나 시퀀스(sequence)를 검사할 때 길이를 (if len(somelist)==0)와 비교하지 말고 if not somelist 와 같이 사용하라
  * 빈 값은 암시적으로 False로 평가된다
* 비어 있지 않을때로 길이로 비교하지 말라
  * 비어 있지 않은 값은 암시적으로 True로 평가된다
* 한줄로 된 if 문, for와 while 루프, except 복합문을 쓰지 말고 여러 줄로 나눠서 쓰라
* 식을 한 줄에 넣을 때는 식을 괄호로 둘러싸고 줄바꿈과 들여쓰기를 추가해서 읽기 쉽게 만들어라
* 여러줄에 걸쳐 식을 쓸 때는 줄이 계속된다는 표시로 \ 문자보단 괄호를 사용하라

### 임포트(Imports)

* import 문은 항상 파일 맨 위에 위치해야 한다
* 모듈을 임포트할 때는 항상 모듈의 절대 이름을 사용하고 현재 모듈의 경로를 기준으로 상대 경로로 된 이름을 사용하지 않는다
  * from bar import foo 라고 해야 되며 import foo 라고 하면 안된다
* 반듯이 상대적인 경로로 임포트해야 하는 경우에는 from . import foo 라고 해야 한다
* 임포트는 '표준 라이브러리 모듈, 서드파티 모듈, 자신이 만든 모듈' 순으로 구분해야 한다

## Better way 3 bytes와 str의 차이를 알아두라

문자열 데이터의 시퀀스를 표현하는 두 가지 타입
* bytes: 8비트 값을 연속된 시퀀스로 나타낸다
* str: 유니코드 문자를 연속된 시퀀스로 나타낸다

str 인스턴스에는 직접 대응하는 이진 인코딩이 없고 bytes 인스턴스에는 직접 대응하는 텍스트 인코딩이 없다

유니코드 샌드위치 : 유니코드 데이터를 인코딩 하거나 디코딩하는 부분을 인터페이스의 가장 먼 경계에 두는 것

```

def to_str(bytes_or_str):
    if isinstance(bytes_or_str, bytes):
        value = bytes_or_str.decode('utf-8')
    else:
        value = bytes_or_str
    return value

```

## Better way 4 C 스타일 형식 문자열을 str.format과 쓰기보다는 f-문자열을 통한 인터폴레이션을 사용하라
* f-문자열: 문자열 앞에 f를 붙이면 문자열 안에 중괄호로 변수를 감싸면 변수의 값을 참조할 수 있다
* f-문자열은 가독성이 좋고 str.format보다 간결하다
* % 연산자를 사용한 C 스타일 형식 문자열은 가독성이 떨어지고 f-문자열보다 더 복잡하다

```
place = 3
number = 1.23456

print(f'내가 고른 숫자? {number:.{place}f}')

```

## Better way 5 복잡한 식을 쓰는 대신 도우미 함수를 작성하라
* 복잡한 식을 작성할 때는 식을 작성하는 도우미 함수를 작성하라
* boolean 연산자나 or, and를 식에 사용하는 것 보다 if/else 문을 사용하는 것이 가독성이 좋다

## Better way 6 인덱스를 사용하는 대신 대입을 사용해 데이터를 언패킹하라
파이썬에는 값으로 이뤄진 불변 순서쌍을 만들어낼 수 있는 tuple이 있다

튜플이 만들어지면 인덱스를 통해 새 값을 대입해서 튜플을 변경할수는 없다

언패킹
```
item = ('apple', 5)
name, count = item
print(name, count)

```

```
def bubble_sort(a):
    for _ in range(len(a)):
        for i in range(1, len(a)):
            if a[i] < a[i-1]:
                a[i-1], a[i] = a[i], a[i-1]
                
names = ['pretzels', 'carrots', 'arugula', 'bacon']
bubble_sort(names)
print(names)
# ['arugula', 'bacon', 'carrots', 'pretzels']
```

```
for rank, (name, count) in enumerate(results, 1):
    print(f'{rank}: {name} -> {count}')
```

## Better way 7 range보다는 enumerate를 사용하라 
range 함수는 어떤 정수의 집합을 이터레이션 하는 루프가 필요 할 때 유용하다

enumerate 함수는 이터레이터를 감싸서 이터레이터가 생성하는 각 아이템의 값과 인덱스를 함께 반환한다

``` 
flavors = ['one', 'two', 'three']

it = enumerate(flavors)
print(next(it))
print(next(it))
print(next(it))

for i, flavor in enumerate(flavors):
    print(f'{i+1}: {flavor}')
    
for i, flavor in enumerate(flavors, 1):
    print(f'{i}: {flavor}')

```

## Better way 8 여러 이터레이터에 대해 나란히 루프를 수행하려면 zip을 사용하라
## Better way 9 for나 while 루프 뒤에 else 블록을 사용하지 말라
## Better way 10 대입식을 사용해 반복을 피하라



# 참조
-----

* [Effective Python 2nd 파이썬 코딩의 기술(개정2판) 똑똑하게 코딩하는 법](https://www.yes24.com/Product/Goods/94197582)
* [PEP 8 – Style Guide for Python Code](https://peps.python.org/pep-0008/)
