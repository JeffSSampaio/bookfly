<template>
  <BaseModal
    v-model="model"
    :title="title"
    :confirm-text="confirmText"
    @confirm="emit('submit', form)"
  >
    <FormRenderer
      v-model="form"
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

const props = defineProps({
  title: {
    type: String,
    default: 'Formulário'
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

const { buildForm } = useForm()

const form = buildForm(props.fields)
</script>