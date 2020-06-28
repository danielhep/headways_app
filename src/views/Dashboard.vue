<template>
  <div>
    <div class="flex flex-row">
      <div
        v-if="!$apollo.loading"
        class="flex flex-col border-r border-accent-1"
      >
        <div class="border-b-2 border-gray-lighter text-xl p-2">
          Routes
        </div>
        <div
          v-for="route in feed.routes"
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
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  data: function () {
    return {
      loading: false
    }
  },
  apollo: {
    feed: {
      query: gql`
        query($feedIndex: Int!) {
          feed(feed_index: $feedIndex) {
            routes {
              route_long_name
              route_short_name
              route_desc
              _id
            }
          }
        }
      `,
      variables () {
        return {
          feedIndex: parseInt(this.$route.params.feed)
        }
      }
    }
  }
}
</script>
