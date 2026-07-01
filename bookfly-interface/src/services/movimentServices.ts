import { api } from '@/services/apiServices';
import type { SortOption } from '@/composable/useTable';

export const movimentService = {
        getAll: async (page: number = 0, itemsPerPage: number = 10, sortBy?: SortOption, search?: string) => {
      
                return api.get('moviments/list', {
                        page,
                        size: itemsPerPage,
                        sort: sortBy?.key ?? 'id',
                        direction: sortBy?.order ?? 'asc',
                        ...(search ? { search } : {})
                })
        },
        update: async (id: number, body: any) => {
                return await api.put(`moviments/${id}`, body)
        },
        delete: async (id: number) => {
                return await api.del(`moviments/${id}`)
        }
}