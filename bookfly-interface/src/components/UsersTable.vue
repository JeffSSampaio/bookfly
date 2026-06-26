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
    v-if="modalType === 'edit'"
    v-model="showModal"
    :title="formTitle"
    :fields="fields"
    v-model:formData = "form"
    @submit="handleSubmit"
    @cancel="closeModal()"
  />

  <ConfirmModal
    v-if="modalType === 'delete'"
    v-model="showModal"
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
import { useUsers } from '@/composable/useUsers'

const {
  titleTable, items, loading, totalItems, headers, getRows, actions,
  showModal, modalType, fields, handleSubmit, handleDelete, deleteMessage,closeModal, formTitle
  ,form
} = useUsers()
</script>