import {ref} from 'vue'
import { api } from '@/services/apiServices'
export function useUsers() {
    const users = ref([])
    const loading = ref(false)

    async function getUsers() {
    loading.value = true

    try {
        const response = await api.get('users/list')
        users.value = response.data
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

    return {
        users,
        loading,
        getUsers
    }
}