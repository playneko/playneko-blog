import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import store from './store'
import router from './router'
import firebase from 'firebase'
import Ads from 'vue-google-adsense'
import vueMoment from 'vue-moment'
import vueCookies from 'vue-cookies'
import kakaoLogin from 'vue-kakao-login'
import isEmpty from './plugins/isEmpty'
import vuetify from './plugins/vuetify'
import Header from './components/page/Header'
import HeaderChat from './components/chat/Header'
import FooterChat from './components/chat/Footer'
import ChatRoom from './components/chat/Room'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$isEmpty = isEmpty
Vue.prototype.$firebase = firebase
Vue.prototype.$kakaoUrl = ""
Vue.prototype.$proxyUrl = ""
Vue.component('Header', Header)
Vue.component('HeaderChat', HeaderChat)
Vue.component('FooterChat', FooterChat)
Vue.component('ChatRoom', ChatRoom)
Vue.component('KakaoLogin', kakaoLogin)

// 쿠키 사용개시
Vue.use(vueCookies);
// 쿠키의 만료일은 7일이다. (글로벌 세팅)
// Vue.$cookies.config("7d");

// Google Adsense
Vue.use(require('vue-script2'))
Vue.use(Ads.Adsense)
Vue.use(Ads.InArticleAdsense)
Vue.use(Ads.InFeedAdsense)

// 날짜시간 라이브러리
Vue.use(vueMoment)

// Initialize Firebase
var config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
}
firebase.initializeApp(config)

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
