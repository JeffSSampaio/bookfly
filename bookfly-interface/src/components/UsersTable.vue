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
    v-if="showModal && modalType === 'edit'"
    v-model="showModal"
    title="Editar Usuário"
    :fields="fields"
    @submit="handleSubmit"
    @cancel="closeModal()"
  />

  <ConfirmModal
    v-if="showModal && modalType === 'delete'"
    v-model="showModal"
    title="Apagar Usuário"
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
import { useUsers } from '@/composable/useUsers'

const {
  titleTable, items, loading, totalItems, headers, getRows, actions,
  showModal, modalType, fields, handleSubmit, handleDelete, deleteMessage,closeModal
} = useUsers()
</script>