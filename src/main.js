import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import store from './store.js'
import router from './router.js'
import vuetify from './plugins/vuetify.js'

import Header from './components/page/Header'
import Footer from './components/page/Footer'
import Navbar from './components/page/Navbar'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.component('Header', Header)
Vue.component('Footer', Footer)
Vue.component('Navbar', Navbar)

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
