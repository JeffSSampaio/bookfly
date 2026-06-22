
import { userService } from '@/services/userService'
import { useServerTable } from './useServerTable'
import type { TableOptions } from '@/composable/useTable'
export function useUsers() {

    function getHeaders(){
        const headers = [
              { title: 'ID', key: 'id' },
              { title: 'Nome', key: 'name' },
              { title: 'Email', key: 'email' },
              { title: 'Role', key: 'role' },
              { title: 'Status', key: 'recordStatus' },
              { title: 'Data', key: 'recordDateTime' },
              { title: 'Ações', key: 'actions', sortable: false }
              ]
              return headers
    }

    
    async function getRows(options: TableOptions) {
        const page = (options.page ?? 1) - 1
        const sortBy = options.sortBy?.[0]
        const response = await userService.getAll(page, options.itemsPerPage, sortBy)
        return response  
    }
    

        const tableEngine = useServerTable(getRows, getHeaders(), 'Usuários')


    

   return {
        ...tableEngine
    }
}