import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    feeds: [
      { name: 'Puget Sound Region', location: 'Seattle, WA', id: 'sea-reg' },
      { name: 'WTA', location: 'Bellingham, WA', id: 'wta' },
      { name: 'Santa Cruz Metro', location: 'Santa Cruz, CA', id: '2' },
      { name: 'Paris Region', location: 'Paris, France', id: '3' }
    ],
    views: [
      { name: 'High Altitude', icon: 'plane', path: 'dash', id: 0 },
      { name: 'Map', icon: 'map', path: 'map', id: 1 }
    ],
    currentFeed: null
  },
  mutations: {
    setFeed (state, feed) {
      state.currentFeed = feed
    },
    clearFeed (state) {
      state.currentFeed = null
      router.push('/')
    }
  },
  actions: {
    async getFeeds () {

    }
  },
  modules: {
  }
})
