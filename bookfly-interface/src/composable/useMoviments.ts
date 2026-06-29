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
    const { 
        formTitle,setFormTitle,
        showModal, modalType, selectedItem, openModal,
        closeModal, deleteMessage, buildForm, fillForm, lastOptions, setLastOptions } = useForm()


    const fields: FormField[] = [
        { name: 'user', label: 'Usuário', type: 'select',items: [] },
        { name: 'book', label: 'Livro', type: 'select', items: []  },
        { name: 'description', label: 'Descrição', type: 'text' },
        { name: 'qtdMoved', label: 'Quantidade', type: 'text' },
        { name: 'type', label: 'Tipo', type: 'select',items: []  },
    ]

    const form = buildForm(fields)


    function edit(moviment?: any) {
        setFormTitle(`Editando Movimentação ID°${moviment.movimentId}`)
        fillForm(form.value, moviment)
        openModal('edit', moviment)
    }

    function deleted(moviment?: any) {
        setFormTitle(`Apagando Movimentação ID°${moviment.movimentId}`)
        openModal('delete', moviment)
    }

    const actions: BtnAction[] = [...createCrudActions(edit, deleted)]


    async function handleSubmit(formData: Record<string, any>) {
        if (selectedItem.value) {
            console.log('[useMoviments] Atualizar movimentação:', selectedItem.value.movimentId, formData)
             try{
                 await movimentService.update(selectedItem.value.movimentId, formData)
                
            }catch(e){
                console.error('Erro:'+e)
            }
        } 
        closeModal()
   
    }

    async function handleDelete() {
        const id = selectedItem.value?.movimentId
        if (!id) return
        console.log('[useMoviments] Deletar movimentação:', id)
        movimentService.delete(id)
        closeModal()
        // await getRows({ page: 1, itemsPerPage: 10 })
    }


    tableStore.headers = [
        { title: 'ID', key: 'movimentId' },
        { title: 'Usuário', key: 'user' },
        { title: 'Livro', key: 'book' },
        { title: 'Quantidade', key: 'qtdMoved' },
        { title: 'Descrição', key: 'description' },
        { title: 'Tipo', key: 'type' },
        { title: 'Data de Criação', key: 'createdTime' },
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
                createdTime: formatDateTime(item.createdTime),
                recordDateTime: formatDateTime(item.recordDateTime)
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
        closeModal,
        formTitle,
        form
    }
}
