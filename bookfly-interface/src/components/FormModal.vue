<template>
  <BaseModal
    v-model="model"
    :title="title"
    :confirm-text="confirmText"
    @confirm="emit('submit', formData)"
  >
    <FormRenderer
      v-model="formData"
      :fields="fields"
    />
  </BaseModal>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import BaseModal from '@/components/ComponentModal.vue'
import FormRenderer from '@/components/ComponentForm.vue'
import { useForm, type FormField } from '@/composable/useForm'

const model = defineModel<boolean>({ required: true })
const formData = defineModel<Record<string, any>>('formData', { required: true })
const props = defineProps({
  title: {
    type: String,
    default: 'formulário'
  },
  confirmText: {
    type: String,
    default: 'Salvar'
  },
  fields: {
    type: Array as PropType<FormField[]>,
    default: () => []
  }
})

const emit = defineEmits<{
  submit: [Record<string, any>]
}>()


</script>