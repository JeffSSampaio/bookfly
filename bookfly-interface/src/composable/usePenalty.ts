import { computed } from 'vue'
import { penaltyService } from '@/services/penaltyServices'
import { useTableStore } from '@/stores/useTableStore'
import type { TableOptions } from './useTable'
import {createCrudActions} from './useCreateCrudActions'
import type {BtnAction} from '@/composable/useBtnActions'

export function usePenalty() {
    const tableStore = useTableStore('penalty')
    const actions: BtnAction[]= [
            ...createCrudActions(edit,deleted)
        ]
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
            const search = opts.search

             const sortKeyMap: Record<string, string> = {
                penaltyId: 'id',
                user: 'user.name',
                amount: 'amount',
                statusPenalty: 'status',
                penaltyDate: 'date'
            }

            const mappedSortBy = sortBy
                ? { key: sortKeyMap[sortBy.key] ?? sortBy.key, order: sortBy.order }
                : undefined

            const response = await penaltyService.getAll(page, opts.itemsPerPage, mappedSortBy, search)

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

    function edit(){


    }

    function deleted(){
   
    }

    return {
        titleTable: 'Multas',
        headers: tableStore.headers,
        items: computed(() => tableStore.items),
        loading: computed(() => tableStore.loading),
        totalItems: computed(() => tableStore.totalItems),
        getRows,
        actions:actions
    }
}