import {api} from '@/services/apiServices';
import type { SortOption } from '@/composable/useTable';
export const movimentService ={
            getAll: async (page: number = 0, itemsPerPage: number = 10, sortBy?: SortOption) => {
                                   const sort = sortBy?.key ?? 'id'
                                   const direction = sortBy?.order ?? 'asc'
                                   const response = await api.get(`moviments/list?page=${page}&size=${itemsPerPage}&sort=${sort}&direction=${direction}`)
                                   return response
                               }
}