
import { userService } from '@/services/userService'
import { useServerTable } from './useServerTable'
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

    async function getRows() {
        const response = await userService.getAll;
        const list = Array.isArray(response)? response : []

        return list.map((data: any)=>{
            return{
                ...data
            }
        })

    }
    

        const tableEngine = useServerTable(getRows, getHeaders(), 'Usuários')


    

   return {
        ...tableEngine
    }
}