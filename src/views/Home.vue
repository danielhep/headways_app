<template>
  <div class="flex flex-col h-full justify-center items-center">
    <div class="text-center text-textclr bold ">Please select an agency below.</div>
    <div class="flex flex-col bg-gray-lighter rounded border-accent-1 border mt-3 cursor-pointer">
      <div class="border-b w-full p-3 last:border-b-0" v-for="feed in feeds" :key="feed.feed_publisher_name">
        {{feed.feed_publisher_name}}
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'home',
  apollo: {
    feeds: {
      query: gql`query feeds {
          feeds {
            feed_publisher_name
          }
        }
      `
    }
  }
}
</script>
