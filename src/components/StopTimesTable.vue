<template>
  <div class="w-full flex flex-row">
    <vue-element-loading
      background-color="rgba(0, 0, 0, .6)"
      :active="!stopSchedule.length"
      color="white"
      spinner="bar-fade-scale"
    />
    <table class="w-full self-grow">
      <thead class="main-table-header">
        <tr>
          <th class="p-0">
            <div
              class="px-4 text-left text-lg bg-purple-900 h-16 border-b border-white flex flex-col justify-center"
            >
              <p>Time</p>
            </div>
          </th>
          <th class="p-0">
            <div
              class="px-4 text-left text-lg bg-purple-900 h-16 border-b border-white flex flex-col justify-center"
            >
              <p>Gap</p>
            </div>
          </th>
          <th class="p-0">
            <div
              class="px-4 text-left text-lg bg-purple-900 h-16 border-b border-white flex flex-col justify-center"
            >
              <p>Route</p>
            </div>
          </th>
          <th class="p-0">
            <div
              class="px-4 text-left text-lg bg-purple-900 h-16 border-b border-white flex flex-col justify-center"
            >
              <p>Headsign</p>
            </div>
          </th>
          <th class="p-0">
            <div
              class="text-left text-lg bg-purple-900 h-16 border-b border-white flex flex-col justify-center"
            >
              <p>
                <font-awesome-icon
                  v-if="startInd || endInd"
                  @click="clear()"
                  class="m-auto cursor-pointer block p-1"
                  size="2x"
                  icon="times"
                  fixed-width
                />
                <font-awesome-icon
                  v-else
                  @click="selectAll()"
                  class="m-auto cursor-pointer block p-1"
                  size="2x"
                  icon="check-double"
                  fixed-width
                />
              </p>
            </div>
          </th>
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
          <td class="px-4">
            <div>
              <p>{{time.departure_time_readable}}</p>
            </div>
          </td>
          <td class="px-3 whitespace-no-wrap px-2">
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
          <td class="px-3" @click="$emit('selectRoute', time.trip.route)">
            <div>
              <p>{{time.trip.route.route_short_name}}</p>
            </div>
          </td>
          <td class="px-3 w-full">
            <p>{{time.trip.trip_headsign}}</p>
          </td>
          <td class="relative">
            <div
              class="absolute h-full top-0"
              v-if="i === 0"
              style="left: 50%; margin-left: -15px;"
            >
              <svg style="stroke: white; width: 30px" id="i-bar" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
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
    selectAll () {
      this.startInd = 0
      this.endInd = this.stopSchedule.length - 1
      this.$emit('selectedItems', this.selectedItems)
      this.redraw()
    },
    redraw () {
      // Set height of SVG to height of table
      const tableHeight = d3.select('tbody').node()
        .getBoundingClientRect().height
      d3.select('#i-bar')
        .style('height', `${tableHeight}px`)

      // filter out blank ones (because endInd is null to start)
      const data = [this.startInd, this.endInd].filter(d => d !== null)
      // get the ref for each indici
      const dataRefs = data.map((d) => this.$refs[d][0])

      const headerHeight = d3.select('thead').node().getBoundingClientRect().height
      // generate horizontal bars
      d3
        .select('#i-bar')
        .selectAll('line.mark')
        .data(dataRefs)
        .join('line')
        .attr('class', 'mark')
        .attr('x1', 5)
        .attr('y1', (d) => d.offsetTop + (d.getBoundingClientRect().height / 2) - headerHeight)
        .attr('x2', 25)
        .attr('y2', (d) => d.offsetTop + (d.getBoundingClientRect().height / 2) - headerHeight)
      if (dataRefs.length === 2) {
        d3.select('#i-bar')
          .selectAll('line#connector')
          .data([{ start: dataRefs[0], end: dataRefs[1] }])
          .join('line')
          .attr('id', 'connector')
          .attr('x1', 15)
          .attr('y1', (d) => d.start.offsetTop + (d.start.getBoundingClientRect().height / 2) - headerHeight)
          .attr('x2', 15)
          .attr('y2', (d) => d.end.offsetTop + (d.end.getBoundingClientRect().height / 2) - headerHeight)
      } else if (dataRefs.length <= 1) {
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
        this.$emit('selectedItems', this.selectedItems)
      } else {
        this.endInd = i
        this.$emit('selectedItems', this.selectedItems)
      }
      this.selectEnd = !this.selectEnd
      this.redraw()
    }
  },
  computed: {
    selectedItems () {
      return this.stopSchedule.slice(this.startInd, this.endInd + 1)
    }
  }
}
</script>

<style  lang="postcss">
tbody {
  @apply items-center justify-between overflow-y-scroll w-full;
  height: 50vh;
}

tbody tr td,
tbody tr {
  /* height: 1px !important; */
  height: 1.5rem;
}
</style>
