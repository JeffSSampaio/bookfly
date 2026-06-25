import { api } from '@/services/apiServices'
import type { SortOption } from '@/composable/useTable'
export const loanService = {
    getAll: async (page: number = 0, itemsPerPage: number = 10, sortBy?: SortOption, search?: string) => {
        return api.get(`loans/list`, {
            page,
            size: itemsPerPage,
            sort: sortBy?.key ?? 'id',
            direction: sortBy?.order ?? 'asc',
            ...(search ? { search } : {})

        })

    },
    delete: async (id: number) => {
        return await api.del(`loans/${id}`)
    }
}