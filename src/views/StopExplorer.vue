<template>
  <div class="flex flex-row items-start">
    <div class="flex-grow">
      <stop-times-table
        @selectedItems="selectedItems"
        :stopID="stopID"
        :fsThreshold="fsThreshold"
        :feedIndex="feedIndex"
      />
    </div>
    <div style="min-width: 30%" class="px-3 pt-2 sticky top-0">
      Threshold for frequent service:
      <input
        v-autowidth="{maxWidth: '960px', minWidth: '10px', comfortZone: 0}"
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
      <h2>Stats for selection:</h2>
      <p>Average gap: {{stats.avgGap}}</p>
    </div>
  </div>
</template>

<script>
import StopTimesTable from '@/components/StopTimesTable.vue'
export default {
  components: { StopTimesTable },
  data () {
    return {
      fsThreshold: 15,
      stats: {
        avgGap: null
      }
    }
  },
  methods: {
    selectedItems (items) {
      // compute average gap
      const gapSum = items
        .filter(entry => !entry.time_since_last.invalid)
        .reduce((acc, entry) => { return acc + entry.time_since_last.as('minutes') }, 0)
      this.stats.avgGap = (gapSum / items.length).toFixed(1)
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
