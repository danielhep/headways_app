<template>
  <div>
    <div class="flex flex-row">
      <route-list
        v-if="!$apollo.loading"
        class="flex flex-col border-r border-accent-1"
        :agencies="feed.agencies"
      />
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import RouteList from '@/components/dashboard/RouteList.vue'

export default {
  components: { RouteList },
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
