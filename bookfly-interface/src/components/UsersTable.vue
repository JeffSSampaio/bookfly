<template>
<DataTable :headers="headers" :items="users" :loading="loading" class="elevation-1" />
</template>

<script setup lang="ts"> 
import DataTable from '@/components/ComponentTable.vue'
import {onMounted} from 'vue'
import {useUsers} from '@/composable/useUsers'


const {users, loading, getUsers} = useUsers()

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nome', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Status', key: 'recordStatus' },
  { title: 'Data', key: 'recordDateTime' },
]
onMounted(() => getUsers())
</script>