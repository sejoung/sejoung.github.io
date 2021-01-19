---
layout: post
title: "닷넷(dotnet) 엔티티 프레임워크(Entity Framework) sqlite no such table error"
date: 2021-01-18 16:14 +0900
comments: true
tags : ["c#","Entity Framework","dotnet","sqlite","엔티티 프레임워크","no such table"]
categories : ["c#"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 닷넷(dotnet) 엔티티 프레임워크(Entity Framework) sqlite no such table error

엔티티 프레임워크에 sqllite를 사용해서 프로그램을 만들어서 update-database 까지 문제 없이 완료 했지만 실행시 계속 `no such table error`가 나온다.

처음에는 이해가 가지 않았다.

```c#
        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite("Data Source=blogging.db");


```

위에 보면 데이터 소스를 `blogging.db` 파일을 보고 있다 실제로 프로젝트에서 만들어진 `blogging.db` 파일에는 문제가 없다

해당 코드를 컴파일후에 run 시키면 오류가 나는데 컴파일 폴더에서 보면 `blogging.db` 파일 사이즈가 0 이다.

이문제는 프로젝트 설정에서 아래의 값을 추가 하면 처리 된다. `<StartWorkingDirectory>$(MSBuildProjectDirectory)</StartWorkingDirectory>`

```xml
<Project Sdk="Microsoft.NET.Sdk">

	<PropertyGroup>
		<OutputType>Exe</OutputType>
		<TargetFramework>net5.0</TargetFramework>
		<StartWorkingDirectory>$(MSBuildProjectDirectory)</StartWorkingDirectory>
	</PropertyGroup>

	<ItemGroup>
		<PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="5.0.2" />
		<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="5.0.2">
			<PrivateAssets>all</PrivateAssets>
			<IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
		</PackageReference>
	</ItemGroup>
</Project>

```

위 설정을 추가하면 빌드완료후 실행시 프로젝트 디렉토리를 참조한다. 그래서 에러 코드가 나오지 않는다.

# 참조
-----


