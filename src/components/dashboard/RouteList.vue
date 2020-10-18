<template>
  <div>
    <div class="border-b-2 border-gray-lighter text-xl p-2">
      Routes
    </div>
    <div
      v-for="agency in agencies"
      :key="agency.agency_name"
    >
      <div
        class="cursor-pointer flex py-2 pr-4 text-bold bg-gray-lighter border-t border-b border-accent-1 sticky top-0"
        @click="showAgency[agency.agency_id] = !showAgency[agency.agency_id]"
      >
        <font-awesome-icon
          class="mx-2"
          :icon="showAgency[agency.agency_id] ? 'chevron-down' : 'chevron-right'"
        />
        <div>
          {{ agency.agency_name }}
        </div>
      </div>
      <div
        v-for="route in agency.routes"
        v-show="showAgency[agency.agency_id]"
        :key="route._id"
        class="flex justify-start content-center cursor-pointer hover:text-accent-1 hover:bg-gray-lighter px-2 py-2"
      >
        <span class="bg-gray-400 h-2 w-2 m-2 rounded-full" />
        <div class="flex-grow font-medium px-2 flex items-center">
          {{ route.route_short_name }}
        </div>
        <div class="text-sm font-normal text-gray-300 tracking-wide flex items-center">
          {{ route.route_long_name ? route.route_long_name : route.route_desc }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['agencies'],
  data () {
    return {
      showAgency: {}
    }
  },
  watch: {
    agencies: {
      immediate: true,
      handler (agencies) {
        for (const agency of agencies) {
          this.$set(this.showAgency, agency.agency_id, false)
        }
      }
    }
  }
}
</script>

<style>

</style>
