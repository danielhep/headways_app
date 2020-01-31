<template>
  <multipane @paneResize="paneResize" class="vertical-panes">
    <div class="w-2/3">
      <Map @mapLoaded="mapLoaded" @stopSelected="stopSelected" class="h-screen" />
    </div>
    <multipane-resizer class="bg-purple-700" />

    <div class="p-3 px-5 w-1/3">
      <map-sidebar :selected-stop="selectedStop" />
    </div>
  </multipane>
</template>

<script>
import Map from '@/components/Map.vue'
import MapSidebar from '@/components/MapSidebar.vue'
import { Multipane, MultipaneResizer } from 'vue-multipane'

export default {
  components: { Map, MapSidebar, Multipane, MultipaneResizer },
  data: function () {
    return {
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
