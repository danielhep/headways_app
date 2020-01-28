<template>
  <MglMap class="w-full" @load="mapboxLoaded" :accessToken="mapboxKey" :mapStyle="mapStyle" />
</template>

<script>
import Mapbox from 'mapbox-gl'
import { MglMap } from 'vue-mapbox'

export default {
  components: {
    MglMap
  },
  data: function () {
    return {
      mapboxKey: process.env.VUE_APP_MAPBOX_KEY,
      mapStyle: 'mapbox://styles/danielhep/cjz0jqvvh5r7u1cpn9ssas68c'
    }
  },
  created () {
    this.mapbox = Mapbox
  },
  methods: {
    mapboxLoaded (e) {
      this.$emit('mapLoaded', e)
    }
  }
}
</script>
