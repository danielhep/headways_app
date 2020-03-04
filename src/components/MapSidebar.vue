<template>
  <div class="w-full flex flex-col">
    <div class="pb-2">
      <h2 class="inline font-display text-3xl">Stop Info</h2>
      <small class="text-small text-gray-400 px-2">ID:{{selectedStop.stop_id}}</small>
      <small class="text-small text-gray-400 px-2">Stop Name: {{selectedStop.stop_name}}</small>
    </div>
    <div class="border-b-2 border-white pb-4 w-full">
      <small class="small-button" @click="openGoogleMaps(selectedStop)">Google Maps</small>
      <router-link
        class="small-button"
        :to="{name: 'Stop Explorer', params: {feed: this.currentFeed.feed_index}, query: {stop: selectedStop.stop_id}}"
      >Stop Explorer</router-link>
    </div>
    <div>
      <h2 class="inline font-display text-3xl">Served by routes:</h2>
    </div>
    <div>
      <p v-for="route in routes" :key="route.route_id" class="route-chip">{{route}}</p>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { mapState } from 'vuex'

export default {
  props: ['selectedStop'],
  data: function () {
    return {
      fields: ['trip.route.route_short_name', 'trip.trip_headsign', 'departure_time'],
      stopInfo: {
        stop: {
          routes: []
        }
      }
    }
  },
  methods: {
    openGoogleMaps: function (stop) {
      const url = `https://www.google.com/maps/search/?api=1&query=${stop.stop_lat},${stop.stop_lon}`
      window.open(url)
    }
  },
  computed: {
    ...mapState(['currentFeed']),
    stopTimes () {
      return this.stopInfo.stop.stop_times
    },
    routes () {
      if (this.stopInfo.stop.routes.length > 0) {
        const routes = this.stopInfo.stop.routes.map(route => route.route_short_name)
        // eliminate duplicates
        return [...new Set(routes)]
      } else {
        return []
      }
    }
  },
  apollo: {
    stopInfo: {
      query: gql`query stopInfo($stopID: ID, $feedIndex: Int) {
        feed(feed_index: $feedIndex) {
          stop(stop_id: $stopID) {
            routes {
              route_short_name
              route_id
            }
          }
        }
      }`,
      update: data => data.feed,
      variables () {
        return {
          feedIndex: this.currentFeed.feed_index,
          stopID: this.selectedStop.stop_id.toString()
        }
      },
      skip () {
        return !this.selectedStop.stop_id
      }
    }
  }
}
</script>
