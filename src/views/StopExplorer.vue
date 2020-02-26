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
      <div v-if="stats.loaded">
        <h2 class="font-display text-2xl">Stats for selection:</h2>
        <p>Average gap: {{stats.avgGap}}</p>
        <p>Total runs: {{stats.totRuns}}</p>
      </div>
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
        totRuns: null,
        avgGap: null,
        loaded: false
      }
    }
  },
  methods: {
    selectedItems (items) {
      if (items.length === 0) { this.stats.loaded = false } else { this.stats.loaded = true }
      // compute average gap
      const gapSum = items
        .filter(entry => !entry.time_since_last.invalid)
        .reduce((acc, entry) => { return acc + entry.time_since_last.as('minutes') }, 0)
      this.stats.avgGap = (gapSum / items.length).toFixed(1)

      this.stats.totRuns = items.length
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
