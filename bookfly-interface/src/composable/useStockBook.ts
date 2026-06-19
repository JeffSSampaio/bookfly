import {stockBookService} from '@/services/StockBookService';
import {useServerTable} from '@/composable/useServerTable';
export function useStockBook(){
    const headers = [
        { title: 'ID', key: 'stockId' },
        { title: 'Livro', key: 'book' },
        { title: 'Quantidade', key: 'qtd' },
        { title: '', key: 'actions', sortable: false },
        { title: 'Ações', key: 'actions', sortable: false }
    ]

 async function allStockBooks() {
    const response = await stockBookService.getAll()
    const list = Array.isArray(response) ? response : []
    return list.map((data: any) => {
        return {
            ...data,
            book: data.book?.title ?? 'Sem título'
        }
    })
}

    const tableEngine = useServerTable(allStockBooks, headers, 'Estoque de Livros')

    return {
        ...tableEngine
    }

}
    