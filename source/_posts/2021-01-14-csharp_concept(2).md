---
layout: post
title: "C# 개념 (2)-속성 (Properties)"
date: 2021-01-14 10:50 +0900
comments: true
tags : ["c#","concept","dotnet","Visual Studio","Properties","속성"]
categories : ["c#"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# C# 개념 (2)-속성 (Properties)

## 속성 (Properties)


```c#
public class Person
{
    public string FirstName;
    // remaining implementation removed from listing
}

```

```c#
public class Person
{
    public string FirstName { get; set; }

    // remaining implementation removed from listing
}

```

위에 표시된 구분은 자동 속성 구문 입니다. 컴파일러가 get및 set 접근자의 본문을 구현함

`FirstName` 필드에 초기 값을 null 대신 빈문자열로 설정하려면 아래와 같이 한다.

```c#

public class Person
{
    public string FirstName { get; set; } = string.Empty;

    // remaining implementation removed from listing
}

```

특성 초기화는 읽기 전용 속성에 가장 유용하다.

아래 처럼 직접 정의도 가능하다.

```c#
public class Person
{
    public string FirstName
    {
        get { return firstName; }
        set { firstName = value; }
    }
    private string firstName;
    // remaining implementation removed from listing
}
```

속성 구현이 단일식인 경우 getter또는 setter에 식 본문 맴버로 사용할수 있다. 

```c#
public class Person
{
    public string FirstName
    {
        get => firstName;
        set => firstName = value;
    }
    private string firstName;
    // remaining implementation removed from listing
}
```

### 유효성 검사

```c#
public class Person
{
    public string FirstName
    {
        get => firstName;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("First name must not be blank");
            firstName = value;
        }
    }
    private string firstName;
    // remaining implementation removed from listing
}
```

아래는 좀더 간소화 버전

```c#
public class Person
{
    public string FirstName
    {
        get => firstName;
        set => firstName = (!string.IsNullOrWhiteSpace(value)) ? value : throw new ArgumentException("First name must not be blank");
    }
    private string firstName;
    // remaining implementation removed from listing
}
```

### 읽기 전용

```c#
public class Person
{
    public string FirstName { get; private set; }

    // remaining implementation removed from listing
}
```

위 방법은 거의 사용하지 않음

```c#
public class Person
{
    public Person(string firstName) => this.FirstName = firstName;

    public string FirstName { get; }

    // remaining implementation removed from listing
}
```

위처럼 set을 만들지 않음

읽기 전용 속성은 노출되는 컬렉션을 초기화 하는데 주로 사용됨

```c#
public class Measurements
{
    public ICollection<DataPoint> points { get; } = new List<DataPoint>();
}
```

### 계산된 속성

```c#
public class Person
{
    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string FullName { get { return $"{FirstName} {LastName}"; } }
}
```
식을 이용해서 축약해서 보면

```c#
public class Person
{
    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string FullName => $"{FirstName} {LastName}";
}
```

### 캐쉬된 평가 속성

```c#
public class Person
{
    public string FirstName { get; set; }

    public string LastName { get; set; }

    private string fullName;
    public string FullName
    {
        get
        {
            if (fullName == null)
                fullName = $"{FirstName} {LastName}";
            return fullName;
        }
    }
}
```

위에 간단한 버그가 있는데 `FirstName`이나 `LastName`을 갱신해도 `fullName` 속성이 갱신이 되지 않는다 간단하게 수정해서 보면

```c#
public class Person
{
    private string firstName;
    public string FirstName
    {
        get => firstName;
        set
        {
            firstName = value;
            fullName = null;
        }
    }

    private string lastName;
    public string LastName
    {
        get => lastName;
        set
        {
            lastName = value;
            fullName = null;
        }
    }

    private string fullName;
    public string FullName
    {
        get
        {
            if (fullName == null)
                fullName = $"{FirstName} {LastName}";
            return fullName;
        }
    }
}
```

### 자동 구현 속성에 특성 연결

C# 7.3부터 필드 특성은 자동 구현된 속성의 컴파일러에서 생성된 지원 필드에 연결할수 있다.

다음 예제와 같이 특성에 field: 지정자를 사용하여 Id 속성의 지원 필드에 NonSerializedAttribute를 연결할 수 있다.

```c#
public class Person
{
    public string FirstName { get; set; }

    public string LastName { get; set; }

    [field:NonSerialized]
    public int Id { get; set; }

    public string FullName => $"{FirstName} {LastName}";
}
```

### INotifyPropertyChanged 구현

구성 데이터가 바꼈을때 이벤트 처리를 하는 방법을 보여준다.

```c#
public class Person : INotifyPropertyChanged
{
    public string FirstName
    {
        get => firstName;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("First name must not be blank");
            if (value != firstName)
            {
                PropertyChanged?.Invoke(this,
                    new PropertyChangedEventArgs(nameof(FirstName)));
            }
            firstName = value;
        }
    }
    private string firstName;

    public event PropertyChangedEventHandler PropertyChanged;
    // remaining implementation removed from listing
}
```

# 참조
-----
* [dotnet csharp](https://docs.microsoft.com/ko-kr/dotnet/csharp/)


