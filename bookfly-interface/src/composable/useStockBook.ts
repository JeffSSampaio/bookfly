import { computed } from 'vue'
import { stockBookService } from '@/services/StockBookService'
import { useTableStore } from '@/stores/useTableStore'
import type { TableOptions } from './useTable'

export function useStockBook() {
    const tableStore = useTableStore('stockBook')

    tableStore.headers = [
        { title: 'ID', key: 'stockId' },
        { title: 'Livro', key: 'book' },
        { title: 'Quantidade', key: 'qtd' },
        { title: 'Ações', key: 'actions', sortable: false }
    ]

    async function getRows(options: TableOptions) {
        const fetchAndTreat = async (opts: TableOptions) => {
            const page = (opts.page ?? 1) - 1
            const sortBy = opts.sortBy?.[0]
            const search = opts.search

            const sortKeyMap: Record<string, string> = {
                stockId: 'id',
                book: 'book.title'  
            }

            const mappedSortBy = sortBy
                ? { key: sortKeyMap[sortBy.key] ?? sortBy.key, order: sortBy.order }
                : undefined

            const response = await stockBookService.getAll(page, opts.itemsPerPage, mappedSortBy, search)

            let content: any[] = []
            if (response && 'content' in response) {
                content = response.content
            } else if (Array.isArray(response)) {
                content = response
            }

            const treatedList = content.map((stock: any) => ({
                ...stock,
                book: stock.book?.title ?? 'Sem Título'
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
        titleTable: 'Estoque de Livros',
        headers: tableStore.headers,
        items: computed(() => tableStore.items),
        loading: computed(() => tableStore.loading),
        totalItems: computed(() => tableStore.totalItems),
        getRows
    }
}