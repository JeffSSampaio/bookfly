<template>
<v-row>
    <v-col
    v-for="field in fields"
    :key="field.name"
    :cols="field.cols ?? 12"
    >
    <div :class="containerForm">

        <v-text-field
        v-if="field.type === 'text'"
        v-model="form[field.name]"
        :label="field.label"
        :placeholder="field.placeholder"
        :class="field.class"
        :rules="field.rules"
        />
        
 <v-text-field
  v-else-if="field.type === 'email'"
  v-model="form[field.name]"
  :label="field.label"
  :placeholder="field.placeholder"
  :rules="field.rules"
  :class="field.class"
  type="email"
  />

  <v-text-field
  v-else-if="field.type === 'password'"
  v-model="form[field.name]"
  :label="field.label"
  :placeholder="field.placeholder"
  :rules="field.rules"
  :class="field.class"
  type="password"
/>

<v-select
v-else-if="field.type === 'select'"
v-model="form[field.name]"
:label="field.label"
:items="field.items"
:rules="field.rules"
:class="field.class"
/>

<v-textarea
v-else-if="field.type === 'textarea'"
  v-model="form[field.name]"
  :label="field.label"
  :rules="field.rules"
  :class="field.class"
  />
  
</div>
    </v-col>
</v-row>

</template>
<script setup lang="ts">
import type { PropType } from 'vue'
import type { FormField} from '@/composable/useForm';

const form = defineModel<Record<string, any>>({
  required: true
})

defineProps({
  fields: {
    type: Array as PropType<FormField[]>,
    default: () => []
  },
  containerForm:{
    type:String
  }
})

</script>