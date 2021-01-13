---
layout: post
title: "닷넷코어 자습서-Visual Studio 사용"
date: 2021-01-12 16:38 +0900
comments: true
tags : ["dotnet","core","dotnet core","tutorials","Visual Studio"]
categories : ["dotnet"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 닷넷코어 자습서-Visual Studio 사용

### 앱 실행

ctrl + f5 를 사용하면 디버깅 없이 프로그램을 실행할수 있다.

### 디버그 빌드 구성 사용

* 컴파일러가 디버그 버전으로 컴파일하도록 구성되어 있어야 한다.
* Breakpoint 설정은 f9키를 사용해서 설정 할 수 있다. 물론 마우스로 클릭해서도 가능
* 그 다음 f5로 디버그 모드로 실행시키면 확인이 가능하다. 
* 다음 한줄 씩 넘어 가려면 f11 
* 프로시져 단위로 실행은 f10
* 프로시저 위로 나가기는 shift + f11

#### 직접실행창 사용

디버그 -> 창 -> 직접 실행창

* 디버거를 실행시켜 놓은 상태에서 직접실행 창을 통해 변수의 값을 바꿀수 있다.

```C#

using System;

namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("\nWhat is your name? ");
            var name = Console.ReadLine();
            var date = DateTime.Now;
            Console.WriteLine($"\nHello, {name}, on {date:d} at {date:t}!");
            Console.Write("\nPress any key to exit...");
            Console.ReadKey(true);
        }
    }
}


```

위에 간단한 C# 코드가 있는데 해당 부분에서 `Console.WriteLine($"\nHello, {name}, on {date:d} at {date:t}!");` 이부분에 브레이크 포인트를 걸고
입력 받은 값이 아니라 즉시 실행창을 통해서 값 변경이 가능하다.

```
date = DateTime.Parse("2019-11-16T17:25:00Z").ToUniversalTime()

{2019-11-16 오후 5:25:00}
    Date: {2019-11-16 오전 12:00:00}
    Day: 16
    DayOfWeek: Saturday
    DayOfYear: 320
    Hour: 17
    Kind: Utc
    Millisecond: 0
    Minute: 25
    Month: 11
    Second: 0
    Ticks: 637095219000000000
    TimeOfDay: {17:25:00}
    Year: 2019

name = "Gracie"

"Gracie"
```

위와 값이 입력후 변수의 값을 보면 변경되어 있는것을 확인 가능하다.

#### 조건부 중단점

* 중단점을 표시하는 빨간색 점에 마우스 오른쪽 버튼을 클릭하면 활성화 할수 있는 조건이라는 값이 있다.
해당 조건을 만족할때 중단점을 활성화 하는데 loop의 값중 특정 값을 확인해야 된다고 할때 좋은 기능이다.


### 릴리즈 빌드

*  릴리스 버전을 컴파일하고 테스트해야 한다. 릴리스 버전에는 애플리케이션의 동작에 부정적인 영향을 줄 수 있는 컴파일러 최적화가 통합됩니다. 

# 참조
-----
* [dotnet core tutorials](https://docs.microsoft.com/ko-kr/dotnet/core/tutorials/)


