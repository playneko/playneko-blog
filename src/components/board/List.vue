<template>
    <div class="list-root">
        <h3>{{title}}</h3>
        <v-simple-table class="border-bottom list-box">
            <template v-slot:default>
            <thead class="background-color">
                <tr>
                    <th class="text-center head-no">
                        No.
                    </th>
                    <th class="text-center head-avatar"></th>
                    <th class="text-center head-title">
                        제목
                    </th>
                    <th class="text-center head-user">
                        작성자
                    </th>
                    <th class="text-center head-date">
                        작성일
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in posts" :key="item.name">
                    <td class="text-center" v-if="item.boardNotice === 1">
                        <v-icon class="body-notice">mdi-bullhorn</v-icon>
                    </td>
                    <td class="text-center" v-else-if="item.boardNotice < 1">{{item.no}}</td>
                    <td class="text-center">
                        <v-avatar class="body-avatar">
                            <img :src="item.avatar" :alt="item.nickname">
                        </v-avatar>
                    </td>
                    <td @click="routerLink('BoardDetail', {cat: catpage, id: item.no}, 1)" class="body-pointer">
                        {{item.boardSubject}}
                        <v-icon v-if="item.commentCount > 0" class="body-comment-icon">mdi-chat-processing-outline</v-icon>
                        <span class='body-comment-count'>{{item.commentCount > 0 ? item.commentCount : ""}}</span>
                    </td>
                    <td>{{item.nickname}}</td>
                    <td class="text-center">{{item.boardDate}}</td>
                </tr>
            </tbody>
            </template>
        </v-simple-table>

        <div class="paging-root">
            <div v-if="paging.total > 0" class="content-bottom">
                <v-pagination
                    v-model="pageNum"
                    :length="paging.total"
                    :total-visible="5"
                    @input="pageChange"
                    color="#424242"
                ></v-pagination>
            </div>
            <v-btn v-if="isLogged" tile color="#8bc34a" class="content-button-edit" @click="handlerAddBoard()">
                <v-icon left>mdi-pencil</v-icon>
                글쓰기
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

        <div v-if="error" class="error">
            {{ error }}
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isLogged: false,
            loading: false,
            error: null,
            title: "",
            posts: [],
            paging: [],
            pageNum: 1,
            catpage: 0,
            keyword: "",
            limitPageNum: 15,
        }
    },
    created() {
        // 로그인 유무
        this.isLogged = this.$store.getters.getIsLoginAuth ? this.$store.getters.getIsLoginAuth : false
        this.catpage = this.$route.params.id ? this.$route.params.id : 0
        this.pageNum = this.$store.getters.getPageNumber ? this.$store.getters.getPageNumber : 1
        this.fetchData()
    },
    methods: {
        fetchData () {
            this.loading = true
            const baseURI = this.$proxyUrl + '/api/board/list/main'
            this.$http.get(`${baseURI}?pagenum=${this.pageNum}&limitpage=${this.limitPageNum}&catpage=${this.catpage}`)
            .then((result) => {
                this.posts = result.data.list
                this.paging = result.data.paging
                this.loading = false
                this.posts.length > 0 ? this.title = this.posts[0].boardCatTitle : "제목없음"
            })
            .catch((error) => {
                console.log(error)
                this.loading = false
            })
        },
        handlerAddBoard () {
            this.$store.commit('addParams', {catpage: this.catpage})
            this.routerLink("BoardAdd")
        },
        pageChange (pageNumber) {
            this.pageNum = pageNumber
            this.fetchData()
            this.$store.commit('addPageNumber', pageNumber)
        },
        routerLink (name, params, type) {
            if (type === 1) {
                this.$router.push({name: name, params: params})
            } else {
                this.$router.push({name: name})
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.list-root {
    margin: 0 auto;
    margin-top: 30px;
    height: calc(100vh - 10vh);
    max-width: calc(100vw - 30vw);
}
.list-box {
    border-radius: 10px;
    border: 3px solid #fff;
    box-shadow: 5px 5px 5px #bdbdbd;
}
.text-center {
    text-align: center;
}
.border-bottom {
    border-bottom: 1px solid #e0e0e0;
}
.head-no {
    width: 60px;
}
.head-avatar {
    width: 35px;
}
.head-user {
    width: 130px;
}
.head-date {
    width: 100px;
}
.body-notice {
    color: #f44336;
}
.body-avatar {
    width: 35px !important;
    height: 35px !important;
    min-width: 35px !important;
}
.body-pointer {
    cursor: pointer;
}
.body-comment-icon {
    font-size: 17px;
}
.body-comment-count {
    font-size: 14px;
    color: #2196f3;
}
.content-bottom {
    margin: 0 auto;
    display: inline-flex;
}
.content-button-edit {
    color: #fff;
    border-radius: 7px;
    margin-bottom: 7px;
}
.paging-root {
    display: flex;
    padding-top: 15px;
    padding-bottom: 20px;
    // width: calc(100vw - 30vw);
    justify-content: center;
}
.loading {
    display: flex;
    color: #cddc39;
    align-items: center;
    justify-content: center;
}
@media (min-width: 0px) and (max-width: 800px) {
    th:nth-child(1), th:nth-child(4), th:nth-child(5), td:nth-child(1), td:nth-child(4), td:nth-child(5) {
        display: none;
    }
    .list-root {
        max-width: calc(100vw - 5vw);
    }
}
</style>
