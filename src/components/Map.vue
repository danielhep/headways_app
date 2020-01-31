<template>
  <MglMap
    :center="[this.currentFeed.feed_lon, this.currentFeed.feed_lat]"
    :zoom="zoom"
    class="w-full"
    @load="mapboxLoaded"
    :accessToken="mapboxKey"
    :mapStyle="mapStyle"
  />
</template>

<script>
import Mapbox from 'mapbox-gl'
import { MglMap } from 'vue-mapbox'
import { mapState } from 'vuex'

export default {
  components: {
    MglMap
  },
  data: function () {
    return {
      mapboxKey: process.env.VUE_APP_MAPBOX_KEY,
      mapStyle: 'mapbox://styles/danielhep/cjz0jqvvh5r7u1cpn9ssas68c',
      zoom: 13,
      stop: {}
    }
  },
  created () {
    this.mapbox = Mapbox
  },
  computed: {
    ...mapState(['stops', 'currentFeed'])
  },
  methods: {
    mapboxLoaded: async function (e) {
      this.$emit('mapLoaded', e)
      await this.$store.dispatch('getStops')
      const map = e.map

      map.addSource('stops', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': this.stops
        }
      })

      map.addLayer({
        'id': 'stops',
        'clustering': true,
        'type': 'symbol',
        'source': 'stops',
        'layout': {
          // get the icon name from the source's "icon" property
          // concatenate the name to get an icon from the style's sprite sheet
          'icon-image': 'embassy-11'
        },
        'paint': {
          'icon-color': '#0000FF'
        }
      })

      map.on('click', 'stops', (e) => {
        this.$emit('stopSelected', e.features[0].properties)
        this.stop = e.features[0].properties
      })

      // Change the cursor to a pointer when the mouse is over the places layer.
      map.on('mouseenter', 'stops', function () {
        map.getCanvas().style.cursor = 'pointer'
      })

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'stops', function () {
        map.getCanvas().style.cursor = ''
      })
    }
  }
}
</script>
