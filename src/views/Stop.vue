<template>
  <vue-element-loading
    v-if="$apollo.loading"
    background-color="rgba(0, 0, 0, .6)"
    :active="$apollo.loading"
    color="white"
    spinner="bar-fade-scale"
  />
  <div
    v-else
    class="w-full flex"
  >
    <div class="w-1/3 px-3 pt-2 ">
      <div class="sticky top-0">
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
        <div class="mt-2">
          <v-select
            v-model="selectedRoutes"
            multiple
            label="route_short_name"
            :options="feed.stop.routes"
          />
        </div>
        <div class="w-full mt-2">
        <!-- <div
      v-if="stats.loaded"
      class="border-t-2 mt-4 pt-4 border-white"
    >
      <h2 class="font-display text-2xl">
        Stats for selection:
      </h2>
      <p>Average gap: {{ stats.avgGap }} minutes.</p>
      <p>Total runs: {{ stats.totRuns }} runs.</p>
    </div> -->
        </div>
      </div>
    </div>
    <div class="flex-grow">
      <stop-times-table
        :columns="fields"
        :rows="feed.stop.stop_times"
        :fs-threshold="fsThreshold"
      />
    </div>
  </div>
</template>

<script>
import { DateTime, Duration } from 'luxon'
import vSelect from 'vue-select'
import gql from 'graphql-tag'
import StopTimesTable from '@/components/StopTimesTable.vue'
const durationToCheck = (threshold) => (row) => {
  // const mins = Duration.fromISO(row.time_since_last).as('minutes')

}

export default {
  components: { vSelect, StopTimesTable },
  data () {
    return {
      selectedDate: new Date(),
      fsThreshold: 15,
      selectedRoutes: [],
      fields: [
        {
          field: 'trip.route.route_short_name',
          label: 'Route'
        },
        {
          field: 'departure_time',
          label: 'Departure Time',
          formatFn: x => Duration.fromISO(x).toFormat('hh:mm'),
          sortFn: (x, y) => (Duration.fromISO(x).as('seconds') > Duration.fromISO(y).as('seconds')) ? -1 : 1
        },
        {
          field: 'trip.trip_headsign',
          label: 'Headsign'
        },
        {
          field: durationToCheck(this.fsThreshold),
          label: 'Frequent'
        }
      ]
    }
  },
  computed: {
    luxonSelectedDate () { return DateTime.fromJSDate(this.selectedDate) }
  },
  deactivated () {
    this.$destroy()
  },
  apollo: {
    feed: {
      query: gql`query stopData($stopID: ID!, $feedIndex: Int, $date: Date!, $routes: [ID]) {
        feed(feed_index: $feedIndex) {
          stop(stop_id: $stopID) {
            routes(date: $date) {
              route_short_name
              route_id
            }
            stop_times(date: $date, routes: $routes) {
              departure_time
              time_since_last
              stop_headsign
              trip {
                trip_headsign
                route {
                  route_short_name
                }
              }
            }
          }
        }
      }`,
      variables () {
        return {
          feedIndex: parseInt(this.$route.params.feed),
          stopID: this.$route.query.stop,
          date: this.luxonSelectedDate.toISODate(),
          routes: this.selectedRoutes.length ? this.selectedRoutes.map(x => x.route_id) : null
        }
      }
    }
  }
}
</script>

<style>

</style>
