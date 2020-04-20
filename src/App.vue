<template>
  <div class="min-h-screen flex flex-col">
    <top-bar />
    <div class="flex-grow flex flex-row bg-gray-lighter text-white">
      <side-bar class="flex-shrink-0" />
      <div class="flex-grow">
        <router-view class="min-h-full" />
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
</style>
