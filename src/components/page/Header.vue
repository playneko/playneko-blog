<template>
    <header>
        <v-app-bar
            color="#424242"
            dark
        >
            <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
            <v-toolbar-title>{{title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="handlerChatNavDrawer">
                <v-icon>mdi-comment-processing</v-icon>
            </v-btn>
        </v-app-bar>

        <v-navigation-drawer
            v-model="drawer"
            absolute
            temporary
            class="navigation-menu"
        >
            <template v-slot:prepend>
                <v-list-item two-line class="padding-top margin-top" v-if="isLogged">
                    <v-list-item-avatar v-if="thumbnail !== null" class="navigation-avatar">
                        <img :src="thumbnail">
                    </v-list-item-avatar>

                    <v-list-item-content class="padding-left">
                        <v-list-item-title v-if="nickname !== null">{{nickname}}</v-list-item-title>
                        <v-list-item-subtitle>
                            <v-btn icon class="navigation-profile" @click="routerLink('Profile')">
                                <v-icon>mdi-cog</v-icon>
                                프로필 수정
                            </v-btn>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item two-line class="padding-top margin-top-bottom" v-else-if="!isLogged">
                    <button class="text-center" @click="routerLink('Login')">
                        <img src="/login/kr/kakao_login_btn_medium_ov.png">
                    </button>
                </v-list-item>
            </template>

            <v-divider></v-divider>

            <v-list
                nav
                dense
                class="padding-top list-item_title"
            >
                <v-list-item @click="routerLink('Home', {id : 0}, 1)">
                    <v-list-item-icon>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Home</v-list-item-title>
                </v-list-item>
                <v-list-item @click="routerLink('RasberryPi', {id : 1}, 1)">
                    <v-list-item-icon>
                        <v-icon></v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Rasberry Pi</v-list-item-title>
                </v-list-item>
                <v-list-item @click="routerLink('Python', {id : 2}, 1)">
                    <v-list-item-icon>
                        <v-icon></v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Python</v-list-item-title>
                </v-list-item>
                <v-list-item @click="routerLink('PHP', {id : 3}, 1)">
                    <v-list-item-icon>
                        <v-icon></v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>PHP</v-list-item-title>
                </v-list-item>
                <v-list-item @click="routerLink('Java', {id : 4}, 1)">
                    <v-list-item-icon>
                        <v-icon></v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Java</v-list-item-title>
                </v-list-item>
                <v-list-item @click="routerLink('Linux', {id : 5}, 1)">
                    <v-list-item-icon>
                        <v-icon></v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Linux</v-list-item-title>
                </v-list-item>
                <v-list-item @click="routerLink('JavaScript', {id : 6}, 1)">
                    <v-list-item-icon>
                        <v-icon></v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>JavaScript</v-list-item-title>
                </v-list-item>
                <v-list-item @click="routerLink('Akihabara', {id : 7}, 1)">
                    <v-list-item-icon>
                        <v-icon></v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>아키바 정보</v-list-item-title>
                </v-list-item>
                <v-list-item @click="routerLink('MicroBit', {id : 8}, 1)">
                    <v-list-item-icon>
                        <v-icon></v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>micro:bit</v-list-item-title>
                </v-list-item>
                <v-list-item @click="routerLink('ChatBot', {id : 9}, 1)">
                    <v-list-item-icon>
                        <v-icon></v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>챗봇(ChatBot)</v-list-item-title>
                </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list
                nav
                dense
                class="list-item_title"
                v-if="Object.keys(lists).length > 0"
            >
                <v-list-item @click="routerLink('BoardList', {id : item.no}, 1)" v-for="(item, index) in lists" :key="index">
                    <v-list-item-icon>
                        <v-icon></v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{item.boardSubject}}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-navigation-drawer
            v-model="chatting"
            right
            absolute
            temporary
            ref="chatNavDrawer"
            :class="chatting ? chattingNaviShowClass : chattingNaviHideClass"
        >
            <div v-if="!isLogged" class="error">
                로그인을 해주시기 바랍니다.
            </div>
            <div v-else-if="isLogged">
                <HeaderChat />
                <ChatRoom />
                <FooterChat />
            </div>
        </v-navigation-drawer>
    </header>
</template>

<script>
export default {
    data: () => ({
        isLogged: false,
        drawer: false,
        chatting: false,
        group: null,
        lists: [],
        nickname: null,
        thumbnail: null,
        chatNavDrawer: null,
        chattingNaviShowClass: "navigation-chatting navigation-show",
        chattingNaviHideClass: "navigation-chatting navigation-hide",
        title: "여러가지 IT정보를 공유하는 블로그&커뮤니티 입니다."
    }),
    created () {
        // 카테고리 목록이 store에 등록이 되어 있는지
        if (this.$store.getters.getCategoryList.length > 0) {
            this.lists = this.$store.getters.getCategoryList
        } else {
            // 카테고리 리스트 취득
            this.categoryList()
        }
        this.$nextTick(() => {
            const ref = this.$refs['chatNavDrawer']
            this.chatNavDrawer = ref.$el.querySelector('div.v-navigation-drawer__content')
            this.chatNavDrawer.classList.add("navigation-middle")
        })
    },
    methods: {
        routerLink (name, params, type) {
            if (type === 1) {
                this.$store.commit('addPageNumber', 1)
                this.$router.push({name: name, params: params})
            } else {
                this.$router.push({name: name})
            }
        },
        categoryList () {
            const baseURI = this.$proxyUrl + '/api/board/category/menu'
            this.$http.get(`${baseURI}`)
            .then((result) => {
                this.lists = result.data.list
                this.$store.commit('addCategoryList', this.lists)
            })
            .catch((error) => {
                console.log(error)
            })
        },
        handlerChatNavDrawer () {
            this.chatting = true
            this.$store.commit('addIsChatting')
        }
    },
    watch: {
        '$store.getters.getKakaoId': function() {
            // 로그인 유무
            this.isLogged = this.$store.getters.getIsLoginAuth ? this.$store.getters.getIsLoginAuth : false
            if (this.isLogged) {
                this.nickname = this.$store.getters.getKakaoNickname
                this.thumbnail = this.$store.getters.getKakaoThumbnail
            }
        },
        '$store.getters.getIsChattingClose': function() {
            // 채팅방 닫기 버튼이 눌렸는지
            if (this.$store.getters.getIsChattingClose > 0) {
                this.chatting = false
                this.$store.commit('addIsChattingClose', 0)
            }
        }
    }
}
</script>

<style lang="scss">
.navigation-menu > div:first-child {
    background: #795548;
}
.navigation-chatting {
    width: 450px !important;
    // height: calc(100vh - 20vh) !important;
    justify-content: right !important;
}
.navigation-avatar {
    width: 45px !important;
    height: 45px !important;
    min-width: 45px !important;
    margin-top: 0px !important;
    margin-right: 10px;
}
.navigation-avatar > img {
    border: 3px solid #ffffff;
}
.navigation-profile {
    font-size: 13px !important;
    color: #ffffff !important;
    margin-left: 25px;
}
.navigation-middle > div {
    width: 100%;
}
.navigation-show {
    display: block !important;
}
.navigation-hide {
    display: none !important;
}
.v-navigation-drawer__content {
    width: 100% !important;
}
.margin-top {
    margin-top: 75px;
}
.margin-top-bottom {
    margin-top: 60px;
    margin-bottom: 20px;
}
.padding-top {
    padding-top: 10px;
}
.padding-left {
    padding-left: 10px;
}
.padding-left > div:first-child {
    color: #ffffff;
    font-weight: 900;
}
.text-center {
    margin: 0 auto;
    text-align: center;
}
.list-item_title > div > div > div {
    font-size: 1rem !important;
}
.error {
    color: #fff;
    border: 3px solid #fff;
    border-radius: 10px;
    padding: 15px;
    background: rgb(255, 112, 112);
    margin: 0 auto !important;
    max-width: calc(100vw);
    box-shadow: 5px 5px 5px #bdbdbd;
}
</style>
