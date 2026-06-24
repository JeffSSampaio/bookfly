import { computed } from 'vue'
import { loanService } from '@/services/loanService'
import { useTableStore } from '@/stores/useTableStore'
import type { TableOptions } from './useTable'
import { createCrudActions } from './useCreateCrudActions'
import type { BtnAction } from '@/composable/useBtnActions'
import { formatDateTime } from '@/utils/dateFormat'
import { useForm, type FormField } from './useForm'

export const useLoans = () => {
    const tableStore = useTableStore('loans')
    const { showModal, modalType, selectedItem, openModal, closeModal, deleteMessage, buildForm, fillForm } = useForm()

  
    const fields: FormField[] = [
        { name: 'userId',     label: 'Usuário',           type: 'select' },
        { name: 'bookId',     label: 'Livro',             type: 'select' },
        { name: 'returnDate', label: 'Data de Devolução', type: 'text'   },
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
            console.log('[useLoans] Atualizar empréstimo:', selectedItem.value.id, formData)
            // await loanService.update(selectedItem.value.id, formData)
        } else {
            console.log('[useLoans] Criar empréstimo:', formData)
            // await loanService.create(formData)
        }
        closeModal()
        // await getRows({ page: 1, itemsPerPage: 10 })
    }

    async function handleDelete() {
        const id = selectedItem.value?.id
        if (!id) return
        console.log('[useLoans] Deletar empréstimo:', id)
        // await loanService.delete(id)
        closeModal()
        // await getRows({ page: 1, itemsPerPage: 10 })
    }

   
    tableStore.headers = [
        { title: 'ID',               key: 'id' },
        { title: 'Usuário',          key: 'user' },
        { title: 'Livro',            key: 'book' },
        { title: 'Data de Empréstimo', key: 'loanDate' },
        { title: 'Data de Devolução',  key: 'returnDate' },
        { title: 'Status',           key: 'status' },
        { title: 'Ações',            key: 'actions', sortable: false }
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
            if (response && 'content' in response) content = response.content
            else if (Array.isArray(response)) content = response

            const treatedList = content.map((item: any) => ({
                ...item,
                user: item.user?.name ?? 'Sem Nome',
                book: item.book?.title ?? 'Sem Título de Livro',
                loanDate: formatDateTime(item.loanDate),
                returnDate: formatDateTime(item.returnDate)
            }))

            if (response && 'content' in response) return { content: treatedList, page: response.page }
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
        getRows,
        actions,
        showModal,
        modalType,
        fields,
        handleSubmit,
        handleDelete,
        deleteMessage: computed(() => deleteMessage('empréstimo')),
        closeModal
    }
}
