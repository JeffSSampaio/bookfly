<template>
  <v-dialog v-model="model" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-h5">{{ title }}</v-card-title>

      <v-card-text>
        <slot />
      </v-card-text>

      <v-card-actions>
        
        <v-spacer />
        <div class=" d-flex  flex-row   justify-space-between w-100">
          <v-btn variant="text" @click="model = false";>Cancelar</v-btn>
          <v-btn color="primary" variant="flat" @click="emit('confirm')" :class="classText">
            {{ confirmText }}
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const model = defineModel<boolean>({ required: true })

defineProps({
  title: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  classText:{
    type:String,
    default:''
  }
})

const emit = defineEmits(['confirm', 'cancel'])
</script>