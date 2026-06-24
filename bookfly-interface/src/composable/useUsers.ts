import { computed, ref } from 'vue'
import { userService } from '@/services/userService'
import { useTableStore } from '@/stores/useTableStore'
import type { TableOptions } from './useTable'
import { createCrudActions } from './useCreateCrudActions'
import type { BtnAction } from '@/composable/useBtnActions'
import { formatDateTime } from '@/utils/dateFormat'
import type { FormField } from './useForm'
export function useUsers() {
    const tableStore = useTableStore('users')
    const selectedUser = ref<any>()
    const showModal = ref(false)
    const modalType = ref<'edit' | 'delete' | null>(null)

    const deleteMessage = computed(() =>
    selectedUser.value
        ? `Você deseja apagar o usuário ${selectedUser.value?.name}?`
        : 'Você deseja apagar este usuário?'
)


 const buildModal = () => {
        const fieldsEdit: FormField[] = [
            {
                name: 'name',
                label: 'Nome',
                type: 'text'
            },
            {
                name: 'email',
                label: 'Email',
                type: 'email'
            }
        ]
        
        return fieldsEdit
    }

    function edit(user?: any) {
        modalType.value = 'edit'
        selectedUser.value = user
        console.log('editar', user)
        showModal.value = true
    }

    function deleted(user?: any) {
        modalType.value = 'delete'
        selectedUser.value = user
        console.log('deletar', user)
        showModal.value = true
    }

    // function deleted(user?: any) {
    // }
    const actions: BtnAction[] = [
        ...createCrudActions(edit, deleted)
    ]


    tableStore.headers = [
        { title: 'ID', key: 'id' },
        { title: 'Nome', key: 'name' },
        { title: 'Email', key: 'email' },
        { title: 'Role', key: 'role' },
        { title: 'Status', key: 'recordStatus' },
        { title: 'Data', key: 'recordDateTime', sortable: false },
        { title: 'Ações', key: 'actions', sortable: false }
    ]

    async function getRows(options: TableOptions) {
        const fetchAndTreat = async (opts: TableOptions) => {
            const page = (opts.page ?? 1) - 1
            const sortBy = opts.sortBy?.[0]
            const search = opts.search
            const response = await userService.getAll(page, opts.itemsPerPage, sortBy, search)

            let content: any[] = []
            if (response && 'content' in response) {
                content = response.content
            } else if (Array.isArray(response)) {
                content = response
            }

            const treatedList = content.map((item: any) => ({
                ...item,
                recordDateTime: formatDateTime(item.recordDateTime)
            }))

            if (response && 'content' in response) {
                return {
                    content: treatedList,
                    page: response.page
                }
            }
            return content
        }

        await tableStore.getRows(options, fetchAndTreat)
    }



    return {
        titleTable: 'Usuários',
        headers: tableStore.headers,
        items: computed(() => tableStore.items),
        loading: computed(() => tableStore.loading),
        totalItems: computed(() => tableStore.totalItems),
        getRows,
        actions: actions,
        showModal,
        modalType,
        buildModal,
        selectedUser,
        deleteMessage

    }
}