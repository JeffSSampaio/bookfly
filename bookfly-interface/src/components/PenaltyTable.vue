<template>
<DataTable 
  :title="titleTable" 
  :headers="headers" 
  :total-items="totalItems" 
  :items="items" 
  :loading="loading"
  @update-options="getRows"
  :actions="actions"
  class="elevation-1" />
</template>

<script setup lang="ts">
import DataTable from '@/components/ComponentTable.vue'
import {usePenalty} from '@/composable/usePenalty'
const { 
  titleTable, 
  items, 
  loading, 
  totalItems, 
  headers, 
  getRows,
  actions
} = usePenalty()

</script>