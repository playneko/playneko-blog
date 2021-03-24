<template>
    <v-container>
        <v-row no-gutters class="margin-top">
            <v-col cols="12" class="div-center">
                <div v-if="Object.keys(posts).length > 0" class="content">
                    <div class="content-title">{{posts.boardTitle}}</div>
                    <div class="content-division_top">
                        <v-chip
                            class="ma-2 chip-category"
                            color="#424242"
                            text-color="#ffffff"
                            v-for="(item, index) in posts.catName" :key="index"
                        >
                            <v-icon left>mdi-timeline-text</v-icon>
                            {{item}}
                        </v-chip>
                        <v-chip
                            class="ma-2 chip-datetime"
                            color="#795548"
                            text-color="#ffffff"
                        >
                            <v-icon left>mdi-alarm</v-icon>
                            {{posts.boardDate}}
                        </v-chip>
                    </div>
                    <markdown-it-vue-light class="md-body" :content="posts.boardArticle" />
                    <div class="content-division_bottom">
                        <v-chip
                            class="ma-2 chip-tag"
                            color="#cddc39"
                            text-color="#6d6d6d"
                            v-for="(item, index) in posts.tagName" :key="index"
                        >
                            #{{item}}
                        </v-chip>
                    </div>
                    <div class='comments'>
                        <Disqus shortname='playneko-github-io' />
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
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { Disqus } from 'vue-disqus'
import MarkdownItVueLight from 'markdown-it-vue/dist/markdown-it-vue-light.umd.min.js'
import 'markdown-it-vue/dist/markdown-it-vue-light.css'

export default {
    data() {
        return {
            loading: false,
            error: null,
            posts: [],
            id: null,
        }
    },
    created() {
        this.id = this.$route.params.id ? this.$route.params.id : ""
        this.fetchData()
    },
    methods: {
        fetchData: function() {
            this.loading = true
            const baseURI = '/api/blog/detail'
            this.$http.get(`${baseURI}?id=${this.id}&projectid=9a27a65f138f8f6f4991323212ebb408`)
            .then((result) => {
                this.posts = result.data
                this.loading = false
            })
            .catch((error) => {
                console.log(error)
                this.loading = false
            })
        }
    },
    components: {
        Disqus,
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
.chip-category {
    margin-right: 5px;
    height: 27px !important;
    font-size: 13px !important;
}
.chip-datetime {
    margin-right: 5px;
    height: 27px !important;
    font-size: 13px !important;
}
.chip-tag {
    margin-right: 4px;
    margin-bottom: 7px;
    height: 27px !important;
    font-size: 13px !important;
}
.chip-category i, .chip-datetime i {
    font-size: 18px !important;
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
.content-division_top {
    margin-top: 5px;
    margin-bottom: 20px;
}
.content-division_bottom {
    margin-top: 10px;
    margin-bottom: 10px;
}
.loading {
    display: flex;
    color: #cddc39;
    align-items: center;
    justify-content: center;
}
.content-title {
    font-size: 30px;
    font-weight: 500;
}
@media (min-width: 1721px) {
    .content {
        max-width: calc(100vw - 40vw);
    }
}
</style>
