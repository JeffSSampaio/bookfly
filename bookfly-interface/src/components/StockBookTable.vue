<template>
<DataTable 
  :title="titleTable" 
  :headers="headers" 
  :total-items="totalItems" 
  :items="items" 
  :loading="loading"
  @update-options="getRows"
  class="elevation-1" >
     <template #qtd="{item}">
      <v-chip class="text-center">
        {{ item.qtd }}
      </v-chip>

     </template>
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from '@/components/ComponentTable.vue'
import{useStockBook} from '@/composable/useStockBook'
const {
    titleTable, 
    items, 
    loading, 
    totalItems, 
    headers, 
    getRows 
    } = useStockBook()
</script>