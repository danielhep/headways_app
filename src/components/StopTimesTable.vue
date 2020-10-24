<template>
  <table class="w-full">
    <thead>
      <tr>
        <th
          v-for="column in columns"
          :key="column.name"
          class="py-3 text-left pl-1 border border-gray-700"
        >
          {{ column.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(row, i) in rows"
        :key="i"
      >
        <td class=" table-cell">
          {{ row.trip.route.route_short_name }}
        </td>
        <td class=" table-cell">
          {{ durationToTime(row.departure_time) }} <span
            v-if="row.time_since_last"
            class="text-gray-400 text-sm ml-1"
          > {{ durationToMin(row.time_since_last).toFixed(1) }} minutes </span>
        </td>
        <!-- TODO: Add next service day indicator if over 24 hours -->
        <td class=" table-cell">
          {{ row.trip.trip_headsign }}
        </td>
        <td class=" table-cell">
          <font-awesome-icon
            v-if="row.time_since_last"
            :icon="durationToMin(row.time_since_last) <= fsThreshold ? 'check-circle' : 'times'"
            :class="durationToMin(row.time_since_last) <= fsThreshold ? 'text-green-400' : ''"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { Duration } from 'luxon'
export default {
  props: ['columns', 'rows', 'fsThreshold'],
  methods: {
    durationToTime: (dur) => Duration.fromISO(dur).toFormat('hh:mm'),
    durationToMin: (dur) => Duration.fromISO(dur).as('minutes'),
    freqIconFromDur (dur) {
      if (dur <= this.fsThreshold) {
        return 'check-circle'
      } else {
        return 'times'
      }
    }
  }
}
</script>

<style scoped>
.table-cell {
    @apply border py-2 pl-1 border-gray-700;
}
</style>
