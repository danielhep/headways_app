import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import gql from 'graphql-tag'
import { apolloClient } from '@/vue-apollo.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    feeds: [ ],
    views: [
      { name: 'High Altitude', icon: 'plane', path: 'dash', id: 0 },
      { name: 'Map', icon: 'map', path: 'map', id: 1 }
    ],
    routes: [],
    stops: [],
    currentFeed: null
  },
  mutations: {
    setFeed (state, feed) {
      state.currentFeed = feed
    },
    clearFeed (state) {
      state.currentFeed = null
      router.push('/')
    },
    setFeeds (state, feeds) {
      state.feeds = feeds
    },
    setRoutes (state, routes) {
      state.routes = routes
    },
    setStops (state, stops) {
      state.stops = stops
    }
  },
  actions: {
    async getRoutes (context) {
      const { data } = await apolloClient.query({
        query: gql`
        query routes { 
          feed(feed_index: ${context.state.currentFeed.feed_index}) {
            routes {
              route_short_name
            }
          }
        }
        `
      })
      context.commit('setRoutes', data.feed.routes)
    },
    async getStops (context) {
      const { data } = await apolloClient.query({
        query: gql`
        query stops { 
          feed(feed_index: ${context.state.currentFeed.feed_index}) {
            stops_json
          }
        }
        `
      })
      context.commit('setStops', data.feed.stops_json)
    },
    async getFeeds (context) {
      const { data } = await apolloClient.query({
        query: gql`
        query feeds {
          feeds {
            feed_lat
            feed_lon
            feed_publisher_name
            feed_index
            feed_location_friendly
          }
        }
      ` })
      context.commit('setFeeds', data.feeds)
    }
  },
  modules: {
  }
})
