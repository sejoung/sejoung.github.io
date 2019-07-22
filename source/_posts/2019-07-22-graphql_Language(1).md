---
layout: post
title: "GraphQL Language"
date: 2019-07-22 21:34 +0900
comments: true
tags : ["GraphQL Language"]
categories : ["GraphQL"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
## GraphQL Language

### Language

클라이언트는 GraphQL 쿼리 언어를 사용하여 GraphQL 서비스에 요청합니다. 
이러한 요청 소스를 문서로 지칭합니다. 
문서에는 쿼리 재사용을 허용하는 컴포지션의 공통 단위 인 조각은 물론 작업 (쿼리, 변이 및 구독)이 포함될 수 있습니다.

GraphQL 문서는 터미널 기호가 토큰 (불가분의 어휘 단위) 인 구문 문법으로 정의됩니다. 
이 토큰은 소스 문자 (:: 이중 콜론으로 정의)의 패턴과 일치하는 어휘 문법으로 정의됩니다.

#### Source Text

```
SourceCharacter
    /[\u0009\u000A\u000D\u0020-\uFFFF]/

```

GraphQL 문서는 일련의 유니 코드 문자 로 표현됩니다. 
그러나 거의 예외가 없으므로 대부분의 GraphQL은 원래의 비 제어 ASCII 범위에서만 표현되므로 최대한 많은 기존 도구, 언어 및 직렬화 형식과 호환되므로 텍스트 편집기 및 소스 제어에서 표시 문제를 피할 수 있습니다 

##### Unicode

```

UnicodeBOM
    Byte Order Mark (U+FEFF)

```

ASCII 코드가 아닌 유니 코드 문자는 GraphVal의 StringValue 및 Comment 부분에 자유롭게 나타날 수 있습니다 .

"Byte Order Mark"는 유니 코드가 들어있는 파일의 시작 부분에 나타날 수있는 특수 유니 코드 문자로, 프로그램이 텍스트 스트림이 유니 코드인지, 텍스트 스트림이 어떤 엔디안인지, 그리고 여러 유니 코드 해석 할 인코딩.

##### White Space

```
WhiteSpace
    Horizontal Tab (U+0009)
    Space (U+0020)

```

공백은 소스 텍스트의 가독성을 높이고 토큰 간의 분리 역할을하며 토큰 앞뒤에 공백이있을 수 있습니다. 
토큰 사이의 공백은 GraphQL 문서의 의미 적 의미에 중요하지 않지만 공백 문자는 문자열 또는 설명 토큰 내에 나타날 수 있습니다.

##### Line Terminators

```

LineTerminator
    New Line (U+000A)
    Carriage Return (U+000D)New Line (U+000A)
    Carriage Return (U+000D)New Line (U+000A)

```

공백 문자와 마찬가지로 라인 종결자는 소스 텍스트의 가독성을 향상시키는 데 사용되며, 다른 토큰의 앞이나 뒤에 표시 될 수 있으며 GraphQL 문서의의 미 의미에 아무런 의미가 없습니다. 
라인 종결자는 다른 토큰에서 찾을 수 없습니다.

##### Comments

```
Comment
    #CommentChar list opt
    CommentChar
    SourceCharacter LineTerminator
   
```

GraphQL 소스 문서에는 # 마커로 시작하는 한 줄 주석이 포함될 수 있습니다 .
주석은 LineTerminator를 제외한 모든 유니 코드 코드 포인트를 포함 할 수 있으므로 주석은 항상 라인 종결자를 포함하지 않고 # 문자로 시작하는 모든 코드 포인트로 구성 됩니다.
주석은 공백처럼 행동하며 토큰 뒤에 또는 줄 종결 자 앞에 나타날 수 있으며 GraphQL 문서의 의미 적 의미에 아무런 의미가 없습니다.

##### Insignificant Commas

```
Comma
    ,
```

공백 문자 및 줄 종결 자와 마찬가지로 쉼표 ( , )는 소스 텍스트와 별도의 어휘 토큰의 가독성을 향상시키는 데 사용되지만 구문 상 및 의미 상으로는 GraphQL Documents 내에서 중요하지 않습니다.

중요하지 않은 쉼표 문자는 다른 언어에서 일반적인 사용자 오류 일 수 있으므로 쉼표가 없거나 존재하면 문서의 해석 구문을 의미있게 변경하지 않습니다. 
또한 소스 코드의 가독성과 유지 보수성을 위해 종종 요구되는 목록 구분 기호로 후행 쉼표 또는 줄 종결자를 문체로 사용할 수 있습니다.


##### Lexical Tokens

```
Token
    Punctuator
    Name
    IntValue
    FloatValue
    StringValue
```

GraphQL 문서는 소스 유니 코드 문자의 패턴에 의해 어휘 문법에 정의 된 여러 종류의 불가분의 어휘 토큰으로 구성됩니다.

토큰은 나중에 GraphQL 문서 문법 문법에서 터미널 기호로 사용됩니다.

##### Ignored Tokens

```

Ignored
    UnicodeBOM
    WhiteSpace
    LineTerminator
    Comment
    Comma

```

모든 어휘 토큰 앞뒤에 WhiteSpace 및 Comment를 포함하여 무시 된 토큰이있을 수 있습니다 . 
소스 문서의 무시 된 영역은 중요하지 않지만 무시 된 소스 문자가 중요한 방식으로 어휘 토큰에 나타날 수 있습니다. 
예를 들어 문자열에 공백 문자가 포함될 수 있습니다.

예를 들어 FloatValue를 정의하는 문자 사이에 공백 문자가 허용되지 않는 경우와 같이 주어진 토큰을 구문 분석하는 동안 무시할 문자는 없습니다 .

##### Punctuators

```
Punctuator
    !	$	&	(	)	...	:	=	@	[	]	{	|	}

```

GraphQL 문서는 구조를 설명하기 위해 구두점을 포함합니다. 
GraphQL은 프로그래밍 언어가 아닌 데이터 기술 언어이므로 GraphQL에는 종종 수학 표현을 설명하는 데 사용되는 구두점이 없습니다

##### Names

```
Names
    / [_A-Za-z] [_ 0-9A-Za-z] * /
```

GraphQL 문서는 작업, 필드, 인수, 유형, 지시문, 단편 및 변수와 같이 이름이 지정된 항목으로 가득합니다. 모든 이름은 동일한 문법적 형식을 따라야합니다.

GraphQL의 이름은 대소 문자를 구분합니다. 그 말을하는 것입니다 name, Name그리고 NAME모든 다른 이름을 참조하십시오. 밑줄이 의미하는 중요 other_name하고 othername두 개의 서로 다른 이름입니다.

GraphQL의 이름 은 가능한 한 많은 다른 시스템과의 상호 운용을 지원하기 위해 가능한 문자의 ASCII 하위 집합으로 제한됩니다 .

##### Document

```
Document
    Definitionlist
Definition
    ExecutableDefinition
    TypeSystemDefinition
    TypeSystemExtension
ExecutableDefinition
    OperationDefinition
    FragmentDefinition
```
GraphQL 문서는 GraphQL 서비스 또는 클라이언트에 의해 작동되는 전체 파일 또는 요청 문자열을 설명합니다. 
문서에는 GraphQL 유형 시스템의 실행 가능 또는 대표적인 여러 정의가 포함되어 있습니다.

문서는 OperationDefinition 을 포함하고 ExecutableDefinition 만을 포함 하는 경우 GraphQL 서비스에 의해서만 실행 가능 합니다. 
그러나 포함되지 않은 문서 OperationDefinition을 하거나 포함 할 TypeSystemDefinition을 하거나 TypeSystemExtension는 여전히 구문 분석 및 클라이언트 도구는 많은 GraphQL 많은 개별 파일에 걸쳐 나타날 수있는 사용 나타낼 수 있도록 검증 할 수있다.

문서에 단 하나의 연산 만 포함되면 해당 연산의 이름이 지정되지 않거나 축약어 형식으로 표현 될 수 있습니다. 
이 형식은 쿼리 키워드와 연산 이름을 생략합니다. 
그렇지 않으면 GraphQL 문서에 여러 작업이 포함되어있는 경우 각 작업의 이름을 지정해야합니다. 
GraphQL 서비스에 여러 연산을 가진 문서를 제출할 때, 실행될 원하는 연산의 이름도 제공되어야합니다.

GraphQL 쿼리 실행을 제공하고자하는 GraphQL 서비스는 ExecutableDefinition 만 포함 하고 Definition 의 TypeSystemDefinition 및 TypeSystemExtension 규칙은 생략 할 수 있습니다 .


# 참조
-----
* [2019-07-05 Working Draft](https://graphql.github.io/graphql-spec/draft/)
