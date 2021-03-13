<template>
    <div class="list-root">
        <div v-if="Object.keys(posts).length > 0" class="content">
            <v-card
                class="mx-auto card-margin"
                max-width="344"
                v-for="item in posts" :key="item.no"
            >
                <div class="card-top">
                    <v-avatar>
                        <img
                            src="https://playneko.com/wp-content/uploads/2020/04/cropped-avatarimg_user1.png"
                            alt="Avatar"
                        >
                    </v-avatar>
                    <div>
                        <v-card-title>
                        {{item.board_title}}
                        </v-card-title>
                        <v-card-subtitle>
                        {{item.board_date}}
                        </v-card-subtitle>
                    </div>
                </div>

                <v-img
                    :src="item.board_thumnail"
                    class="image-click"
                    @click="routerLink('DetailInfo', item.no)"
                ></v-img>

                <v-expand-transition>
                <div>
                    <v-card-text>
                    {{item.board_comment}}
                    </v-card-text>
                </div>
                </v-expand-transition>
            </v-card>
            <div class="paging-root">
                <div v-if="paging.total > 0" class="text-center">
                    <v-pagination
                        v-model="pageNum"
                        :length="paging.total"
                        :total-visible="5"
                        @input="pageChange"
                        color="#424242"
                    ></v-pagination>
                </div>
            </div>
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
    data () {
        return {
            loading: false,
            error: null,
            posts: [],
            paging: [],
            pageNum: 1,
            limitPageNum: 8,
            catpage: 0,
            keyword: "",
        }
    },
    created () {
        this.catpage = this.$route.params.id ? this.$route.params.id : 0
        this.fetchData()
    },
    methods: {
        fetchData: function () {
            const baseURI = 'https://akibatv.playneko.com/?/api/blog/category'
            this.$http.get(`${baseURI}?page=${this.pageNum}&limitpage=${this.limitPageNum}&catpage=${this.catpage}&keyword=${this.keyword}&projectid=9a27a65f138f8f6f4991323212ebb408`)
            .then((result) => {
                this.posts = result.data.list
                this.paging = result.data.paging
            })
            .catch((error) => {
                console.log(error)
            })
        },
        pageChange: function (pageNumber) {
            this.pageNum = pageNumber
            this.fetchData()
        },
        routerLink: function (name, id) {
            this.$router.push({name: name, params: {id : id}})
        }
    }
}
</script>

<style lang="scss" scoped>
.list-root {
    margin: 20px;
    height: calc(100vh - 10vh);
}
.paging-root {
    padding-top: 15px;
    width: calc(100vw);
    justify-content: center;
}
.content {
    display: flex;
    flex-flow: wrap;
}
.card-top {
    display: flex;
}
.card-margin {
    margin: 15px;
}
.v-avatar {
    margin-top: 20px;
    margin-left: 15px;
}
.v-card__title {
    font-size: .9rem;
    line-height: 1.2rem;
}
.v-card__subtitle {
    font-size: .8rem;
}
.v-progress-circular {
    margin: 1rem;
}
.image-click {
    height: 200px;
    cursor: pointer;
}
.loading {
    display: flex;
    color: #cddc39;
    align-items: center;
    justify-content: center;
}
</style>
