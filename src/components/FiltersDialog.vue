<template>
  <div>
    <a @click="show = !show">Hello</a>
    <div
      v-if="show"
      class="z-40 fixed w-full py-24 h-full top-0 left-0 flex items-center justify-center"
    >
      <div class="absolute w-full h-full bg-gray-900 opacity-50" />

      <div class="z-50 p-5 bg-white text-black w-11/12 h-full my-24 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div class="modal-content py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-6">
            <p class="text-2xl font-bold">
              Filters
            </p>
            <div
              class="modal-close cursor-pointer z-50"
              @click="show= false"
            >
              <svg
                class="fill-current text-black"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
              </svg>
            </div>
          </div>
          Excluded agencies:
          <v-select
            v-if="feed"
            :value="$store.state.options.excludeAgencies"
            class="pt-4"
            multiple
            label="agency_name"
            :options="feed.agencies"
            :reduce="agency => agency.agency_id"
            @input="val => $store.commit('setExcludeAgencies', val)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import vSelect from 'vue-select'
export default {
  components: { vSelect },
  data () {
    return {
      show: false
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

<style>

</style>
