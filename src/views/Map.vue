<template>
  <div class="w-full h-full relative">
    <vue-element-loading
      background-color="rgba(0, 0, 0, .6)"
      :active="!stops.length"
      color="white"
      spinner="bar-fade-scale"
    />
    <Map @mapLoaded="mapLoaded" @stopSelected="stopSelected" :routeShapes="shapes" :stops="stops" />
    <div class="z-10 absolute bg-gray-light border border-accent-1 shadow m-4 top-0 right-0">
      <div class="bg-accent-1 w-full p-2 flex">
        <div class="pr-4 flex-grow font-bold">Properties</div>
        <font-awesome-icon
          border
          fixed-width
          class="cursor-pointer"
          :icon="showProperties ? 'window-minimize' : 'window-maximize'"
          @click="showProperties = !showProperties"
        />
      </div>
      <transition name="slide">
        <map-sidebar
          v-if="showProperties"
          @routeSelected="(route) => selectedRoute=route"
          :selected-stop="selectedStop"
          class="p-2"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import Map from '@/components/Map.vue'
import MapSidebar from '@/components/MapSidebar.vue'
import { mapState } from 'vuex'
import gql from 'graphql-tag'
import _ from 'lodash/fp'

export default {
  components: { Map, MapSidebar },
  data: function () {
    return {
      selectedStop: {},
      selectedRoute: '',
      showProperties: false
    }
  },
  computed: {
    ...mapState(['stops']),
    feedIndex () { return parseInt(this.$route.params.feed) }
  },
  created () {
    this.$store.dispatch('getStops')
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
    shapes: {
      query: gql`query route($feedIndex: Int, $routeShortNames: [String!]) {
        feed(feed_index: $feedIndex) {
          routes_by_short_name(route_short_names: $routeShortNames) {
            shapes
          }
        }
      }
      `,
      update (data) {
        const out = _.flow([
          _.path('feed.routes_by_short_name'),
          _.flatMap(_.path('shapes'))
        ])(data)

        return out
      },
      variables () {
        return {
          feedIndex: this.feedIndex,
          routeShortNames: this.selectedRoute
        }
      },
      skip () {
        console.log(this.selectedRoute === '')
        return this.selectedRoute === ''
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
