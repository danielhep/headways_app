<template>
  <div
    class="overflow-x-scroll relative m-4 border-2 border-accent-2"
    style="scrollbar-color: #555 #222"
  >
    <div class="absolute h-full">
      <bar-chart
        class="relative h-full"
        style="width: 10000px"
        :chart-data="chartdata"
      />
    </div>
  </div>
</template>

<script>
import BarChart from '../BarChart.vue'
import { flatMap } from 'lodash'
export default {
  components: { BarChart },
  props: { agencies: { type: Array, default: () => [] } },
  computed: {
    routes () {
      return flatMap(this.agencies, agency => agency.routes).sort((a, b) => b.trips_count - a.trips_count)
    },
    labels () {
      return this.routes.map(route => route.route_short_name ? route.route_short_name : route.route_long_name)
    },
    datasets () {
      return this.agencies.map(agency => ({
        data: this.routes.map(route => (this.tripCountFromRouteID(route._id, agency.routes))),
        backgroundColor: 'red',
        label: agency.agency_name
      }))
    },
    chartdata () {
      return {
        labels: [...this.labels],
        datasets: this.datasets
      }
    }
  },
  methods: {
    tripCountFromRouteID (id, routes) {
      const route = routes.find(route => route._id === id)
      return route ? route.trips_count : null
    }
  }
}
</script>

<style>

</style>
