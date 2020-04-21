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
    <div class="flex-grow flex h-full">
      <router-link
        :to="{name: view.name, params: {feed: currentFeed.feed_index}}"
        v-for="view in views"
        v-bind:key="view.id"
        class="nav-button"
        active-class="active"
      >
        <div>
          <font-awesome-icon class="mx-2" :icon="view.icon" />
          {{view.name}}
        </div>
      </router-link>
    </div>
    <div v-if="currentFeed" class="p-4 text-white font-bold">
      <font-awesome-icon v-on:click="clearFeed" class="mx-3 cursor-pointer" size="lg" icon="times" />
      {{currentFeed.feed_publisher_name}}
      <small
        class="font-normal px-2 text-gray-400"
      >{{currentFeed.feed_location_friendly}}</small>
    </div>
    <div class="block lg:hidden">
      <button
        class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
      >
        <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </button>
    </div>
  </nav>
</template>
<style scoped>
.nav-button {
  @apply px-3 border-b-2 cursor-pointer border-transparent flex flex-col justify-center font-bold;
}

.nav-button:hover,
.nav-button.active {
  @apply border-accent-1;
}
</style>
<script>
import { mapState } from 'vuex'
import { routes } from '@/router'

export default {
  data: function () {
    return {

    }
  },
  computed: {
    ...mapState(['currentFeed']),
    views: () => {
      return routes.filter((e) => {
        return e.showInSidebar
      })
    }
  },
  methods: {
    clearFeed: function () {
      this.$store.commit('clearFeed')
    }
  }
}
</script>
