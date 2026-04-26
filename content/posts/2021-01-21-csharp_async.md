---
layout: post
title: ".NET 테스크 기반 비동기 패턴 (Task-based async model)"
date: 2021-01-21 14:08 +0900
comments: true
tags : ["c#","async","dotnet","Task-based async model","task"]
categories : ["c#"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# .NET 테스크 기반 비동기 패턴 (Task-based async model)

.NET 태스크 기반 비동기 모델을 사용하면 I/O 및 CPU 바인딩된 비동기 코드를 간단하게 작성할 수 있습니다. 
모델은 C# 및 Visual Basic에서 `Task` 및 `Task<T>` 형식과 `async` 및 `await` 키워드로 표시됩니다. 

## Task 및 Task<T>

Task(java.util.concurrent.Future 또는 java.util.concurrent.CompletableFuture 비슷)는 동시성 약속 모델(Futures and promises)을 구현하는 데 사용되는 구문입니다. 
간단히 말해서, 나중에 작업이 완료될 것이라는 "약속"을 제공하여 클린 API로 약속을 조정할 수 있게 합니다.

* Task - 값을 반환하지 않는 작업 하나를 나타냅니다.
* Task<T> - T 형식의 값을 반환하는 작업 하나를 나타냅니다.

스레딩에 대한 추상화가 아니라 비동기적으로 수행되는 작업의 추상화로 태스크에 대해 추론하는 것이 중요합니다. 
기본적으로 태스크는 현재 스레드에 대해 실행되며 해당하는 경우 운영 체제에 작업을 위임합니다. 
필요에 따라 Task.Run API를 통해 별도 스레드에서 실행되도록 태스크를 명시적으로 요청할 수 있습니다.

태스크는 태스크의 결과 값(Task<T>의 경우)을 모니터링, 대기 및 액세스하기 위한 API 프로토콜을 표시합니다. 
await 키워드가 있는 언어 통합에서는 태스크 사용을 위한 상위 수준 추상화를 제공합니다.

await를 사용하면 태스크가 완료될 때까지 해당 호출자에게 제어가 양도되므로 태스크가 실행되는 동안 애플리케이션 또는 서비스에서 유용한 작업을 수행할 수 있습니다. 
태스크가 완료된 후에는 코드에서 콜백 또는 이벤트를 사용하여 실행을 계속할 필요가 없습니다. 
언어 및 태스크 API 통합에서 해당 작업을 자동으로 수행합니다. Task<T>를 사용하는 경우 await 키워드는 작업이 완료될 때 반환되는 값을 추가로 “unwrap”합니다. 

```c#

		public static Task<string> GetHtmlAsync()
		{
			Console.WriteLine("GetHtmlAsync start");
			var client = new HttpClient();
			Console.WriteLine("GetHtmlAsync 1");
			var result = client.GetStringAsync("https://www.dotnetfoundation.org");
			Console.WriteLine("GetHtmlAsync 2");
			return result;
		}


```

위에 메소드에 간단한 테스트 코드를 만들어 실행해보면

```c#

		[Test]
		public void NonAwaitTest()
		{
			Console.WriteLine("start");
			var result = GetHtmlAsync();
			Console.WriteLine($"IsCompleted {result.IsCompleted}");
			Console.WriteLine("end");
		}

```

실행결과
```
start
GetHtmlAsync start
GetHtmlAsync 1
GetHtmlAsync 2
IsCompleted False
end
```

위에 값을 실행하면 완료되지 않은 task를 반환 한다.

`async`, `await` 키워드를 사용해서 보면

```c#

		public static async Task<string> GetFirstCharactersCountAsync(int count)
		{
			Console.WriteLine("GetFirstCharactersCountAsync start");
			var client = new HttpClient();
			Console.WriteLine("GetFirstCharactersCountAsync 1");
			var page = await client.GetStringAsync("https://www.dotnetfoundation.org");
			Console.WriteLine("GetFirstCharactersCountAsync 2");
			var result = count > page.Length ? page : page.Substring(0, count);
			Console.WriteLine("GetFirstCharactersCountAsync 3");
			return result;
		}
```

테스트 코드
```c#

		[Test]
		public void AwaitTest()
		{
			Console.WriteLine("start");
			var result = GetFirstCharactersCountAsync(10);
			Console.WriteLine($"IsCompleted {result.IsCompleted}");
			Console.WriteLine("end");
		}
```

실행결과
```
start
GetFirstCharactersCountAsync start
GetFirstCharactersCountAsync 1
IsCompleted False
end
```
`async`, `await` 키워드를 사용해도 완료 되지 않은 task를 반환 하지만 await 구문 아래의 구문들은 실행되지 않고 리턴된다.

이 내용을 더 보면 간단하게 위에 테스트 코드를 수정해서 보면 간단하게 마지막 end를 찍기 전에 2초간 대기를 줬다.

```c#
		[Test]
		public void AwaitTest()
		{
			Console.WriteLine("start");
			var result = GetFirstCharactersCountAsync(10);
			Console.WriteLine($"IsCompleted {result.IsCompleted}");
			Thread.Sleep(2000);
			Console.WriteLine("end");
		}
```

실행결과
```
start
GetFirstCharactersCountAsync start
GetFirstCharactersCountAsync 1
IsCompleted False
GetFirstCharactersCountAsync 2
GetFirstCharactersCountAsync 3
end

```

2초 대기중에 await 중인 내용이 실행이되어서 Console 내용들이 찍히고 end를 찍는것을 볼수 있다.

요청은 커널 공간에 있으면서 OS에서 관리한다.

위에 내용에서 요점은 `태스크 실행 전용 스레드가 없다`는 것이다.

## 비동기 작업의 시작

TAP을 기반으로 하는 비동기 메서드는 인수 유효성 검사 및 결과 작업을 반환하기 전에 비동기 작업 시작 등 적은 양의 작업을 동기적으로 수행할 수 있습니다. 
동기 작업은 비동기 메서드가 신속하게 반환할 수 있도록 최소한으로 유지해야 합니다. 
빠르게 반환되는 이유는 다음과 같습니다.

* 비동기 메서드는 사용자 인터페이스(UI) 스레드에서 호출할 수 있으며, 모든 장기 실행 동기 작업에서 애플리케이션의 응답에 문제가 발생할 수 있습니다
* 여러 비동기 메서드를 동시에 실행할 수 있습니다. 따라서 비동기 메서드의 동기 부분에서 모든 장기 실행 작업은 다른 비동기 작업의 시작을 지연시켜 동시성의 이점을 감소시킬 수 있습니다.

경우에 따라 작업을 완료하는 데 필요한 작업 시간이 비동기적으로 작업을 실행하는 데 필요한 작업 시간보다 적을 수 있습니다. 
이미 메모리에 버퍼링된 데이터로 읽기 작업을 충족할 수 있는 스트림에서 읽기는 이러한 시나리오의 예입니다. 
경우에 따라 작업을 동기적으로 완료하고 이미 완료된 작업을 반환할 수 있습니다.

## 예외

비동기 메서드는 사용 오류에 응답에서만 비동기 메서드 호출에서 throw할 예외를 발생시켜야 합니다. 
프로덕션 코드에서는 사용 오류가 절대 발생해서는 안 됩니다. 예를 들어, null 참조(Visual Basic에서 Nothing)를 
오류 상태(일반적으로 ArgumentNullException 예외로 표시됨)를 유발하는 메서드 인수 중 하나로 전달하는 경우 null 참조가 전달되지 않도록 호출 코드를 수정할 수 있습니다. 
기타 모든 오류에 대해 작업이 반환되기 전에 비동기 메서드가 완전하게 동기화되었다고 해도 비동기 메서드가 실행되는 동안 발생하는 예외를 반환된 작업에 할당해야 합니다. 
일반적으로 작업에는 최대 하나의 예외가 포함됩니다. 
그러나 WhenAll과 같이 작업이 여러 작업을 나타내는 경우 여러 예외가 단일 작업에 연결될 수 있습니다.

## 대상 환경

TAP 메서드를 구현하면 비동기 실행이 발생하는 위치를 확인할 수 있습니다. 
스레드 풀에서 워크로드를 실행하는 방법, 대부분의 작업 실행을 위한 스레드에 바인딩하지 않고 비동기 I/O를 사용하여 구현하는 방법, UI 스레드와 같은 특정 스레드를 실행하는 방법 
또는 원하는 수의 잠재 컨텍스트를 사용하는 방법 중 선택할 수 있습니다. 
TAP 메서드는 실행할 항목이 없을 수도 있으며 시스템 내 다른 위치에서의 조건 발생을 나타내는 Task만 반환할 수도 있습니다(예: 큐에 대기 중인 데이터 구조에 도착하는 데이터를 나타내는 작업).

TAP 메서드의 호출자는 결과 작업을 동기적으로 대기함으로써 TAP 메서드의 완료 대기를 차단하거나 비동기 작업이 완료될 때 추가(연속) 코드를 실행할 수 있습니다. 
연속 코드 작성자는 해당 코드가 실행되는 위치를 제어합니다. 
연속 코드를 Task 클래스에서 메서드를 통해(예: ContinueWith) 명시적으로 만들거나 
연속 작업을 기반으로 만들어진 언어 지원을 사용하여(예: C#의 await, Visual Basic의 Await, F#의 AwaitValue) 암시적으로 만들 수 있습니다.

## 작업 상태

Task 클래스는 비동기 작업에 대한 수명 주기를 제공하며 해당 주기는 TaskStatus 열거형으로 표시됩니다. 
Task 및 Task<TResult>에서 파생되는 유형의 상황을 지원하거나 일정에 따라 구성을 구분할 수 있도록 지원하기 위해 Task 클래스가 Start 메서드를 노출합니다. 
공용 Task 생성자에서 만든 작업은 예약되지 않은 Created 상태에서 수명 주기를 시작하고 이러한 인스턴스에서 Start를 호출할 때만 예약되므로 콜드 작업이라고 합니다.

다른 모든 작업은 활성 상태로 수명 주기를 시작합니다. 즉, 작업이 나타내는 비동기 작업이 이미 시작되었고 작업 상태는 TaskStatus.Created 이외의 열거형 값임을 의미합니다. 
TAP 메서드에서 반환되는 모든 작업을 활성화해야 합니다. TAP 메서드가 내부적으로 작업의 생성자를 사용하여 반환할 작업을 인스턴스화하는 경우 해당 TAP 메서드는 작업을 반환하기 전에 Task 개체에서 Start를 호출해야 합니다. 
TAP 메서드의 소비자는 반환된 작업을 활성화했다가 안전하게 가정할 수 있으며 TAP 메서드에서 반환된 Start의 Task를 호출하려고 시도해서는 안 됩니다. 
활성 작업에서 Start를 호출하면 InvalidOperationException 예외가 나타납니다.

## 취소(선택 사항)

TAP에서 취소는 비동기 메서드 구현자와 비동기 메서드 소비자 모두에 대한 선택 사항입니다. 
작업에서 취소를 허용하는 경우에는 취소 토큰(CancellationToken 인스턴스)을 수락하는 비동기 메서드의 오버로드가 표시됩니다. 
관례적으로 매개 변수의 이름은 cancellationToken입니다.


비동기 작업은 취소 요청에 대해 이 토큰을 모니터링합니다. 
취소 요청을 받으면 작업을 요청하고 취소하도록 선택할 수 있습니다.
작업이 완료되지 않은 상태로 취소되었다면, TAP 메서드는 Canceled 상태에서 종료된 작업을 반환합니다. 
이 때, 사용 가능한 결과는 없으며 예외도 throw되지 않습니다. Canceled 상태는 Faulted 및 RanToCompletion 상태와 함께 작업에 대한 최종(완료) 상태로 간주됩니다. 
따라서 작업이 Canceled 상태에 있을 경우 IsCompleted 속성은 true를 반환합니다. 
Canceled 상태에서 작업이 완료되면 NotOnCanceled와 같은 연속 옵션이 연속을 취소하기 위해 지정되지 않는 한 작업이 등록된 모든 연속은 예정되거나 실행됩니다. 
언어 기능의 사용을 통해 취소된 작업을 비동기적으로 대기하고 있는 코드는 실행을 계속하고 여기에서 파생되는 OperationCanceledException 또는 예외를 받습니다. 
또한 Wait 및 WaitAll과 같은 메서드를 통해 작업에서 대기 중인 동기적으로 차단된 코드도 예외적으로 계속해서 실행합니다.

토큰을 허용하는 TAP 메서드가 호출되기 전에 취소 토큰이 취소를 요청한 경우 TAP 메서드가 Canceled 작업을 반환해야 합니다. 
그러나 비동기 작업을 실행하는 동안 취소가 요청된 경우 비동기 작업에서 취소 요청을 허용해서는 안됩니다. 
반환된 작업은 작업이 취소 요청의 결과로 종료될 경우에만 Canceled 상태에서 종료되어야 합니다. 
취소가 요청되었지만 결과나 예외가 계속해서 발생하면 RanToCompletion 또는 Faulted 상태에서 작업을 종료해야 합니다.

무엇보다도 먼저 취소할 기능을 표시하려는 비동기 메서드의 경우 취소 토큰을 수락하지 않은 오버로드를 제공하지 않아도 됩니다. 
취소할 수 없는 메서드의 경우 취소 토큰을 수락하는 오버로드를 제공하지 마세요. 
이렇게 하면 대상 메서드가 실제로 취소 가능한지 여부를 호출자에게 알려줍니다. 
취소를 원하지 않는 소비자 코드는 CancellationToken을 허용하는 메서드를 호출하고 인수 값으로 None을 제공할 수도 있습니다. 
None은 기본 CancellationToken과 기능적으로 동일합니다.

## Progress reporting(선택 사항)

일부 비동기 작업은 진행률 알림을 제공하여 이점을 얻습니다. 이는 일반적으로 비동기 작업의 진행률에 대한 정보로 사용자 인터페이스를 업데이트하는 데 사용됩니다.

TAP에서 일반적으로 `IProgress<T>`라고 이름이 지정된 매개 변수로 비동기 메서드에 전달되는 progress 인터페이스를 통해 진행이 처리됩니다. 
비동기 메서드를 호출할 때 진행률 인터페이스를 제공하면 작업을 시작한 후 잘못 등록된 이벤트 처리기가 업데이트를 누락시킬 수 있는 경우 잘못된 사용으로 인해 발생하는 경합 상태를 없앨 수 있습니다. 
더욱 중요한 것은 진행률 인터페이스에서 사용하는 코드에 따라 결정된 대로 다양한 진행률 구현을 지원한다는 점입니다. 
예를 들어, 현재 사용하고 있는 코드는 가장 최신 진행 상황 업데이트에만 관여하거나 모든 업데이트를 버퍼링하거나, 각 업데이트에 대한 작업을 호출하거나, 특정 스레드 호출이 마샬링되었는지 제어할 수 있습니다. 
특정 소비자의 요구에 따라 맞춘 다양한 인터페이스의 구현을 통해 이러한 옵션을 모두 수행할 수 있습니다. 
취소와 마찬가지로 API가 진행률 알림을 지원할 경우에만 TAP 구현에서 `IProgress<T>` 매개 변수를 제공해야 합니다.

예를 들어, 지금까지는 이 문서 앞부분에서 설명한 ReadAsync 메서드가 바이트 리드 수의 형태로 중간 진행률을 보고할 수 있는 경우 진행률 콜백이 `IProgress<T>` 인터페이스일 수 있었습니다.

```c#

public Task ReadAsync(byte[] buffer, int offset, int count,
                      IProgress<long> progress)

```

FindFilesAsync 메서드가 특정 검색 패턴을 충족하는 모든 파일의 목록을 반환하는 경우 진행률 콜백은 완료된 작업 비율과 부분 결과의 현재 세트에 관한 예측을 제공할 수 있습니다. 
튜플을 사용하여 이 정보를 제공할 수 있습니다.

```c#

public Task<ReadOnlyCollection<FileInfo>> FindFilesAsync(
            string pattern,
            IProgress<Tuple<double,ReadOnlyCollection<List<FileInfo>>>> progress)
```

또는 API에 따라 달라지는 데이터 형식을 사용합니다.

```c#
public Task<ReadOnlyCollection<FileInfo>> FindFilesAsync(
    string pattern,
    IProgress<FindFilesProgressInfo> progress)
```
후자의 경우 일반적으로 특수 데이터 형식에 ProgressInfo 접미사가 붙습니다.

TAP 구현이 progress 매개 변수를 허용하는 오버로드를 제공하는 경우 인수가 null일 수 있어야 하며, null인 경우 진행률이 보고되지 않습니다. 
TAP 구현에서는 진행률을 Progress<T> 개체에 동기적으로 보고해야 하므로, 비동기 메서드를 통해 진행률을 빠르게 제공합니다. 
또한 진행률의 소비자가 정보를 처리하는 최선의 방법과 위치를 결정할 수 있습니다. 
예를 들어, 진행률 인스턴스에서 콜백 마샬링을 선택할 수 있으며, 캡처된 동기화 컨텍스트에 이벤트를 발생시킬 수 있습니다.

## IProgress<T> 구현

.NET은 IProgress<T>을 구현하는 Progress<T> 클래스를 제공합니다. Progress<T> 클래스는 다음과 같이 선언됩니다.

```c#

public class Progress<T> : IProgress<T>  
{  
    public Progress();  
    public Progress(Action<T> handler);  
    protected virtual void OnReport(T value);  
    public event EventHandler<T>? ProgressChanged;  
}

```
Progress<T>의 인스턴스는 비동기 작업이 진행률 업데이트를 보고할 때마다 발생하는 ProgressChanged 이벤트를 노출합니다. 
ProgressChanged 이벤트는 SynchronizationContext 인스턴스를 인스턴스화할 때 캡처된 Progress<T> 개체에서 발생합니다. 
동기화 컨텍스트를 사용할 수 없는 경우 스레드 풀을 대상으로 하는 기본 컨텍스트가 사용됩니다. 
처리기가 이 이벤트에 등록될 수 있습니다. 또한 편의를 위해 단일 처리기가 Progress<T> 생성자에 제공될 수 있으며 ProgressChanged 이벤트의 이벤트 처리기와 같이 동작합니다. 
진행률 업데이트는 이벤트 처리기를 실행하는 동안 비동기 작업이 지연되지 않도록 비동기적으로 발생합니다. 
다른 IProgress<T> 구현에서 다른 의미 체계를 적용하도록 선택할 수 있습니다.

## 제공할 오버로드 선택
TAP 구현에서 선택적 CancellationToken과 선택적 IProgress<T> 매개 변수를 모두 사용하는 경우 잠재적으로 최대 4개의 오버로드가 필요할 수 있습니다.

```c#

public Task MethodNameAsync(…);  
public Task MethodNameAsync(…, CancellationToken cancellationToken);  
public Task MethodNameAsync(…, IProgress<T> progress);
public Task MethodNameAsync(…,
    CancellationToken cancellationToken, IProgress<T> progress);  

```
그러나 많은 TAP 구현에서 취소 또는 진행률 기능을 제공하지 않으므로 단일 메서드가 필요합니다.
```c#
public Task MethodNameAsync(…);  
```
TAP 구현에서 취소 또는 진행률을 지원하지만 둘 모두 지원하지 않는 경우 두 가지 오버로드를 제공할 수 있습니다.

```c#
public Task MethodNameAsync(…);  
public Task MethodNameAsync(…, CancellationToken cancellationToken);  
  
// … or …  
  
public Task MethodNameAsync(…);  
public Task MethodNameAsync(…, IProgress<T> progress);  
```
TAP 구현에서 취소와 진행률을 모두 지원하는 경우 4가지 오버로드를 모두 노출할 수 있습니다. 그러나 다음 두 가지만 제공할 수 있습니다.
```c#
public Task MethodNameAsync(…);  
public Task MethodNameAsync(…,
    CancellationToken cancellationToken, IProgress<T> progress);  
```
누락된 두 개의 중간 조합을 조정하기 위해 개발자가 None 매개 변수에 대해 CancellationToken 또는 기본값인 cancellationToken을 전달하고 null 매개 변수에 대해 progress을 전달할 수 있습니다.

TAP 메서드를 사용할 때마다 취소 또는 진행률을 이용해야 하는 경우 관련 매개 변수를 허용하지 않는 오버로드는 생략할 수 있습니다.

여러 오버로드가 취소 또는 진행률을 선택하도록 노출되는 경우 취소 또는 진행률을 지원하지 않는 오버로드는 이를 지원하는 오버로드에 대해 취소의 경우 None 및 진행률의 경우 null이 전달된 것처럼 동작해야 합니다.


# 참조
-----
* [task-based-asynchronous-pattern-tap](https://docs.microsoft.com/ko-kr/dotnet/standard/asynchronous-programming-patterns/task-based-asynchronous-pattern-tap/)
* [gyuwon DotNetConf2021Seoul](https://github.com/gyuwon/DotNetConf2021Seoul)
* [gyuwon DotNetConf2021Seoul 발표자료](https://onedrive.live.com/view.aspx?resid=318484C5AAD6B73D!682425&ithint=file%2cpptx&authkey=!APVuBvwV3XWAdio)

