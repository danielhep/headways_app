 <template>
  <!--Metric Card-->
  <div class="bg-purple-900 border-b-4 border-purple-300 rounded-lg shadow-lg p-5">
    <div class="flex flex-row items-center">
      <div class="flex-shrink">
        <font-awesome-icon class="text-white" :icon="icon" size="2x" />
      </div>
      <div class="flex-1 text-right md:text-center">
        <h5 class="uppercase text-grey-900">{{title}}</h5>
        <h3 class="text-3xl">
          <slot />
        </h3>
      </div>
    </div>
  </div>
  <!--/Metric Card-->
</template>

<script>
export default {
  props: ['title', 'icon']
}
</script>
