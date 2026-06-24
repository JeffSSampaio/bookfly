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


 <ModalForm
  v-if="modalType === 'edit'"
  v-model="showModal"
  title="Editar Usuário"
  :fields="buildModal()"
/>

<ConfirmModal
  v-if="modalType === 'delete'"
  v-model="showModal"
  title="Apagar Usuário"
  confirm-text="Apagar"
  :message="deleteMessage"
/>
  
</template>

<script setup lang="ts"> 
import DataTable from '@/components/ComponentTable.vue'
import {useUsers} from '@/composable/useUsers'
import ModalForm from '@/components/FormModal.vue'
import ConfirmModal from './ConfirmModal.vue'
const { 
  titleTable, 
  items, 
  loading, 
  totalItems, 
  headers, 
  getRows ,
  actions,
  showModal,
  modalType,
  buildModal,
  deleteMessage
} = useUsers()



</script>