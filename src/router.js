import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const List = () => import(/* webpackChunkName: "List" */ "./components/List.vue")

const vueRouter = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'Home',
            component: List
        }, {
            path: '/rasberry-pi/:id',
            name: 'RasberryPi',
            component: List
        }, {
            path: '/python/:id',
            name: 'Python',
            component: List
        }, {
            path: '/php/:id',
            name: 'PHP',
            component: List
        }, {
            path: '/java/:id',
            name: 'Java',
            component: List
        }, {
            path: '/linux/:id',
            name: 'Linux',
            component: List
        }, {
            path: '/java-script/:id',
            name: 'JavaScript',
            component: List
        }, {
            path: '/akihabara/:id',
            name: 'Akihabara',
            component: List
        }, {
            path: '/micro-bit/:id',
            name: 'MicroBit',
            component: List
        }, {
            path: '/chat-bot/:id',
            name: 'ChatBot',
            component: List
        }, {
            path: '/detail/:id',
            name: 'DetailInfo',
            component: () => import(/* webpackChunkName: "Detail" */ "./components/Detail.vue")
        }, {
            path: '/board/detail/:cat/:id',
            name: 'BoardDetail',
            component: () => import(/* webpackChunkName: "Detail" */ "./components/board/Detail.vue")
        }, {
            path: '/board/add',
            name: 'BoardAdd',
            component: () => import(/* webpackChunkName: "Add" */ "./components/board/Add.vue")
        }, {
            path: '/board/modify',
            name: 'BoardModify',
            component: () => import(/* webpackChunkName: "Modify" */ "./components/board/Modify.vue")
        }, {
            path: '/login',
            name: 'Login',
            component: () => import(/* webpackChunkName: "Login" */ "./components/Login.vue")
        }, {
            path: '/profile',
            name: 'Profile',
            component: () => import(/* webpackChunkName: "Profile" */ "./components/user/Profile.vue")
        }, {
            path: '/callback',
            name: 'Auth'
        }, {
            path: '/board/list/:id',
            name: 'BoardList',
            component: () => import(/* webpackChunkName: "BoardList" */ "./components/board/List.vue")
        }
    ]
})

vueRouter.beforeEach((to, from, next) => {
    document.title = "Playneko - 여러가지 IT정보를 공유하는 블로그&커뮤니티 입니다."

    // 인증체크 페이지의 경우
    if (to.name === 'Auth') {
        if (to.query.error === 'login_required') {
            next({name: 'Login'})
        } else {
            next({name: 'Home'})
        }
    } else if (to.name !== 'Login') {
        // 로그인페이지가 아닌경우 인증체크후 페이지로 전이
        next()
    } else {
        next()
    }
})

export default vueRouter