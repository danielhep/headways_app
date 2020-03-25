<template>
  <div id="map" class="h-full w-full"></div>
</template>

<script>
// import 'leaflet'
import * as L from 'mapbox-gl'
// import { MarkerClusterGroup } from 'leaflet.markercluster'
import 'mapbox-gl/dist/mapbox-gl.css'
import { mapState } from 'vuex'

const useMousePointer = (map, layer) => {
  map.on('mouseenter', layer, function () {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', layer, function () {
    map.getCanvas().style.cursor = ''
  })
}
export default {
  props: ['stops'],
  data: function () {
    return {
      mapboxKey: process.env.VUE_APP_MAPBOX_KEY,
      mapStyle: 'mapbox://styles/danielhep/cjz0jqvvh5r7u1cpn9ssas68c',
      zoom: 13,
      stop: {}
    }
  },
  mounted () {
    this.mapbox = L

    L.accessToken = process.env.VUE_APP_MAPBOX_KEY

    const map = new L.Map({
      container: 'map',
      center: [this.currentFeed.feed_lon, this.currentFeed.feed_lat],
      zoom: 13,
      style: this.mapStyle
    })

    map.on('load', this.mapboxLoaded)
    this.map = map
    this.$store.dispatch('getStops')
  },
  computed: {
    ...mapState(['currentFeed'])
  },
  watch: {
    stops () { this.updateSource() }
  },
  methods: {
    updateSource () {
      this.map.getSource('stopsSource').setData({
        type: 'FeatureCollection',
        features: this.stops
      })
    },
    mapboxLoaded: async function (e) {
      const map = this.map
      this.$emit('mapLoaded', this.map)

      map.addSource('stopsSource', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        },
        cluster: true,
        clusterMaxZoom: 12, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      })

      this.updateSource()

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'stopsSource',
        filter: ['has', 'point_count'],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          'circle-color': [
            'interpolate-hcl',
            ['linear'],
            ['get', 'point_count'],
            4,
            ['rgba', 248, 97, 90, 0.8],
            750,
            ['rgba', 184, 13, 87, 0.8]
          ],
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'point_count'],
            4,
            10,
            300,
            40
          ]
        }
      })

      map.addLayer({
        'id': 'stopsLayer',
        'type': 'circle',
        'source': 'stopsSource',
        filter: ['!', ['has', 'point_count']],
        'paint': {
          'circle-color': '#11b4da',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      })

      // inspect a cluster on click
      map.on('click', 'clusters', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        })
        var clusterId = features[0].properties.cluster_id
        map.getSource('stopsSource').getClusterExpansionZoom(
          clusterId,
          function (err, zoom) {
            if (err) return

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            })
          }
        )
      })

      map.on('click', 'stopsLayer', (e) => {
        this.$emit('stopSelected', e.features[0].properties)
        this.stop = e.features[0].properties
      })

      useMousePointer(map, 'clusters')
      useMousePointer(map, 'stopsLayer')

      // just make sure it's sized correctly
      map.resize()
    }
  }
}
</script>
