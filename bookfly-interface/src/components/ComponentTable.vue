<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    class="elevation-1">
  </v-data-table>
</template>

<script setup lang="ts">

defineProps({
  headers: {
    type: Array as () => any[],
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>

</style>