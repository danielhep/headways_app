<template>
  <div class="min-h-screen flex flex-col">
    <top-bar />
    <div class="flex-grow flex flex-row bg-gray-900 text-white">
      <side-bar class="flex-shrink-0" />
      <div class="flex-grow">
        <router-view class="border-purple-700 border-t-4 min-h-full" />
      </div>
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar.vue'
import SideBar from '@/components/SideBar.vue'

export default {
  components: { TopBar, SideBar }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=PT+Sans&display=swap");
</style>
