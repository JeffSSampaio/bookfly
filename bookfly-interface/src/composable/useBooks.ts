import { computed } from 'vue'
import { bookService } from '@/services/bookService'
import { useTableStore } from '@/stores/useTableStore'
import type { TableOptions } from './useTable'
import {createCrudActions} from './useCreateCrudActions'
import type {BtnAction} from '@/composable/useBtnActions'

export function useBooks() {
    const tableStore = useTableStore('books')
    const actions: BtnAction[]= [
                    ...createCrudActions(edit,deleted)
                ]
    tableStore.headers = [
        { title: 'ID', key: 'bookId' },
        { title: 'Nome', key: 'title' },
        { title: 'Autores', key: 'authors' ,sortable: false},
        { title: 'Ações', key: 'actions', sortable: false }
    ]

    async function getRows(options: TableOptions) {
        const fetchAndTreat = async (opts: TableOptions) => {
            const page = (opts.page ?? 1) - 1
            const sortBy = opts.sortBy?.[0]
            const search = opts.search

             const sortKeyMap: Record<string, string> = {
                bookId: 'id',
                title: 'title',
                authors: 'id'
            }

            const mappedSortBy = sortBy
                ? { key: sortKeyMap[sortBy.key] ?? sortBy.key, order: sortBy.order }
                : undefined

            const response = await bookService.getAll(page, opts.itemsPerPage, mappedSortBy, search)

            let content: any[] = []
            if (response && 'content' in response) {
                content = response.content
            } else if (Array.isArray(response)) {
                content = response
            }

            const treatedList = content.map((item: any) => ({
                ...item,
                authors: item.authors ? item.authors.map((a: any) => a.name).join(', ') : 'Sem Autores'
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

    function edit(){}

    function deleted(){
   
    }

    return {
        titleTable: 'Livros',
        headers: tableStore.headers,
        items: computed(() => tableStore.items),
        loading: computed(() => tableStore.loading),
        totalItems: computed(() => tableStore.totalItems),
        getRows,
        actions:actions
    }
}