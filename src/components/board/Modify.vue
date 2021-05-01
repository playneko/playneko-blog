<template>
    <div>
        <v-container>
            <div v-if="error" class="error">
                {{ error }}
            </div>
            <v-row no-gutters class="margin-top">
                <v-col cols="12" class="div-center">
                    <div v-if="Object.keys(posts).length > 0" class="content">
                        <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation
                        >
                            <v-chip
                                class="ma-2 chip-category"
                                color="#696969"
                                text-color="#ffffff"
                            >
                                {{posts.boardCatTitle}}
                            </v-chip>
                            <v-text-field
                                v-model="subject"
                                :counter="255"
                                :rules="subjectRules"
                                label="제목"
                                required
                            ></v-text-field>
                            <Editor ref="toastuiEditor" height="700px" initialEditType="markdown" :initialValue="article" />
                        </v-form>
                    </div>
                    <div v-if="Object.keys(posts).length > 0 && doAuthUserCheck(posts.userId) && !loadingBoard" class="content-button">
                        <v-btn tile color="#ffc107" class="content-button-back" @click="doBackPage()">
                            <v-icon left>mdi-arrow-left-circle</v-icon>
                            돌아가기
                        </v-btn>
                        <v-btn tile color="#8bc34a" class="content-button-edit" @click="doSubmit()">
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
import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor } from '@toast-ui/vue-editor'

export default {
    data() {
        return {
            loading: false,
            loadingBoard: false,
            error: null,
            valid: true,
            posts: [],
            params: [],
            subject: '',
            article: '',
            subjectRules: [
                v => !!v || '제목을 입력해 주세요.',
                v => (v && v.length <= 10) || '제목은 최대 255자 까지 입력을 해주시기 바랍니다.',
            ],
            kakaoId: null,
        }
    },
    created() {
        // 로그인 유무
        this.isLogged = this.$store.getters.getIsLoginAuth ? this.$store.getters.getIsLoginAuth : false
        if (this.isLogged) this.kakaoId = this.$store.getters.getKakaoId
        this.params = this.$store.getters.getParams ? this.$store.getters.getParams : null
        if (!this.isLogged || this.$isEmpty(this.params, 1)) this.doBackPage()
        this.fetchDetailData()
    },
    methods: {
        fetchDetailData: async function() {
            this.loading = true
            const baseURI = this.$proxyUrl + '/api/board/detail'
            // const baseURI = 'http://ec2-54-249-69-88.ap-northeast-1.compute.amazonaws.com:8090/api/blog/detail'
            // const baseURI = 'https://playneko.com:8090/api/blog/detail'
            await this.$http.get(`${baseURI}?id=${this.params.id}`)
            .then((result) => {
                this.posts = result.data
                this.subject = this.posts.boardSubject
                this.article = this.posts.boardArticle
            })
            .catch((error) => {
                console.log(error)
            })
            this.loading = false
        },
        doSubmit () {
            var content = this.$refs.toastuiEditor.invoke("getMarkdown");
            if (this.$isEmpty(this.subject)) {
                this.error = "제목을 입력해 주시기 바랍니다."
            } else if (this.$isEmpty(content)) {
                this.error = "내용을 입력해 주시기 바랍니다."
            } else {
                if (confirm("게시글을 저장 하시겠습니까?")) {
                    this.error = null
                    this.loadingBoard = true
                    const baseURI = '/api/board/modify/detail'
                    const params = {
                        no: this.params.id,
                        userId: this.kakaoId,
                        boardSubject: this.subject,
                        boardArticle: content,
                        boardNotice: 0,
                        boardSecret: 0,
                        boardDat: 0,
                        fileCode: "",
                        thumbnail: ""
                    }
                    // 게시글 저장
                    this.sendPostData(baseURI, params)
                }
            }
        },
        doBackPage () {
            this.$router.go(-1)
        },
        doAuthUserCheck (userId) {
            if (!this.$isEmpty(userId, 1) && !this.$isEmpty(this.kakaoId, 1)) {
                if (userId + "" === this.kakaoId + "") return true
            }
            return false
        },
        sendPostData: async function(baseURI, params) {
            await this.$http.post(baseURI, params)
            .then((result) => {
                if (result.data.success === false) {
                    this.error = "게시글 저장에 실패 했습니다. 잠시후 다시 시도해 주시기 바랍니다."
                } else {
                    this.$store.commit('addParams', null)
                    this.$store.commit('addPageNumber', 1)
                    this.routerLink("BoardList", {id : this.params.catpage}, 1)
                }
                this.loadingBoard = false
            })
            .catch((error) => {
                console.log(error)
                this.loadingBoard = false
                this.error = "게시글 저장에 실패 했습니다. 잠시후 다시 시도해 주시기 바랍니다."
            })
        },
        routerLink (name, params, type) {
            if (type === 1) {
                this.$router.push({name: name, params: params})
            } else {
                this.$router.push({name: name})
            }
        },
        validate () {
            this.$refs.form.validate()
        }
    },
    components: {
        Editor
    }
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
.content-button-back {
    color: #fff;
    margin-right: 10px;
    border-radius: 7px;
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
@media (min-width: 1721px) {
    .content, .error {
        max-width: calc(100vw - 40vw);
    }
}
</style>
