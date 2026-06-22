import { computed } from 'vue'
import { userService } from '@/services/userService'
import { useTableStore } from '@/stores/useTableStore'
import type { TableOptions } from './useTable'

export function useUsers() {
    const tableStore = useTableStore('users')

    tableStore.headers = [
        { title: 'ID', key: 'id' },
        { title: 'Nome', key: 'name' },
        { title: 'Email', key: 'email' },
        { title: 'Role', key: 'role' },
        { title: 'Status', key: 'recordStatus' },
        { title: 'Data', key: 'recordDateTime' },
        { title: 'Ações', key: 'actions', sortable: false }
    ]

    async function getRows(options: TableOptions) {
        const fetchAndTreat = async (opts: TableOptions) => {
            const page = (opts.page ?? 1) - 1
            const sortBy = opts.sortBy?.[0]
            
            const response = await userService.getAll(page, opts.itemsPerPage, sortBy,opts.search)
            
            let content: any[] = []
            if (response && 'content' in response) {
                content = response.content
            } else if (Array.isArray(response)) {
                content = response
            }

            if (response && 'content' in response) {
                return {
                    content,
                    page: response.page
                }
            }
            return content
        }

        await tableStore.getRows(options, fetchAndTreat)
    }

    return {
        titleTable: 'Usuários',
        headers: tableStore.headers,
        items: computed(() => tableStore.items),
        loading: computed(() => tableStore.loading),
        totalItems: computed(() => tableStore.totalItems),
        getRows
    }
}