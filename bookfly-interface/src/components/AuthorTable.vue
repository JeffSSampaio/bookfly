<template>
  <DataTable
    :title="titleTable"
    :headers="headers"
    :total-items="totalItems"
    :items="items"
    :loading="loading"
    :actions="actions"
    @update-options="getRows"
    class="elevation-1 "
   >
    <template #recordStatus="{ item }">
      <v-chip :color="item.recordStatus === 'ACTIVE' ? 'green' : 'red'">
        {{ item.recordStatus }}
      </v-chip>
    </template>
  </DataTable>

  <FormModal
    :model-value="modalType === 'edit'"
    :title="formTitle"
    v-model:formData="form"
    :fields="fields"
    @submit="handleSubmit"
    @cancel="closeModal"
  />

  <ConfirmModal
    :model-value="modalType === 'delete'"
    :title="formTitle"
    confirm-text="Apagar"
    :message="deleteMessage"
    @confirm="handleDelete"
    @cancel="closeModal"
  />
</template>

<script setup lang="ts">
import DataTable from '@/components/ComponentTable.vue'
import FormModal from '@/components/FormModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useAuthors } from '@/composable/useAuthors'

const {
  formTitle,form,
  titleTable, items, loading, totalItems, headers, getRows, actions,
  showModal, modalType, fields, handleSubmit, handleDelete, deleteMessage,closeModal
} = useAuthors()
</script>
