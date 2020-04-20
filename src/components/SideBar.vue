<template>
  <div
    class="bg-gray-dark border-solid border-accent-1 border-r-2 min-h-full"
    v-bind:class="{'w-1/3': selectFeedMode, 'w-48': !selectFeedMode}"
    style="transition: width .5s ease"
  >
    <ul v-if="selectFeedMode" class="list-reset min-h-full">
      <li class="text-white bg-purple-700 p-4">
        <p class="text-xl text-center pb-4">Please select a GTFS feed.</p>
        <input
          class="bg-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block m-auto appearance-none leading-normal"
          placeholder="Search"
        />
      </li>
      <li v-for="feed in feeds" v-bind:key="feed.feed_index">
        <a
          class="block p-4 text-white font-bold border-gray-800 hover:border-purple-700 hover:bg-gray-900 border-r-4"
          v-on:click="selectFeed(feed)"
        >
          {{feed.feed_publisher_name}}
          <small
            class="font-normal px-2 text-gray-400"
          >{{feed.feed_location_friendly}}</small>
        </a>
      </li>
    </ul>
    <ul v-else class="list-reset">
      <li v-for="view in views" v-bind:key="view.id">
        <router-link
          active-class="border-accent-1"
          :to="{name: view.name, params: {feed: currentFeed.feed_index}}"
          class="block p-4 text-white font-bold border-transparent hover:border-accent-1 hover:bg-gray-900 border-r-8 outline-none"
        >
          <font-awesome-icon class="mx-2" :icon="view.icon" />
          {{view.name}}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { routes } from '@/router'

export default {
  data: function () {
    return {
    }
  },
  computed: { ...mapState(['feeds', 'currentFeed']),
    views: () => {
      return routes.filter((e) => {
        return e.showInSidebar
      })
    },
    selectFeedMode: function () {
      return !this.$store.state.currentFeed
    }
  },
  methods: {
    selectFeed: function (feed) {
      this.$store.commit('setFeed', feed)
      this.$router.push({ name: 'Dashboard', params: { feed: feed.feed_index } })
    }
  },
  created: function () {
    this.$store.dispatch('getFeeds')
  }
}
</script>
