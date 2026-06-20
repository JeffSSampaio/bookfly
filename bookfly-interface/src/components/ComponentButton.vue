<template>
    <v-btn 
      :color="color" 
      :size="size" 
      :variant="variant"
      @click="$emit('click')"
    >
        <slot />
    </v-btn>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

type ThemeColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'

defineProps({
  color: {
    type: String as PropType<ThemeColor>,
    default: 'primary'
  },
  size: {
    type: [String, Number] as PropType<'x-small' | 'small' | 'default' | 'large' | 'x-large' | number>,
    default: 'default'
  },
  variant: {
    type: String as PropType<'flat' | 'outlined' | 'text' | 'tonal' | 'elevated' | 'plain'>,
    default: 'elevated'
  }
})

defineEmits(['click'])
</script>

<style scoped>
.color-blue{}

</style>
