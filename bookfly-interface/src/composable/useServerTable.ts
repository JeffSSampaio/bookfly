import { ref } from 'vue'

export interface TableOptions {
  page?: number
  itemsPerPage?: number
  sortBy?: { key: string; order: string }[]
}


export function useServerTable<T>(fetchFn: () => Promise<T[]>, defaultHeaders: any[], defaultTitle: string) {
  const allItems = ref<T[]>([])   
  const items = ref<T[]>([])       
  const loading = ref(false)
  const totalItems = ref(0)
  const titleTable = ref(defaultTitle)
  const headers = ref(defaultHeaders)

  async function getRows(options: TableOptions = {}) {
    loading.value = true

    const { page = 1, itemsPerPage = 10, sortBy = [] } = options

    try {
     
      if (allItems.value.length === 0) {
        const response = await fetchFn()
        allItems.value = Array.isArray(response) ? response : []
      }

      let list = [...allItems.value]

   
      if (sortBy.length) {
        const { key, order } = sortBy[0]
        list.sort((a: any, b: any) => {
          const valA = a[key]
          const valB = b[key]

          if (typeof valA === 'string') {
            return order === 'desc' ? valB.localeCompare(valA) : valA.localeCompare(valB)
          }
          return order === 'desc' ? valB - valA : valA - valB
        })
      }

   
      const start = (page - 1) * itemsPerPage
      const end = start + itemsPerPage

      items.value = list.slice(start, end)
      totalItems.value = list.length
    } catch (error) {
      console.error('Erro ao processar dados da tabela ' + titleTable +':' + error)
    } finally {
      loading.value = false
    }
  }


  function clearCache() {
    allItems.value = []
  }

  return {
    titleTable,
    headers,
    items,
    loading,
    totalItems,
    getRows,
    clearCache
  }
}