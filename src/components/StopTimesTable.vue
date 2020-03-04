<template>
  <div class="w-full flex flex-row">
    <table class="w-full self-grow">
      <thead class="main-table-header">
        <tr>
          <th>Time</th>
          <th>Gap</th>
          <th>Route</th>
          <th>Headsign</th>
        </tr>
      </thead>
      <tbody>
        <tr
          :class="{'bg-gray-800': time.is_even_hour, 'bg-gray-850': !time.is_even_hour}"
          class="border-solid border-gray-700 border-b py-2"
          v-for="(time, i) in stopSchedule"
          :key="i"
          :ref="i"
          @click="selectRow(i)"
        >
          <td>{{time.departure_time_readable}}</td>
          <td class="whitespace-no-wrap flex flex-row">
            <span class="flex-grow text-center" v-if="time.time_since_last.invalid">-</span>
            <span class="flex-grow" v-else>{{time.time_since_last.as('minutes').toFixed(1)}}</span>
            <div class="self-right">
              <font-awesome-icon
                :class="{'opacity-0': !isFrequent(time.time_since_last)}"
                class="ml-2"
                icon="check-square"
              />
            </div>
          </td>
          <td>{{time.trip.route.route_short_name}}</td>
          <td class="w-full">{{time.trip.trip_headsign}}</td>
        </tr>
      </tbody>
    </table>
    <div>
      <div
        style="width: 30px"
        class="absolute bg-gray-900 h-16 flex-col flex justify-center border-b border-white"
      >
        <font-awesome-icon
          @click="clear()"
          class="m-auto cursor-pointer block"
          size="2x"
          icon="times"
        />
      </div>
      <svg style="stroke: white; width: 30px" id="i-bar" class="h-full" />
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { Duration } from 'luxon'
import * as d3 from 'd3'
export default {
  props: ['stopID', 'feedIndex', 'fsThreshold', 'date'],
  data: function () {
    return {
      startInd: null,
      endInd: null,
      selectEnd: false
    }
  },
  methods: {
    isFrequent (dur) {
      return dur.as('minutes') <= this.fsThreshold
    },
    clear () {
      this.startInd = null
      this.endInd = null
      this.$emit('selectedItems', [])
      this.redraw()
    },
    redraw () {
      // filter out blank ones (because endInd is null to start)
      let data = [this.startInd, this.endInd].filter(d => d !== null)
      // get the ref for each indici
      data = data.map((d) => this.$refs[d][0])
      d3
        .select('#i-bar')
        .selectAll('line.mark')
        .data(data)
        .join('line')
        .attr('class', 'mark')
        .attr('x1', 5)
        .attr('y1', (d) => (d.offsetTop + (d.getBoundingClientRect().height / 2)))
        .attr('x2', 25)
        .attr('y2', (d) => d.offsetTop + (d.getBoundingClientRect().height / 2))

      if (data.length === 2) {
        d3.select('#i-bar')
          .selectAll('line#connector')
          .data([{ start: data[0], end: data[1] }])
          .join('line')
          .attr('id', 'connector')
          .attr('x1', 15)
          .attr('y1', (d) => (d.start.offsetTop + (d.start.getBoundingClientRect().height / 2)))
          .attr('x2', 15)
          .attr('y2', (d) => d.end.offsetTop + (d.end.getBoundingClientRect().height / 2))
      } else if (data.length <= 1) {
        d3.select('#i-bar')
          .selectAll('line#connector')
          .remove()
      }
    },
    selectRow (i) {
      // if no end point has been selected
      if (!this.selectEnd) {
        this.startInd = i
        this.endInd = null
      } else if (i < this.startInd) { // we are selecting end point, but end point < start point
        this.endInd = this.startInd
        this.startInd = i
        const items = this.stopSchedule.slice(this.startInd, this.endInd + 1)
        this.$emit('selectedItems', items)
      } else {
        this.endInd = i
        const items = this.stopSchedule.slice(this.startInd, this.endInd + 1)
        this.$emit('selectedItems', items)
      }
      this.selectEnd = !this.selectEnd
      this.redraw()
    }
  },
  apollo: {
    stopSchedule: {
      query: gql`query stopInfo($stopID: ID, $feedIndex: Int, $date: Date!) {
        feed(feed_index: $feedIndex) {
          stop(stop_id: $stopID) {
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
        return data.feed.stop.stop_times.map((time) => {
          // convert the dep time ISO string to an object
          time.departure_time = Duration.fromISO(time.departure_time)
          time.time_since_last = Duration.fromISO(time.time_since_last)
          return time
        })
      },
      variables () {
        return {
          feedIndex: this.feedIndex,
          stopID: this.stopID,
          date: this.date.toISODate()
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
  @apply items-center justify-between overflow-y-scroll w-full;
  height: 50vh;
}

thead.main-table-header > tr > th {
  @apply p-3 text-left text-lg bg-gray-900;
}

thead.main-table-header > tr {
  @apply border-b h-16 border-white;
}

td {
  @apply pl-3;
}
</style>
