<template>
  <div
    id="map"
    class="h-full w-full"
  />
</template>

<script>
// import 'leaflet'
import * as L from 'mapbox-gl'
// import { MarkerClusterGroup } from 'leaflet.markercluster'
import 'mapbox-gl/dist/mapbox-gl.css'
import _ from 'lodash/fp'
import gql from 'graphql-tag'

const useMousePointer = (map, layer) => {
  map.on('mouseenter', layer, function () {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', layer, function () {
    map.getCanvas().style.cursor = ''
  })
}
export default {
  props: ['stops', 'routeShapes', 'center'],
  data: function () {
    return {
      mapboxKey: process.env.VUE_APP_MAPBOX_KEY,
      mapStyle: 'mapbox://styles/danielhep/ck89oivim0a871ip0ksmxs64y',
      zoom: 13,
      stop: {}
    }
  },
  computed: {
  },
  watch: {
    stops () { this.updateSource() },
    routeShapes () { this.updateRouteShapes() }
  },
  mounted () {
    this.mapbox = L

    L.accessToken = process.env.VUE_APP_MAPBOX_KEY

    const map = new L.Map({
      container: 'map',
      center: this.center,
      zoom: 13,
      style: this.mapStyle
    })

    map.on('load', this.mapboxLoaded)
    this.map = map
  },
  apollo: {
    feed: {
      query: gql`
        query feed($feedIndex: Int!) {
          feed(feed_index: $feedIndex) {
            feed_lat
            feed_lon
          }
        }
      `,
      variables () {
        return {
          feedIndex: parseInt(this.$route.params.feed)
        }
      },
      skip () { return !this.$route.params.feed }
    }
  },
  methods: {
    updateSource () {
      // only set data if the source exists
      if (this.map.getSource('stopsSource')) {
        this.map.getSource('stopsSource').setData({
          type: 'FeatureCollection',
          features: this.stops
        })

        const coordinates = _.map(s => { return s.geometry.coordinates })(this.stops)
        const bounds = coordinates.reduce(function (bounds, coord) {
          return bounds.extend(coord)
        }, new L.LngLatBounds(coordinates[0], coordinates[1])) // start with a latlngbounds of the first coordinates

        this.map.fitBounds(bounds, {
          padding: 20,
          animate: false
        })
      }
    },
    updateRouteShapes () {
      const features = []
      for (const shape of this.routeShapes) {
        features.push({ type: 'Feature', geometry: shape })
      }
      this.map.getSource('routeLinesSource').setData({
        type: 'FeatureCollection',
        features
      })

      this.zoomToSelectedRoute()
    },
    zoomToSelectedRoute () {
      const coordinates = _.flatMap(s => { return s.coordinates })(this.routeShapes)
      const bounds = coordinates.reduce(function (bounds, coord) {
        return bounds.extend(coord)
      }, new L.LngLatBounds(coordinates[0], coordinates[1])) // start with a latlngbounds of the first coordinate

      this.map.fitBounds(bounds, {
        padding: 20
      })
    },
    mapboxLoaded: async function (e) {
      const map = this.map
      this.$emit('map-loaded', this.map)

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

      map.addSource('routeLinesSource', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
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
        id: 'stopsLayer',
        type: 'circle',
        source: 'stopsSource',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#9852f9',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      })

      map.addLayer({
        id: 'routeLines',
        type: 'line',
        source: 'routeLinesSource',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#FF715B',
          'line-width': 2
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
        this.$emit('stop-selected', e.features[0].properties)
        this.stop = e.features[0].properties
      })

      map.addControl(
        new L.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        })
      )

      useMousePointer(map, 'clusters')
      useMousePointer(map, 'stopsLayer')

      // just make sure it's sized correctly
      map.resize()
    }
  }
}
</script>
