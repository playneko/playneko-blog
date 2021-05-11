<template>
    <div class="footer">
        <div v-show="isPreview" class="footer-emoji_pv_open">
            <img :src="'/emoji/' + preview +'.png'" />
        </div>
        <div class="background-dark">
            <div class="footer-div">
                <textarea v-model="message" class="noresize input-text"></textarea>
                <div class="input-button">
                    <v-btn icon @click="doShowEmoji">
                        <v-icon>mdi-emoticon-lol</v-icon>
                    </v-btn>
                    <v-btn icon @click="doSendMessage">
                        <v-icon>mdi-arrow-up-bold-circle</v-icon>
                    </v-btn>
                </div>
            </div>
            <div v-show="isEmoji" class="footer-emoji">
                <div v-for="(item, index) in emojiList" :key="index">
                    <img :src="'/emoji/' + item +'.png'" @click="doPreviewEmoji(item)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ChildByAutoId from '../../plugins/ChildByAutoId'

export default {
    name: 'Footer',
    data() {
        return {
            loading: false,
            error: null,
            message: "",
            preview: "",
            kakaoId: null,
            nickname: "",
            thumbnail: "",
            isEmoji: false,
            isPreview: false,
            chatid: "playneko-blog-group-chatting",
            emojiList: ['001','002','003','004','005','006',
            '007','008','009','010','011','012','013',
            '014','015','016','017','018','019','020']
        }
    },
    created() {
        // 로그인 유무
        this.doKakaoProfile()
    },
    methods: {
        routerLink: function(name) {
            this.$router.push({name: name})
        },
        doShowEmoji () {
            if (this.isEmoji) {
                this.doCloseMessage()
            } else {
                this.isEmoji = true
            }
        },
        doPreviewEmoji (item) {
            this.preview = item
            this.isPreview = true
        },
        doCloseMessage () {
            this.message = ""
            this.preview = ""
            this.isEmoji = false
            this.isPreview = false
        },
        doSendMessage () {
            if (!this.$isEmpty(this.message) || !this.$isEmpty(this.preview)) {
                let nowTime = null
                let params = null
                let childByAutoId = null
                const getKakaoId = this.getKakaoId()
                if (!this.$isEmpty(this.preview)) {
                    childByAutoId = ChildByAutoId("/message", getKakaoId.kakaoId)
                    nowTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
                    params = {
                        uuid: getKakaoId.kakaoId,
                        name: getKakaoId.nickname,
                        image: getKakaoId.thumbnail,
                        emoji: this.preview,
                        datetime : nowTime
                    }
                    this.SendProcessMessage(childByAutoId, params)
                }
                if (!this.$isEmpty(this.message)) {
                    childByAutoId = ChildByAutoId("/message", getKakaoId.kakaoId)
                    nowTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
                    params = {
                        uuid: getKakaoId.kakaoId,
                        name: getKakaoId.nickname,
                        image: getKakaoId.thumbnail,
                        message: this.message,
                        datetime : nowTime
                    }
                    this.SendProcessMessage(childByAutoId, params)
                }
            }
            this.doCloseMessage()
        },
        SendProcessMessage (childByAutoId, params) {
            let ref = this.$firebase.database().ref('/message').child(this.chatid).child(childByAutoId)
            ref.set(params);
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
                        this.nickname = loginData.kakaoNickname
                        this.thumbnail = loginData.kakaoThumbnail
                    } else {
                        this.destoryAuth()
                    }
                } else {
                    this.destoryAuth()
                }
            } else {
                this.destoryAuth()
            }
        },
        getKakaoId () {
            // 아이디값 취득
            const kakaoProfile = this.$store.getters.getkakaoData
            if (!this.$isEmpty(kakaoProfile, 1)) {
                // 로그인 정보 복호화
                const dencrypt = this.$aesDencrypt(this.$secretKey, this.$secretIv, kakaoProfile, 1)
                const loginData = JSON.parse(dencrypt)
                if (loginData.isLoginAuth) {
                    return {
                        kakaoId: loginData.kakaoId,
                        nickname: loginData.kakaoNickname,
                        thumbnail: loginData.kakaoThumbnail
                    }
                }
            }
            return null
        },
        destoryAuth () {
            // 쿠키에서 토큰값 삭제
            this.$cookies.remove("accessToken")
            // 로그인 정보 삭제
            this.$store.commit('addIsLoginAuth', false)
            this.$store.commit('addKakaoData', null)
            // 채팅방 닫기
            this.$store.commit('addIsChattingClose', 1)
        }
    },
    watch: {
        '$store.getters.getIsChatting': function() {
            const isChatting = this.$store.getters.getIsChatting ? this.$store.getters.getIsChatting : false
            if (isChatting > 0) {
                this.isEmoji = false
                this.isPreview = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.badge {
    width: 19px;
    height: 19px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 6px;
    right: 6px;
    background: #fff;
    border-radius: 100%;
    color: #000;
    font-size: 10px;
    font-style: normal;
    font-weight: 600;
    letter-spacing: -.05em;
    font-family: 'Roboto Mono', monospace;
}
.footer {
    bottom: 0;
    width: 100%;
    // position: fixed;
    position: absolute;
}
.footer-div {
    display: flex;
    height: 55px;
    margin: 5px;
    margin-bottom: 0;
    padding-top: 8px;
}
.footer-emoji {
    height: 150px;
    bottom: 0px;
    overflow: auto;
    margin: 0 auto;
    margin-bottom: 0px;
    text-align: center;
    align-items: center;
    justify-content: center;
}
.footer-emoji > div {
    padding-right: 7px;
    display: inline-flex;
}
.footer-emoji > div > img {
    width: 80px;
}
.footer-emoji_pv_open {
    opacity: 0.7;
    height: 100px;
    display: block;
    text-align: center;
    margin-bottom: -5px;
    background: #545454;
}
.footer-emoji_pv_open > img {
    width: 100px;
    opacity: unset;
}
.input-text {
    width: 100%;
    height: 40px;
    padding: 10px;
    color: #ffffff;
    border-radius: 10px;
    background: #525252;
    border: 1px solid #525252;
}
.input-button {
    display: flex;
}
.input-button > button {
    color: #eeeeee !important;
}
.noresize {
    resize: none;
}
.background-dark {
    background: #303030 !important;
}
.list-color-black i {
    color: #ffffff !important;
}
</style>