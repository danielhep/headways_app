<template>
  <div>
    <div class="flex flex-row p-5">
      <info-card class="flex-grow mx-3" title="Number of Routes" icon="route">{{routes.length}}</info-card>
      <info-card class="flex-grow mx-3" title="Number of Stops" icon="map-marker">{{stops.length}}</info-card>
      <info-card class="flex-grow mx-3" title="Service Hours Per Day" icon="clock">n/a</info-card>
    </div>
  </div>
</template>

<script>
import InfoCard from '@/components/InfoCard.vue'
import { mapState } from 'vuex'

export default {
  components: { InfoCard },
  computed: mapState(['routes', 'stops']),
  created: function () {
    this.$store.dispatch('getRoutes')
    this.$store.dispatch('getStops')
  }
}
</script>
