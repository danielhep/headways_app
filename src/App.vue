<template>
  <div class="min-h-screen flex flex-col">
    <top-bar />
    <router-view class="flex-grow" />
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
