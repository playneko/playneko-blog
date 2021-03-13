import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const List = () => import(/* webpackChunkName: "List" */ "./components/List.vue")
const Detail = () => import(/* webpackChunkName: "Detail" */ "./components/Detail.vue")

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'Home',
            component: List
        }, {
            path: '/rasberry-pi',
            name: 'RasberryPi',
            component: List
        }, {
            path: '/python',
            name: 'Python',
            component: List
        }, {
            path: '/php',
            name: 'PHP',
            component: List
        }, {
            path: '/java',
            name: 'Java',
            component: List
        }, {
            path: '/linux',
            name: 'Linux',
            component: List
        }, {
            path: '/java-script',
            name: 'JavaScript',
            component: List
        }, {
            path: '/akihabara',
            name: 'Akihabara',
            component: List
        }, {
            path: '/micro-bit',
            name: 'MicroBit',
            component: List
        }, {
            path: '/chat-bot',
            name: 'ChatBot',
            component: List
        }, {
            path: '/detail/:id',
            name: 'DetailInfo',
            component: Detail
        }
    ]
})
