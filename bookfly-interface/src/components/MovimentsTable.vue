<template>
<DataTable 
  :title="titleTable" 
  :headers="headers" 
  :total-items="totalItems" 
  :items="items" 
  :loading="loading"
  @update-options="getRows"
  :actions="actions"
  class="elevation-1 w-66" />
</template>

<script setup lang="ts">
import DataTable from '@/components/ComponentTable.vue'
import {useMoviments} from '@/composable/useMoviments'
const { 
  titleTable, 
  items, 
  loading, 
  totalItems, 
  headers, 
  getRows,
  actions
} = useMoviments()
</script>