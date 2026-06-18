import {ref} from 'vue'
import { api } from '@/services/apiServices'
export function useUsers() {
    const users = ref([])
    const loading = ref(false)

    async function getUsers(){
        loading.value = true,
        users.value= await api.get('users/list')
        loading.value = false
    }

    return {
        users,
        loading,
        getUsers
    }
}