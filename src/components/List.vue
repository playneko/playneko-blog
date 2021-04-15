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
                            src="https://firebasestorage.googleapis.com/v0/b/cocoatalk-41442.appspot.com/o/avata%2FkCvqARth.png?alt=media&token=23aedec4-4aa9-410a-84d1-7e7cb507c345"
                            alt="Avatar"
                        >
                    </v-avatar>
                    <div>
                        <v-card-title>
                        {{item.boardTitle}}
                        </v-card-title>
                        <v-card-subtitle>
                        {{item.boardDate}}
                        </v-card-subtitle>
                    </div>
                </div>

                <v-img
                    :src="item.boardThumnail"
                    class="image-click"
                    @click="routerLink('DetailInfo', item.no)"
                ></v-img>

                <v-expand-transition>
                <div>
                    <v-card-text>
                    {{item.boardComment}}
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
    data() {
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
    created() {
        this.catpage = this.$store.getters.getCategory ? this.$store.getters.getCategory : 0
        this.pageNum = this.$store.getters.getPageNumber ? this.$store.getters.getPageNumber : 1
        this.fetchData()
    },
    methods: {
        fetchData: function() {
            this.loading = true
            const baseURI = '/api/blog/category'
            // const baseURI = 'http://ec2-54-249-69-88.ap-northeast-1.compute.amazonaws.com:8090/api/blog/category'
            // const baseURI = 'https://playneko.com:8090/api/blog/category'
            this.$http.get(`${baseURI}?pagenum=${this.pageNum}&limitpage=${this.limitPageNum}&catpage=${this.catpage}&keyword=${this.keyword}&projectid=9a27a65f138f8f6f4991323212ebb408`)
            .then((result) => {
                this.posts = result.data.list
                this.paging = result.data.paging
                this.loading = false
            })
            .catch((error) => {
                console.log(error)
                this.loading = false
            })
        },
        pageChange: function(pageNumber) {
            this.pageNum = pageNumber
            this.fetchData()
            this.$store.commit('addPageNumber', pageNumber)
        },
        routerLink: function(name, id) {
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
    padding-bottom: 20px;
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
@media (min-width: 1721px) {
    .content {
        margin: 0 auto;
        max-width: calc(100vw - 26vw);
    }
}
</style>
