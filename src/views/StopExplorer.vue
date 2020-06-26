<template>
  <div
    v-if="stopID"
    class="flex flex-row items-start"
  >
    <div class="flex-grow border-r-2 border-purple-800">
      <stop-times-table
        v-if="stopData"
        :stop-schedule="stopData.stopSchedule"
        :fs-threshold="fsThreshold"
        :date="luxonSelectedDate"
        @selectedItems="selectedItems"
        @selectRoute="(route) => routes=[route]"
      />
    </div>
    <div class="w-1/3 px-3 pt-2 sticky top-0">
      <div>
        Selected date:
        <v-date-picker
          v-model="selectedDate"
          is-dark
        >
          <p class="inline-block small-input pl-1">
            {{ selectedDate.toDateString() }}
          </p>
        </v-date-picker>
      </div>
      <div class="mt-2">
        <span>Threshold for frequent service:</span>
        <input
          v-model="fsThreshold"
          v-autowidth="{maxWidth: '960px', minWidth: '10px', comfortZone: 0}"
          class="small-input pl-1"
          type="number"
        > minutes.
        <vue-slider
          v-model="fsThreshold"
          class="mt-1"
          tooltip="none"
          :max="120"
          :min="1"
          :contained="true"
        />
      </div>
      <!-- <div class="w-full mt-2" /> -->
      <div
        v-if="stats.loaded"
        class="border-t-2 mt-4 pt-4 border-white"
      >
        <h2 class="font-display text-2xl">
          Stats for selection:
        </h2>
        <p>Average gap: {{ stats.avgGap }} minutes.</p>
        <p>Total runs: {{ stats.totRuns }} runs.</p>
      </div>
    </div>
  </div>
  <div
    v-else
    class="text-center"
  >
    <p class="mt-4">
      Please select a stop on the Map or enter a stop ID below and press enter.
    </p>
    <input
      v-model="stopIDInput"
      class="mt-4 bg-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block m-auto appearance-none leading-normal"
      placeholder="Stop ID"
      @keyup.enter="updateQuery"
    >
  </div>
</template>

<script>
import StopTimesTable from '@/components/StopTimesTable.vue'
import { DateTime, Duration } from 'luxon'

import gql from 'graphql-tag'

export default {
  components: { StopTimesTable },
  data () {
    return {
      fsThreshold: 15,
      selectedDate: new Date(),
      routes: [],
      stopIDInput: '',
      stats: {
        totRuns: null,
        avgGap: null,
        loaded: false
      }
    }
  },
  computed: {
    feedIndex () { return parseInt(this.$route.params.feed) },
    stopID () { return this.$route.query.stop },
    luxonSelectedDate () { return DateTime.fromJSDate(this.selectedDate) },
    selectedRouteIds () { return this.routes.map(val => val.route_id) }
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
    },
    updateQuery () {
      this.$router.replace({
        query: {
          ...this.$router.query,
          stop: this.stopIDInput
        }
      })
    }
  },
  apollo: {
    stopData: {
      query: gql`query stopData($stopID: ID!, $feedIndex: Int, $date: Date!, $routes: [ID]) {
        feed(feed_index: $feedIndex) {
          stop(stop_id: $stopID) {
            stop_code
            stop_name
            loc {
              lat
              long
            }
            routes(date: $date) {
              route_short_name
              route_id
            }
            stop_times(date: $date, routes: $routes) {
              departure_time
              is_even_hour
              time_since_last_readable
              time_since_last
              stop_headsign
              trip {
                trip_id
                trip_headsign
                route {
                  route_short_name
                  route_id
                }
              }
            }
          }
        }
      }`,
      update (data) {
        const output = {
          stopSchedule: [],
          stopInfo: {}
        }

        output.stopSchedule = data.feed.stop.stop_times.map((time) => {
          // convert the dep time ISO string to an object
          time.departure_time = Duration.fromISO(time.departure_time)
          time.time_since_last = Duration.fromISO(time.time_since_last)
          return time
        })

        output.stopInfo = data.feed.stop

        return output
      },
      variables () {
        return {
          feedIndex: this.feedIndex,
          stopID: this.stopID,
          date: this.luxonSelectedDate.toISODate(),
          routes: this.selectedRouteIds
        }
      },
      skip () {
        return !this || !this.stopID
      }
    }
  },
  watch: {
    stopData (newData) {
      if (this.routes.length === 0) {
        this.routes = newData.stopInfo.routes
      }
    }
  }
}
</script>
