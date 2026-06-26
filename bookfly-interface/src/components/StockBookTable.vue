<template>
  <DataTable
    :title="titleTable"
    :headers="headers"
    :total-items="totalItems"
    :items="items"
    :loading="loading"
    :actions="actions"
    @update-options="getRows"
    class="elevation-1 w-66"
  >
  <template #recordStatus="{ item }">
      <v-chip :color="item.recordStatus === 'ACTIVE' ? 'green' : 'red'">
        {{ item.recordStatus }}
      </v-chip>
    </template>

    <template #qtd="{ item }">
      <v-chip class="text-center">
        {{ item.qtd }}
      </v-chip>
    </template>
  </DataTable>

  <FormModal
    :model-value="modalType === 'edit'"
    v-model:formData="form"
    :title="formTitle"
    :fields="fields"
    @submit="handleSubmit"
    @cancel="closeModal()"
  />

  <ConfirmModal
    :model-value="modalType === 'delete'"
    :title="formTitle"
    confirm-text="Apagar"
    :message="deleteMessage"
    @confirm="handleDelete"
    @cancel="closeModal()"
  />
</template>

<script setup lang="ts">
import DataTable from '@/components/ComponentTable.vue'
import FormModal from '@/components/FormModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useStockBook } from '@/composable/useStockBook'

const {
  form,
  formTitle, titleTable, items, loading, totalItems, headers, getRows, actions,
  showModal, modalType, fields, handleSubmit, handleDelete, deleteMessage, closeModal,
} = useStockBook()
</script>
