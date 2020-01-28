<template>
  <multipane @paneResize="paneresize" class="vertical-panes">
    <div class="w-2/3">
      <Map @mapLoaded="mapLoaded" class="h-screen" />
    </div>
    <multipane-resizer class="bg-purple-700" />

    <div class="p-3 px-5">
      <div class="pb-2">
        <h2 class="inline font-display text-3xl">Stop Info</h2>
        <small class="text-small text-gray-400 px-3">ID:</small>
        <small class="text-small text-gray-400 px-3">Stop Name:</small>
      </div>
      <small
        class="bg-gray-200 cursor-pointer text-black text-small p-1 rounded-lg mx-2 border-2 hover:border-purple-700"
      >Google Maps</small>
      <small
        class="bg-gray-200 cursor-pointer text-black text-small p-1 rounded-lg mx-2"
      >Stop Explorer</small>
    </div>
  </multipane>
</template>

<script>
import Map from '@/components/Map.vue'
import { Multipane, MultipaneResizer } from 'vue-multipane'

export default {
  components: { Map, Multipane, MultipaneResizer },
  data: function () {
    return {
      infoDrawer: false
    }
  },
  methods: {
    paneresize: function () {
      this.map.resize() // or this.$store.map.resize();
    },
    mapLoaded: function (e) {
      // in component
      this.map = e.map
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
