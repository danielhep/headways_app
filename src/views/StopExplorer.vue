<template>
  <div class="flex flex-row">
    <div class="flex-grow">
      <stop-times-table :stopID="stopID" :fsThreshold="fsThreshold" :feedIndex="feedIndex" />
    </div>
    <div style="min-width: 30%" class="px-3">
      <vue-slider v-model="fsThreshold"></vue-slider>
    </div>
  </div>
</template>

<script>
import StopTimesTable from '@/components/StopTimesTable.vue'
export default {
  components: { StopTimesTable },
  data () {
    return {
      fsThreshold: 15
    }
  },
  computed: {
    feedIndex () { return parseInt(this.$route.params.feed) },
    stopID () { return this.$route.query.stop }
  }
}
</script>

<style scoped>
</style>
