import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import vuetify from '@/plugins/vuetify'

import Header from './components/page/Header'
import Footer from './components/page/Footer'
import Navbar from './components/page/Navbar'
import List from './components/List'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.component('Header', Header)
Vue.component('Footer', Footer)
Vue.component('Navbar', Navbar)
Vue.component('List', List)

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
