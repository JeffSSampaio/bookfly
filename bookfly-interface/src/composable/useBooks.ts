import { computed } from 'vue'
import { bookService } from '@/services/bookService'
import { useTableStore } from '@/stores/useTableStore'
import type { TableOptions } from './useTable'
import { createCrudActions } from './useCreateCrudActions'
import type { BtnAction } from '@/composable/useBtnActions'
import { useForm, type FormField } from './useForm'
import { useWebSocket } from './useWebSocket'

export function useBooks() {
    const tableStore = useTableStore('books')
    const { showModal, modalType, selectedItem, openModal,
        closeModal, deleteMessage, buildForm, fillForm, lastOptions, setLastOptions } = useForm()


    const fields: FormField[] = [
        { name: 'title', label: 'Título', type: 'text' },
        { name: 'authors', label: 'Autores', type: 'text' },
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
            console.log('[useBooks] Atualizar livro:', selectedItem.value.bookId, formData)
            // await bookService.update(selectedItem.value.bookId, formData)
        } else {
            console.log('[useBooks] Criar livro:', formData)
            // await bookService.create(formData)
        }
        closeModal()
        // await getRows({ page: 1, itemsPerPage: 10 })
    }

    async function handleDelete() {
        const id = selectedItem.value?.bookId
        if (!id) return
        console.log('[useBooks] Deletar livro:', id)
        // await bookService.delete(id)
        closeModal()
        // await getRows({ page: 1, itemsPerPage: 10 })
    }


    tableStore.headers = [
        { title: 'ID', key: 'bookId' },
        { title: 'Nome', key: 'title' },
        { title: 'Autores', key: 'authors', sortable: false },
        { title: 'Ações', key: 'actions', sortable: false }
    ]

    async function getRows(options: TableOptions) {
        setLastOptions(options)
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
            if (response && 'content' in response) content = response.content
            else if (Array.isArray(response)) content = response

            const treatedList = content.map((item: any) => ({
                ...item,
                authors: item.authors ? item.authors.map((a: any) => a.name).join(', ') : 'Sem Autores'
            }))

            if (response && 'content' in response) return { content: treatedList, page: response.page }
            return treatedList
        }

        await tableStore.getRows(options, fetchAndTreat)
    }
    useWebSocket('books', () => { if (lastOptions.value) getRows(lastOptions.value) })

    return {
        titleTable: 'Livros',
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
        deleteMessage: computed(() => deleteMessage('livro')),
        closeModal
    }
}
