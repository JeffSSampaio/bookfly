<template>
  <v-card 
    class=" 
    d-dm-flex 
    w-50 ma-13 
    flex-lg-column 
    rounded-xl
    c-container
    "
  >
    <v-card-title 
      class="
      c-title 
      d-flex 
      align-center justify-space-between 
      text-darkGreen font-weight-semibold"
    >
      <span>{{ title }}</span>
      
      <v-text-field
        v-model="search"
        density="compact"
        label="Buscar..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
        color="midGreen"
        style="max-width: 33%; width: 100%;"
        clearable
        @update:model-value="onSearch"
        @click:clear="clearSearch"
      />
    </v-card-title>
    
    <v-data-table-server
      theme="root"
      v-model:search="search"
      :items-per-page="itemsPerPage"
      :items-per-page-options="[
        { value: 5, title: '5' },
        { value: 10, title: '10' },
        { value: 20, title: '20' },
        { value: 50, title: '50' },
        { value: 100, title: '100' }
      ]"
      :headers="headers"
      :items="items"
      :items-length="totalItems" 
      :loading="loading"
      items-per-page-text="Linhas por Página"
      @update:options="onOptionsUpdate"
      class="c-table fixed-table "
    >
      <template v-for="header in headers" :key="`header-${header.key}`" v-slot:[`header.${header.key}`]="{ column }">
        <div class="header-title text-midGreen font-weight-semibold">
          <slot :name="`header-${header.key}`" :column="column">
            {{ column.title }}
          </slot>
        </div>  
      </template>

      <template v-for="header in headers" :key="header.key" v-slot:[`item.${header.key}`]="{ item }: { item: any }">
        <div class="text-brightGreen font-weight-semibold">
          <slot :name="header.key" :item="item">
            {{ item[header.key] }}
          </slot>
        </div>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  headers: {
    type: Array as () => any[],
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['updateOptions'])
const search = ref('')

function onOptionsUpdate(options: any) {
  emit('updateOptions', { ...options, search: search.value })
}

function onSearch(){
  emit('updateOptions', {
    page:1,
    search: search.value
  })
}

function clearSearch() {
  search.value = ''
}
</script>

<style scoped>
.c-table :deep(thead th) {
  background-color: #F5EDD8;
}
</style>