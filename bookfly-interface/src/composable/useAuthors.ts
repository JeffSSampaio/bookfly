import { computed } from 'vue'
import { authorsService } from '@/services/authorsService'
import { useTableStore } from '@/stores/useTableStore'
import type { TableOptions } from './useTable'
import { createCrudActions } from './useCreateCrudActions'
import type { BtnAction } from '@/composable/useBtnActions'
import { useForm, type FormField } from './useForm'
import { useWebSocket } from './useWebSocket'
import { formatDateTime } from '@/utils/dateFormat'

export function useAuthors(){
 const tableStore = useTableStore('authors')

    tableStore.headers = [
        { title: 'ID', key: 'id' },
        { title: 'Nome', key: 'name' },
        { title: 'Status', key: 'recordStatus' },
        { title: 'Data/Hora', key: 'recordDateTime' },
        { title: 'Ações', key: 'actions', sortable: false }
    ]
const {
        formTitle, setFormTitle,
        showModal, modalType, selectedItem, openModal,
        closeModal, deleteMessage, buildForm, fillForm, lastOptions, setLastOptions } = useForm()

  const fields: FormField[] = [
        { name: 'name', label: 'Nome', type: 'text' },
    ]

      const form = buildForm(fields)


    function edit(author?: any) {
        setFormTitle(`Editando Autor ID°${author.id}`)
        fillForm(form.value, author)
        openModal('edit', author)
    }

    function deleted(author?: any) {
        setFormTitle(`Editando Livro ID°${author.id}`)
        openModal('delete', author)
    }

    async function handleSubmit(formData: Record<string, any>) {
            if (selectedItem.value) {
                console.log('[usePenalty] Atualizar multa:', selectedItem.value.penaltyId, formData)
                try{
                    authorsService.update(selectedItem.value.id, formData)
                    
                }catch(e){
                    console.error('Erro:'+e)
                }
            }
            closeModal()
        
        }
    
        async function handleDelete() {
    
            console.log('[usePenalty] Deletar multa:', selectedItem.value.id)
             authorsService.delete(selectedItem.value.id)
            closeModal()
            // await getRows({ page: 1, itemsPerPage: 10 })
        }

    const actions: BtnAction[] = [...createCrudActions(edit, deleted)]
async function getRows(options: TableOptions) {
        setLastOptions(options)
        const fetchAndTreat = async (opts: TableOptions) => {
            const page = (opts.page ?? 1) - 1
            const sortBy = opts.sortBy?.[0]
            const search = opts.search

            const sortKeyMap: Record<string, string> = {
                id: 'id',
                name: 'name',
        
            }

            const mappedSortBy = sortBy
                ? { key: sortKeyMap[sortBy.key] ?? sortBy.key, order: sortBy.order }
                : undefined

            const response = await authorsService.getAll(page, opts.itemsPerPage, mappedSortBy, search)

            let content: any[] = []
            if (response && 'content' in response) content = response.content
            else if (Array.isArray(response)) content = response

            const treatedList = content.map((item: any) => ({
                ...item,
                recordDateTime: formatDateTime(item.recordDateTime)
            }))

            if (response && 'content' in response) return { content: treatedList, page: response.page }
            return treatedList
        }

        await tableStore.getRows(options, fetchAndTreat)
    }
    useWebSocket('authors', () => { if (lastOptions.value) getRows(lastOptions.value) })
 return {
        titleTable: 'Autores',
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
        deleteMessage: computed(() => deleteMessage('autor')),
        closeModal,
        formTitle,
        form
    }
}