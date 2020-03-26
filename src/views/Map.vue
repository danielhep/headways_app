<template>
  <multipane @paneResize="paneResize" class="vertical-panes">
    <div class="w-2/3">
      <vue-element-loading
        background-color="rgba(0, 0, 0, .6)"
        :active="!stops.length"
        color="white"
        spinner="bar-fade-scale"
      />
      <Map
        @mapLoaded="mapLoaded"
        @stopSelected="stopSelected"
        :routeShapes="shapes"
        :stops="stops"
      />
    </div>
    <multipane-resizer class="bg-purple-700" />
    <div class="p-3 px-5 w-1/3">
      <map-sidebar @routeSelected="(route) => selectedRoute=route" :selected-stop="selectedStop" />
    </div>
  </multipane>
</template>

<script>
import Map from '@/components/Map.vue'
import MapSidebar from '@/components/MapSidebar.vue'
import { Multipane, MultipaneResizer } from 'vue-multipane'
import { mapState } from 'vuex'
import gql from 'graphql-tag'
import _ from 'lodash/fp'

export default {
  components: { Map, MapSidebar, Multipane, MultipaneResizer },
  data: function () {
    return {
      selectedStop: {},
      selectedRoute: ''
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
.vertical-panes {
  width: 100%;
  height: 100%;
}

.multipane-resizer {
  width: 10px;
}

.multipane-resizer::before {
  content: "";
  margin-left: -2px;
  height: 40px;
  width: 4px;
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 2px;
  background-color: white;
}

.vertical-panes > .pane {
  text-align: left;
  padding: 15px;
  overflow: hidden;
  background: #eee;
}
.vertical-panes > .pane ~ .pane {
  border-left: 3px solid #ccc;
}
</style>
