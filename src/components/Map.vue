<template>
  <MglMap
    :center="[this.currentFeed.feed_lon, this.currentFeed.feed_lat]"
    :zoom="zoom"
    @load="mapboxLoaded"
    :accessToken="mapboxKey"
    :mapStyle="mapStyle"
  >
    <MglGeojsonLayer sourceId="stops" :source="stopsComplete" layerId="stops" :layer="layerConfig" />
  </MglMap>
</template>

<script>
import Mapbox from 'mapbox-gl'
import { MglMap, MglGeojsonLayer } from 'vue-mapbox'
import { mapState } from 'vuex'

export default {
  components: {
    MglMap, MglGeojsonLayer
  },
  data: function () {
    return {
      mapboxKey: process.env.VUE_APP_MAPBOX_KEY,
      mapStyle: 'mapbox://styles/danielhep/cjz0jqvvh5r7u1cpn9ssas68c',
      zoom: 13,
      stop: {},
      layerConfig: {
        'clustering': true,
        'type': 'symbol',
        'layout': {
          // get the icon name from the source's "icon" property
          // concatenate the name to get an icon from the style's sprite sheet
          'icon-image': 'embassy-11'
        },
        'paint': {
          'icon-color': '#0000FF'
        }
      }
    }
  },
  created () {
    this.mapbox = Mapbox
  },
  computed: {
    ...mapState(['stops', 'currentFeed']),
    stopsComplete: function () {
      return {
        'type': 'geojson',
        'data': {
          type: 'FeatureCollection',
          id: 'stopsboi',
          features: this.stops
        }
      }
    }
  },
  methods: {
    mapboxLoaded: async function (e) {
      this.$emit('mapLoaded', e)
      await this.$store.dispatch('getStops')
      const map = e.map

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

      // just make sure it's sized correctly
      map.resize()
    }
  }
}
</script>
