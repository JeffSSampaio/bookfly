import { computed } from 'vue'
import { stockBookService } from '@/services/StockBookService'
import { useTableStore } from '@/stores/useTableStore'
import type { TableOptions } from './useTable'
import { createCrudActions } from './useCreateCrudActions'
import type { BtnAction } from '@/composable/useBtnActions'
import { useForm, type FormField } from './useForm'

export function useStockBook() {
    const tableStore = useTableStore('stockBook')
    const { showModal, modalType, selectedItem, openModal, closeModal, deleteMessage, buildForm, fillForm } = useForm()

  
    const fields: FormField[] = [
        { name: 'bookId', label: 'Livro',      type: 'select' },
        { name: 'qtd',    label: 'Quantidade', type: 'text'   },
    ]

    const form = buildForm(fields)

    function edit(item?: any) {
        fillForm(form.value, item)
        openModal('edit', item)
    }

    function deleted(item?: any) {
        openModal('delete', item)
    }

    const actions: BtnAction[] = [...createCrudActions(edit, deleted)]

   
    async function handleSubmit(formData: Record<string, any>) {
        if (selectedItem.value) {
            console.log('[useStockBook] Atualizar estoque:', selectedItem.value.stockId, formData)
            // await stockBookService.update(selectedItem.value.stockId, formData)
        } else {
            console.log('[useStockBook] Criar estoque:', formData)
            // await stockBookService.create(formData)
        }
        closeModal()
        // await getRows({ page: 1, itemsPerPage: 10 })
    }

    async function handleDelete() {
        const id = selectedItem.value?.stockId
        if (!id) return
        console.log('[useStockBook] Deletar estoque:', id)
        // await stockBookService.delete(id)
        closeModal()
        // await getRows({ page: 1, itemsPerPage: 10 })
    }


    tableStore.headers = [
        { title: 'ID',         key: 'stockId' },
        { title: 'Livro',      key: 'book' },
        { title: 'Quantidade', key: 'qtd' },
        { title: 'Ações',      key: 'actions', sortable: false }
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
            if (response && 'content' in response) content = response.content
            else if (Array.isArray(response)) content = response

            const treatedList = content.map((item: any) => ({
                ...item,
                book: item.book?.title ?? 'Sem Título'
            }))

            if (response && 'content' in response) return { content: treatedList, page: response.page }
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
        getRows,
        actions,
        showModal,
        modalType,
        fields,
        handleSubmit,
        handleDelete,
        closeModal,
        deleteMessage: computed(() => deleteMessage('estoque')),
    }
}
