
import { userService } from '@/services/userService'
import { useServerTable } from './useServerTable'
export function useUsers() {
    
  const headers = [
        { title: 'ID', key: 'id' },
        { title: 'Nome', key: 'name' },
        { title: 'Email', key: 'email' },
        { title: 'Role', key: 'role' },
        { title: 'Status', key: 'recordStatus' },
        { title: 'Data', key: 'recordDateTime' },
        { title: 'Ações', key: 'actions', sortable: false }
        ]

        const tableEngine = useServerTable(userService.getAll, headers, 'Usuários')


    

   return {
        ...tableEngine
    }
}