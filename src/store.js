import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isLoginAuth: false,
        isChatting: 0,
        isChattingClose: 0,
        categoryList: [],
        category: 0,
        pageNumber: 1,
        kakaoId: "",
        kakaoNickname: "",
        kakaoThumbnail: "",
        params: []
    },
    getters: {
        getIsLoginAuth: state => {
            return state.isLoginAuth
        },
        getIsChatting: state => {
            return state.isChatting
        },
        getIsChattingClose: state => {
            return state.isChattingClose
        },
        getCategoryList: state => {
            return state.categoryList
        },
        getCategory: state => {
            return state.category
        },
        getPageNumber: state => {
            return state.pageNumber
        },
        getAxiosUrl: state => {
            return state.axiosUrl
        },
        getKakaoId: state => {
            return state.kakaoId
        },
        getKakaoNickname: state => {
            return state.kakaoNickname
        },
        getKakaoThumbnail: state => {
            return state.kakaoThumbnail
        },
        getParams: state => {
            return state.params
        }
    },
    mutations: {
        addIsLoginAuth: (state, payload) => {
            state.isLoginAuth = payload
        },
        addIsChatting: (state) => {
            state.isChatting++
        },
        addIsChattingClose: (state, payload) => {
            state.isChattingClose = payload
        },
        addCategoryList: (state, payload) => {
            state.categoryList = payload
        },
        addCategory: (state, payload) => {
            state.category = payload
        },
        addPageNumber: (state, payload) => {
            state.pageNumber = payload
        },
        addKakaoId: (state, payload) => {
            state.kakaoId = payload
        },
        addKakaoNickname: (state, payload) => {
            state.kakaoNickname = payload
        },
        addKakaoThumbnail: (state, payload) => {
            state.kakaoThumbnail = payload
        },
        addParams: (state, payload) => {
            state.params = payload
        }
    },
    actions: {
    }
});