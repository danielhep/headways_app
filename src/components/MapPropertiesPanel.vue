<template>
  <div
    v-if="feed"
    class="w-full flex flex-col"
  >
    <h2 class="text-lg w-full border-b py-1 mb-1">
      Stop Info
    </h2>
    <small class="px-2">ID:{{ selectedStop.stop_id }}</small>
    <small class="px-2">Stop Name: {{ selectedStop.stop_name }}</small>
    <div class="py-4 w-full">
      <small
        class="small-button"
        @click="openGoogleMaps(selectedStop)"
      >Google Maps</small>
      <router-link
        class="small-button"
        :to="{name: 'Stop Schedule', query: {stop: selectedStop.stop_id}}"
      >
        Stop Schedule
      </router-link>
    </div>
    <div>
      <h2 class="text-lg border-b py-1 mb-1">
        Routes:
      </h2>
    </div>
    <div class="w-full">
      <p
        v-for="route in feed.stop.routes"
        :key="route._id"
        class="route-chip"
        @click="$emit('routeSelected', route)"
      >
        {{ route.route_short_name }}
      </p>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'

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
  computed: {
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
  methods: {
    openGoogleMaps: function (stop) {
      const url = `https://www.google.com/maps/search/?api=1&query=${stop.stop_lat},${stop.stop_lon}`
      window.open(url)
    }
  },
  apollo: {
    feed: {
      query: gql`query stopInfo($stopID: ID!, $feedIndex: Int) {
        feed(feed_index: $feedIndex) {
          stop(stop_id: $stopID) {
            routes {
              route_short_name
              route_id
              _id
            }
          }
        }
      }`,
      variables () {
        return {
          feedIndex: parseInt(this.$route.params.feed),
          stopID: this.selectedStop.stop_id.toString()
        }
      },
      skip () {
        // skip if no selected stop
        return !this.selectedStop.stop_id
      }
    }
  }
}
</script>
