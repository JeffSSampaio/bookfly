import { computed } from 'vue'
import { loanService } from '@/services/loanService'
import { useTableStore } from '@/stores/useTableStore'
import type { TableOptions } from './useTable'

export const useLoans = () => {
    const tableStore = useTableStore('loans')

    tableStore.headers = [
        { title: 'ID', key: 'id' },
        { title: 'Usuário', key: 'user' },
        { title: 'Livro', key: 'book' },
        { title: 'Data de Empréstimo', key: 'loanDate' },
        { title: 'Data de Devolução', key: 'returnDate' },
        { title: 'Status', key: 'status' },
        { title: 'Ações', key: 'actions', sortable: false }
    ]

    async function getRows(options: TableOptions) {
        const fetchAndTreat = async (opts: TableOptions) => {
            const page = (opts.page ?? 1) - 1
            const sortBy = opts.sortBy?.[0]
            const search = opts.search
             const sortKeyMap: Record<string, string> = {
                id: 'id',
                user: 'user.name',
                book: 'book.title',
                loanDate: 'loanDate',
                returnDate: 'returnDate',
                status: 'status'
            }

            const mappedSortBy = sortBy
                ? { key: sortKeyMap[sortBy.key] ?? sortBy.key, order: sortBy.order }
                : undefined


            const response = await loanService.getAll(page, opts.itemsPerPage, mappedSortBy, search)

            let content: any[] = []
            if (response && 'content' in response) {
                content = response.content
            } else if (Array.isArray(response)) {
                content = response
            }

            const treatedList = content.map((item: any) => ({
                ...item,
                user: item.user?.name ?? 'Sem Nome',
                book: item.book?.title ?? 'Sem Título de Livro'
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
        titleTable: 'Empréstimos',
        headers: tableStore.headers,
        items: computed(() => tableStore.items),
        loading: computed(() => tableStore.loading),
        totalItems: computed(() => tableStore.totalItems),
        getRows
    }
}