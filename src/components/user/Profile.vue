<template>
    <div>
        <v-container>
            <div v-if="error" class="error">
                {{ error }}
            </div>
            <div v-if="success" class="success">
                {{ success }}
            </div>
            <v-row no-gutters class="margin-top">
                <v-col cols="12" class="div-center">
                    <div class="content">
                        <v-row>
                            <v-col cols="3">
                                <v-subheader>이미지</v-subheader>
                            </v-col>
                            <v-col cols="7">
                                <v-avatar class="content-avatar">
                                    <img :src="thumbnail" :alt="nickname">
                                </v-avatar>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="3">
                                <v-subheader>닉네임</v-subheader>
                            </v-col>
                            <v-col cols="7">
                                <v-text-field
                                    label="닉네임"
                                    placeholder="Dense & Rounded"
                                    filled
                                    rounded
                                    dense
                                    v-model="nickname"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="3">
                                <v-subheader>재취득</v-subheader>
                            </v-col>
                            <v-col cols="7">
                                <v-btn v-if="!loadingKakao" tile color="#795548" class="content-button-edit" @click="doKakaoReProfile">
                                    <v-icon left>mdi-chat</v-icon>
                                    카카오 프로필 재취득
                                </v-btn>

                                <div v-if="loadingKakao" class="loading-kakao">
                                    <v-progress-circular
                                        :size="50"
                                        :width="7"
                                        color="purple"
                                        indeterminate
                                    ></v-progress-circular>
                                </div>
                            </v-col>
                        </v-row>
                    </div>
                    <div v-if="!loading" class="content-button">
                        <v-btn tile color="#8bc34a" class="content-button-edit" @click="doSubmitProfile">
                            <v-icon left>mdi-check-bold</v-icon>
                            저장
                        </v-btn>
                    </div>

                    <div v-if="loading" class="loading">
                        <v-progress-circular
                            :size="50"
                            :width="7"
                            color="purple"
                            indeterminate
                        ></v-progress-circular>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            loadingKakao: false,
            error: null,
            success: null,
            valid: true,
            kakaoId: null,
            nickname: null,
            thumbnail: null,
            loginProfile: null,
            accessToken: "",
        }
    },
    created() {
        // 로그인 유무
        this.isLogged = this.$store.getters.getIsLoginAuth ? this.$store.getters.getIsLoginAuth : false
        if (this.isLogged) {
            // 스토어에서 로그인 정보 취득
            this.loginProfile = this.$store.getters.getkakaoData
            if (!this.$isEmpty(this.loginProfile, 1)) {
                // 로그인 정보
                const dencrypt = this.$aesDencrypt(this.$secretKey, this.$secretIv, this.loginProfile, 1)
                const loginData = JSON.parse(dencrypt)
                if (loginData.isLoginAuth) {
                    this.nickname = loginData.kakaoNickname
                    this.thumbnail = loginData.kakaoThumbnail
                } else {
                    // 로그인 유무 True로 전환
                    this.$store.commit('addIsLoginAuth', false)
                }
            } else {
                // 로그인 유무 True로 전환
                this.$store.commit('addIsLoginAuth', false)
            }
        } else {
            this.routerLink("Home")
        }
    },
    methods: {
        routerLink (name, params, type) {
            if (type === 1) {
                this.$router.push({name: name, params: params})
            } else {
                this.$router.push({name: name})
            }
        },
        doSubmitProfile () {
            if (confirm("프로필 정보를 저장 하시겠습니까?")) {
                this.error = null
                this.success = null
                this.loading = true
                this.updateUserProfile()
            }
        },
        doKakaoReProfile () {
            if (confirm("카카오 프로필을 재취득 하시겠습니까? 기존 프로필 정보는 사라집니다.")) {
                this.error = null
                this.success = null
                // 로그인 정보 삭제
                this.loginProfile = null
                this.$store.commit('addkakaoData', null)
                // 억세스 토큰 쿠키가 존재하며, 로그인중이 아닌경우
                if (this.$cookies.isKey("accessToken") && this.isLogged) {
                    this.loadingKakao = true
                    // 쿠키에서 억세스 토큰을 취득
                    this.accessToken = this.$cookies.get("accessToken")
                    // 카카오 프로필 정보 취득
                    const headers = {'Authorization': `Bearer ${this.accessToken}`}
                    const baseURI = this.$kakaoUrl + '/v2/user/me'
                    this.$http.post(baseURI, {}, {headers: headers})
                    .then((result) => {
                        const kakaoData = result.data
                        const kakaoProfile = kakaoData.kakao_account.profile
                        this.kakaoId = kakaoData.id
                        this.nickname = kakaoProfile.nickname
                        this.thumbnail = kakaoProfile.thumbnail_image_url
                        this.updateUserProfile()
                    })
                    .catch((error) => {
                        console.log(error)
                        this.destoryAuth()
                    })
                }
            }
        },
        updateUserProfile () {
            let userId = null
            if (!this.$isEmpty(this.loginProfile, 1)) {
                // 로그인 정보
                const dencrypt = this.$aesDencrypt(this.$secretKey, this.$secretIv, this.loginProfile, 1)
                const loginData = JSON.parse(dencrypt)
                userId = loginData.kakaoId
            } else if (!this.$isEmpty(this.kakaoId, 1)) {
                // 일반 정보
                userId = this.kakaoId
            }
            if (!this.$isEmpty(userId, 1)) {
                const encrypt = this.$aesEncrypt(this.$secretKey, this.$secretIv, {
                    userId: userId,
                    nickname: this.nickname,
                    thumbnail: this.thumbnail
                })
                const baseURI = this.$proxyUrl + '/api/user/update/profile'
                this.$http.post(baseURI, {param: encrypt})
                .then((result) => {
                    if (result.data.success === true) {
                        // 로그인 정보 스토어에 암호화 저장
                        const kakaoData = this.$aesEncrypt(this.$secretKey, this.$secretIv, {
                            isLoginAuth: true,
                            kakaoId: userId,
                            kakaoNickname: this.nickname,
                            kakaoThumbnail: this.thumbnail
                        })
                        this.$store.commit('addkakaoData', kakaoData)
                        if (this.loading) {
                            this.success = "프로필 정보가 갱신 되었습니다."
                        }
                        this.loading = false
                        this.loadingKakao = false
                    }
                })
                .catch((error) => {
                    console.log(error)
                    this.success = null
                    this.loading = false
                    this.loadingKakao = false
                    this.error = "프로필 갱신 처리중 에러가 발생했습니다."
                })
            }
        },
        destoryAuth () {
            this.loading = false
            this.loadingKakao = false
            // 쿠키에서 토큰값 삭제
            this.$cookies.remove("accessToken")
            // 로그인 정보 삭제
            this.$store.commit('addIsLoginAuth', false)
            this.$store.commit('addKakaoData', null)
            // 로그인 페이지로 이동
            this.routerLink("Login")
        }
    },
}
</script>

<style lang="scss" scoped>
.margin-top {
    margin-top: 15px !important;
}
.div-center {
    margin: 0 auto;
    justify-content: center;
}
.content {
    border: 3px solid #fff;
    border-radius: 10px;
    padding: 15px;
    background: #fff;
    margin: 0 auto !important;
    /* width: 1160px; */
    max-width: calc(100vw);
    box-shadow: 5px 5px 5px #bdbdbd;
}
.content-button {
    padding: 15px;
    text-align: center;
}
.content-button-edit {
    color: #fff;
    border-radius: 7px;
}
.loading {
    display: flex;
    color: #cddc39;
    align-items: center;
    justify-content: center;
}
.loading-kakao {
    display: flex;
    color: #795548;
    align-items: center;
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
.success {
    color: #fff;
    border: 3px solid #fff;
    border-radius: 10px;
    padding: 15px;
    background: #8bc34a;
    margin: 0 auto !important;
    max-width: calc(100vw);
    box-shadow: 5px 5px 5px #bdbdbd;
}
@media (min-width: 1721px) {
    .content, .error, .success {
        max-width: calc(100vw - 40vw);
    }
}
</style>
