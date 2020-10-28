<template>
  <nav
    class="flex items-center justify-between flex-wrap bg-gray-dark border-b-2 border-accent-1 h-16"
  >
    <div class="flex items-center flex-shrink-0 mr-6 m-3">
      <svg
        class="fill-current h-8 w-8 mr-2"
        width="54"
        height="54"
        viewBox="0 0 54 54"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"
        />
      </svg>
      <span class="font-semibold italic text-3xl tracking-tight">Headways</span>
    </div>
    <div
      v-if="$route.params.feed"
      class="flex-grow flex h-full"
    >
      <router-link
        :to="{name: 'Dashboard' }"
        class="nav-button"
        active-class="active"
      >
        <div>
          <font-awesome-icon
            class="mx-2"
            icon="columns"
          />
          Dashboard
        </div>
      </router-link>
      <router-link
        :to="{name: 'Map' }"
        class="nav-button"
        active-class="active"
      >
        <div>
          <font-awesome-icon
            class="mx-2"
            icon="map"
          />
          Map
        </div>
      </router-link>
    </div>
    <router-link
      v-if="feed && $route.params.feed"
      class="p-4 text-white font-bold"
      :to="{name: 'Select Feed'}"
    >
      <font-awesome-icon
        class="mx-3 cursor-pointer"
        size="lg"
        icon="times"
      />
      {{ feed.feed_publisher_name }}
      <small
        class="font-normal px-2 text-gray-400"
      >{{ feed.feed_location_friendly }}</small>
    </router-link>
    <filters-dialog />
  </nav>
</template>
<script>
import gql from 'graphql-tag'
import FiltersDialog from '@/components/FiltersDialog.vue'

export default {
  components: { FiltersDialog },
  data: function () {
    return {

    }
  },
  computed: {
  },
  methods: {
  },
  apollo: {
    feed: {
      query: gql`
        query feed($feedIndex: Int!) {
          feed(feed_index: $feedIndex) {
            feed_publisher_name
            feed_location_friendly
          }
        }
      `,
      variables () {
        return {
          feedIndex: parseInt(this.$route.params.feed)
        }
      },
      skip () { return !this.$route.params.feed }
    }
  }
}
</script>

<style scoped>
.nav-button {
  @apply px-3 border-b-2 cursor-pointer border-transparent flex flex-col justify-center font-bold;
}

.nav-button:hover,
.nav-button.active {
  @apply border-accent-1;
}
</style>
