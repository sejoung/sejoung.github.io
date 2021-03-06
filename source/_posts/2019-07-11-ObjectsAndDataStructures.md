---
layout: post
title: "Classes vs. Data Structures"
date: 2019-07-11 17:10 +0900
comments: true
tags : ["Classes","Data Structures"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
## Classes vs. Data Structures

클래스 란 무엇인가요?

클래스는 유사한 객체 세트의 명세입니다

객체 란 무엇입니까?

객체는 캡슐화 된 데이터 요소에서 작동하는 함수 집합입니다.
또는 객체는 함축 된 데이터 요소 에서 작동하는 함수 집합입니다 .

묵시적인 데이터 요소 란 무엇입니까 ?

객체의 기능은 일부 데이터 요소의 존재를 암시합니다. 그 데이터는 객체 외부에서 직접 액세스하거나 볼 수 없습니다.

객체 안의 데이터가 아닌가?

그럴수있다. 하지만 무조건 맞다라는것은 아니다. 사용자의 관점에서 볼 때 객체는 하나 이상의 함수 집합에 지나지 않습니다. 
해당 기능이 작동하는 데이터가 있어야하지만 해당 데이터의 위치는 사용자에게 알려지지 않습니다

이제 데이터 구조 란 무엇입니까?

데이터 구조는 응집력있는 데이터 요소 집합입니다.
즉, 데이터 구조는 함축 된 기능에 따라 작동되는 데이터 요소 집합입니다.

데이터 구조에서 작동하는 함수는 데이터 구조에 의해 지정되지 않지만 데이터 구조의 존재는 일부 연산이 존재해야 함을 의미합니다.

이제이 두 정의에 대해 어떻게 알 수 있습니까?

과연. 그것들은 서로 보완 적입니다. 그들은 장갑처럼 손에 꼭 맞습니다.

객체는 함축 된 데이터 요소에 대해 작동하는 함수 집합입니다.
데이터 구조는 묵시적 함수에 의해 작동되는 데이터 요소 집합입니다

객체는 데이터 구조가 아닙니다.

옳은. 객체는 데이터 구조의 반대입니다.

따라서 데이터 전송 객체 인 DTO는 객체가 아닙니다.

옳은. DTO는 데이터 구조입니다.

그리고 데이터베이스 테이블도 객체가 아닙니다.

옳은  데이터베이스는 객체가 아니라 데이터 구조를 포함합니다.

하지만 ORM과 Object Relational Mapper는 데이터베이스 테이블을 객체에 매핑하지 않습니까?

당연히 아니지. 데이터베이스 테이블과 개체 간에는 매핑이 없습니다. 
데이터베이스 테이블은 객체가 아닌 데이터 구조입니다.

그렇다면 ORM은 무엇을합니까?

데이터 구조간에 데이터를 전송합니다.

그래서 그들은 객체들과 아무 상관이 없습니까?

뭐든간에. 객체 관계 맵퍼와 같은 것은 존재하지 않습니다. 
왜냐하면 데이터베이스 테이블과 객체간에 매핑이 없기 때문입니다.

하지만 ORM이 우리를 위해 비즈니스 객체를 구축했다고 생각했습니다.

아니요, ORM은 비즈니스 개체가 작동하는 데이터를 추출합니다. 이 데이터는 ORM에 의해로드 된 데이터 구조에 포함됩니다.

그렇다면 비즈니스 객체에는 해당 데이터 구조가 포함되어 있지 않습니까?

그것은 수도. 그렇지 않을 수도 있습니다. 그것은 ORM의 사업이 아닙니다.

그것은 사소한 의미 론적 지점처럼 보입니다.

전혀. 이 구별에는 중요한 의미가 있습니다.

예를 들면?

데이터베이스 스키마의 디자인 대 비즈니스 객체의 디자인. 
비즈니스 개체는 비즈니스 동작 의 구조를 정의합니다. 
데이터베이스 스키마는 비즈니스 데이터의 구조를 정의합니다. 
이 두 구조는 매우 다른 힘에 의해 제약을받습니다. 
비즈니스 데이터의 구조가 반드시 비즈니스 행동을위한 최상의 구조는 아닙니다.

흠. 혼란 스럽네.

이것을 이렇게 생각하십시오. 
하나의 응용 프로그램에 대해서만 데이터베이스 스키마가 조정되지 않습니다. 
그것은 전체 기업을 지원해야합니다. 
따라서 이 데이터의 구조는 다양한 응용 프로그램 간의 절충안입니다.

좋아, 알았다.

좋은. 그러나 이제 각각의 개별 응용 프로그램을 고려하십시오. 
각 응용 프로그램의 개체 모델은 해당 응용 프로그램의 동작 방식을 설명합니다. 
각 응용 프로그램에는 해당 응용 프로그램의 동작에 맞게 조정 된 다른 개체 모델이 있습니다.

오, 알았어. 데이터베이스 스키마는 모든 다양한 응용 프로그램의 절충안이므로 해당 스키마는 특정 응용 프로그램의 개체 모델을 따르지 않습니다.

객체와 데이터 구조는 매우 다른 힘에 의해 제약을받습니다. 
드물게 잘 정돈되어 있습니다. 
사람들은 이것을 Object / Relational 임피던스 불일치 라고 부릅니다.

나는 그것을 들었다. 하지만 임피던스 불일치가 ORM에 의해 해결되었다고 생각했습니다.

그리고 이제 당신은 지금 다르게 객체와 데이터 구조가 동형이 아닌 상보 적이기 때문에 임피던스 불일치가 없습니다.

뭐라고?

그것들은 반대편이며, 비슷한 존재가 아닙니다.

반대편 이요?

네, 매우 흥미로운 방법 으로요. 객체와 데이터 구조는 정반대의 제어 구조를 의미합니다.

무엇을 기다립니다?

공통 인터페이스를 모두 준수하는 객체 클래스 집합을 생각해보십시오. 
예를 들면, 모두를 계산하는 기능을 갖는 이차원 형상 나타내는 클래스 상상 area과 perimeter형상을한다.


왜 모든 소프트웨어 예제는 항상 모양을 포함합니까?

Squares와 Circles 의 두 가지 유형을 고려해 보겠습니다. 
이 두 클래스의 함수 area와 permimeter기능은 서로 다른 암시 적 데이터 구조에서 작동 한다는 것이 분명해야합니다. 
또한 이러한 작업이 호출되는 방식은 동적 다형성을 통해 이루어지는 것이 분명해야합니다.

천천히 해. 뭐?

두 가지 area기능이 있습니다. 하나는 Square, 다른 하나는 Circle. 
호출자가 area특정 객체에서 함수를 호출하면 호출 할 함수를 알고있는 것은 해당 객체입니다. 
우리는이 동적 다형성을 호출합니다.

Discoominated 무엇입니까?

차별 된 조합. 이 경우 두 개의 다른 데이터 구조에 불과합니다. 
하나는 for Square, 다른 하나는 for Circle. Circle 데이터 구조 중심점 및 데이터 요소의 반경을 갖는다. 
또한이 코드를 a로 식별하는 유형 코드가 Circle있습니다.

열거형을 의미합니까?

확실한. Square데이터 구조는 좌상 점, 측면의 길이를 갖는다. 그것은 또한 타입 discriminator - enum을 가진다.

유형 코드가있는 두 개의 데이터 구조.

권리. 이제이 area함수를 살펴 보자. 그것의 switch 문을 가지고가는 것이지, 그렇지 않습니까?

음. 물론, 두 가지 다른 경우. 하나는 for Square, 다른 하나는 for Circle. 그리고이 perimeter함수는 비슷한 switch 문을 필요로합니다.

다시. 이제이 두 시나리오의 구조에 대해 생각해보십시오. 
객체 시나리오에서 area함수 의 두 구현은 서로 독립적이며 유형에 대해 (단어의 의미에서) 속합니다. 
Square의 area기능에 속하는 Square과 Circle의의 area기능이 속한 Circle.

좋아, 나는 너가 이것으로 어디로 가고 있는지 안다. 
데이터 구조 시나리오에서 area함수 의 두 구현은 동일한 함수에 함께 있으며 형식에 속합니다(그러나 그 단어를 의미 함)는 아닙니다.


점점 좋아집니다. Triangle유형을 오브젝트 시나리오 에 추가하려면 어떤 코드를 변경해야합니까?

코드가 변경되지 않았습니다. 새 Triangle클래스를 만들면 됩니다. 아, 인스턴스의 작성자를 변경해야한다고 생각합니다.

권리. 따라서 새로운 유형을 추가 할 때 변경 사항이 거의 없습니다. 이제 새로운 함수를 추가하려고한다고 가정 해보자 center.

그럼 당신은 세 가지 유형이 추가해야 것 Circle, Square하고 Triangle.

좋은. 새로운 기능을 추가하는 것은 어렵습니다. 각 클래스를 변경해야합니다.

그러나 데이터 구조가 다르다. 추가하기 위해서는 switch 문에 대소 문자를 Triangle추가하기 위해 각 함수를 변경해야 Triangle합니다.

권리. 새로운 유형을 추가하는 것은 어렵습니다. 각 기능을 변경해야합니다.

그러나 새 center함수 를 추가하면 아무 것도 변경되지 않습니다.

예. 새로운 기능을 추가하는 것은 쉽습니다.

와우. 그것은 정반대입니다.

그것은 분명합니다. 복습 해보자:

클래스 집합에 새 함수를 추가하는 것은 어렵습니다. 각 클래스를 변경해야합니다.
새로운 함수를 데이터 구조 세트에 추가하는 것은 쉽습니다. 함수를 추가하기 만하면 다른 것은 변경되지 않습니다.
클래스 집합에 새 형식을 추가하는 것은 쉽습니다. 새 클래스를 추가하기 만하면됩니다.
데이터 구조 세트에 새로운 유형을 추가하는 것은 어렵습니다. 각 기능을 변경해야합니다.


네. 맞은 편. 재미있는 방식으로 맞은 편. 
즉, 일련의 유형에 새로운 기능을 추가한다는 것을 알고 있다면 데이터 구조를 사용하는 것이 좋습니다. 
그러나 새로운 유형을 추가하려고한다면 클래스를 사용하고 싶습니다.

좋은 관찰! 그러나 오늘 우리가 고려해야 할 것이 하나 있습니다. 
데이터 구조와 클래스가 상반되는 또 다른 방법이 있습니다. 의존성과 관련이 있습니다.

의존성?

예, 소스 코드 종속성의 방향입니다.

좋아, 내가 물지. 차이점이 뭐야?

데이터 구조의 경우를 고려하십시오. 각 함수에는 구분 된 공용체 내의 형식 코드를 기반으로 적절한 구현을 선택하는 switch 문이 있습니다.

좋아, 그게 사실이야. 하지만 뭐라구?

area함수 호출을 고려하십시오 . 호출자 area는 area함수에 의존하며 함수는 모든 특정 구현에 따라 다릅니다.

"의존"이란 무엇을 의미합니까?

각 구현이 area자신의 함수로 작성 되었다고 상상해보십시오. 그래서 거기에 circleArea와 squareArea와 triangleArea.

그렇기 때문에 switch 문은 이러한 함수를 호출합니다.

이 함수들이 다른 소스 파일에 있다고 상상해보십시오.

권리. 이것이 소스 코드 의존성입니다. 하나의 소스 파일은 다른 소스 파일에 의존합니다. 그 의존성의 방향은 무엇입니까?

switch 문을 사용하는 소스 파일은 모든 구현을 포함하는 소스 파일에 따라 다릅니다.

그리고 area함수 의 호출자는 어떻습니까?

area함수 호출자는 모든 구현에 따라 달라지는 switch 문을 사용하여 소스 파일에 종속됩니다.

옳은. 모든 소스 파일 종속성은 호출자에서 구현에 이르기까지 호출 방향을 나타냅니다. 그래서 만약 당신이 그 구현 중 하나에 작은 변화를 만들면 ...

좋아, 나는 너가 이것으로 어디로 가고 있는지 안다. 
구현 중 하나를 변경하면 switch 문이있는 소스 파일이 다시 컴파일되므로 switch 문 (이 area경우 에는 함수) 을 호출 한 모든 사람 이 다시 컴파일됩니다.

권리. 최소한 소스 파일의 날짜에 의존하는 언어 시스템에서 어떤 모듈을 컴파일해야하는지 파악해야합니다.

정적 타이핑을 사용하는 것은 거의 전부입니다.

네, 그렇지 않은 사람도 있습니다.

재 컴파일이 많이 필요합니다.

좋아요,하지만 클래스의 경우에는 바뀌 었습니까?

네, area함수 의 호출자 는 인터페이스에 의존하고, 구현 함수는 또한 그 인터페이스에 의존 하기 때문에 그렇습니다 .

무슨 뜻인지 알 겠어. 소스의 파일 Square수준의 수입 또는 사용, 또는의 소스 파일이 포함되어 Shape인터페이스를.

권리. 구현 지점의 소스 파일은 호출의 반대 방향입니다. 
구현에서 호출자를 가리 킵니다. 
정적으로 입력 된 언어의 경우에도 마찬가지입니다. 
동적 유형 지정 언어의 경우 호출자는 area함수에 전혀 의존하지 않습니다. 
연결은 런타임에 해결됩니다.

권리. 승인. 따라서 구현 중 하나를 변경하면 ...

변경된 파일 만 재 컴파일하거나 재배포해야합니다.

소스 파일 간의 종속성이 호출 방향을 기준으로하기 때문입니다.

권리. Dependency Inversion이라고 부릅니다.

좋아, 내가 이것을 마무리 할 수 ​​있는지 알아 보자. 클래스와 데이터 구조는 적어도 세 가지 방식으로 서로 상반됩니다.

클래스는 데이터를 유지하면서 함수를 표시합니다. 데이터 구조는 함축 된 기능을 유지하면서 데이터를 표시합니다.
클래스를 사용하면 유형을 쉽게 추가 할 수 있지만 함수를 추가하기는 쉽지 않습니다. 데이터 구조는 함수를 쉽게 추가 할 수 있지만 유형을 추가하기는 어렵습니다.
데이터 구조는 호출자에게 재 컴파일 및 재배포를 제공합니다. 클래스는 호출자를 재 컴파일 및 재배포로부터 격리합니다.

알았어. 이러한 모든 좋은 소프트웨어 디자이너와 건축가가 염두에 두어야 할 문제입니다.






# 참조
-----
* [uncle-bob ObjectsAndDataStructures](http://blog.cleancoder.com/uncle-bob/2019/06/16/ObjectsAndDataStructures.html)
