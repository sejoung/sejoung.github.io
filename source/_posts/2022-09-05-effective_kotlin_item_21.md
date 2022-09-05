---
layout: post
title: "이펙티브 코틀린 아이템 21: 일반적인 프로퍼티 패턴은 프로퍼티 위임으로 만들어라"
date: 2022-09-05 10:03 +0900
comments: true
tags : ["kotlin","Effective kotlin","이펙티브 코틀린"]
categories : ["kotlin"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 이펙티브 코틀린(재사용성)
## 아이템 21: 일반적인 프로퍼티 패턴은 프로퍼티 위임으로 만들어라

property delegate 를 사용하는것이 property delegation 이라고 부른다.

코틀린에서 lazy 함수 제공

```kotlin
val value by lazy { createValue() }
```

프로퍼티 위임을 사용하면 변화가 있을때 이를 감지하는 observable 패턴을 쉽게 만들수 있다.

```kotlin

var items: List<Item> by Delegates.observable(listOf()){
  notifyDataSetChange
  }
 
var key : String? by Delegates.observable(null){_,old,new->
  Log.e("key changed from $old to $new")
}

```

일반적으로 자바를 활용하면 어노테이션을 많이 사용해야 되지만 코틀린은 프로퍼티 위임을 사용해서 간단하고 type-safe 하게 구현 가능

```kotlin

// 안드로이드에서의 뷰와 리소스 바인딩
private val button: Button by bindView(R.id.button)
private val textSize by bindDimension(R.dimen.font_size)
private val doctor: Doctor by argExtra(DOCTOR_ARG)

// kotlin 에서의 종속성 주입
private val presenter: MainPresenter by inject()
private val repository: NetworkRepository by inject()
private val vm: MainViewModel by viewModel()

// 데이터 바인딩
private val port by bindConfiguration("port")
private val token: String by preferences.bind(TOKEN_KEY)

```

어떻게 위와 같은 코드가 가능하고 프로퍼티 위임을 어떻게 사용할수 있는지 알아보자

```kotlin

var token: String? = null
	get() {
		print("token returned value $field")
		return field
	}
	set(value) {
		print("token changed from $field to $value")
		field = value
	}

var attempts: Int = 0
	get() {
		print("attempts returned value $field")
		return field
	}
	set(value) {
		print("attempts changed from $field to $value")
		field = value
	}

```

두개 프로퍼티 타입은 다르지만 내부적으로 거의 같은 처리를 한다. 그리고 프로젝트에서 자주 쓰일것 같다.

```kotlin

var token: String? by LoggingProperty(null)
var attempts: Int by LoggingProperty(0)

private class LoggingProperty<T>(var value: T) {
	operator fun getValue(
		thisRef: Any?,
		prop: KProperty<*>
	): T {
		print("${prop.name} returned value $value")
		return value
	}

	operator fun setValue(
		thisRef: Any?,
		prop: KPRoperty<*>,
		newValue: T
	) {
		val name = prop.name
		print("name changed from $value to $newValue")
		value = newValue
	}
}

```

프로퍼티 위임이 어떻게 동작하는지 보려면 by 가 어떻게 컴파일 되는지 봐야 된다.

```kotlin

@JvmField
private val 'token$delegate' = 
	LoggingProperty<String>(null)
var token: String?
	get() = 'token$delegate'.getValue(this, ::token)
	set(value) {
		'token$delegate'.setValue(this, ::token, value)
	}

```

코드를 보면 알수 있듯이 단순하게 값만 처리 하는게 바뀐게 아니라 컨텍스트와 프로퍼티 레퍼런스의 경계도 함께 사용하는 형태로 바뀐다.

여러 종류의 뷰와 함께 사용될 수 있는 델리게이트가 필요한 경우가 있다. 이는 다음과 같이 구현해서, 컨텍스트의 종류에 따라서 적절한 메서드가 선택되게 만들 수 있다.

```kotlin

class SwipeRefreshBinderDelegate(val id: Int) {
	private var cache: SwipeRefreshLayout? = null

	operator fun getValue(
		activity: Activity,
		prop: KProperty<*>,
	): SwipeRefreshLayout {
	return cache?: activity
		.findViewById<SwipeRefreshLayout>(id)
		.also { cache = it }
	}

	operator fun getValue(
		fragment: Fragment,
		prop: KProperty<*>
	): SwipeRefreshLayout {
		return cache?: fragment.view
		.findViewById<SwipeRefreshLayout>(id)
		.also { cache = it }
	}
}

```

객체를 프로퍼티 위임하려면 val의 경우 getValue연산, var의 경우 getValue와 setValue 연산이 필요하다.

이러한 연산은 확장 함수로도 만들 수 있다.

```kotlin

val map: Map<String, Any> = mapOf(
		"name" to "Marcin",
		"kotlinProgrammer" to true
)
val name by map
print(name) // Marcin

```

```kotlin

inline operator fun <V, V1 : V> Map<in String, V>.getValue(thisRef: Any?, property: KProperty<*>): V1 = getOrImplicitDefault(property.name) as V1

```

코틀린의 델리게이터들

* lazy
* Delegates.observable
* Delegates.vetoable
* Delegates.notNull

# 참조

-----
* [이펙티브 코틀린](http://www.yes24.com/Product/Goods/106225986)
