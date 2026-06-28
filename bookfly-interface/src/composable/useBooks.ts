import { computed } from 'vue'
import { bookService } from '@/services/bookService'
import { useTableStore } from '@/stores/useTableStore'
import type { TableOptions } from './useTable'
import { createCrudActions } from './useCreateCrudActions'
import type { BtnAction } from '@/composable/useBtnActions'
import { useForm, type FormField } from './useForm'
import { useWebSocket } from './useWebSocket'
import { formatDateTime } from '@/utils/dateFormat'
export function useBooks() {
    const tableStore = useTableStore('books')
    const {
        formTitle, setFormTitle,
        showModal, modalType, selectedItem, openModal,
        closeModal, deleteMessage, buildForm, fillForm, lastOptions, setLastOptions } = useForm()


    const fields: FormField[] = [
        { name: 'title', label: 'Título', type: 'text' },
        { name: 'authors', label: 'Autores', type: 'text' },
    ]

    const form = buildForm(fields)


    function edit(book?: any) {
        setFormTitle(`Editando Livro ID°${book.bookId}`)
        fillForm(form.value, book)
        openModal('edit', book)
    }

    function deleted(book?: any) {
        setFormTitle(`Editando Livro ID°${book.bookId}`)
        openModal('delete', book)
    }

    const actions: BtnAction[] = [...createCrudActions(edit, deleted)]


    async function handleSubmit(formData: Record<string, any>) {
        if (selectedItem.value) {
            console.log('[useBooks] Atualizar livro:', selectedItem.value.bookId, formData)
            try {

                const treatedFormData = { ...formData }
                if (typeof treatedFormData.authors === 'string') {
                    treatedFormData.authors = treatedFormData.authors
                        .split(',')                 
                        .map(name => name.trim())    
                        .filter(name => name !== '') 
                } else if (!treatedFormData.authors) {
                    treatedFormData.authors = []            
                }

                bookService.update(selectedItem.value.bookId, treatedFormData)

            } catch (e) {
                console.error('Erro:' + e)
            }
        }
        closeModal()

    }

    async function handleDelete() {
        const id = selectedItem.value?.bookId
        if (!id) return
        console.log('[useBooks] Deletar livro:', id)
        await bookService.delete(id)
        closeModal()
        // await getRows({ page: 1, itemsPerPage: 10 })
    }


    tableStore.headers = [
        { title: 'ID', key: 'bookId' },
        { title: 'Nome', key: 'title' },
        { title: 'Autores', key: 'authors', sortable: false },
        { title: 'Status', key: 'recordStatus' },
        { title: 'Data/Hora', key: 'recordDateTime' },
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
                authors: item.authors ? item.authors.map((a: any) => a.name).join(', ') : 'Sem Autores',
                recordDateTime: formatDateTime(item.recordDateTime)
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
        closeModal,
        formTitle,
        form
    }
}
