import { ref, shallowRef } from 'vue'
import type { TableOptions, SortOption, TableHeader } from '@/composable/useTable'

interface SpringPageResponse<T> {
  content: T[]
  page: {
    totalElements: number
    totalPages: number
    number: number
    size: number
  }
}

interface FlatPageResponse<T> {
  content: T[]
  totalElements: number
}

export function useServerTable<T>(
  fetchFn: (options: TableOptions) => Promise<SpringPageResponse<T> | FlatPageResponse<T> | T[]>,
  defaultHeaders: TableHeader[],
  defaultTitle: string
) {
  const allItems = shallowRef<T[]>([])
  const items = shallowRef<T[]>([])
  const loading = ref(false)
  const totalItems = ref(0)
  const titleTable = ref(defaultTitle)
  const headers = ref<TableHeader[]>(defaultHeaders)

  function isSpringPageResponse(response: any): response is SpringPageResponse<T> {
    return response !== null
      && typeof response === 'object'
      && 'content' in response
      && 'page' in response
      && 'totalElements' in response.page
  }

  function isFlatPageResponse(response: any): response is FlatPageResponse<T> {
    return response !== null
      && typeof response === 'object'
      && 'content' in response
      && 'totalElements' in response
  }

  function applySorting(list: T[], sortBy: SortOption[]): T[] {
    if (!sortBy.length) return list

    const { key, order } = sortBy[0]
    return [...list].sort((a: any, b: any) => {
      const valA = a[key]
      const valB = b[key]

      if (typeof valA === 'string') {
        return order === 'desc' ? valB.localeCompare(valA) : valA.localeCompare(valB)
      }
      return order === 'desc' ? valB - valA : valA - valB
    })
  }

  async function getRows(options: TableOptions = {}) {
    loading.value = true

    const { page = 1, itemsPerPage = 10, sortBy = [] } = options

    try {
      const response = await fetchFn(options)

      if (isSpringPageResponse(response)) {
        items.value = response.content
        totalItems.value = response.page.totalElements
        return
      }

      if (isFlatPageResponse(response)) {
        items.value = response.content
        totalItems.value = response.totalElements
        return
      }

      if (allItems.value.length === 0) {
        allItems.value = Array.isArray(response) ? response : []
      }

      const sorted = applySorting([...allItems.value], sortBy)
      const start = (page - 1) * itemsPerPage

      items.value = sorted.slice(start, start + itemsPerPage)
      totalItems.value = allItems.value.length

    } catch (error) {
      console.error(`Erro ao processar dados da tabela ${titleTable.value}:`, error)
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