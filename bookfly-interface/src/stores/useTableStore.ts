import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import type { TableOptions , TableHeader} from '@/composable/useTable'

export const useTableStore = (id: string) => {
    return defineStore(`table_${id}`, () => {
        const items = shallowRef<any[]>([])
        const totalItems = ref(0)
        const loading = ref(false)
        const search = ref('')
        const headers = ref<TableHeader[]>([])

        async function getRows(options: TableOptions, fetchFn: Function) {
            loading.value = true

            if (options.search !== undefined) {
                search.value = options.search
            }

            const page = options.page ?? 1
            const itemsPerPage = options.itemsPerPage ?? 5
            const sortBy = options.sortBy ?? [0]

            try {
                const response = await fetchFn({ ...options, search: search.value });
                if (response && 'content' in response) {
                    items.value = response.content;
                    totalItems.value = response.page?.totalElements ?? response.totalElements;
                } else if (Array.isArray(response)) {

                    const begin = (page - 1) * itemsPerPage;
                    items.value = response.slice(begin, begin + itemsPerPage);
                    totalItems.value = response.length;
                }
            } catch (e) {
                console.error("Erro" + e)
                items.value = []
                totalItems.value = 0
            } finally{
                loading.value = false
            }

        }
        return {
        items,
        totalItems,
        loading,
        headers,
        search,
        getRows
        }
    })()
}