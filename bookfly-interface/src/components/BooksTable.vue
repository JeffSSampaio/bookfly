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
  />

  <FormModal
    :model-value="showModal && modalType === 'edit'"
    title="Editar Livro"
    :fields="fields"
    @submit="handleSubmit"
    @cancel="closeModal"
  />

  <ConfirmModal
    :model-value="showModal && modalType === 'delete'"
    title="Apagar Livro"
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
import { useBooks } from '@/composable/useBooks'

const {
  titleTable, items, loading, totalItems, headers, getRows, actions,
  showModal, modalType, fields, handleSubmit, handleDelete, deleteMessage,closeModal
} = useBooks()
</script>
