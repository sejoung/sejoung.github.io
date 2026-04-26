---
layout: post
title: "스프링을 활용한 쿼리와 명령간에 데이터 동기화"
date: 2020-04-28 16:48 +0900
comments: true
tags : ["spring","cqrs"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 스프링을 활용한 쿼리와 명령간에 데이터 동기화

* CQRS 란 무엇입니까?

이 패턴은 시스템을 서로 다른 두 부분으로 나눕니다. 
CQRS는 쓰기 (실행 명령)에 사용되는 구성 요소와 조회 구성 요소를 분리합니다.
따라서 명령 서비스 와 쿼리 서비스 는 분리되어 있으며 별도로 운영 할 수 있습니다.

CQS로 시작합시다 (나중에 R을 추가하겠습니다)

CQRS를 이해하기위한 여정에서 유명한 Command-Query Separation 인 CQS부터 시작하겠습니다. (이 접근 방식에서 "R"이없는 것은 의도적 인 것입니다.)

CQS (패턴은 객체의 메소드가 다음과 같이 그룹화되어야한다고 말합니다.)

* 명령 : 시스템 상태를 변경할 수 있으며 값을 반환하지 않습니다.
* 쿼리 : 시스템 상태를 변경할수없고 (부작용이 없음) 값을 반환 할수 있다.

이 명확한 분리는 개발자에게 유용합니다. 이유는 다음과 같습니다. 쿼리와 명령은 근본적으로 다른 작업입니다.
확장 성 특성이 다르기 때문에 분리하는 데 유용합니다. 쿼리를 반복 할 수 있습니다.
쿼리는 안전하고 여러번 하더라도 결과는 달라지지 않습니다.
일관성에 대한 걱정없이 다른 순서의 쿼리를 처리 할 수​있습니다. 

반대로, 명령은 반복해서 안전하지 않습니다. 명령의 순서가 중요합니다.

이러한 원칙을 염두에두고 샘플 앱을 구축하면 이해도를 높일 수 있습니다. 
CQS 팁에 따라 신용 카드 개체를 작성해 봅시다. 

다음과 같은 요구 사항을 스스로 살펴 보겠습니다.

* 사용자는 신용 카드에 연결된 계정에 충분한 돈이 있으면 주어진 금액을 인출(Withdraw) 할 수 있습니다. 이것을 Withdraw 이라고합니다
* 사용자는 신용 카드에 연결된 계정에서 모든 출금 목록을 볼 수 있습니다. 우리는 이것을 Show Me Withdrawals 라고 부릅니다.


Withdraw 명령 이나 Show Me Withdrawals 쿼리 두 가지 기본 사용 사례 입니다.

또한 출금 요청은 모든 이전 출금 명령 의 세부 사항을 리턴해야 합니다. 
이러한 명령과 쿼리는 모두 동일한 데이터 저장소를 사용할 때 간단합니다.

명령 및 쿼리 소스를 일관성있게 만드는 메커니즘이 있다면 별도의 데이터 저장소를 사용할 수 있습니다. 
이러한 개념을 설명하기 위해 튜토리얼의 재미있는 그림에 색상 코드를 사용하십시오.

```java

package io.dddbyexamples.cqrs.model;

import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Entity
@NoArgsConstructor
public class CreditCard {

    @Id @GeneratedValue @Getter
    private UUID id;

    private BigDecimal initialLimit;

    private BigDecimal usedLimit = BigDecimal.ZERO;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "cardId")
    private List<Withdrawal> withdrawals = new ArrayList<>();

    public CreditCard(BigDecimal limit) {
        this.initialLimit = limit;
    }

    public void withdraw(BigDecimal amount) {
        if (thereIsMoneyToWithdraw(amount)) {
            usedLimit = usedLimit.add(amount);
            withdrawals.add(new Withdrawal(amount, id));
        } else {
            throw new NotEnoughMoneyException(id, amount, availableBalance());
        }
    }

    public BigDecimal availableBalance() {
        return initialLimit.subtract(usedLimit);
    }

    private boolean thereIsMoneyToWithdraw(BigDecimal amount) {
        return availableBalance().compareTo(amount) >= 0;
    }

    public List<Withdrawal> getWithdrawals() {
        return Collections.unmodifiableList(withdrawals);
    }
}

```

이 기사의 주요 목표는 동기화를 설명하는 것입니다. 
이러한 이유로 우리는 일을 단순하게 유지하고 금전적 가치를 BigDecimals로 나타냅니다. 
실제로는 이 클래스가 나타내는 개념을 모델링하는 데 더 많은 시간을 할애 할 수 있습니다.

withdraw 명령 과 getWithdrawals 쿼리는 분리가 명확하다

신용카드 클래스는 새 명령 을 받은 후 비즈니스 불변량을 확인합니다. 
쿼리는 즉시 모든 과거 출금을 반환합니다. 
명령과 쿼리를 처리하는 하나의 모델이 있습니다. 
신용 카드 클래스는 언급 된 동기화 메커니즘입니다.

쿼리와 명령이 분리되어 있지만 서로 연결되어 있습니다. 
하나의 객체가 두 기능을 모두 처리하기 때문입니다. 
이 방법이 문제입니까? 우리에게 가장 적합한 대답은 아닐 수도 있습니다. 
이유를 자세히 살펴 보겠습니다.


* 인출을 위해 객체 관계형 매퍼와 지연 로딩을 사용하면 문제가 발생할 수 있습니다. 
일관성이없는 상태에서 객체를 만들 수 있습니다. 
초기 상태를로드하고 (사용 된 제한으로) 동시 스레드에 의해 새 인출을 작성하고 새 인출을 사용하여 지연 콜렉션을 로드한다고 가정하십시오. 
물론 이에 대한 해결책이 있습니다. 
예를 들어, withdrawals 값을 세어 로드하거나 사용 한도를 계산할 수 있습니다.

* withdrawals 명령은 현재 인출의 목록에 새 withdrawals 를 추가합니다. 
이 작업은 명령을 수락하거나 거부 할 필요가 없습니다. 
그러나 앞으로 정확한 쿼리를 수행해야합니다.

* 새 출금을 추가하려면 출금 목록에 액세스해야합니다. 
게으른 로딩은 어떻습니까? Object-Relational Mapper가 데이터베이스에서 전체 컬렉션을 가져 와서 단순히 새로운 인출을 추가합니까? 
그들 중 일부는이 작업을 간단한 삽입으로 취급합니다. 
그러나 일부는 그렇지 않습니다. 
애플리케이션 메모리에 많은 수의 불필요한 인출을 로드 할 위험이 있습니다.

대부분의 시스템은 쓰기보다 훨씬 더 많은 읽기를 가지고 있습니다. 
즉, 시스템이 다른 모델과 다른 데이터 구조의 이점을 누릴 수 있습니다. 
다시 말해, 이러한 비 기능적 요구 사항은 다른 설계 결정으로 이어질 수 있습니다.

이 두 가지 진실을 기억하십시오 :

* 읽기는 반복해도 안전하지만 명령은 안전하지 않습니다.
* 읽기는 캐시 가능하지만 명령은 캐시 할 수 없습니다.

서로 다른 객체로 해당 사용 사례를 처리하고 싶다고 가정 해 봅시다. 
별도의 스토리지에 대해서는 아무 것도 말하지 않습니다. 
적어도 아직은 아닙니다.

기존 코드와 데이터로 상황에 직면 할 수도 있습니다. 
새로운 코드를 제공하기 위해 동기화 해야합니다. 
다음 섹션에서 사용할 일부 동기화 기술이 도움이 될 수 있습니다.

이제 사용 사례를 분리합시다

신용 카드를 별도의 개체로 나누는 한 가지 방법 :

* 출발 클래스에서 인출 컬렉션을 제거합시다 .
* 그리고 고객의 출금 목록을 나타내는 새로운 개념을 소개합니다. 인출은 좋은 선택 인 것 같습니다.

```java

package io.dddbyexamples.cqrs.model;

import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@NoArgsConstructor
public class CreditCard {

    @Id @GeneratedValue @Getter private UUID id;
    private BigDecimal initialLimit;
    private BigDecimal usedLimit = BigDecimal.ZERO;

    public CreditCard(BigDecimal limit) {
        this.initialLimit = limit;
    }

    public void withdraw(BigDecimal amount) {
        if (thereIsMoneyToWithdraw(amount)) {
            usedLimit = usedLimit.add(amount);
        } else {
            throw new NotEnoughMoneyException(id, amount, availableBalance());
        }
    }

    public BigDecimal availableBalance() {
        return initialLimit.subtract(usedLimit);
    }

    private boolean thereIsMoneyToWithdraw(BigDecimal amount) {
        return availableBalance().compareTo(amount) >= 0;
    }

}

```

WithdrawalsFinder 내에서 데이터베이스에 대한 직접 쿼리를 사용하거나 읽기 전용 트랜잭션을 사용할 수 있습니다. 
그러나 중요한 것은 더러운 점검 페널티를 피한다는 것입니다. 
이것이 무엇이며 왜 피하고 싶습니까? 더티 검사는 객체 관계 맵퍼에 내장 된 메커니즘으로 객체의 변화를 감지합니다. 
물론 쿼리는 상태를 변경하지 않으므로 더티 검사는 쓸모가 없습니다. 
Spring은 읽기 전용 트랜잭션을 사용할 때 사용하지 않도록 설정합니다.

쿼리 결과를 변경 불가능한 데이터 구조에 매핑하는 것으로 충분합니다

요약 : 엔터티 데이터의 일부를 읽기 용으로, 나머지는 쓰기 용으로 매핑하는 것에 대해 생각해 보셨을 것입니다. 
두 개의 JPA 엔티티를 하나의 데이터베이스 테이블에 맵핑 할 수 있습니다. (다른 열을 매핑하여 수행 할 수 있습니다.) 
그러나 이것이 필요합니까? 엔터티를 수정할 수 있습니다. 
두 엔티티가 동일한 테이블에 맵핑되면 낙관적 잠금 예외가 자주 발생할 수 있습니다. 
또한 쿼리를 제공하는 엔터티는 변경할 필요가 없습니다. 
불변 투사는 자연스러운 솔루션입니다.

그러나 이제 종단 간 테스트가 실패합니다. 
인출 명령이 성공 하면 조회 할 때 인출이 0으로 리턴됩니다. 
왜? 명령과 쿼리를 동기화하는 데 사용 된 일부 코드를 제거했기 때문입니다. 
목록 인출 의 크레딧 카드는 사라졌다.

게시물을 상기시켜 신용 카드와 출금 상태를 동기화하는 다른 방법을 살펴 보겠습니다. 


### 명시적 동기화

CreditCard 개체에서 응용 프로그램 계층으로 한 계층 위로 동기화를 이동할 수 있습니다. 
결국 우리는 신용 카드를 더 단순하게 유지하려고합니다. 
마찬가지로 쿼리 할 때 더티 검사를 피하고 싶습니다. 
작동 방법은 다음과 같습니다.

인출 중에 신용 카드 한도를 업데이트합시다. 
데이터베이스에 새로운 인출도 삽입 해 봅시다. 
작업을 수행하는 간단한 응용 프로그램 서비스를 만들 수 있습니다. 
이름은 WithdrawalProcess 입니다. 
테스트를 다시 녹색으로 만듭니다.



```java

package io.dddbyexamples.cqrs.application;

import io.dddbyexamples.cqrs.model.CreditCard;
import io.dddbyexamples.cqrs.model.Withdrawal;
import io.dddbyexamples.cqrs.persistence.CreditCardRepository;
import io.dddbyexamples.cqrs.persistence.WithdrawalRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.UUID;

@Service
public class WithdrawalProcess {

    private final CreditCardRepository creditCardRepository;
    private final WithdrawalRepository withdrawalRepository;

    WithdrawalProcess(CreditCardRepository creditCardRepository, WithdrawalRepository withdrawalRepository) {
        this.creditCardRepository = creditCardRepository;
        this.withdrawalRepository = withdrawalRepository;
    }

    @Transactional
    public void withdraw(UUID cardId, BigDecimal amount) {
        CreditCard creditCard = creditCardRepository.findById(cardId)
                .orElseThrow(() -> new IllegalStateException("Cannot find card with id " + cardId));
        creditCard.withdraw(amount);
        withdrawalRepository.save(new Withdrawal(amount, cardId));
    }

}

```

명령과 쿼리는 연결되지 않습니다. 
상태가 일관되도록 애플리케이션 서비스가 있습니다. 
이전 예 에서와 같이 동기화가 즉시 이루어집니다. 
변화는 원자 적입니다. 
그리고 Google 시스템은 단일 거래에서 신용 카드 한도 수정 및 새로운 인출 삽입을 수행했습니다.

ORM에 의해 암시 적 동기화가 수행 되기 전에. 
이제 응용 프로그램 계층에서 명시적인 동기화를 수행했습니다. 
인출을 위해서만 별도의 데이터베이스를 사용하면 즉각적인 동기화가 불가능합니다. 
우리는 CAP 정리를 이길 수 없으며 두 개의 다른 데이터베이스를 원자 적으로 변경할 수 없습니다. 
그러나 이 방법은 원하는 비즈니스 성과를 제공합니다.


### 스프링 애플리케이션 이벤트와의 암시 적 동기화

일부 사람들은 위의 응용 프로그램 서비스에서 수행 한 수동 작업과 명시 적 작업을 좋아하지 않을 수 있습니다. 
새로운 인출을 삽입하는 다른 방법이있을 수 있습니까? 
예, 있습니다! 통제권을 뒤집기 위해 신용 카드 클래스는 이벤트 게시로 끝날 수 있습니다. 
이 이벤트는 응용 프로그램의 다른 부분에서 처리 될 수 있습니다. 
이벤트를 공개하고 청취하기 위해 스프링 애플리케이션 이벤트를 사용할 수 있습니다.

WithdrawalProcess에 이벤트를 게시하는 방법은 다음과 같습니다 .

```java

package io.dddbyexamples.cqrs.application;

import io.dddbyexamples.cqrs.model.CardWithdrawn;
import io.dddbyexamples.cqrs.model.CreditCard;
import io.dddbyexamples.cqrs.persistence.CreditCardRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.UUID;

@Service
public class WithdrawalProcess {

    private final CreditCardRepository creditCardRepository;
    private final ApplicationEventPublisher applicationEventPublisher;

    WithdrawalProcess(CreditCardRepository creditCardRepository, ApplicationEventPublisher applicationEventPublisher) {
        this.creditCardRepository = creditCardRepository;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    @Transactional
    public void withdraw(UUID cardId, BigDecimal amount) {
        CreditCard creditCard = creditCardRepository.findById(cardId)
                .orElseThrow(() -> new IllegalStateException("Cannot find card with id " + cardId));
        CardWithdrawn event = creditCard.withdraw(amount);
        applicationEventPublisher.publishEvent(event);
    }
}

```

아래에서 이벤트를 캐치 할수 있습니다.

```java

package io.dddbyexamples.cqrs.sink;

import io.dddbyexamples.cqrs.model.CardWithdrawn;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
class ReadModelUpdater {

    private final JdbcTemplate jdbcTemplate;

    ReadModelUpdater(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @EventListener
    public void addWithdrawalOnCardWithdrawn(CardWithdrawn event) {
        jdbcTemplate.update("INSERT INTO WITHDRAWAL(ID, CARD_ID, AMOUNT) VALUES (?,?,?)", UUID.randomUUID(), event.getCardNo(), event.getAmount());
    }
}

```

보시다시피, 이전 예제와의 유일한 차이점은 동일한 작업을 구성 요소간에 나누는 방법입니다. 
인출을 삽입하는 데 사용 된 애플리케이션 서비스는 이제 이를 이벤트로 공개하고 ReadModelUpdater는 인출을 삽입합니다. 
개념적 흐름은 여전히 동일합니다. 
우리는 신용 카드 및 인출 테이블을 업데이트합니다. 
어플리케이션 이벤트는 컨트롤을 반전시키기 위해 존재합니다. 
모든 것이 단일 트랜잭션으로 실행된다는 것을 기억하십시오. 
새 인출을 삽입 할 때 실패하면 CreditCard의 변경 사항이 롤백됩니다.

수동 게시와 ApplicationEventPublisher에 대한 종속성을 피하려면 Spring이 모든 작업을 수행 할 수 있습니다. 

응용 프로그램 수준에서 두 개의 이전 동기화가 작동했습니다. 
그것은 그것을 명시 적으로 제어했습니다. 
그러나 이를 수행하는 암시 적 방법도 있으며 데이터베이스 수준에서 작동합니다. 
데이터베이스 트리거를 사용할 수 있습니다.

### 데이터베이스 트리거

```java
package io.dddbyexamples.cqrs.persistence;

import org.h2.api.Trigger;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.UUID;

public class CreditCardUsedTrigger implements Trigger {

    @Override
    public void init(Connection connection, String s, String s1, String s2, boolean b, int i) throws SQLException {

    }

    @Override
    public void fire(Connection connection, Object[] before, Object[] after) throws SQLException {
        try (PreparedStatement stmt = connection.prepareStatement(
                "INSERT INTO WITHDRAWAL (ID, CARD_ID, AMOUNT) " + "VALUES (?, ?, ?)")) {
            stmt.setObject(1, UUID.randomUUID()); //generate withdrawal id
            stmt.setObject(2, cardId(after));
            stmt.setObject(3, getUsedLimitChange(before, after));

            stmt.executeUpdate();
        }
    }

    private Object cardId(Object[] cardRow) {
        return cardRow[0];
    }

    private BigDecimal getUsedLimitChange(Object[] oldCardRow, Object[] newCardRow) {
        return ((BigDecimal) newCardRow[2]).subtract((BigDecimal) oldCardRow[2]);
    }

    @Override
    public void close() throws SQLException {

    }

    @Override
    public void remove() throws SQLException {

    }
}

```
동기화가 즉시 이루어집니다. 신용 카드 한도 변경 및 새로운 인출 추가는 여전히 트리거가 거래의 일부이기 때문에 원자 적 입니다.

이 솔루션에는 몇 가지 단점이 있습니다. 언급했듯이 데이터베이스 별 솔루션입니다. 
이는 애플리케이션 논리가 애플리케이션에 유지되지 않음을 의미합니다. 
또한 솔루션을 다른 데이터베이스로 이식 할 수 없습니다.

우리는 응용 프로그램 서비스와 트리거, 명령 및 쿼리를 분리한다고 언급했습니다. 
글쎄, 이것은 완전히 사실이 아닙니다. 트리거가 실패하면 어떻게됩니까? 
모든 것이 하나의 거래입니다. 철수 작업은 명령을 실행과 관련이없는 이유로 실패합니다.

신용 카드 클래스에서 상위 계층으로 도메인 계층을 
애플리케이션 계층 (애플리케이션 이벤트와 함께 명시 적 또는 암시 적으로)으로 이동 한 다음 
데이터베이스 계층으로 동기화를 이동해도 모든 문제가 해결되지는 않았습니다. 
우리는 여전히 어느 정도 연결되어 있습니다. 
어떤 사람들은 사건이 우리에게 분리를 제공한다고 말할 수 있습니다. 
내가 동의하지 않는 이유는 다음과 같습니다.

이전 솔루션의 응용 프로그램 이벤트는 메모리에만 존재합니다. 
모든 코드는 호출 하기 전에 및 애프터 이벤트의 게시는 하나의 데이터베이스 트랜잭션 내에서 처리됩니다. 
따라서 동기화가 즉시 이루어집니다. 
이것은 숨겨진 중요한 결점이 있습니다. 
명령과 쿼리가 분리 된 것처럼 보일 수 있습니다. 
실제로 하나의 트랜잭션은 강력한 암시 적 커플 링을 만듭니다. 
코드를 검토하면 분명하지 않습니다.

### 트랜잭션 로그 테일링

이제 다음 단계로 넘어갑니다. 그것은 약간 반 직관적 일 것입니다. 
때로는 실제로 이런 방식으로 동기화하는 것이 유용 할 수 있습니다. 
특히 초기 상태를 생성하는 응용 프로그램을 제어 할 수없는 경우. 
예제로 돌아 갑시다. Withdraw 명령을 담당하는 스레드 가 완료 되면 동기화해야합니다 . 
옵션 중 하나는 데이터베이스 트랜잭션 저널을 사용하고 신용 카드 한도를 업데이트하는 것입니다. 
트랜잭션 저널 또는 트랜잭션 로그 실행 된 작업의 역사입니다. 
이전에는 동일한 거래 및 스레드에서 신용 카드 한도 변경에 따라 트리거가 발생했습니다. 
이제 응용 프로그램은 트랜잭션 로그를 스캔하고 이전 업데이트에 반응하고 신용 카드 한도를 업데이트 할 수 있습니다. 
이 설정에서는 다음을 사용합니다.

* 인출 및 신용 카드를 보관하는 MySQL;
* Apache Kafka (데이터베이스 트랜잭션 로그 (이 경우 MySQL))에서 읽은 메시지에 대한 pub / sub 용)
* Kafka Debezium 과 연결 하여 MySQL의 트랜잭션 로그를 읽고 Kafka의 주제로 메시지를 스트리밍합니다.
* Kafka의 주제에서 메시지를 읽는 Spring Cloud Stream .


```java

package io.dddbyexamples.cqrs.sink;

import io.dddbyexamples.cqrs.model.Withdrawal;
import io.dddbyexamples.cqrs.persistence.WithdrawalRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.cloud.stream.messaging.Sink;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@Slf4j
class ReadModelUpdater {

	private final WithdrawalRepository withdrawalRepository;

	ReadModelUpdater(WithdrawalRepository withdrawalRepository) {
		this.withdrawalRepository = withdrawalRepository;
	}

	@StreamListener(Sink.INPUT)
	public void handle(Envelope message) {
		if(message.isUpdate()) {
			saveWithdrawalFrom(message);
		}
	}

	private void saveWithdrawalFrom(Envelope message) {
		String cardId = message.getPayload().getBefore().getId();
		BigDecimal withdrawalAmount
				= balanceAfter(message).subtract(balanceBefore(message));
		withdrawalRepository.save(new Withdrawal(withdrawalAmount, cardId));
	}

	private BigDecimal balanceAfter(Envelope message) {
		return message.getPayload().getAfter().getUsed_limit();
	}

	private BigDecimal balanceBefore(Envelope message) {
		return message.getPayload().getBefore().getUsed_limit();
	}


}

```

이 시점에서 ReadModelUpdater 는 별도의 스토리지에 새로운 인출을 저장할 수 있습니다. 
새로운 인출을 삽입하지 않아도 명령 측에는 영향을 미치지 않습니다. 
그러나 이제는 더 이상 원자가 변경되지 않습니다.
Withdraw 명령 이 성공한 후 새로운 출금을 삽입하는 데 시간이 걸립니다. 
솔루션은 결국 일관성이 있습니다.

Pub / Sub를 사용하면 명령 모델에 영향을주지 않고 새로운 읽기 모델을 추가 할 수 있습니다. 
그러나 메시징을 도입하는 데에는 벌칙이 따릅니다. 
이제 메시지 순서와 중복에 대해 생각해야합니다. 
트리거와 마찬가지로 트랜잭션 로그는 지정된 데이터베이스에 특정한 솔루션입니다. 
또한 새로운 종속성 (Kafka, Kafka Connect, 트랜잭션 로그)으로 인해 테스트가 더 어려워졌습니다. 
적어도 우리는 메시지 전달이 데이터베이스에서 새로운 Withdrawal를 초래하는지 테스트 할 수 있습니다.

```java

package io.dddbyexamples.cqrs.sink;


import io.dddbyexamples.cqrs.model.CreditCard;
import io.dddbyexamples.cqrs.model.Withdrawal;
import io.dddbyexamples.cqrs.persistence.CreditCardRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.cloud.stream.messaging.Sink;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;
import java.util.*;

import static java.math.BigDecimal.TEN;
import static java.math.BigDecimal.ZERO;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;
import static org.springframework.http.HttpMethod.GET;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
public class ReadModelUpdaterTest {

    @Autowired TestRestTemplate restTemplate;
    @Autowired CreditCardRepository creditCardRepository;
    @Autowired Sink sink;

    @Test
    public void shouldSynchronizeQuerySideAfterLogTailing() {
        // given
        String cardUUid = thereIsCreditCardWithLimit(new BigDecimal(100));
        // when
        creditCardUpdateReadFromDbTransactionLog(TEN, cardUUid);
        // then
        thereIsOneWithdrawalOf(TEN, cardUUid);
    }

    String thereIsCreditCardWithLimit(BigDecimal limit) {
        CreditCard creditCard = new CreditCard(limit);
        return creditCardRepository.save(creditCard).getId();
    }

    void creditCardUpdateReadFromDbTransactionLog(BigDecimal usedLimitAfter, String cardUUid) {
        Card before = createCardDbRepresentation(cardUUid, ZERO);
        Card after = createCardDbRepresentation(cardUUid, usedLimitAfter);
        CreditCardStateChanged message = new CreditCardStateChanged();
        message.setOp("u");
        message.setBefore(before);
        message.setAfter(after);
        sink.input().send(new GenericMessage<>(new Envelope(message)));
    }

    Card createCardDbRepresentation(String cardUUid, BigDecimal val) {
        Card before = new Card();
        before.setId(cardUUid);
        before.setUsed_limit(new String(Base64.getEncoder().encode(val.multiply(new BigDecimal(100)).unscaledValue().toByteArray())));
        return before;
    }

    void thereIsOneWithdrawalOf(BigDecimal amount, String cardId) {
        Map<String, Object> params = new HashMap<>();
        params.put("uuid", cardId);
        List<Withdrawal> withdrawals =
                restTemplate.exchange(
                        "/withdrawals?cardId={uuid}",
                        GET, null,
                        new ParameterizedTypeReference<List<Withdrawal>>() {},
                        params)
                        .getBody();
        assertThat(withdrawals).hasSize(1);
        assertThat(withdrawals.get(0).getAmount()).isEqualByComparingTo(amount);
    }


}

```

실제로 트랜잭션 로그 테일링 및 트리거에 더 큰 문제가 있습니다. 
신용 카드 시스템에 지불 거절이라는 새로운 기능을 추가해 봅시다. 
구현은 간단합니다. 지불 거절이있을 때마다 사용한도를 낮춥니 다.

지불 거절이있을 때 우리의 읽기 모델은 어떻게 될지 추측하십니까? 
당신은 그것을 추측 : 트리거가 실행됩니다. 
그리고 네, 메시지가 트랜잭션 로그에 나타납니다. 
결과는 마이너스 금액으로 인출됩니다. 
인출에 대해 양의 금액 만 허용하는 if 문으로 이를 해결할 수 있습니다. 그러나 이것은 단기적인 해결책입니다. 
실제 문제는 다른 곳입니다. 소프트웨어 개발에서 가장 일반적인 오해 중 하나와 관련이 있습니다. 
우리의 솔루션은 "비즈니스 의도 기억 상실"로 고통 받고 있습니다.

이 솔루션은 동작 대신 데이터에 중점을 둡니다. 
상태 변경 (즉, 사용 한도 변경)으로 이어지는 많은 비즈니스 사례 (철회, 지불 거절)가있을 수 있습니다. 
우리가 국가에 의존 할 때,이 변화의 배후에 진정한 사업상의 이유를 찾는 것이 불가능할 수도 있습니다. 
데이터베이스 트리거 또는 트랜잭션 로그 테일링을 사용하면 해당 지식을 훔칩니다.

### 도메인 이벤트 소개

이제 트랜잭션 로그처럼 보이지만 비즈니스 의도가있는 것이 필요합니다. 
이상적으로는 비즈니스 컨텍스트를 포함하는 변경 불가능한 변경 사항의 추가 전용 로그와 같은 것이 있습니다. 
다시 말해, 도메인 이벤트 스트림이 필요합니다. 데이터베이스 관리 시스템이 트랜잭션 로그를 자동으로 채웠습니다. 
그러나 이벤트는 응용 프로그램 코드에서 게시됩니다. 
우리는이 상황을 약간의 주의를 기울여 해결합니다. 
명령이 성공한 경우에만 이벤트를 공개 해야합니다. (자세한 내용은 이 기사를 읽으십시오.)

참고 : 도메인 이벤트는 신용 카드에 발생한 모든 변경 사항을 나타냅니다. 
이런 식으로 어떤 종류의 스토리지에서 도메인 이벤트를 호스팅하여 신용 카드의 상태를 재현 할 수 있습니다. 
따라서 일련의 이벤트 만 게시하면 명령이 완료됩니다. 
신용 카드 상태를 유지할 필요가 없으며 안정적인 이벤트 게시에 문제가 없습니다. 
이 기술을 이벤트 소싱이라고합니다. Spring Boot에서 이벤트 소싱 및 CQRS를 보다 쉽게 사용할 수 있는 Axon 프레임 워크

이 설정에서는 다음을 사용합니다.

* 신용 카드 데이터를 저장하는 MySQL;
* 도메인 이벤트를위한 pub / sub를위한 Apache Kafka;
* Kafka의 주제를 게시하고 청취하기위한 Spring Cloud Stream;
* 출금을위한 별도의 저장소 인 MongoDB. MongoDB에 연결하기 위해 Spring Data Reactive MongoDB의 반응 드라이버를 사용합니다 . 
MongoDB (특히 반응성 드라이버와 함께)를 사용하는 것은 선택 사항입니다. 
요점은 이 예제에서 쿼리 측에 가장 적합한 것을 자유롭게 사용할 수 있다는 것입니다. 
우리는 현명하게 선택할 수 있습니다!

솔루션이 배포됩니다. 우리는 명령 과 쿼리를 위한 별도의 Spring Boot 애플리케이션과 스토리지를 가지고 있습니다 . 
명령보다 더 많은 쿼리가있는 경우 어떻게합니까? 쿼리 측면은 MySQL과 독립적으로 수평 적으로 확장 될 수 있습니다. 
또한 읽기 측에서 다른 데이터베이스를 선택하면 이점이 있습니다. 우리는 쿼리를 위해 더 성능이 좋은 모델을 선택할 수 있습니다.

이 솔루션은 3 가지 측면에서 트랜잭션 로그 테일링과 다릅니다.

1. 출금을위한 별도의 보관소가 있습니다. 
트랜잭션 로그에는 상태 변경이 포함되며 도메인 이벤트는 비즈니스 동작에 중점을 둡니다.

2. 트랜잭션 로그는 데이터베이스 관리 시스템에 의해 채워집니다. 도메인 이벤트는 응용 프로그램 코드로 게시해야합니다.

3. 내부 상태를 변경 한 후 이벤트를 원자 적으로 푸시하는 방법을 기억해야합니다.
아이디어 중 하나는 내부적으로 동일한 데이터베이스에 이벤트를 저장하고 예약 된 게시자가 이벤트를 보내는 것입니다. 

```java
package io.dddbyexamples.cqrs.persistence;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.dddbyexamples.cqrs.model.DomainEvent;
import io.dddbyexamples.cqrs.model.DomainEventPublisher;
import org.springframework.cloud.stream.messaging.Source;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.Map;

@Component
public class KafkaDomainEventPublisher implements DomainEventPublisher {

    private final Source source;
    private final DomainEventsStorage domainEventStorage;
    private final ObjectMapper objectMapper;

    public KafkaDomainEventPublisher(Source source, DomainEventsStorage domainEventStorage, ObjectMapper objectMapper) {
        this.source = source;
        this.domainEventStorage = domainEventStorage;
        this.objectMapper = objectMapper;
    }

    @Override
    public void publish(DomainEvent domainEvent) {
        try {
            domainEventStorage.save(new StoredDomainEvent(objectMapper.writeValueAsString(domainEvent), domainEvent.getType()));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }


    @Scheduled(fixedRate = 2000)
    @Transactional
    public void publishExternally() {
        domainEventStorage
                .findAllBySentOrderByEventTimestampDesc(false)
                .forEach(event -> {
                            Map<String, Object> headers = new HashMap<>();
                            headers.put("type", event.getEventType());
                            source.output().send(new GenericMessage<>(event.getContent(), headers));
                            event.sent();
                        }

                );
    }
}

```

ReadModelUpdater 는 이제 새 Withdrawals을 작성합니다. Kafka의 주제를 구독하고 도메인 이벤트를 찾습니다.

```java

package io.dddbyexamples.cqrs.sink;

import io.dddbyexamples.cqrs.persistence.WithdrawalsRepository;
import io.dddbyexamples.cqrs.ui.WithdrawalDto;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.cloud.stream.messaging.Sink;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
class ReadModelUpdater {

	private final WithdrawalsRepository withdrawalsRepository;

	ReadModelUpdater(WithdrawalsRepository withdrawalsRepository) {
		this.withdrawalsRepository = withdrawalsRepository;
	}

	@StreamListener(target = Sink.INPUT, condition = "headers['type'] == 'card-withdrawn'")
	public void handle(CardWithdrawn cardWithdrawn) {
        withdrawalsRepository
				.save(new WithdrawalDto(UUID.randomUUID().toString(), cardWithdrawn.getCardNo().toString(), cardWithdrawn.getAmount())).subscribe();
	}
}

```

논의 된 모든 접근 방식에는 장단점이 있습니다. 
중요한 것은 사용 사례에 적합한 옵션을 선택하는 것입니다. 
당신에게 내 조언은 하나의 옵션을 선택한 다음 다음 요소를 고려하는 것입니다.

구현 : 제안 된 솔루션을 얼마나 쉽게 구현할 수 있습니까?

테스트 가능성 : 솔루션을 테스트하는 것이 얼마나 쉬운가요?

복잡성 : 솔루션을 구축하는 데 몇 개의 기술이 필요합니까?

일관성 : 명령이 성공한 후 쿼리 측이 즉시 일관성이 있습니까? 아니면 일관성이 있습니까?

이식성 : 솔루션을 다른 공급 업체로 쉽게 포팅 할 수 있습니까? 예를 들어, 일부 솔루션은 특정 데이터베이스에 의존 할 수 있습니다. 벤더 잠금이 생성됩니다.

 

확장성 : 한쪽과 다른 쪽을 독립적으로 가로로 쉽게 확장 할 수 있습니까?

배포 : 솔루션이 배포 되었습니까? 유스 케이스는 다른 프로세스에서 처리됩니까?

확장성 : 새 모델을 쉽게 추가 할 수 있습니까?



# 참조
-----
* [how-cqrs-works-with-spring-tools](https://thenewstack.io/how-cqrs-works-with-spring-tools/)
* [all-things-cqrs](https://github.com/ddd-by-examples/all-things-cqrs/)
* [spring domain-events](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#core.domain-events)
* [axoniq](https://axoniq.io/)
