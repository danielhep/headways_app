<template>
  <div class="bg-gray-dark flex flex-col justify-center items-center ">
    <div class="text-center text-textclr bold">
      Please select an agency below.
    </div>
    <div class="flex flex-col bg-gray-lighter rounded border-accent-1 border mt-3 pointer sm:max-w-md">
      <router-link
        v-for="feed in feeds"
        :key="feed.feed_publisher_name"
        class="border-b w-full p-3 last:border-b-0 cursor-pointer"
        tag="div"
        :to="{name: 'Dashboard', params: {feed: feed.feed_index}}"
      >
        {{ feed.feed_publisher_name }}
      </router-link>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'Home',
  apollo: {
    feeds: {
      query: gql`
        query feeds {
          feeds {
            feed_publisher_name
            feed_index
          }
        }
      `
    }
  }
}
</script>
