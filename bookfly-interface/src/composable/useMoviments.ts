import { computed } from 'vue'
import { movimentService } from '@/services/movimentServices'
import { useTableStore } from '@/stores/useTableStore'
import type { TableOptions } from './useTable'

export function useMoviments() {
    const tableStore = useTableStore('moviments')

    tableStore.headers = [
        { title: 'ID', key: 'movimentId' },
        { title: 'Usuário', key: 'user' },
        { title: 'Livro', key: 'book' },
        { title: 'Quantidade', key: 'qtdMoved' },
        { title: 'Tipo', key: 'type' },
        { title: 'Data de Criação', key: 'createdTime' },
        { title: 'Ações', key: 'actions', sortable: false }
    ]

    async function getRows(options: TableOptions) {
        const fetchAndTreat = async (opts: TableOptions) => {
            const page = (opts.page ?? 1) - 1
            const sortBy = opts.sortBy?.[0]
            const search = opts.search
             const sortKeyMap: Record<string, string> = {
                movimentId: 'id',
                user: 'user.name',
                book: 'book.title',
                qtdMoved: 'quantity',
                type: 'type',
                createdTime: 'createdTime'
            }

            const mappedSortBy = sortBy
                ? { key: sortKeyMap[sortBy.key] ?? sortBy.key, order: sortBy.order }
                : undefined


            const response = await movimentService.getAll(page, opts.itemsPerPage, mappedSortBy, search)
            
            let content: any[] = []
            if (response && 'content' in response) {
                content = response.content
            } else if (Array.isArray(response)) {
                content = response
            }

            const treatedList = content.map((item: any) => ({
                ...item,
                user: item.user?.name ?? 'Sem Usuário',
                book: item.book?.title ?? 'Sem Título'
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
        titleTable: 'Movimentações',
        headers: tableStore.headers,
        items: computed(() => tableStore.items),
        loading: computed(() => tableStore.loading),
        totalItems: computed(() => tableStore.totalItems),
        getRows
    }
}