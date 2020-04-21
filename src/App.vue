<template>
  <div class="min-h-screen flex flex-col">
    <top-bar />
    <div class="flex-grow flex flex-row bg-gray-lighter text-white">
      <div class="flex-grow">
        <router-view class="min-h-full" />
      </div>
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar.vue'

export default {
  components: { TopBar }
}
</script>

<style>
</style>
