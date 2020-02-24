<template>
  <table class="w-full">
    <thead>
      <tr>
        <th>Time</th>
        <th>Route</th>
        <th>Headsign</th>
        <th>Gap</th>
      </tr>
    </thead>
    <tbody>
      <tr
        :class="{'bg-gray-900': time.is_even_hour}"
        v-for="time in stopSchedule"
        :key="time.trip.trip_id"
      >
        <td>{{time.departure_time_readable}}</td>
        <td class="whitespace-no-wrap">
          {{time.time_since_last_readable}}
          <font-awesome-icon
            :class="{'opacity-0': !isFrequent(time.time_since_last)}"
            icon="check-square"
          />
        </td>
        <td>{{time.trip.route.route_short_name}}</td>
        <td class="w-full">{{time.trip.trip_headsign}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import gql from 'graphql-tag'
import { Duration } from 'luxon'

export default {
  props: ['stopID', 'feedIndex', 'fsThreshold'],
  data: function () {
    return {
    }
  },
  methods: {
    isFrequent (durationStr) {
      const dur = Duration.fromISO(durationStr)
      return dur.as('minutes') < this.fsThreshold
    }
  },
  apollo: {
    stopSchedule: {
      query: gql`query stopInfo($stopID: ID, $feedIndex: Int) {
        feed(feed_index: $feedIndex) {
          stop(stop_id: $stopID) {
            stop_times(date: "2020-01-31") {
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
      update: data => data.feed.stop.stop_times,
      variables () {
        return {
          feedIndex: this.feedIndex,
          stopID: this.stopID
        }
      },
      skip () {
        return !this
      }
    }
  }
}
</script>

<style  lang="postcss">
tbody {
  @apply bg-gray-800 items-center justify-between overflow-y-scroll w-full;
  height: 50vh;
}

thead > tr > th {
  @apply p-3 text-left text-lg bg-purple-900 border-b;
}

/* th:first-of-type {
  @apply rounded-tl;
}

th:last-of-type {
  @apply rounded-tr;
} */

td {
  @apply pl-3;
}
</style>
