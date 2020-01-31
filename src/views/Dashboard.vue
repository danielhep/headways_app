<template>
  <div>
    <div class="flex flex-row p-5">
      <info-card
        class="flex-grow mx-3"
        title="Number of Routes"
        icon="route"
        :loading="loading"
      >{{routes.length}}</info-card>
      <info-card
        class="flex-grow mx-3"
        title="Number of Stops"
        icon="map-marker"
        :loading="loading"
      >{{stops.length}}</info-card>
      <info-card
        class="flex-grow mx-3"
        title="Service Hours Per Day"
        icon="clock"
        :loading="loading"
      >n/a</info-card>
    </div>
  </div>
</template>

<script>
import InfoCard from '@/components/InfoCard.vue'
import { mapState } from 'vuex'

export default {
  data: function () {
    return {
      loading: false
    }
  },
  components: { InfoCard },
  computed: mapState(['routes', 'stops']),
  created: async function () {
    this.loading = true
    await this.$store.dispatch('getRoutes')
    await this.$store.dispatch('getStops')
    this.loading = false
  }
}
</script>
