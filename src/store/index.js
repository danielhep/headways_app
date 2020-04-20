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
      state.routes = []
      state.stops = []
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
      if (!context.state.routes.length) {
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
      }
    },
    async getStops (context) {
      if (!context.state.stops.length) {
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
      }
    },
    async getInfoOnStop (context, stopID) {
      const { data } = await apolloClient.query({
        query: gql`
          query stopInfo {
            feed(feed_index ${context.state.currentFeed.feed_index}) {
              stop(stop_id: ${stopID}) {
                stop_times(date: "1-31-2020") {
                  trip {
                    route {
                      route_short_name
                    }
                  }
                }
              }
            }
          }
        `
      })
      return data
    },
    async getFeeds (context) {
      if (!context.state.feeds.length) {
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
    }
  },
  modules: {
  }
})
