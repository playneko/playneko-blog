import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        category: 0,
        pageNumber: 1,
    },
    getters: {
        getCategory: state => {
            return state.category
        },
        getPageNumber: state => {
            return state.pageNumber
        }
    },
    mutations: {
        addCategory: (state, payload) => {
            state.category = payload
        },
        addPageNumber: (state, payload) => {
            state.pageNumber = payload
        }
    },
    actions: {
    }
});