<template>
<DataTable 
  :title="titleTable" 
  :headers="headers" 
  :total-items="totalItems" 
  :items="items" 
  :loading="loading"
  :actions="actions"
  @update-options="getRows"
  class="elevation-1 w-66" >
  <template #recordStatus ="{item}">
   <v-chip :color="item.recordStatus === 'ACTIVE' ? 'green' : 'red'">
        {{ item.recordStatus }}
      </v-chip>
  </template>

  
  </DataTable>
</template>

<script setup lang="ts"> 
import DataTable from '@/components/ComponentTable.vue'
import Button from '@/components/ComponentButton.vue'
import {useUsers} from '@/composable/useUsers'

const { 
  titleTable, 
  items, 
  loading, 
  totalItems, 
  headers, 
  getRows ,
  actions
} = useUsers()
        


</script>