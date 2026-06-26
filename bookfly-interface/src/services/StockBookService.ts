import { api } from '@/services/apiServices';
import type { SortOption } from '@/composable/useTable'
export const stockBookService = {
    getAll: async (page: number = 0, itemsPerPage: number = 10, sortBy?: SortOption, search?: string) => {
        return api.get(`stock/list`, {
            page,
            size: itemsPerPage,
            sort: sortBy?.key ?? 'id',
            direction: sortBy?.order ?? 'asc',
            ...(search ? { search } : {})

        })

    },
    update:async(id:number,body:any)=>{
            return await api.put(`stock/${id}`, body )
      },
    delete: async(id:number)=>{
            return await api.del(`stock/${id}`)
      }
}