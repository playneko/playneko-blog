<template>
    <div class="header background-blue">
        <v-btn icon class="header-close" @click="handlerChatNavClose">
            <v-icon>mdi-exit-run</v-icon>
        </v-btn>
        <div class="header-title">{{title}}</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: "그룹채팅방",
        }
    },
    methods: {
        handlerChatNavClose () {
            this.$store.commit('addIsChattingClose', 1)
        }
    },
}
</script>

<style lang="scss" scoped>
.header {
    top: 0;
    width: 100%;
    height: 64px;
    z-index: 999;
    display: flex;
    margin: 0 auto;
    color: #ffffff;
    position: absolute;
    align-items: center;
}
.header-div {
    display: flex;
    margin: 5px;
    margin-bottom: 0;
}
.header-close {
    left: 0;
    margin-left: 0;
    text-align: left;
    color: #ffffff !important;
}
.header-title {
    margin: 0 auto;
}
.background-blue {
    background: #03a9f4 !important;
    box-shadow: 5px 5px 5px #bdbdbd;
}
</style>
