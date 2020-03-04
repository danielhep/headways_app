<template>
  <div class="flex flex-row items-start">
    <div class="flex-grow border-r-2 border-purple-800">
      <stop-times-table
        @selectedItems="selectedItems"
        :stopID="stopID"
        :fsThreshold="fsThreshold"
        :feedIndex="feedIndex"
      />
    </div>
    <div style="min-width: 30%" class="px-3 pt-2 sticky top-0">
      <div>
        Selected date:
        <v-date-picker v-model="selectedDate" is-dark>
          <p class="inline-block small-input pl-1">{{selectedDate.toDateString()}}</p>
        </v-date-picker>
      </div>
      <div class="mt-2">
        <span>Threshold for frequent service:</span>
        <input
          v-autowidth="{maxWidth: '960px', minWidth: '10px', comfortZone: 0}"
          class="small-input pl-1"
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
      <div v-if="stats.loaded" class="border-t-2 mt-4 pt-4 border-white">
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
      selectedDate: new Date(),
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
