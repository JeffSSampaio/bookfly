import {api} from '@/services/apiServices';
import type { SortOption } from '@/composable/useTable';
export const penaltyService ={
         getAll: async (page: number = 0, itemsPerPage: number = 10, sortBy?: SortOption,search?:String) => {
                           const sort = sortBy?.key ?? 'id'
                           const direction = sortBy?.order ?? 'asc'
                           const response = await api.get(`penalties/list`, {
                               params: {
                                   page: page,
                                   size: itemsPerPage,
                                   sort: sort,
                                   direction: direction,
                                   search: search
                               }
                           })
                           return response
                       }
}