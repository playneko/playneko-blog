<template>
    <header>
        <v-app-bar
            color="#424242"
            dark
        >
            <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
            <v-toolbar-title>{{title}}</v-toolbar-title>
        </v-app-bar>

        <v-navigation-drawer
            v-model="drawer"
            absolute
            temporary
        >
        <v-list
            nav
            dense
            class="padding-top list-item_title"
        >
            <v-list-item-group
                v-model="group"
                active-class="deep-purple--text text--accent-4"
            >
            <v-list-item @click="routerLink('Home', 0)">
                <v-list-item-icon>
                    <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Home</v-list-item-title>
            </v-list-item>
            <v-list-item @click="routerLink('RasberryPi', 1)">
                <v-list-item-icon>
                    <v-icon></v-icon>
                </v-list-item-icon>
                <v-list-item-title>Rasberry Pi</v-list-item-title>
            </v-list-item>
            <v-list-item @click="routerLink('Python', 2)">
                <v-list-item-icon>
                    <v-icon></v-icon>
                </v-list-item-icon>
                <v-list-item-title>Python</v-list-item-title>
            </v-list-item>
            <v-list-item @click="routerLink('PHP', 3)">
                <v-list-item-icon>
                    <v-icon></v-icon>
                </v-list-item-icon>
                <v-list-item-title>PHP</v-list-item-title>
            </v-list-item>
            <v-list-item @click="routerLink('Java', 4)">
                <v-list-item-icon>
                    <v-icon></v-icon>
                </v-list-item-icon>
                <v-list-item-title>Java</v-list-item-title>
            </v-list-item>
            <v-list-item @click="routerLink('Linux', 5)">
                <v-list-item-icon>
                    <v-icon></v-icon>
                </v-list-item-icon>
                <v-list-item-title>Linux</v-list-item-title>
            </v-list-item>
            <v-list-item @click="routerLink('JavaScript', 6)">
                <v-list-item-icon>
                    <v-icon></v-icon>
                </v-list-item-icon>
                <v-list-item-title>JavaScript</v-list-item-title>
            </v-list-item>
            <v-list-item @click="routerLink('Akihabara', 7)">
                <v-list-item-icon>
                    <v-icon></v-icon>
                </v-list-item-icon>
                <v-list-item-title>아키바 정보</v-list-item-title>
            </v-list-item>
            <v-list-item @click="routerLink('MicroBit', 8)">
                <v-list-item-icon>
                    <v-icon></v-icon>
                </v-list-item-icon>
                <v-list-item-title>micro:bit</v-list-item-title>
            </v-list-item>
            <v-list-item @click="routerLink('ChatBot', 9)">
                <v-list-item-icon>
                    <v-icon></v-icon>
                </v-list-item-icon>
                <v-list-item-title>챗봇(ChatBot)</v-list-item-title>
            </v-list-item>
            </v-list-item-group>
        </v-list>
        </v-navigation-drawer>
    </header>
</template>

<script>
export default {
    data: () => ({
        drawer: false,
        group: null,
        title: "여러가지 개발정보를 공유하는 블로그 입니다."
    }),
    methods: {
        routerLink: function(name, id) {
            this.$store.commit('addCategory', id)
            this.$store.commit('addPageNumber', 1)
            this.$router.push({name: name, params: {id : id}})
        }
    }
}
</script>

<style lang="scss" scoped>
.padding-top {
    padding-top: 75px;
}
.list-item_title > div > div > div {
    font-size: 1rem !important;
}
</style>
