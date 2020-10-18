<template>
  <div
    v-if="feed"
    class="w-full flex flex-col max-w-md"
  >
    <vue-element-loading
      background-color="rgba(0, 0, 0, .6)"
      :active="$apollo.loading"
      color="white"
      spinner="bar-fade-scale"
    />
    <h2 class="text-lg w-full border-b py-1 mb-1">
      Stop Info
    </h2>
    <small class="px-2">ID:{{ selectedStop.stop_id }}</small>
    <small class="px-2">Code:{{ feed.stop.stop_code }}</small>
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
      <small>Select a route to view on map.</small>
    </div>
    <div class="w-full">
      <p
        v-for="route in feed.stop.routes"
        :key="route._id"
        class="route-chip"
        @click="$emit('route-selected', route); selectedRoute = route;"
      >
        {{ route.route_short_name }}
      </p>
    </div>
    <div class="flex flex-col">
      <h2 class="text-lg border-b py-1 mb-1">
        Selected Route:
      </h2>
      <small class="px-2">ID: {{ selectedRoute.route_id }}</small>
    </div>
  </div>
  <div v-else>
    <div v-if="$apollo.loading">
      Loading...
    </div>
    <div v-else>
      Please select a stop to view more info.
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  props: ['selectedStop'],
  data: function () {
    return {
      selectedRoute: {}
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
            stop_code
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
