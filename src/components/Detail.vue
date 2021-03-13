<template>
    <v-container>
        <v-row no-gutters class="margin-top">
            <v-col cols="12" class="div-center">
                <div v-if="Object.keys(posts).length > 0" class="content">
                    <div>{{posts[0].board_title}}</div>
                    <markdown-it-vue-light class="md-body" :content="posts[0].board_article" />
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
</template>

<script>
import MarkdownItVueLight from 'markdown-it-vue/dist/markdown-it-vue-light.umd.min.js'
import 'markdown-it-vue/dist/markdown-it-vue-light.css'

export default {
    data () {
        return {
            loading: false,
            error: null,
            posts: [],
            id: null,
        }
    },
    created () {
        this.id = this.$route.params.id ? this.$route.params.id : ""
        this.fetchData()
    },
    methods: {
        fetchData: function () {
            const baseURI = 'https://akibatv.playneko.com/?/api/blog/detail'
            this.$http.get(`${baseURI}?id=${this.id}&projectid=9a27a65f138f8f6f4991323212ebb408`)
            .then((result) => {
                this.posts = result.data.detail
                console.log(this.posts)
            })
            .catch((error) => {
                console.log(error)
            })
        }
    },
    components: {
        MarkdownItVueLight
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
.content {
    border: 3px solid #fff;
    border-radius: 10px;
    padding: 15px;
    background: #fff;
    margin: 0 auto!important;
    /* width: 1160px; */
    max-width: calc(100vw);
    box-shadow: 5px 5px 5px #bdbdbd;
}
.loading {
    display: flex;
    color: #cddc39;
    align-items: center;
    justify-content: center;
}
</style>
