<template>
    <div id="app" class="mx-auto overflow-hidden">
        <Header />
        <router-view :key="$route.fullPath"></router-view>
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            isLogged: false,
            accessToken: "",
            kakaoId: null
        }
    },
    created() {
        // 로그인 유무
        this.isLogged = this.$store.getters.getIsLoginAuth ? this.$store.getters.getIsLoginAuth : false
        // 유저정보 재취득
        this.checkLoginAuth()
    },
    methods: {
        checkLoginAuth () {
            // 억세스 토큰 쿠키가 존재하며, 로그인중이 아닌경우
            if (this.$cookies.isKey("accessToken") && !this.isLogged) {
                // 쿠키에서 억세스 토큰을 취득
                this.accessToken = this.$cookies.get("accessToken")
                // 카카오 프로필 정보 취득
                const headers = {'Authorization': `Bearer ${this.accessToken}`}
                const baseURI = this.$kakaoUrl + '/v2/user/me'
                this.$http.post(baseURI, {}, {headers: headers})
                .then((result) => {
                    const kakaoData = result.data
                    this.kakaoId = kakaoData.id
                    this.getLoginProfile()
                })
                .catch((error) => {
                    console.log(error)
                    this.destoryAuth()
                })
            }
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
                })
                .catch((error) => {
                    console.log(error)
                    this.destoryAuth()
                })
            }
        },
        destoryAuth () {
            // 쿠키에서 토큰값 삭제
            this.$cookies.remove("accessToken")
            // 로그인 정보 삭제
            this.$store.commit('addIsLoginAuth', false)
            this.$store.commit('addKakaoId', null)
            this.$store.commit('addKakaoNickname', null)
            this.$store.commit('addKakaoThumbnail', null)
        }
    },
    watch: {
        '$store.getters.getIsLoginAuth': function() {
            if (this.$store.getters.getIsLoginAuth === false) {
                this.checkLoginAuth()
            }
        }
    }
}
</script>

<style>
body {
    background-color: #fafafa;
}
#app {
    margin: 0;
}
</style>
