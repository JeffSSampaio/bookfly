<template>
<DataTable 
  :title="titleTable" 
  :headers="headers" 
  :total-items="totalItems" 
  :items="items" 
  :loading="loading"
  @update-options="getRows"
  class="elevation-1" >
  <template #recordStatus ="{item}">
   <v-chip :color="item.recordStatus === 'ACTIVE' ? 'green' : 'red'">
        {{ item.recordStatus }}
      </v-chip>
  </template>
  
  </DataTable>
</template>

<script setup lang="ts"> 
import DataTable from '@/components/ComponentTable.vue'
import {useUsers} from '@/composable/useUsers'

const { 
  titleTable, 
  items, 
  loading, 
  totalItems, 
  headers, 
  getRows 
} = useUsers()
        


</script>