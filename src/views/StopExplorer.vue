<template>
  <div class="flex flex-row items-start">
    <div class="flex-grow">
      <stop-times-table :stopID="stopID" :fsThreshold="fsThreshold" :feedIndex="feedIndex" />
    </div>
    <div style="min-width: 30%" class="px-3 pt-2 sticky top-0">
      Threshold for frequent service:
      <input
        v-autowidth="{maxWidth: '960px', minWidth: '20px', comfortZone: 0}"
        class="small-input"
        v-model="fsThreshold"
        type="number"
      /> minutes.
      <vue-slider
        class="mt-1"
        tooltip="none"
        :max="120"
        :min="1"
        :contained="true"
        v-model="fsThreshold"
      ></vue-slider>
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
