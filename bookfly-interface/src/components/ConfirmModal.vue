<template>
<BaseModal
v-model="model"
 :title ="title"
 :confirm-text="confirmText"
 @confirm="emit('confirm')"
 @cancel="emit('cancel')"
>
 <p class="text-darkGreen font-weight-semibold"> {{ message }}</p>
</BaseModal>
</template>
<script setup lang="ts">

import BaseModal from '@/components/ComponentModal.vue'
const model = defineModel<boolean>({ required: true })

defineProps({
  title: {
    type: String,
    default: ''
  },
  message: {
    type:String,
    default: ''
  },
  confirmText:{
    type:String,
    default: 'Confirmar'
  }
})

const emit = defineEmits(['confirm', 'cancel'])
</script>