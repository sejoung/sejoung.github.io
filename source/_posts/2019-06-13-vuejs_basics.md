---
layout: post
title: "vuejs 기본"
date: 2019-06-13 10:15 +0900
comments: true
tags : ["vuejs","mvvm"]
categories : ["javascript"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## vuejs 기본


Vue.Js와 그 가벼운 무게의 단순성은 프론트 엔드 개발을위한 필수 프레임 워크입니다.

Vue 2.0은 2016 년에 출시되었으며 ReactJS와의 경쟁에서 경쟁하고 있습니다. 
ReactJs 및 Angular 2.0과 비교하여 빠르며 가벼운 것으로 입증되었습니다. 
또한 학습 곡선은 ReactJ보다 상대적으로 짧으며 가장 뛰어난 문서 중 하나를 가지고 있습니다. 
당신은 문서를 읽는 것을 끝내기 전에 당신이 그것에 빠지게 될 수도 있습니다.

구조 유연성을 허용하고 응용 프로그램에서 구성 요소를 쉽게 재사용 할 수 있습니다. 
간단히 말해서, 그것은 당신의 길을 방해하지 않습니다. 
원하는대로 응용 프로그램을 작성하고 구조화 할 수 있습니다. 
이 이상한 기능은 크고 확장 성이 뛰어난 웹 애플리케이션을 구축하는 데 적합합니다.

이 포스트에서, 나는 길을 따라 에이스에 대한 몇 가지 기본 사항을 세웠다.

### Vue 인스턴스

첫 번째 VueJs 앱을 만들기 전에 VueJs에 대해 알아야 할 가장 중요한 사항 중 하나는 Vue 인스턴스 입니다.

모든 뷰 응용 프로그램라는 루트 인스턴스가 뷰를 . 
Vue 인스턴스는 ModelView -ViewModel (MVVM 패턴)을 따르며 Vue 인스턴스를 데이터와 뷰 사이의 링크로 정의하는 것을 선호합니다.

Vue 인스턴스는 템플릿, 데이터, 메소드 및 라이프 훅 콜백 및 이벤트를 포함 할 수있는 선택적 객체로 새로운 Vue () 를 발행함으로써 생성 될 수있다 . 
다른 말로하면 Vue 인스턴스가 데이터와 뷰 사이의 중개자임을 알 수 있습니다.

"사용자 A"와 HTML보기에 대한 세부 정보가 포함 된 데이터 객체가있는 경우 사용자 객체를 다음과 같이 정의 할 수 있습니다.

```javascript

//User Object
var userA = {
            name: "Samuel James",
            post: "VueJs: The basics in 4 mins"
          }

```

템플릿보기 :

```html

<!----view --->
<div id="app">
    <h1>Name</h1>
    <p>Post title </p>
</div>
<!---Includes VueJs-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.4/vue.js"></script>
<script src="app.js"></script>


```

Vue 인스턴스를 생성하기 위해 우리는 우리의 데이터, 
즉 userA 와 우리가보기에 Vue 인스턴스를 바인드하기를 원하는 섹션 의 ID 를 제공합니다. 
이 예에서 ID 는 ' app '입니다.

```javascript

var vm = new Vue({
    el:"#app",  //id 

    data:userA, //userA object
    created: function () {
        console.log('Vue instance was created');
    },
    methods:  {
        exampleFunction: function () {
            console.log('This is an example function')
        },
    },
    destroyed: function () {
        console.log('Vue instance was destroyed')
    }
})

```

### VueJs의 데이터 바인딩


VueJs에서보기 위해 데이터를 바인드하는 두 가지 방법이 있습니다 : 단방향 데이터 바인딩과 양방향 데이터 바인딩.

단방향 데이터 바인딩 은 자바 스크립트 코드에서 DOM으로 직접 데이터를 바인딩 합니다. 
좋은 예가 피드백 양식을 제출 한 후 고객에게 친절한 감사 인사 메시지를 표시하는 것입니다.

```html

<!---One-way data binding--->
<!----feedback.html-->
<div class="container">
    <div id="app">
        <h1>Feed back form </h1>
        <div class="server-message">{{msg}}</div>
        <form>
            <input type="name" placeholder="Your name"/>
            <input type="email" placeholder="your email">
            <textarea name="message" rows="2" cols="3"></textarea>
            <button type="button" class="btn btn-primary">Send feedback</button>
        </form>
    </div>
</body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.4/vue.js"></script>
<script src="app.js"></script>
</html>

```

뷰에 메시지를 바인딩하려면 메시지 객체와 바인딩 할 뷰 템플릿 의 ID 를 매개 변수 로 사용하여 Vue 인스턴스를 만들어야합니다 .


```javascript

<!---app.js---->
var data= {
    msg: "Thank you for the feedback :)"
}
new Vue({
    data:data, //message object 
    el:'#app' 
})

```

양방향 데이터 바인딩 은 Javascript 코드의 데이터를보기 및보기에서 코드로 바인딩하여 두면의 데이터를 변경하면 전체적으로 변경됩니다.

양방향 데이터 바인딩의 경우 Vue 는 이 목적을 위해 v-model 지시문을 제공합니다. 
피드백 양식으로 돌아가서 몇 가지 사항을 변경해 보겠습니다.


```html

<!---feedback.html-->
<div class="container">

    <div id="app">
        <h1>Feed back form </h1>
        <form>
     <input type="name" placeholder="Your name" v-model="name"/>
     <input type="email" placeholder="your email" v-model="email">              
     <textarea name="message" rows="2" cols="3" v-model="message"></textarea>
     <button type="button" class="btn btn-primary">Send feedback</button>
        </form>
    </div>
</div>
</body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.4/vue.js"></script>
<script src="app.js"></script>
</html>

```

```javascript

<!----app.js--->
var data={
    name:  " Samuel James",
    email: "example@mail.com",
    message: "Hello there",
}
var vm = new Vue({
    data: data,
    el:'#app'
})
//watch name as it changes reactively during modification
vm.$watch('name', function (newName, oldName) {
    console.log(newName); //new name
    console.log(oldName); //old name
})

```

콘솔에서 브라우저의 필드를 수정할 때 이름 필드가 반응적으로 변경되는 것을 볼 수 있습니다.


### 지시문

지시어는 Vue의 강력한 기능이며 v- 특성을 사용 하여 바인딩 식입니다 . 
이전 예제에서 우리는 v-model 지시문을 사용하여 데이터를 반응 적으로 DOM에 바인딩하고 볼 수있었습니다. 
지시문을 사용하면보기 및 반복 작업을 쉽게 처리 할 수 ​​있습니다. 
이 외에도 몇 줄의 코드로 사용자 지정 지시문을 정의 할 수 있습니다.

다음으로 피드백 양식을 제출하는 방법과 Vue 지시어를 사용하여 이중 제출을 방지하는 논리를 처리하는 것입니다.


여기 Vue 지시어 와 메소드가 있습니다. 
우리는 v-on을 추가 합니다 : click 및 v-bind : 사용 불능 지시어는 feedback.html의 버튼을 제출할 수 있습니다.

```html

<!----feedback.html--->
<input type="name" placeholder="Your name" v-model="name"/>
<input type="email" placeholder="your email" v-model="email">              
<textarea name="message" rows="2" cols="3" v-model="message"></textarea>
<button type="button" v-on:click="submit" v-bind:disabled="isSubmitted" class="btn btn-primary">Send feedback</button>
 

```

app.js 는 다음과 같이 됩니다.

```javascript

<!----app.js --->
var data={
    name:  " Samuel James",
    email: "example@mail.com",
    message: "Hello there",
    isSubmitted:false //we initially set to false to enable submit button
}

new Vue({
    data:data,
    el:"#app",
    methods:{
        submit: function () {
            //Now submit feed back via ajax 
            this.isSubmitted=true; //set submitted to true to disable submit button
        }
    }
})


```

v- on : click 이 click 이벤트를 청취 하고 Vue 인스턴스에 정의 된 submit () 메소드를 실행 하면 v-bind : disabled 지시문은 isSubmitted 가 true로 설정된 경우 제출 단추를 사용 불가능하게 합니다.

이제 VueJs의 3 가지 기본 사항에 대해 살펴 보았으므로 VueJs 공식 문서 로 이동 하여 VueJs로 다음 웹 애플리케이션을 빌드 할 수 있습니다.



# 참조
-----
* [introduction-to-modelviewviewmodel-pattern-for-building-wpf-apps](https://blogs.msdn.microsoft.com/johngossman/2005/10/08/introduction-to-modelviewviewmodel-pattern-for-building-wpf-apps/)
* [vuejs-the-basics-in-4-mins-6208df76003d](https://codeburst.io/vuejs-the-basics-in-4-mins-6208df76003d)


