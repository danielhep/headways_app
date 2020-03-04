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
          <td>
            <p>{{time.departure_time_readable}}</p>
          </td>
          <td class="whitespace-no-wrap px-2">
            <div class="flex flex-row p-0 h-full content-center">
              <p class="flex-grow" v-if="time.time_since_last.invalid">-</p>
              <p class="flex-grow" v-else>{{time.time_since_last.as('minutes').toFixed(1)}}</p>
              <div class="self-end inline">
                <font-awesome-icon
                  :class="{'opacity-0': !isFrequent(time.time_since_last)}"
                  class="ml-2 inline"
                  icon="check-square"
                />
              </div>
            </div>
          </td>
          <td @click="$emit('selectRoute', time.trip.route)">
            <p>{{time.trip.route.route_short_name}}</p>
          </td>
          <td class="w-full">
            <p>{{time.trip.trip_headsign}}</p>
          </td>
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
import * as d3 from 'd3'

export default {
  props: ['stopSchedule', 'fsThreshold', 'date'],
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

tbody tr td,
tbody tr {
  /* height: 1px !important; */
  height: 1.5rem;
}
</style>
