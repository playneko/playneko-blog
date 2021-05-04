<template>
    <div>
        <v-container>
            <v-row no-gutters class="margin-top">
                <v-col cols="12" class="div-center">
                    <div v-if="Object.keys(posts).length > 0" class="content">
                        <div class="content-title">{{posts.boardSubject}}</div>
                        <div class="content-division_top">
                            <v-chip
                                class="ma-2 chip-category"
                                color="#ff9800"
                                text-color="#ffffff"
                            >
                                {{posts.boardCatTitle}}
                            </v-chip>
                            <v-chip
                                class="ma-2 chip-datetime"
                                color="#795548"
                                text-color="#ffffff"
                            >
                                <v-icon left>mdi-alarm</v-icon>
                                {{posts.boardDate}}
                            </v-chip>
                            <v-spacer></v-spacer>
                            <v-avatar class="content-avatar">
                                <img :src="posts.avatar" :alt="posts.nickname">
                            </v-avatar>
                            <v-chip
                                class="ma-2 chip-nickname"
                                color="#696969"
                                text-color="#ffffff"
                            >
                                {{posts.nickname}}
                            </v-chip>
                        </div>
                        <hr class="content-hr-top">
                        <div class="md-body">
                            <Adsense
                                data-ad-client="ca-pub-6351488118670184"
                                data-ad-slot="1919404640">
                            </Adsense>
                            <Viewer :initialValue="posts.boardArticle" />
                            <Adsense
                                data-ad-client="ca-pub-6351488118670184"
                                data-ad-slot="1919404640">
                            </Adsense>
                        </div>
                        <hr class="content-hr-bottom">
                        <div v-if="isLogged" class="content-comment-div">
                            <v-col cols="12" sm="12" class="content-comment" v-if="!loadingComment">
                                <v-avatar v-if="thumbnail !== null" class="content-comment-avatar">
                                    <img :src="thumbnail">
                                </v-avatar>
                                <v-textarea
                                    filled
                                    auto-grow
                                    label="Comment"
                                    rows="2"
                                    color="#9a9a9a"
                                    row-height="15"
                                    v-model="commentText"
                                    class="content-comment-textarea"
                                ></v-textarea>
                                <v-btn tile color="#dedede" class="content-comment-write" @click="handlerWriteComment">
                                    <v-icon left>mdi-plus-thick</v-icon>
                                    저장
                                </v-btn>
                            </v-col>

                            <div v-if="loadingComment" class="loading">
                                <v-progress-circular
                                    :size="50"
                                    :width="7"
                                    color="purple"
                                    indeterminate
                                ></v-progress-circular>
                            </div>
                        </div>
                        <div v-else-if="!isLogged" class="content-comment-nologin">
                            <v-icon>mdi-gitlab</v-icon>
                            댓글을 남기실려면 로그인을 해주시기 바랍니다.
                        </div>
                        <v-list three-line class="content-comment-list">
                            <template v-for="(item, index) in comments">
                                <v-list-item
                                    :key="item.no"
                                >
                                    <v-list-item-avatar class="content-comment-list-avatar">
                                        <v-img :src="item.avatar"></v-img>
                                    </v-list-item-avatar>

                                    <v-list-item-content class="content-comment-list-root">
                                        <v-list-item-title class="content-comment-list-text">
                                            <div class="content-comment-list-div">
                                                <span class="content-comment-nickname">{{item.nickname}}</span>, <span class="content-comment-datetime">{{item.boardDate}}</span>
                                            </div>
                                            <v-spacer></v-spacer>
                                            <v-btn icon v-if="doAuthUserCheck(item.userId) && item.isNew !== null && !item.isNew" @click="handlerDeleteComment(item.no, item.userId)" class="content-comment-trash">
                                                <v-icon class="content-comment-icon">mdi-trash-can-outline</v-icon>
                                            </v-btn>
                                        </v-list-item-title>
                                        <nl2br tag="div" :text="item.boardArticle" className="content-comment-list-text"/>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-divider
                                    :key="'div_' + index"
                                    :inset="false"
                                ></v-divider>
                            </template>
                        </v-list>
                    </div>
                    <div v-if="Object.keys(posts).length > 0 && doAuthUserCheck(posts.userId) && !loadingBoard" class="content-button">
                        <v-btn tile color="#8bc34a" class="content-button-edit" @click="handlerModifyBoard(posts.userId)">
                            <v-icon left>mdi-pencil</v-icon>
                            수정
                        </v-btn>
                        <v-btn tile color="#f44336" class="content-button-delete" @click="handlerDeleteBoard(posts.userId)">
                            <v-icon left>mdi-trash-can-outline</v-icon>
                            삭제
                        </v-btn>
                    </div>
                    <div v-if="loadingBoard" class="loading">
                        <v-progress-circular
                            :size="50"
                            :width="7"
                            color="purple"
                            indeterminate
                        ></v-progress-circular>
                    </div>

                    <div v-if="loading" class="loading">
                        <v-progress-circular
                            :size="50"
                            :width="7"
                            color="purple"
                            indeterminate
                        ></v-progress-circular>
                    </div>

                    <div v-if="error" class="error">
                        {{ error }}
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import "codemirror/lib/codemirror.css"
import "@toast-ui/editor/dist/toastui-editor.css"
import { Viewer } from "@toast-ui/vue-editor"
import Nl2br from 'vue-nl2br'

export default {
    data() {
        return {
            isLogged: false,
            loading: false,
            loadingBoard: false,
            loadingComment: false,
            error: null,
            id: null,
            catpage: 0,
            posts: [],
            comments: [],
            kakaoId: null,
            nickname: null,
            thumbnail: null,
            commentText: "",
            contentCommentRef: null,
        }
    },
    created() {
        // 로그인 유무
        this.isLogged = this.$store.getters.getIsLoginAuth ? this.$store.getters.getIsLoginAuth : false
        if (this.isLogged) {
            this.kakaoId = this.$store.getters.getKakaoId
            this.nickname = this.$store.getters.getKakaoNickname
            this.thumbnail = this.$store.getters.getKakaoThumbnail
        }
        this.id = this.$route.params.id ? this.$route.params.id : null
        this.catpage = this.$route.params.cat ? this.$route.params.cat : 0
        this.fetchDetailData()
        this.fetchCommentData()
    },
    methods: {
        fetchDetailData: async function() {
            this.loading = true
            const baseURI = this.$proxyUrl + '/api/board/detail'
            // const baseURI = 'http://ec2-54-249-69-88.ap-northeast-1.compute.amazonaws.com:8090/api/blog/detail'
            // const baseURI = 'https://playneko.com:8090/api/blog/detail'
            await this.$http.get(`${baseURI}?id=${this.id}`)
            .then((result) => {
                const data = result.data
                const dencrypt = this.$aesDencrypt(this.$secretKey, this.$secretIv, data)
                this.posts = JSON.parse(dencrypt)
                this.loading = false
            })
            .catch((error) => {
                console.log(error)
                this.loading = false
            })
        },
        fetchCommentData: async function() {
            const baseURI = this.$proxyUrl + '/api/board/detail/comment'
            await this.$http.get(`${baseURI}?id=${this.id}`)
            .then((result) => {
                const data = result.data
                const dencrypt = this.$aesDencrypt(this.$secretKey, this.$secretIv, data)
                this.comments = JSON.parse(dencrypt)
            })
            .catch((error) => {
                console.log(error)
            })
        },
        doAuthUserCheck (userId) {
            if (!this.$isEmpty(userId, 1) && !this.$isEmpty(this.kakaoId, 1)) {
                if (userId + "" === this.kakaoId + "") return true
            }
            return false
        },
        handlerModifyBoard (userId) {
            if (this.doAuthUserCheck(userId)) {
                const params = {
                    id: this.id,
                    catpage: this.catpage
                }
                this.$store.commit('addParams', params)
                this.routerLink("BoardModify")
            }
        },
        handlerWriteComment () {
            if (!this.$isEmpty(this.kakaoId, 1)) {
                this.loadingComment = true
                if (!this.$isEmpty(this.commentText)) {
                    const baseURI = this.$proxyUrl + '/api/board/write/comment'
                    const params = {
                        no: this.id,
                        userId: this.kakaoId,
                        boardArticle: this.commentText
                    }
                    this.sendPostData(baseURI, params)
                    // 댓글에 가상 항목 배열에 추가
                    var array = [{
                        no: this.comments.length + 1,
                        userId: this.kakaoId,
                        avatar: this.thumbnail,
                        nickname: this.nickname,
                        boardDate: "방금전",
                        boardArticle: this.commentText,
                        isNew: true
                    }]
                    array.push(...this.comments)
                    this.comments = array
                    this.commentText = ""
                }
            }
        },
        handlerDeleteComment (no, userId) {
            if (this.doAuthUserCheck(userId) && confirm("댓글을 삭제 하시겠습니까?")) {
                const baseURI = this.$proxyUrl + '/api/board/delete/comment'
                const params = {
                    no: no,
                    id: this.id,
                    userId: this.kakaoId
                }
                this.sendPostData(baseURI, params)
                // 댓글 배열에서 삭제항목 제거
                const itemToFind = this.comments.find(function (item) { return item.no === no })
                const idx = this.comments.indexOf(itemToFind)
                if (idx > -1) this.comments.splice(idx, 1)
            }
        },
        handlerDeleteBoard (userId) {
            if (this.doAuthUserCheck(userId) && confirm("게시글을 삭제 하시겠습니까?")) {
                this.loadingBoard = true
                const baseURI = this.$proxyUrl + '/api/board/delete/detail'
                const params = {
                    no: this.id,
                    userId: this.kakaoId
                }
                this.sendPostData(baseURI, params)
                // 게시판 목록으로 이동
                this.routerLink("BoardList", {id : this.catpage}, 1)
            }
        },
        sendPostData: async function(baseURI, params) {
            const encrypt = this.$aesEncrypt(this.$secretKey, this.$secretIv, params)
            await this.$http.post(baseURI, {param: encrypt})
            .then((result) => {
                if (result.data.success === false) {
                    console.log(result)
                }
                if (this.loadingBoard) this.loadingBoard = false
                if (this.loadingComment) this.loadingComment = false
            })
            .catch((error) => {
                console.log(error)
                if (this.loadingBoard) this.loadingBoard = false
                if (this.loadingComment) this.loadingComment = false
            })
        },
        routerLink (name, params, type) {
            if (type === 1) {
                this.$router.push({name: name, params: params})
            } else {
                this.$router.push({name: name})
            }
        }
    },
    components: {
        Nl2br,
        Viewer
    }
}
</script>

<style scoped>
.margin-top {
    margin-top: 15px !important;
}
.div-center {
    margin: 0 auto;
    justify-content: center;
}
.chip-category {
    margin-top: 7px;
    margin-right: 10px;
    height: 27px !important;
    font-size: 13px !important;
}
.chip-datetime {
    margin-top: 7px;
    margin-right: 5px;
    height: 27px !important;
    font-size: 13px !important;
}
.chip-nickname {
    margin-top: 7px;
    margin-right: 10px;
    height: 27px !important;
    font-size: 13px !important;
}
.chip-category i, .chip-datetime i, .chip-nickname i {
    font-size: 18px !important;
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
.content-button-delete {
    color: #fff;
    margin-left: 10px;
    border-radius: 7px;
}
.content-division_top {
    display: flex;
    margin-top: 5px;
    margin-bottom: 20px;
}
.content-division_bottom {
    margin-top: 10px;
    margin-bottom: 10px;
}
.content-avatar {
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
    margin-right: 7px;
}
.content-title {
    font-size: 30px;
    font-weight: 500;
}
.content-hr-top {
    margin-bottom: 25px;
}
.content-hr-bottom {
    margin-top: 25px;
}
.content-comment {
    display: flex;
    margin-bottom: 0px;
    padding-bottom: 0px;
}
.content-comment-avatar {
    margin-right: 10px;
}
.content-comment-nologin {
    height: 70px;
    display: flex;
    font-size: 15px;
    color: #808080;
    text-align: center;
    align-items: center;
    background: #eeeeee;
    justify-content: center;
}
.content-comment-list {
    padding-top: 0px;
}
.content-comment-list > .v-list-item {
    min-height: 0px;
}
.content-comment-list-root {
    display: flow-root !important;
    padding: 0px !important;
    padding-left: 7px !important;
}
.content-comment-list-div {
    padding-top: 7px;
}
.content-comment-list-avatar {
    margin-top: 7px !important;
    margin-right: 7px;
}
.content-comment-list-text {
    display: flex;
    font-size: 13px;
    margin-top: 5px !important;
    margin-bottom: 7px;
}
.content-comment-icon {
    color: #ff5722 !important;
}
.content-comment-nickname {
    color: #673ab7;
    font-weight: 800;
}
.content-comment-datetime {
    font-weight: 500;
}
.content-comment-write {
    margin-left: 10px;
    border-radius: 7px;
    height: 4em !important;
}
.content-comment-trash {
    width: 20px;
    height: 20px;
}
.content-comment-trash i {
    width: 20px !important;
    height: 20px !important;
    font-size: 17px !important;
}
.loading {
    display: flex;
    color: #cddc39;
    align-items: center;
    justify-content: center;
}
@media (min-width: 1721px) {
    .content {
        max-width: calc(100vw - 40vw);
    }
}
</style>
