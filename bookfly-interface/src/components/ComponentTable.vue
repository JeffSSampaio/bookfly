<template>
  <c-card class="card-container">
    <c-card-title class="card-title">
      {{ title }}
    </c-card-title>
    <v-data-table-server
    :items-per-page="itemsPerPage"
    :headers="headers"
    :items="items"
    :items-length="totalItems" 
    :loading="loading"
    items-per-page-text="Linhas por Página"
    @update:options="$emit('updateOptions',$event)" 
    class="c-table">

        <template v-for="header in headers" :key="header.key" v-slot:[`item.${header.key}`]="{ item }: { item: any }">
  <slot :name="header.key" :item="item">
    {{ item[header.key] }}
  </slot>
</template>


     <template v-slot:item.actions="{ item }">
  <slot name="actions" :item="item" />
  </template>
  
  </v-data-table-server>

</c-card>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type:String,
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
  itemsPerPage:{
    type:Number,
    required:true
  }
})

defineEmits(['updateOptions'])
</script>

<style scoped>
.card-container {
  display: flex;
  flex-direction: column; 
  width: 50%;
  margin: 20px;
}

.card-title {
  font-size: 1.5rem;
  padding: 16px;
  display: block; 
  color: black;
}

.c-table {
  border-radius: 25px;
  width: 100%; 
}

</style>