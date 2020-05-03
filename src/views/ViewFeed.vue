<template>
  <div class="flex-grow flex flex-row bg-gray-dark text-white">
    <div class="flex-grow">
      <keep-alive>
        <router-view class="min-h-full" />
      </keep-alive>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
