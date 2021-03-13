import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        category: 0
    },
    getters: {
        getCategory(state) {
            return state.category;
        }
    },
    mutations: {
        setCategory(state, id) {
            return state.category = id;
        }
    },
    actions: {
    }
});