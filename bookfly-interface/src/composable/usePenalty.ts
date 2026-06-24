import { computed } from 'vue'
import { penaltyService } from '@/services/penaltyServices'
import { useTableStore } from '@/stores/useTableStore'
import type { TableOptions } from './useTable'
import { createCrudActions } from './useCreateCrudActions'
import type { BtnAction } from '@/composable/useBtnActions'
import { formatDateTime } from '@/utils/dateFormat'
import { useForm, type FormField } from './useForm'
import { useWebSocket } from './useWebSocket'

export function usePenalty() {
    const tableStore = useTableStore('penalty')
    const { showModal, modalType, selectedItem, openModal, closeModal, deleteMessage, buildForm, fillForm,lastOptions,setLastOptions } = useForm()

  
    const fields: FormField[] = [
        { name: 'userId', label: 'Usuário', type: 'select' },
        { name: 'amount', label: 'Valor',   type: 'text'   },
        { name: 'status', label: 'Status',  type: 'select' },
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
            console.log('[usePenalty] Atualizar multa:', selectedItem.value.penaltyId, formData)
            // await penaltyService.update(selectedItem.value.penaltyId, formData)
        } else {
            console.log('[usePenalty] Criar multa:', formData)
            // await penaltyService.create(formData)
        }
        closeModal()
        // await getRows({ page: 1, itemsPerPage: 10 })
    }

    async function handleDelete() {
        const id = selectedItem.value?.penaltyId
        if (!id) return
        console.log('[usePenalty] Deletar multa:', id)
        // await penaltyService.delete(id)
        closeModal()
        // await getRows({ page: 1, itemsPerPage: 10 })
    }

  
    tableStore.headers = [
        { title: 'ID',           key: 'penaltyId' },
        { title: 'Usuário',      key: 'user' },
        { title: 'Valor',        key: 'amount' },
        { title: 'Status',       key: 'statusPenalty' },
        { title: 'Data de Multa', key: 'penaltyDate', sortable: false },
        { title: 'Ações',        key: 'actions', sortable: false }
    ]

    async function getRows(options: TableOptions) {
        setLastOptions(options)
        const fetchAndTreat = async (opts: TableOptions) => {
            const page = (opts.page ?? 1) - 1
            const sortBy = opts.sortBy?.[0]
            const search = opts.search

            const sortKeyMap: Record<string, string> = {
                penaltyId: 'id',
                user: 'user.name',
                amount: 'amount',
                statusPenalty: 'status',
                penaltyDate: 'date'
            }

            const mappedSortBy = sortBy
                ? { key: sortKeyMap[sortBy.key] ?? sortBy.key, order: sortBy.order }
                : undefined

            const response = await penaltyService.getAll(page, opts.itemsPerPage, mappedSortBy, search)

            let content: any[] = []
            if (response && 'content' in response) content = response.content
            else if (Array.isArray(response)) content = response

            const treatedList = content.map((item: any) => ({
                ...item,
                user: item.user?.name ?? 'Sem nome',
                penaltyDate: formatDateTime(item.penaltyDate)
            }))

            if (response && 'content' in response) return { content: treatedList, page: response.page }
            return treatedList
        }

        await tableStore.getRows(options, fetchAndTreat)
    }
    useWebSocket('penalties',   () => { if (lastOptions.value) getRows(lastOptions.value) })
    return {
        titleTable: 'Multas',
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
        deleteMessage: computed(() => deleteMessage('multa')),
        closeModal
    }
}
