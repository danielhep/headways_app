<template>
  <multipane @paneResize="paneResize" class="vertical-panes">
    <div class="w-2/3">
      <Map @mapLoaded="mapLoaded" @stopSelected="stopSelected" class="h-screen" />
    </div>
    <multipane-resizer class="bg-purple-700" />

    <div class="p-3 px-5">
      <div class="pb-2">
        <h2 class="inline font-display text-3xl">Stop Info</h2>
        <small class="text-small text-gray-400 px-2">ID:{{selectedStop.stop_id}}</small>
        <small class="text-small text-gray-400 px-2">Stop Name: {{selectedStop.stop_name}}</small>
      </div>
      <small class="small-button" @click="openGoogleMaps(selectedStop)">Google Maps</small>
      <small class="small-button">Stop Explorer</small>
      <br />
      <h2 class="inline font-display text-3xl">Served by routes:</h2>
    </div>
  </multipane>
</template>

<script>
import Map from '@/components/Map.vue'
import { Multipane, MultipaneResizer } from 'vue-multipane'
import gql from 'graphql-tag'
import { mapState } from 'vuex'

export default {
  components: { Map, Multipane, MultipaneResizer },
  data: function () {
    return {
      infoDrawer: false,
      selectedStop: {}
    }
  },
  methods: {
    paneResize: function () {
      this.map.resize() // or this.$store.map.resize();
    },
    mapLoaded: function (e) {
      // in component
      this.map = e.map
    },
    stopSelected: async function (stop) {
      this.selectedStop = stop
    },
    openGoogleMaps: function (stop) {
      const url = `https://www.google.com/maps/search/?api=1&query=${stop.stop_lat},${stop.stop_lon}`
      window.open(url)
    }
  },
  computed: mapState(['currentFeed']),
  apollo: {
    stopInfo: {
      query: gql`query StopInfo($stopID: ID, $feedIndex: Int) {
        feed(feed_index: $feedIndex) {
          stop(stop_id: $stopID) {
            routes {
              route_short_name
            }
          }
        }
      }`,
      variables () {
        return {
          feedIndex: this.currentFeed.feed_index,
          stopID: this.selectedStop.stop_id.toString()
        }
      },
      skip () {
        return !this.selectedStop || !this.currentFeed
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
