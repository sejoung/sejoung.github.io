---
layout: post
title: "Pattern Matching for java"
date: 2020-02-10 10:00 +0900
comments: true
tags : ["Pattern Matching for Java","Pattern Matching","패턴매칭"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## Pattern Matching for Java

이 문서는 Java 언어에서 패턴 일치 를 지원하기위한 가능한 방향을 탐구합니다. 
이 문서는 설명 용 문서 일 뿐이며 특정 버전의 Java 언어에서 특정 기능에 대한 계획을 구성하지는 않습니다. 
이 문서는 또한 탐색중인 다른 기능을 참조 할 수도 있습니다. 
이는 순전히 설명을위한 것이며 이러한 기능을 제공하기위한 어떠한 계획이나 약속도 아닙니다.

### Motivation

거의 모든 프로그램에는 표현식에 특정 유형 또는 구조가 있는지 테스트 한 다음 추가 처리를 위해 상태의 
구성 요소를 조건부로 추출하는 테스트를 결합하는 일종의 논리가 포함되어 있습니다. 
예를 들어, 모든 Java 프로그래머는 인스턴스 및 캐스트 관용구에 익숙합니다.

```java
    if (obj instanceof Integer) {
        int intValue = ((Integer) obj).intValue();
        // use intValue
    }
```
여기에 세 가지가 있습니다 

* 테스트(is x an Integer) 
* 전환(conversion)(casting obj to Integer)
* destructuring(extracting the intValue component from the Integer)


이 패턴은 모든 Java 프로그래머가 간단하고 이해하지만 여러 가지 이유로 차선책입니다. 

* 지루합니다.
* 유형 테스트와 캐스트를 모두 수행하는 것은 불필요해야하며(instanceof 테스트 후 다른 작업을 수행해야 합니까?)
* 실수로 주조 및 파괴의 상용구가 뒤 따르는 더 중요한 논리를 혼란스럽게합니다.
* 그러나 가장 중요한 것은 유형 이름을 불필요하게 반복하면 오류가 프로그램에 눈에 띄지 않게 발생할 수 있습니다
* 여러 대상 유형에 대해 테스트하려는 경우이 문제가 악화됩니다. 때때로 일련의 if...else테스트로 동일한 대상을 반복적으로 테스트합니다 .

```java

String formatted = "unknown";
if (obj instanceof Integer) {
    int i = (Integer) obj;
    formatted = String.format("int %d", i);
}
else if (obj instanceof Byte) {
    byte b = (Byte) obj;
    formatted = String.format("byte %d", b);
}
else if (obj instanceof Long) {
    long l = (Long) obj;
    formatted = String.format("long %d", l);
}
else if (obj instanceof Double) {
    double d = (Double) obj;
    formatted = String.format(“double %f", d);
}
else if (obj instanceof String) {
    String s = (String) obj;
    formatted = String.format("String %s", s);
}
...

```

위의 코드는 익숙하지만 바람직하지 않은 속성이 많습니다. 이미 언급했듯이 각 팔에 캐스트를 반복하는 것은 성 가시고 불필요합니다.
상용구에서 비즈니스 로직이 너무 쉽게 손실 될 수 있습니다. 
그러나 가장 중요한 방법은 지나치게 일반적인 제어 구문을 사용했기 때문에 코딩 오류를 숨길 수 있습니다. 
위 코드의 목적은 체인의 formatted각 암에 무언가를 할당하는 것 if...else입니다. 
그러나 컴파일러가 실제로이를 확인할 수있는 것은 없습니다. 
실제로는 거의 실행되지 않는 블록이에 할당을 잊어 버린 formatted경우 버그가 있습니다. 
(퇴거formatted빈 지역 또는 빈 결승전은 최소한 이러한 노력에서 "정확한 할당"분석을 수반하지만 항상 수행되는 것은 아닙니다.) 
마지막으로 위의 코드는 최적화가 쉽지 않습니다. 
컴파일러 영웅이없는 경우, 근본적인 문제가 종종 O (1) 이지만 n 개의 분기를 가진 체인 은 O (n) 시간 복잡성을 갖습니다 .

흐름 유형 ( 테스트 obj후 유형이 instanceof Integer테스트에 의해 지배되는 제어 경로에서 구체화되어 캐스트가 필요하지 않은 경우) 
또는 유형 스위치 (여기서 ) 와 같은 이러한 문제를 개선하기위한 많은 임시 제안이 있었습니다. 
switch 문의 case 레이블은 상수와 유형을 지정할 수 있습니다). 그러나 이들은 대부분 반창고입니다. 이 (및 다른 경우를 포함하는 더 나은 대안이 있습니다.)

### Patterns

테스트 및 추출 문제에 대한 임시 솔루션에 도달하기보다는 Java가 패턴 일치 를 수용 할 때가되었다고 생각합니다. 
패턴 일치는 SNOBOL4 및 AWK와 같은 텍스트 지향 언어, Haskell 및 ML과 같은 기능적 언어, 
최근에는 스칼라와 같은 객체 지향 언어로 확장 된 1960 년대로 거슬러 올라가는 다양한 프로그래밍 언어 스타일에 맞게 조정 된 기술입니다. (가장 최근에는 C #).

패턴 (A)의 조합 매치 술어 패턴의 세트와 함께 타겟과 일치하는지를 결정 패턴 변수 패턴이 목표와 일치하는 경우 조건에 따라 추출된다. 
입력과 같은 입력을 테스트하는 많은 언어 구성을 입력 instanceof과 switch일치하는 패턴을 수용하도록 일반화 할 수 있습니다.

패턴의 한 형태는 유형 pattern 이며, 아래에 일반화하여 설명 된 결과를 바인딩 할 변수 이름과 유형 이름으로 구성됩니다 instanceof.


```java

if (x instanceof Integer i) {
    // can use i here, of type Integer
}

```
여기 x에서 type 패턴과 일치합니다 Integer i. 
먼저 x의 인스턴스인지 테스트합니다 Integer. 
그렇다면로 캐스팅되고 Integer결과가 i에 할당됩니다 . 
이름 i은 기존 변수의 재사용이 아니라 패턴 변수의 선언입니다. 
변수 선언과의 유사성은 우연이 아닙니다.

패턴을 사용하면 메소드 instanceof구현과 같이 일반적으로 복잡한 작업 이 간단 해 equals()집니다. 
클래스의 Point경우 equals()다음과 같이 구현할 수 있습니다.

```java

public boolean equals(Object o) {
    if (!(o instanceof Point))
        return false;
    Point other = (Point) o;
    return x == other.x 
        && y == other.y;
}

```
대신 패턴 일치를 사용하여이를 단일 표현식으로 결합하여 반복을 제거하고 제어 흐름을 단순화 할 수 있습니다.

```java

public boolean equals(Object o) {
    return (o instanceof Point other)
        && x == other.x
        && y == other.y;
}

```
마찬가지로 if..else유형 패턴으로 위 의 체인을 단순화 하여 주조 및 바인딩 상용구를 제거 할 수 있습니다.

```java

String formatted = "unknown";
if (obj instanceof Integer i) {
    formatted = String.format("int %d", i);
}
else if (obj instanceof Byte b) {
    formatted = String.format("byte %d", b);
}
else if (obj instanceof Long l) {
    formatted = String.format("long %d", l);
}
else if (obj instanceof Double d) {
    formatted = String.format(“double %f", d);
}
else if (obj instanceof String s) {
    formatted = String.format("String %s", s);
}
...

```
비즈니스 로직이 훨씬 더 명확하게 드러나지 만 이는 이미 크게 개선되었지만 더 잘할 수 있습니다.

### Patterns in multi-way conditionals

체인에는 if...else여전히 버그를 숨기고 자하는 중복성이 있습니다. 
둘 다 버그를 숨길 수있는 곳을 제공하고 독자가 코드의 기능을 이해하기 어렵게 만듭니다. 
구체적으로, if (obj instanceof ...)부분이 반복된다. "대상 객체를 가장 잘 설명하는 블록을 선택하십시오"라고 말하고 정확히 하나만 실행되도록합니다.

우리는 이미 다국어 평등 테스트를위한 메커니즘을 언어로 가지고 있습니다 switch. 
그러나 switch현재 매우 제한적입니다. 
작은 유형의 세트 (숫자, 문자열 및 열거 형) 만 켤 수 있으며 상수에 대한 정확한 동등성 만 테스트 할 수 있습니다. 
그러나 이러한 한계는 대부분 역사 사고입니다. 
이 switch문은 패턴 일치를 위한 완벽한 "일치"입니다. 
유형 피연산자 instanceof가 패턴으로 일반화 될 수있는 것처럼 case레이블도 가능합니다. 
패턴 케이스와 함께 스위치 표현식을 사용하여 형식화 예제를 다음과 같이 표현할 수 있습니다.

```java

String formatted =
    switch (obj) {
        case Integer i -> String.format("int %d", i); 
        case Byte b    -> String.format("byte %d", b); 
        case Long l    -> String.format("long %d", l); 
        case Double d  -> String.format("double %f", d); 
        case String s  -> String.format("String %s, s);
        default        -> String.format("Object %s", obj);
    };
...

```

이제 올바른 제어 구문을 사용하기 때문에 코드의 의도가 훨씬 더 명확 해졌습니다. 
"표현식 obj은 다음 조건 중 대부분의 조건과 일치하고이를 파악하여 해당 표현식을 평가합니다." 
이것은 더 간결하지만 더 중요합니다. 더 안전합니다. 
우리는 언어 formatted가 항상 할당 되도록 보장해 주었으며 , 컴파일러는 제공된 사례가 철저한 지 확인할 수 있습니다. 
보너스로 더욱 최적화 할 수 있습니다. 이 경우 O (1) 시간 내에 디스패치를 ​​수행 할 가능성이 높습니다 .


### Constant patterns

우리는 이미 일종의 패턴, 즉 오늘의 switch진술 에서 일정한 대소 문자 레이블에 익숙 합니다. 
현재 대소 문자 레이블은 숫자, 문자열 또는 열거 형 상수 일 수 있습니다. 
앞으로 이러한 상수 대소 문자 레이블은 단지 일정한 패턴 입니다. 
대상을 상수 패턴에 일치시키는 것은 분명한 것입니다.
 상수에 대한 동등성을 테스트합니다. 
 이전에는 상수 케이스 레이블을 케이스 레이블과 동일한 유형의 대상과 일치시키는 데만 사용할 수있었습니다. 
 앞으로는 상수 패턴을 사용하여 유형 테스트와 동등성 테스트를 결합 Object하여 특정 상수 와 일치시킬 수 있습니다.

### Operations on polymorphic data

Object동적 유형에 따라 다른 작업을 수행해야하는 위의 예 는 일종의 "임시 다형성"으로 생각할 수 있습니다. 
다양한 하위 유형을 구별하는 데 사용할 수있는 가상 디스패치 또는 메소드를 제공 할 수있는 
일반적인 수퍼 유형은 없으므로 동적 유형 테스트에만 의지하여 질문에 대답 할 수 있습니다.

우리는 종종 클래스를 계층 구조로 배열 할 수 있으며, 이런 경우 유형 시스템을 사용하여 이와 같은 질문에보다 쉽게 대답 할 수 있습니다. 
예를 들어, 산술 표현식을 설명하기 위해이 계층 구조를 고려하십시오.

```java

interface Node { }

class IntNode implements Node {
    int value;
}

class NegNode implements Node { 
    Node node;
}

class MulNode implements Node {
    Node left, right;
}

class AddNode implements Node {
    Node left, right;
}

```
이러한 계층 구조에서 일반적으로 수행 할 수있는 작업은 식을 평가하는 것입니다. 이것은 가상 방법에 이상적인 응용 프로그램입니다.

```java

interface Node { 
    int eval();
}

class IntNode implements Node {
    int value;
    
    int eval() { return value; }
}

class NegNode implements Node { 
    Node node;
    
    int eval() { return -node.eval(); }
}

class MulNode implements Node {
    Node left, right;
    
    int eval() { return left.eval() * right.eval(); }
}

class AddNode implements Node {
    Node left, right;
    
    int eval() { return left.eval() + right.eval(); }
}

```

더 큰 프로그램에서는 계층 구조에 대해 많은 작업을 정의 할 수 있습니다. 
위와 같은 일부 eval()는 본질적으로 계층에 합리적이므로 가상 메소드로 구현할 수 있습니다. 
그러나 일부 연산은 너무 임시적입니다 (예 : "이 표현식에 42로 평가되는 중간 노드가 포함되어 있습니까"). 
API를 오염시키기 때문에 이것을 계층 구조에 넣는 것은 어리석은 일입니다.

### The Visitor pattern

운영과 계층을 별도로 지정하는 표준 트릭은 방문자 패턴입니다.
데이터 구조의 순회를 데이터 구조 자체의 정의와 분리합니다. 
예를 들어, 데이터 구조가 CAD 응용 프로그램의 설계를 나타내는 트리 인 경우, 거의 모든 작업은 트리의 적어도 일부를 통과해야합니다 
(저장, 인쇄, 요소 레이블에서 텍스트 검색, 중량 또는 비용 계산, 설계 검증). 
우리는 이러한 각 작업을 루트 유형에 대한 가상 방법으로 표현함으로써 시작할 수 있지만, 
이것은 다루기 어려워지고 방문자 패턴을 통해 주어진 순회에 대한 코드를 분리 할 수 있습니다 
(예 : 데이터 구조 자체를 정의하는 코드의 요소 레이블)을 사용하면 코드를 구성하는 데 가장 좋은 방법입니다.


그러나 방문자 패턴에는 비용이 있습니다. 
이를 사용하려면 방문을위한 계층 구조를 설계해야합니다. 
여기에는 모든 노드에 accept(Visitor)메소드 를 제공 하고 Visitor 인터페이스를 정의하는 것이 포함 됩니다.

```java

interface NodeVisitor<T> {
    T visit(IntNode node);
    T visit(NegNode node);
    T visit(MulNode node);
    T visit(AddNode node);
}

```
평가 방법을의 방문자로 정의하려면 다음 Node과 같이하십시오.

```java

class EvalVisitor implements NodeVisitor<Integer> {
    Integer visit(IntNode node) {
        return node.value;
    }
    
    Integer visit(NegNode node) {
        return -node.accept(this);
    }
    
    Integer visit(MulNode node) {
        return node.left.accept(this) * node.right.accept(this);
    }

    Integer visit(AddNode node) {
        return node.left.accept(this) + node.right.accept(this);
    }
}

```

간단한 계층 구조와 간단한 통과의 경우에는 그렇게 나쁘지 않습니다. 
우리는 방문자 준비 (모든 노드 클래스가 accept메소드와 단일 방문자 인터페이스를 필요로 함)로 인해 일정한 코드 오버 헤드를 겪고 
그 후 순회 작업마다 방문자를 하나씩 작성합니다. (추가적인 처벌로 방문자가 반환 한 프리미티브를 상자에 넣어야합니다.) 
그러나 방문자는 상세하고 엄격하다는 평판을 얻었습니다. 방문자가 더 복잡해지면 단일 순회에 여러 레벨의 방문자가 참여하는 것이 일반적입니다.

방문자는 계층 구조의 조작을 계층 구조 정의 자체와 분리하는 올바른 아이디어를 가지고 있지만 결과는 이상적이지 않습니다. 
그리고 계층 구조가 방문 용으로 설계되지 않았거나 더 나쁜 경우, 순회하는 요소에는 공통 수퍼 유형이 없으므로 운이 없습니다. 
다음 섹션에서는 패턴 일치를 통해 방문자가 제공하는 유형 중심의 순회를 자세 성, 침해 성 또는 제한없이 어떻게 제공하는지 살펴 보겠습니다.

### Deconstruction patterns

클래스와 같은 많은 클래스 Node는 구조화 된 데이터를위한 유형이 지정된 캐리어입니다. 
일반적으로 생성자 또는 팩토리를 사용하여 상태에서 객체를 생성 한 다음 접근 자 메서드를 사용하여이 상태에 액세스합니다. 
생성자에 전달하는 모든 상태 구성 요소에 액세스 할 수 있으면 생성은 가역적 인 것으로 생각할 수 있으며 구성의 반대는 해체 입니다.

해체 패턴(deconstruction pattern) 반대로 생성자 같다; 지정된 형식의 인스턴스와 일치 한 다음 상태 구성 요소를 추출합니다. 우리 Node가

```java

new IntNode(5)

```

그런 다음 노드를 해체 할 수 있습니다 (해체를 IntNode지원 한다고 가정 ).

```java

case IntNode(int n) -> ... n is in scope here ...

```
클래스 eval()에서 해체 패턴을 사용하여 메소드를 구현하는 방법은 다음과 같습니다 Node.


```java

int eval(Node n) {
    return switch(n) {
        case IntNode(int i) -> i;
        case NegNode(Node n) -> -eval(n);
        case AddNode(Node left, Node right) -> eval(left) + eval(right);
        case MulNode(Node left, Node right) -> eval(left) * eval(right);
    };
}

```

해체 패턴은 AddNode(Node left, Node right)먼저 n그것이인지 확인하고 AddNode, 
그렇다면 AddNode추가 평가를 위해 그것을 왼쪽과 오른쪽 하위 트리로 캐스팅 하여 패턴 변수로 추출합니다.

이것은 방문자 솔루션보다 훨씬 간결하지만 더 중요한 것은 더 직접적입니다. 
우리는 Node방문자 지원을 제공하기 위해 유형을 필요로하지 않았으며 일반적인 일반 수퍼 유형이 필요하지 않았습니다. 
우리가 필요로하는 것은 Node해체 패턴을 사용하여 유형을 분리 할 수있을 정도로 유형이 충분히 투명해야했습니다.

### Sidebar: Data-driven polymorphism with patterns

방문자 패턴의 약속은 안정적인 계층에 대한 작업을 계층과 별도로 지정할 수 있다는 것입니다. 
그러나 이것은 비용이 많이 든다. 방문자 기반 코드는 부피가 크고, 잘못되기 쉽고, 작성하기가 성가시다. 
패턴 일치를 사용하면 방문자의 기계가 개입하지 않고도 동일한 결과를 얻을 수 있으므로보다 깨끗하고 단순하며 투명하며 유연한 코드가 생성됩니다. 
또한 패턴 일치에는 방문자가 수행하는 "안정된 계층 구조"요구 사항 또는 실제로 계층 구조 요구 사항이 없습니다.

패턴 일치로 임시 다형성을 지원한다고해서 상속 계층과 가상 방법이 잘못되었다는 의미는 아닙니다. 
문제를 공격하는 유일한 방법은 아닙니다. 이 eval()방법으로 보았 듯이 때로는 작업이 계층 구조에 포함하기에 이상적인 후보입니다. 
그러나 엔드 포인트가 다양한 메시지를 수신하고 모든 메시지 유형이 공통 상위 유형을 갖지 않는 경우 (또는 동일한 라이브러리에서 온 경우)와 
같이 때로는 이것이 올바른 선택이 아니거나 가능하지 않은 경우도 있습니다. 패턴 매칭은 깨끗하고 간단한 데이터 중심 다형성을 제공합니다.

많은 "디자인 패턴"이 언어에서 누락 된 기능에 대한 해결 방법이라고도합니다. 
이 주장은 너무 쉬울 수 있지만 방문자의 경우 상당히 정확합니다. 
언어에 충분히 강력한 패턴 일치가 있으면 방문자 패턴이 거의 필요하지 않습니다.


### Composing patterns

해체 패턴은 믿을 수 없을 정도로 강력합니다. 
우리가에 대해 일치하면 AddNode(Node x, Node y)앞의 예에서, 그것은처럼 보였다 수도 Node x및 Node y패턴 변수의 선언은 단순히. 
그러나 실제로는 패턴 자체입니다!

왼쪽 및 오른쪽 하위 트리에 대한 값을 AddNode취하는 생성자 Node와 왼쪽 및 오른쪽 하위 트리를 Nodes 로 생성하는 소멸자가 있다고 가정하십시오. 
다음의 경우 pattern AddNode(P, Q)과 where P및 Q patterns는 대상과 일치합니다.

* 대상은 AddNode;
* 일치 하는 left노드 ;AddNodeP
* 해당 right노드가 AddNode일치 Q합니다.

때문에 P와 Q패턴, 그들은 자신의 패턴 변수가있을 수 있습니다; 전체 패턴이 일치하면 하위 패턴의 모든 바인딩 변수도 바인딩됩니다. 그래서 :

```java

case AddNode(Node left, Node right)) -> ...

```

중첩 된 패턴 Node left과는 Node right효과가 타겟이 경우 우리가 확인하는 것이되도록 
(. 정적 유형 정보를 기반으로,이 경우에 일치하도록 보장 할 일이) 
우리가 이미 본 적이 단지 형 패턴입니다 AddNode, 만약 그렇다면 즉시 결합 left하고 right왼쪽과 오른쪽 하위 노드. 
복잡하게 들릴 수도 있지만 효과는 간단합니다. AddNode구성 요소와 일치 하고 구성 요소를 한 번에 바인딩 할 수 있습니다 .

그러나 우리는 더 나아갈 수 있습니다 : 우리는 다른 패턴을 해체 패턴 안에 중첩하여 일치하는 것을 더 제한하거나 결과를 더 해체 할 수 있습니다.

### Exhaustiveness

의 표현 형식 switch에서 스위치의 한 팔을 정확하게 평가하여 switch표현 자체 의 값이 됩니다. 
즉, 입력에 적용되는 팔이 하나 이상 있어야합니다. 그렇지 않으면 switch표현식 의 값 이 정의되지 않을 수 있습니다. 
스위치에 default암이 있으면 아무런 문제가 없습니다. 
enum모든 열거 상수가 처리되는 스위치 오버의 경우 , 
default결코 우리가 결코 취하지 않을 것으로 예상 되는 절 을 작성해야하는 경우가 종종 있습니다. 
더 나쁜 것은,이 기본 조항을 작성하면, 컴파일러가 사례를 철저히 열거했는지 확인할 수 없게됩니다.

마찬가지로 Node클래스 와 같이 패턴 일치를 적용 할 수있는 많은 계층의 경우 default모든 하위 유형을 나열한 경우 절대 사용하지 않는 팔 을 포함해야합니다. 
우리는 것을 표현할 수 있다면 단지 의 아형이 Node있다 IntNode, AddNode, MulNode,와 NegNode, 
컴파일러는 확인이 정보를 사용할 수있는 switch 이러한 유형의 이상이 철저한이다.

여기에 적용 할 수있는 오래된 기술인 계층 구조 씰링이 있습니다. 
Node타입을 봉인 한다고 선언한다고 가정하자 . 즉, 공동 컴파일 된 하위 유형 (종종 단일 컴파일 단위에서) 만 확장 할 수 있습니다.

```java

sealed interface Node { }

```

봉인은 최종성의 일반화입니다. 최종 유형에 하위 유형이없는 경우 봉인 된 유형은 공동 선언 된 고정 하위 유형 세트를 초과하는 하위 유형을 가질 수 없습니다. 
밀봉에 대한 자세한 내용은 별도로 설명합니다.

### Patterns and type inference

컴파일러 var가 타입을 명시 적으로 철자하는 대신 사용하여 로컬 변수의 타입을 유추하도록하려는 것처럼 타입 패턴으로 동일한 작업을 수행 할 수 있습니다. 
AddNode예제 에서 명시 적으로 유형 패턴을 사용하는 것이 유용 할 수 있지만 컴파일러는 위에서 본 것처럼 정적 유형 정보를 기반으로 var 패턴을 최적화 할 수 있지만  
중첩 유형 패턴 대신 중첩 패턴을 사용할 수도 있습니다. var패턴 용도의 타입 추론은 동일한 종류의 패턴 (아무것도 효과적으로 일치)에 매핑하고, 
추정 된 입력 패턴 변수 목표 결합한다. 어떤 것과 일치하는 패턴은 어리석게 들릴 수도 있지만 어리석은 소리 일 수도 있지만 중첩 된 패턴으로 매우 유용합니다. 
eval메소드를 다음과 같이 변환 할 수 있습니다 .

```java

int eval(Node n) {
    return switch(n) {
        case IntNode(var i) -> i;
        case NegNode(var n) -> -eval(n);
        case AddNode(var left, var right) -> eval(left) + eval(right);
        case MulNode(var left, var right) -> eval(left) * eval(right);
    };

```
이 버전은 명시 적으로 유형이 지정된 버전과 동일합니다. var로컬 변수 선언에서 사용하는 것처럼 컴파일러는 올바른 유형을 유추 할뿐입니다. 
지역 변수와 마찬가지로 중첩 유형 패턴을 사용할지 또는 중첩 var패턴 을 사용할지 선택 하는 것은 매니페스트 유형이 가독성과 유지 관리 성을 추가 
또는 분산시키는 지 여부 중 하나입니다.

### Nesting constant patterns

상수 패턴은 자체적으로 유용하지만 ( switch현재 모든 기존 명령문은 상수 패턴과 동일 함) 중첩 패턴으로도 유용합니다. 
예를 들어, 평가자에서 "0 번 아무 것도 0"과 같은 특수한 경우를 최적화한다고 가정합니다. 이 경우 다른 하위 트리를 평가할 필요조차 없습니다.

경우 IntNode(var i)어떤 일치 IntNode, 중첩 된 패턴은 IntNode(0)일치하는 IntNode0의 값을 보관 유지합니다. 
( 0여기서는 상수 패턴입니다.)이 경우 먼저 대상이 테스트되어 목표인지 테스트하고 IntNode, 
그렇다면 숫자 페이로드를 추출한 다음 상수 패턴과 비교합니다 0. 우리는 원하는만큼 깊이 갈 수 있습니다. 
MulNode왼쪽 구성 요소가 IntNode0을 포함하는 에 대해 일치 시킬 수 있으며이 경우 두 하위 트리의 평가를 최적화 할 수 있습니다.

```java
int eval(Node n) {
    return switch(n) {
        case IntNode(var i) -> i;
        case NegNode(var n) -> -eval(n);
        case AddNode(var left, var right) -> eval(left) + eval(right);
        case MulNode(IntNode(0), var right), 
             MulNode(var left, IntNode(0)) -> 0;
        case MulNode(var left, var right) -> eval(left) * eval(right);
    };
}
```

첫 번째 MulNode패턴은 세 개의 깊이로 중첩되며 모든 레벨이 일치하는 경우에만 일치합니다. 
먼저 일치하는 대상이 a MulNode인지 테스트 한 다음 MulNode왼쪽 구성 요소가 IntNode; 인지 테스트 합니다. 
IntNode정수 요소가 0 인지 테스트합니다 . 목표가이 복잡한 패턴과 일치하면 MulNode0을 단순화 할 수 있습니다. 
그렇지 않으면 다음과 같이 진행합니다. case이는 any 와 일치 MulNode하며 이전과 같이 왼쪽 및 오른쪽 하위 노드를 재귀 적으로 평가합니다.

방문객들에게 이것을 표현하는 것은 순진하고 읽기가 더 어려울 것이다. 
방문자가 가장 바깥 쪽 레이어를 쉽게 처리 할 수 있지만 명시적인 조건부 논리 또는 더 많은 방문자 레이어로 내부 레이어를 처리해야합니다. 
이러한 방식으로 패턴을 작성하는 기능을 통해 복잡한 일치 조건을 명확하고 
간결하게 지정할 수 있으므로 코드를보다 쉽게 읽을 수 있고 오류 발생 가능성이 줄어 듭니다.

### Any patterns

var패턴이 어떤 것과도 일치하고 그 대상을 바인딩하는 것처럼 패턴은 어떤 것도 _일치하고 아무 것도 바인딩하지 않습니다. 
다시 말하지만, 이것은 독립형 패턴으로별로 유용하지 않지만 "이 구성 요소에 관심이 없다"고 말하는 방법으로 유용합니다. 
하위 구성 요소가 일치와 관련이없는 경우 _패턴 을 사용하여 명시 적으로 만들거나 실수로 액세스하지 못하게 할 수 있습니다 . 
예를 들어, _패턴을 사용하여 위의 예에서 "0으로 곱하기"사례를 다시 작성할 수 있습니다 .

```java

case MulNode(IntNode(0), _), MulNode(_, IntNode(0)) -> 0;

```

다른 구성 요소는 일치하는 논리와 관련이 없으며 이름을 지정하거나 추출 할 필요가 없습니다.

### Patterns are the dual of constructors (and literals)

패턴은 몇 가지 일반적인 연산을 결합하여 현명한 구문 트릭으로 보일 수 있지만 실제로는 더 깊습니다. 
즉, 값을 생성, 표시 또는 얻는 데 사용한 연산의 이중입니다. 
리터럴 0은 숫자 0을 나타냅니다. 패턴으로 사용되면 숫자 0과 일치합니다. 
이 표현 은 특정 쌍 에서 a를 new Point(1, 2)구성합니다 . 패턴 은 모든 점과 일치하고 해당 값을 추출 합니다. 
값 (생성자, 정적 팩토리 등)을 구성하거나 얻는 모든 방법에 대해 해당 값을 구성 요소 부분으로 분리하는 해당 패턴이있을 수 있습니다. 
건설과 해체 사이의 강력한 구문 유사성은 우연이 아닙니다. Point(x, y)Point(int x, int y)(x, y)

### Static patterns

해체 패턴은 생성자와 비슷하지만 인스턴스를 가져 와서 일련의 구성 요소로 파괴하는 반대로 실행되는 클래스 멤버에 의해 구현됩니다. 
클래스가 생성자뿐만 아니라 정적 팩토리를 가질 수있는 것처럼, 정적 패턴 을 갖는 것도 합리적 입니다. 
정적 팩토리가 객체를 생성하는 다른 방법 인 것처럼 정적 패턴은 생성자를 노출시키지 않는 유형에 대해 동일한 해체 패턴을 수행 할 수 있습니다.

예를 들어, Optional팩토리 메소드 Optional.of(v)및로 구성됩니다 Optional.empty(). 
Optional값 에 따라 작동하는 정적 패턴을 노출 하고 관련 상태를 추출 할 수 있습니다 .

```java

switch (opt) {
    case Optional.empty(): ...
    case Optional.of(var v): ...
}

```
객체가 구성되는 방식과 구조가 해제되는 방식 사이의 구문은 마찬가지로 우연이 아닙니다. 
(인스턴스 패턴도 의미가 있는지 여부는 분명한 질문입니다. 현재 패턴보다 API 디자이너에게 더 나은 선택을 제공합니다. 
정적 및 인스턴스 패턴은 별도의 문서에서 더 자세히 다룰 것입니다.)

### Pattern bind statements

패턴을 지원하기 위해 확장 할 수있는 두 가지 구성이 이미 있습니다 : instanceof및 switch. 
우리가 원하는 또 다른 패턴 인식 제어 구문은 패턴을 사용하여 대상을 구조화하는 패턴 바인딩 명령문 입니다. 

예를 들어, 다음과 같이 말합니다.

```java

record Point(int x, int y);
record Rect(Point p0, Point p1);

```
그리고 우리는 Rect경계 지점으로 구조를 변경하고 싶습니다. 무조건 파괴는 다음과 같이 보일 수 있습니다 
(익스프레스의 목적으로 구문이 단지 자리 표시 자라는 것을 제안하기 위해 친숙한 "이중 밑줄"구문 규칙을 사용함).

```java

Rect r = ...
__let Rect(var p0, var p1) = r;
// use p0, p1

```

여기서 패턴이 일치하는지 확인하고 컴파일러가 확인하므로 대상을 구조 해제하고 해당 구성 요소를 새 변수에 바인딩합니다. 
패턴이 대상 피연산자에서 부분적 이므로 일치한다고 보장 할 수없는 경우 다음 else절을 제공 할 수 있습니다.

```java

Object r = ...
__let Rect(var p0, var p1) = r
else throw new IllegalArgumentException("not a Rect");
// use p0, p1

```
중첩 된 패턴을 사용하여 코너 좌표를 한 번에 추출 할 수도 있습니다.

```java

Rect r = ...
__let Rect(Point(var x0, var y0), Point(var x1, var y1)) = r;
// use x0, x1, y0, y1

```
마찬가지로 switch, let던질 수 있습니다 NullPointerException우리는을 destructure하려고하면 런타임에 null와 제공하지 않는 else절을.

### Summary of patterns and control flow constructs

우리는 이제 여러 종류의 패턴을 보았습니다.

* 상수 패턴 : 목표와 상수가 같은지 테스트합니다.
* instanceof테스트 를 수행 하고 대상을 캐스트하고 패턴 변수에 바인딩하는 유형 패턴;
* instanceof테스트 를 수행하고 , 대상을 캐스팅하고, 대상을 변형하고, 구성 요소를 서브 패턴에 재귀 적으로 일치시키는 분해 패턴;
* 해체 패턴보다 일반적인 방법 패턴;
* 모든 것과 일치하고 대상을 바인딩하는 Var 패턴;
* any _와 일치하고 아무것도 바인딩하지 않는 any 패턴 .

또한 패턴을 사용할 수있는 몇 가지 컨텍스트를 보았습니다.

* switch문 또는 expresion;
* instanceof술어;
* __let또는 __bind문.

컬렉션 패턴 과 같은 다른 가능한 종류의 패턴 은 나중에 추가 할 수 있습니다. 마찬가지로, 같은 다른 언어 구조도 catch향후 패턴 일치를 지원할 수 있습니다.

### Pattern matching and records

패턴 일치는 현재 개발중인 레코드 , 데이터 클래스 와 다른 기능과 매우 잘 연결됩니다 . 
데이터 클래스는 작성자가 데이터를 투명하게 전달하는 클래스에 커밋하는 클래스입니다. 
답례로, 데이터 클래스는 암시 적으로 획득 해체 패턴 (뿐만 아니라 생성자, 접근, 같은 다른 유용한 유물 equals(), hashCode()등) 
우리는 우리의 정의 할 수 있습니다 Node매우 컴팩트 기록과 같은 계층 구조를 :

```java

sealed interface Node { }

record IntNode(int value) implements Node;
record NegNode(Node node) implements Node;
record SumNode(Node left, Node right) implements Node;
record MulNode(Node left, Node right) implements Node;
record ParenNode(Node node) implements Node;

```

우리는 이제 유일한 하위 유형이 Node여기에 있다는 것을 알고 있으므로 switch 위 예제 의 표현은 철저한 분석의 이점이 있으며 default 팔이 필요하지 않습니다 .
 (Astute 독자들은 우리가 잘 알려진 구조 인 대수 데이터 유형에 도달했음을 관찰 할 것입니다 . 
 레코드는 제품 유형에 대한 간단한 표현을 제공하고 봉인은 다른 절반 인 sum 유형을 제공 합니다.)


### Scoping

패턴 인식 구문 instanceof에는 새로운 속성이 있습니다. 표현식 중간에서 변수를 도입 할 수 있습니다. 
분명한 질문은이 패턴 변수의 범위는 무엇입니까? 동기 부여가되는 몇 가지 예를 살펴 보겠습니다 (자세한 내용은 별도의 문서에 있음).

```java
if (x instanceof String s) {
    System.out.println(s);
}
```

여기서 패턴 변수 s는 if문장 의 본문에 사용됩니다 . 
본문을 실행할 때까지 패턴이 일치해야하므로 s잘 정의 s되어 있으며 본문에 범위 내에있는 변수 세트에 포함해야 합니다 if. 
우리는 이것을 더 확장 할 수 있습니다 :

```java

if (x instanceof String s && s.length() > 0) {
    System.out.println(s);
}

```

이것도 의미가 있습니다. 왜냐하면 &&단락이기 때문에 두 번째 조건을 실행할 때마다 일치가 
이미 성공했기 s때문에이 사용에 대해 다시 정의되어 s있으며 조건의 두 번째 하위 표현 범위에 속하는 변수 세트에 포함해야 합니다 . 

반면에 AND를 OR로 바꾸면 :

```java

if (x instanceof String s || s.length() > 0) {  // error
    ...
}

```

우리는 오류를 예상해야한다. s조건부에서 두 번째 하위 표현식에서 일치하지 않았기 때문에이 컨텍스트에서 잘 정의되지 않았습니다. 
마찬가지로 s else 절에 잘 정의되어 있지 않습니다.

```java

if (x instanceof String s) {
    System.out.println(s + "is a string");
    // OK to use s here
}
else {
    // error to use s here
}

```
그러나 조건이 일치를 거꾸로 가정합니다.

```java

if (!(x instanceof String s)) {
    // error to use x here
}
else {
    System.out.println(s + "is a string");
    // OK to use s here
}

```

여기서 s else-arm의 범위에 속 하려고 합니다 (그렇지 않은 경우 if-then-else블록의 상태를 바꾸고 팔을 바꾸어 블록 을 자유롭게 리팩터링 할 수는 없습니다 ).

본질적으로, 우리 는 언어 의 명확한 할당 규칙 을 모방하는 범위 지정 구문을 원합니다 . 
우리는 패턴 변수가 확실히 할당 된 범위 안에 있고, 그렇지 않을 때는 범위 안에 있지 않기를 원합니다. 
이를 통해 각 패턴마다 새로운 것을 만들지 않고 패턴 변수 이름을 재사용 할 수 있습니다.

```java

switch (shape) {
    case Square(Point corner, int length): ...
    case Rectangle(Point rectCorner, int rectLength, int rectHeight): ...
    case Circle(Point center, int radius): ...
}

```

패턴 변수의 범위가 지역 변수의 범위와 비슷하다면, 
우리는 여기에서와 length 같이 이름을 재사용하지 않고 모든 경우에 대해 고유 한 이름을 구성해야하는 불행한 위치에있게 됩니다.
범위를 명확한 할당과 일치 시키면 패턴 변수를 사용할 수있는시기와 그렇지 않은시기에 대한 사용자의 기대에 부응 할 수 있습니다.


# 참조
-----
* [Pattern Matching for Java](http://cr.openjdk.java.net/~briangoetz/amber/pattern-match.html)

