<template>
    <div class="room-style">
        <ul class="list-style" id="container">
            <div v-for="(item, index) in lists" :key="index" class="list-li-style">
                <div v-if="item.uuid !== kakaoId" class="MuiListItem-root">
                    <v-avatar class="list-avatar chat-room_bubble_avatar">
                        <img :src="item.image">
                    </v-avatar>
                    <div>
                        <div class="chat-room_bubble_name">{{item.name}}</div>
                        <div class="chat-room_bubble_left_root">
                            <div class="chat-room_bubble_left" v-if="item.message !== ''">
                                <nl2br tag="div" :text="item.message"/>
                            </div>
                            <div class="chat-room_emoji_left" v-else-if="item.emoji !== ''">
                                <img :src="'/emoji/' + item.emoji +'.png'" />
                            </div>
                            <div class="chat-room_bubble_time_left">{{item.datetime}}</div>
                        </div>
                    </div>
                </div>
                <div v-else class="MuiListItem-root">
                    <div class="chat-room_bubble_time_right">{{item.datetime}}</div>
                    <div class="chat-room_bubble_right" v-if="item.message !== ''">
                        <nl2br tag="div" :text="item.message"/>
                    </div>
                    <div class="chat-room_emoji_right" v-else-if="item.emoji !== ''">
                        <img :src="'/emoji/' + item.emoji +'.png'" />
                    </div>
                </div>
                <span class="MuiTouchRipple-root"></span>
            </div>
        </ul>
    </div>
</template>

<script>
import Nl2br from 'vue-nl2br'

export default {
    data() {
        return {
            loading: false,
            error: null,
            kakaoId: null,
            lists: [],
            chatid: "playneko-blog-group-chatting",
        }
    },
    created() {
        // 로그인 유무
        this.doKakaoProfile()
        // 채팅 리스트 취득
        this.doChatList()
    },
    methods: {
        doChatList: async function() {
            // 유저ID가 존재할 경우
            if (!this.$isEmpty(this.chatid)) {
                // 채팅글 가져오기
                let ref = await this.$firebase.database().ref('/message').child(this.chatid)
                ref.limitToLast(20).on("value", this.childAdded)
            }
        },
        childAdded (snap) {
            this.lists = []
            // 채팅내용 배열에 넣기
            const snapshot = snap.val()
            for (var key in snapshot) {
                let data = snapshot[key]
                this.lists.push({
                    key: snap.key,
                    uuid: data.uuid,
                    name: data.name,
                    image: data.image,
                    message: !this.$isEmpty(data.message) ? data.message : "",
                    emoji: !this.$isEmpty(data.emoji) ? data.emoji : "",
                    datetime: this.doDateTimeFormat(data.datetime),
                })
            }
        },
        doDateTimeFormat (str) {
            return !this.$isEmpty(str) ? str.split(" ")[1].substring(0,5) : ""
        },
        doScrollToEnd () {
            const container = this.$el.querySelector("#container");
            const listName = document.getElementsByClassName("navigation-middle")[0]
            listName.scrollTop = container.scrollHeight;
        },
        doKakaoProfile () {
            // 로그인 유무
            this.isLogged = this.$store.getters.getIsLoginAuth ? this.$store.getters.getIsLoginAuth : false
            if (this.isLogged) {
                // 로그인 정보 취득
                const kakaoProfile = this.$store.getters.getkakaoData
                if (!this.$isEmpty(kakaoProfile, 1)) {
                    // 로그인 정보 복호화
                    const dencrypt = this.$aesDencrypt(this.$secretKey, this.$secretIv, kakaoProfile, 1)
                    const loginData = JSON.parse(dencrypt)
                    if (loginData.isLoginAuth) {
                        this.kakaoId = loginData.kakaoId
                    }
                }
            }
        }
    },
    watch: {
        lists () {
            this.$nextTick(() => {
                this.doScrollToEnd()
            })
        },
        '$store.getters.getIsChatting': function() {
            const isChatting = this.$store.getters.getIsChatting ? this.$store.getters.getIsChatting : false
            if (isChatting > 0) {
                this.doScrollToEnd()
            }
        }
    },
    components: {
        Nl2br
    }
}
</script>

<style lang="scss" scoped>
.room-style {
    margin-top: 75px;
    margin-bottom: 60px;
}
.list-style {
    list-style: none;
    // padding-top: 15px;
    padding-left: 15px;
    margin-right: 15px;
    margin-top: 7px;
    margin-bottom: 0px;
}
.MuiListItem-root {
    width: 100%;
    display: flex;
    position: relative;
    box-sizing: border-box;
    text-align: left;
    align-items: center;
    padding-top: 5px;
    padding-bottom: 5px;
    justify-content: flex-start;
    text-decoration: none;
}
.MuiTouchRipple-root {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    overflow: hidden;
    position: absolute;
    border-radius: inherit;
    pointer-events: none;
}
.chat-room_bubble_avatar {
    flex-shrink: 0;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 0;
    margin-bottom: auto;
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
}
.chat-room_bubble_name {
    font-size: 10px;
    font-weight: 700;
    margin-top: 3px;
    margin-left: 10px;
    margin-bottom: 5px;
}
.chat-room_bubble_left_root {
    display: flex;
}
.chat-room_bubble_left {
    padding: 5px;
    width: max-content;
    font-size: 10px;
    color: #4c4c4c;
    margin-left: 10px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 7px;
    line-height: unset;
    text-align: initial;
    white-space: pre-line;
    background: #e8e8e8;
    border: 1px solid #e8e8e8;
    border-top-left-radius: 0px;
}
.chat-room_bubble_right {
    padding: 5px;
    width: max-content;
    font-size: 10px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 7px;
    line-height: unset;
    text-align: initial;
    white-space: pre-line;
    background: #ffde3f;
    border: 1px solid #ffde3f;
    border-bottom-right-radius: 0px;
}
.chat-room_emoji_left {
    width: auto;
    float: left;
    text-align: left;
    margin-left: 10px;
}
.chat-room_emoji_right {
    width: auto;
    text-align: right;
}
.chat-room_emoji_left > img, .chat-room_emoji_right > img {
    width: 100px;
}
.chat-room_bubble_time_left {
    float: left;
    font-size: 9px;
    margin-top: auto;
    margin-bottom: 0;
    padding-left: 5px;
}
.chat-room_bubble_time_right {
    font-size: 9px;
    margin-top: auto;
    margin-left: auto;
    margin-bottom: 0;
    padding-right: 5px;
}
</style>
