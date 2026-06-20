<template>
<DataTable 
  :title="titleTable" 
  :headers="headers" 
  :total-items="totalItems" 
  :items="items" 
  :loading="loading"
  @update-options="getRows"
  class="elevation-1" />
</template>

<script setup lang="ts">    
import DataTable from '@/components/ComponentTable.vue'
import {useLoans} from '@/composable/useLoans'
const { 
  titleTable, 
  items, 
  loading, 
  totalItems, 
  headers, 
  getRows 
} = useLoans()
</script>