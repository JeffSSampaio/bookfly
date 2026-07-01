import { computed } from 'vue'
import { userService } from '@/services/userService'
import { useTableStore } from '@/stores/useTableStore'
import type { TableOptions } from './useTable'
import { createCrudActions } from './useCreateCrudActions'
import { formatDateTime } from '@/utils/dateFormat'
import { useForm, type FormField } from './useForm'


export function useUsers() {
  const tableStore = useTableStore('users')
  const {
    showModal, modalType,
    selectedItem, openModal, closeModal, deleteMessage,
    buildForm, fillForm, lastOptions,
    setLastOptions,
    setFormTitle,
    formTitle
    
  } = useForm()


  const fields: FormField[] = [
    { name: 'name', label: 'Nome', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
  ]

  const form = buildForm(fields)


  function edit(user?: any) {
    setFormTitle(`Editando Usuário ID°${user?.id}`)
    fillForm(form.value, user)
    openModal('edit', user)
  }

  function deleted(user?: any) {
    setFormTitle(`Removendo Usuário ID°${user?.id}`)
    openModal('delete', user)
  }

  const actions = [...createCrudActions(edit, deleted)]


  async function handleSubmit(formData: Record<string, any>) {
    if (selectedItem.value) {
      try{
        userService.update(selectedItem.value.id, formData)
      }catch(e){
        console.error('Erro:' + e)
      }
    }
    closeModal()
  }

  async function handleDelete() {
    try {
      userService.delete(selectedItem.value.id);
      console.log('Usuário deletado com sucesso:', selectedItem.value.name);
      // await getRows({ page: 1, itemsPerPage: 10 })
      closeModal();
    } catch (e) {
      console.error("Erro:" + e)
    }
  }


  tableStore.headers = [
    { title: 'ID', key: 'id' },
    { title: 'Nome', key: 'name' },
    { title: 'Email', key: 'email' },
    { title: 'Role', key: 'role' },
    { title: 'Status', key: 'recordStatus' },
    { title: 'Data/Hora', key: 'recordDateTime', sortable: false },
    { title: 'Ações', key: 'actions', sortable: false },
  ]

  async function getRows(options: TableOptions) {

    const fetchAndTreat = async (opts: TableOptions) => {
      const page = (opts.page ?? 1) - 1
      const sortBy = opts.sortBy?.[0]
      const response = await userService.getAll(page, opts.itemsPerPage, sortBy, opts.search)

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
    setLastOptions(options)
  }


  return {
    titleTable: 'Usuários',
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
    deleteMessage: computed(() => deleteMessage('usuário')),
    closeModal,
    formTitle,form
  }
}