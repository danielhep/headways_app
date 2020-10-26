<template>
  <div>
    <div class="flex flex-row">
      <route-list
        v-if="!$apollo.loading"
        class="flex flex-col border-r border-accent-1"
        :agencies="feed.agencies"
      />
      <div class="flex flex-col w-full">
        <trips-by-route
          v-if="feed"
          :agencies="feed.agencies"
          style="height:300px"
        />
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import RouteList from '@/components/dashboard/RouteList.vue'
import TripsByRoute from '@/components/dashboard/TripsByRoute.vue'

export default {
  components: { RouteList, TripsByRoute },
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
            agencies {
              agency_name
              agency_id
              routes {
                trips_count
                route_long_name
                route_short_name
                route_desc
                _id
              }
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
