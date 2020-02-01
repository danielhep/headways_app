<template>
  <div>
    <vuetable :fields="fields" :api-mode="false" :data="stopSchedule" />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Vuetable from 'vuetable-2'

export default {
  components: { Vuetable },
  data: function () {
    return {
      fields: [
        {
          name: 'departure_time',
          title: 'Time'
        },
        {
          name: 'trip.route.route_short_name',
          title: 'Route'
        },
        {
          name: 'trip.trip_headsign',
          title: 'Headsign'
        }
      ]

    }
  },
  apollo: {
    stopSchedule: {
      query: gql`query stopInfo($stopID: ID, $feedIndex: Int) {
        feed(feed_index: $feedIndex) {
          stop(stop_id: $stopID) {
            stop_times(date: "2020-01-31") {
              departure_time
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
      update: data => data.feed.stop.stop_times,
      variables () {
        return {
          feedIndex: parseInt(this.$route.params.feed),
          stopID: this.$route.query.stop
        }
      },
      skip () {
        return !this.$route.query.stop
      }
    }
  }
}
</script>
