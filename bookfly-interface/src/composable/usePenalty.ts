import { computed } from 'vue'
import { penaltyService } from '@/services/penaltyServices'
import { useTableStore } from '@/stores/useTableStore'
import type { TableOptions } from './useTable'

export function usePenalty() {
    const tableStore = useTableStore('penalty')

    tableStore.headers = [
        { title: 'ID', key: 'penaltyId' },
        { title: 'Usuário', key: 'user' },
        { title: 'Valor', key: 'amount' },
        { title: 'Status', key: 'statusPenalty' },
        { title: 'Data de Multa', key: 'penaltyDate' },
        { title: 'Ações', key: 'actions', sortable: false }
    ]

    async function getRows(options: TableOptions) {
        const fetchAndTreat = async (opts: TableOptions) => {
            const page = (opts.page ?? 1) - 1
            const sortBy = opts.sortBy?.[0]
            
            const response = await penaltyService.getAll(page, opts.itemsPerPage, sortBy)
            
            let content: any[] = []
            if (response && 'content' in response) {
                content = response.content
            } else if (Array.isArray(response)) {
                content = response
            }

            const treatedList = content.map((item: any) => ({
                ...item,
                user: item.user?.name ?? 'No Name'
            }))

            if (response && 'content' in response) {
                return {
                    content: treatedList,
                    page: response.page
                }
            }
            return treatedList
        }

        await tableStore.getRows(options, fetchAndTreat)
    }

    return {
        titleTable: 'Penalties',
        headers: tableStore.headers,
        items: computed(() => tableStore.items),
        loading: computed(() => tableStore.loading),
        totalItems: computed(() => tableStore.totalItems),
        getRows
    }
}