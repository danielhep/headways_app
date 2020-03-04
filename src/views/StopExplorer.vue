<template>
  <div class="flex flex-row items-start">
    <div class="flex-grow border-r-2 border-purple-800">
      <stop-times-table
        v-if="stopData"
        @selectedItems="selectedItems"
        :stopSchedule="stopData.stopSchedule"
        :fsThreshold="fsThreshold"
        :date="luxonSelectedDate"
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
      <div>
        <!-- <multiselect
          v-model="value"
          :options="options"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="true"
          placeholder="Pick some"
          label="name"
          track-by="name"
          :preselect-first="true"
        >
          <template slot="selection" slot-scope="{ values, search, isOpen }">
            <span
              class="multiselect__single"
              v-if="values.length &amp;&amp; !isOpen"
            >{{ values.length }} options selected</span>
          </template>
        </multiselect>-->
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
import { DateTime, Duration } from 'luxon'

// import Multiselect from 'vue-multiselect'
import gql from 'graphql-tag'

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
    stopID () { return this.$route.query.stop },
    luxonSelectedDate () { return DateTime.fromJSDate(this.selectedDate) }
  },
  apollo: {
    stopData: {
      query: gql`query stopData($stopID: ID, $feedIndex: Int, $date: Date!) {
        feed(feed_index: $feedIndex) {
          stop(stop_id: $stopID) {
            stop_code
            stop_name
            loc {
              lat
              long
            }
            routes {
              route_short_name
              route_id
            }
            stop_times(date: $date) {
              departure_time
              departure_time_readable
              is_even_hour
              time_since_last_readable
              time_since_last
              stop_headsign
              trip {
                trip_id
                trip_headsign
                route {
                  route_short_name
                }
              }
            }
          }
        }
      }`,
      update: data => {
        const stopSchedule = data.feed.stop.stop_times.map((time) => {
          // convert the dep time ISO string to an object
          time.departure_time = Duration.fromISO(time.departure_time)
          time.time_since_last = Duration.fromISO(time.time_since_last)
          return time
        })

        const stopInfo = data.feed.stop

        return { stopSchedule, stopInfo }
      },
      variables () {
        return {
          feedIndex: this.feedIndex,
          stopID: this.stopID,
          date: this.luxonSelectedDate.toISODate()
        }
      },
      skip () {
        return !this
      }
    }
  }
}
</script>

<style scoped>
</style>
