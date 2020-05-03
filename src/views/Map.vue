<template>
  <div class="w-full h-full relative">
    <vue-element-loading
      background-color="rgba(0, 0, 0, .6)"
      :active="$apollo.loading"
      color="white"
      spinner="bar-fade-scale"
    />
    <Map
      v-if="!$apollo.queries.feed.loading"
      :route-shapes="shape"
      :stops="feed.stops_json"
      :center="[feed.feed_lon, feed.feed_lat]"
      @mapLoaded="mapLoaded"
      @stopSelected="stopSelected"
    />
    <div class="z-10 absolute bg-gray-light border border-accent-1 shadow m-4 top-0 right-0 rounded">
      <div class="bg-accent-1 w-full p-2 flex">
        <div class="pr-4 flex-grow font-bold flex items-center">
          Properties
        </div>
        <font-awesome-icon
          border
          fixed-width
          class="cursor-pointer"
          :icon="showProperties ? 'window-minimize' : 'window-maximize'"
          @click="showProperties = !showProperties"
        />
      </div>
      <map-properties-panel
        v-if="showProperties"
        :selected-stop="selectedStop"
        class="p-2"
        @routeSelected="(route) => selectedRoute=route"
      />
    </div>
  </div>
</template>

<script>
import Map from '@/components/Map.vue'
import MapPropertiesPanel from '@/components/MapPropertiesPanel.vue'
import gql from 'graphql-tag'

export default {
  components: { Map, MapPropertiesPanel },
  data: function () {
    return {
      selectedStop: {},
      selectedRoute: {},
      showProperties: false
    }
  },
  computed: {
    feedIndex () { return parseInt(this.$route.params.feed) }
  },
  created () {
  },
  methods: {
    paneResize: function () {
      this.map.resize() // or this.$store.map.resize();
    },
    mapLoaded: function (e) {
      // in component
      this.map = e
      this.map.resize()
    },
    stopSelected: async function (stop) {
      this.selectedStop = stop
    }
  },
  apollo: {
    shape: {
      query: gql`
        query shape($routeIDs: [ID]) {
          routes_by_id(route_ids: $routeIDs) {
            shapes
          }
        }`,
      update (data) { console.log(data); return data.routes_by_id[0].shapes },
      variables () {
        return {
          feedIndex: this.feedIndex,
          routeIDs: [this.selectedRoute._id]
        }
      },
      skip () { return !this.selectedRoute._id }
    },
    feed: {
      query: gql`query feed($feedIndex: Int) {
        feed(feed_index: $feedIndex) {
          feed_lat
          feed_lon
          stops_json
        }
      }
      `,
      variables () {
        return {
          feedIndex: this.feedIndex
        }
      }
    }
  }
}
</script>

<style scoped>
.slide-enter-active {
  transition: all 0.3s;
  overflow: hidden;
}

.slide-enter {
  transform: scaleY(0) scaleX(0);
}
</style>
