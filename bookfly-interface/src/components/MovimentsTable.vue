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
</DataTable>

  <FormModal
    :model-value="showModal && modalType === 'edit'"
    title="Editar Movimentação"
    :fields="fields"
    @submit="handleSubmit"
    @cancel="closeModal"
  />

  <ConfirmModal
    :model-value="showModal && modalType === 'delete'"
    title="Apagar Movimentação"
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
import { useMoviments } from '@/composable/useMoviments'

const {
  titleTable, items, loading, totalItems, headers, getRows, actions,
  showModal, modalType, fields, handleSubmit, handleDelete, deleteMessage,closeModal
} = useMoviments()
</script>
