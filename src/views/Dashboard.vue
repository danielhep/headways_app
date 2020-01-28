<template>
  <div>
    <div class="flex flex-row p-5">
      <info-card class="flex-grow mx-3" title="Number of Routes" icon="route">3213</info-card>
      <info-card class="flex-grow mx-3" title="Number of Stops" icon="map-marker">1231</info-card>
      <info-card class="flex-grow mx-3" title="Service Hours Per Day" icon="clock">n/a</info-card>
    </div>
  </div>
</template>

<script>
import InfoCard from '@/components/InfoCard.vue'

export default {
  components: { InfoCard }
}
</script>
