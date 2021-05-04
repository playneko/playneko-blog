<template>
    <div class="login-root">
        <div class="container">
            <div class="card login-wrap">
                <h2 class="form-login-heading">로그인</h2>
                <div class="card-body">
                    <div v-if="loading === true" class="loading">
                        <v-progress-circular
                            :size="50"
                            :width="7"
                            color="purple"
                            indeterminate
                        ></v-progress-circular>
                    </div>
                    <div v-show="loading === false">
                        <KakaoLogin
                            api-key=""
                            image="kakao_account_login_btn_medium_wide"
                            :on-success=onSuccess
                            :on-failure=onFailure
                            class="kakao-login"
                        />
                    </div>
                </div>
            </div>
        </div>

        <v-alert type="error" v-if="error === 1" class="kakako-error">
            카카오 계정으로 로그인중 에러가 발생 했습니다.
        </v-alert>
        <v-alert type="error" v-if="error === 2" class="kakako-error">
            카카오 계정으로 로그인은 성공을 했습니다만,<br/>
            인증정보 취득에 실패 했습니다.
        </v-alert>
        <v-alert type="error" v-if="error === 3" class="kakako-error">
            회원정보 등록에 실패 했습니다.<br/>
            잠시후 다시 로그인을 해주시기 바랍니다.
        </v-alert>
        <v-alert type="error" v-if="error === 4" class="kakako-error">
            회원정보 취득에 실패 했습니다.<br/>
            잠시후 다시 로그인을 해주시기 바랍니다.
        </v-alert>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            error: 0,
            kakaoId: null
        }
    },
    created() {
        // 로그인중일 경우 홈으로 이동
        if (this.$store.getters.getIsLoginAuth) this.$router.push({name: "Home"})
    },
    methods: {
        onSuccess (data) {
            console.log("success")
            this.loading = true
            this.kakaoUserMe(data.access_token)
        },
        onFailure () {
            console.log("error")
            this.error = 1
            this.loading = false
        },
        kakaoUserMe (accessToken) {
            // 쿠키에 토큰값 존재 체크
            if (this.$cookies.isKey("accessToken")) {
                // 쿠키에서 토큰값 삭제
                this.$cookies.remove("accessToken")
            }
            // 카카오 억세스 토큰값 쿠키에 저장
            this.$cookies.set("accessToken", accessToken)
            // 로그인 유무 False로 전환
            this.$store.commit('addIsLoginAuth', false)
            if (accessToken != null && accessToken != "") {
                // 카카오 프로필 정보 취득
                const headers = {'Authorization': `Bearer ${accessToken}`}
                const baseURI = this.$kakaoUrl + '/v2/user/me'
                this.$http.post(baseURI, {}, {headers: headers})
                .then((result) => {
                    const kakaoData = result.data
                    const kakaoProfile = kakaoData.kakao_account.profile
                    this.kakaoId = kakaoData.id
                    // 유저정보 체크및 등록/갱신
                    this.checkUser(kakaoData, kakaoProfile)
                })
                .catch((error) => {
                    console.log(error)
                    this.error = 2
                    this.loading = false
                })
            }
        },
        checkUser (userId, profile) {
            const encrypt = this.$aesEncrypt(this.$secretKey, this.$secretIv, {userId: userId.id})
            const baseURI = this.$proxyUrl + '/api/user/check/profile'
            this.$http.post(baseURI, {param: encrypt})
            .then((result) => {
                var count = result.data.cnt
                if (count > 0) {
                    // 유저정보 디비에 갱신
                    this.getLoginProfile()
                } else {
                    // 유저정보 디비에 등록
                    this.insertUser(userId, profile)
                }
            })
            .catch((error) => {
                console.log(error)
                this.error = 1
                this.loading = false
            })
        },
        insertUser (userId, profile) {
            const encrypt = this.$aesEncrypt(this.$secretKey, this.$secretIv, {
                userId: userId.id,
                nickname: profile.nickname,
                thumbnail: profile.thumbnail_image_url
            })
            const baseURI = this.$proxyUrl + '/api/user/insert/profile'
            this.$http.post(baseURI, {param: encrypt})
            .then(() => {
                this.getLoginProfile()
            })
            .catch((error) => {
                console.log(error)
                this.error = 3
                this.loading = false
            })
        },
        getLoginProfile () {
            if (!this.$isEmpty(this.kakaoId, 1)) {
                const encrypt = this.$aesEncrypt(this.$secretKey, this.$secretIv, {userId: this.kakaoId})
                const baseURI = this.$proxyUrl + '/api/user/get/profile'
                this.$http.post(baseURI, {param: encrypt})
                .then((result) => {
                    const data = result.data
                    const dencrypt = this.$aesDencrypt(this.$secretKey, this.$secretIv, data)
                    const kakaoData = JSON.parse(dencrypt)
                    this.$store.commit('addKakaoId', this.kakaoId)
                    this.$store.commit('addKakaoNickname', kakaoData[0].nickname)
                    this.$store.commit('addKakaoThumbnail', kakaoData[0].thumbnail)
                    // 로그인 유무 True로 전환
                    this.$store.commit('addIsLoginAuth', true)
                    this.loading = false
                    // 홈으로 이동
                    this.$router.push({name: "Home"})
                })
                .catch((error) => {
                    console.log(error)
                    this.error = 4
                    this.loading = false
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.login-root {
    margin: 20px;
    margin-top: 65px;
    text-align: center;
    height: calc(100vh - 10vh);
}
.login-title {
    font-size: 40px;
    font-weight: 700;
    margin-bottom: 50px;
}
.kakao-login {
    cursor: pointer;
}
.kakako-error {
    width: 300px;
    margin: 0 auto;
    margin-top: 15px;
    font-size: 13px;
    background: #ff6e6e;
}
.loading {
    display: flex;
    color: #cddc39;
    align-items: center;
    justify-content: center;
}
.login-wrap {
    width: 330px;
    margin: 0 auto;
}
.card {
    position: relative;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 1px solid rgba(0,0,0,.125);
    border-radius: .25rem;
}
.card-body {
    // height: 200px;
    max-height: 100%;
}
.card-body > div {
    padding-top: 25px;
    padding-bottom: 25px;
}
h2.form-login-heading {
    margin: 0;
    padding: 25px 20px;
    text-align: center;
    background: #ffcf3f;
    border-radius: 5px 5px 0 0;
    -webkit-border-radius: 5px 5px 0 0;
    color: #fff;
    font-size: 20px;
    text-transform: uppercase;
    font-weight: 900;
}
</style>
