import { computed } from 'vue'
import { movimentService } from '@/services/movimentServices'
import { useTableStore } from '@/stores/useTableStore'
import type { TableOptions } from './useTable'
import { createCrudActions } from './useCreateCrudActions'
import type { BtnAction } from '@/composable/useBtnActions'
import { formatDateTime } from '@/utils/dateFormat'
import { useForm, type FormField } from './useForm'
import { useWebSocket } from './useWebSocket'
export function useMoviments() {
    const tableStore = useTableStore('moviments')
    const { showModal, modalType, selectedItem, openModal,
        closeModal, deleteMessage, buildForm, fillForm, lastOptions, setLastOptions } = useForm()


    const fields: FormField[] = [
        { name: 'userId', label: 'Usuário', type: 'select' },
        { name: 'bookId', label: 'Livro', type: 'select' },
        { name: 'qtdMoved', label: 'Quantidade', type: 'text' },
        { name: 'type', label: 'Tipo', type: 'select' },
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
            console.log('[useMoviments] Atualizar movimentação:', selectedItem.value.movimentId, formData)
            // await movimentService.update(selectedItem.value.movimentId, formData)
        } else {
            console.log('[useMoviments] Criar movimentação:', formData)
            // await movimentService.create(formData)
        }
        closeModal()
        // await getRows({ page: 1, itemsPerPage: 10 })
    }

    async function handleDelete() {
        const id = selectedItem.value?.movimentId
        if (!id) return
        console.log('[useMoviments] Deletar movimentação:', id)
        // await movimentService.delete(id)
        closeModal()
        // await getRows({ page: 1, itemsPerPage: 10 })
    }


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
        setLastOptions(options)
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
            if (response && 'content' in response) content = response.content
            else if (Array.isArray(response)) content = response

            const treatedList = content.map((item: any) => ({
                ...item,
                user: item.user?.name ?? 'Sem Usuário',
                book: item.book?.title ?? 'Sem Título',
                createdTime: formatDateTime(item.createdTime)
            }))

            if (response && 'content' in response) return { content: treatedList, page: response.page }
            return treatedList
        }

        await tableStore.getRows(options, fetchAndTreat)
    }
    useWebSocket('moviments', () => { if (lastOptions.value) getRows(lastOptions.value) })

    return {
        titleTable: 'Movimentações',
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
        deleteMessage: computed(() => deleteMessage('movimentação')),
        closeModal
    }
}
