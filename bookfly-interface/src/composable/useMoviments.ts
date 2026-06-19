import {movimentService} from '@/services/movimentServices';
import { useServerTable } from './useServerTable';

export function useMoviments() {
    const headers = [
        { title: 'ID', key: 'movimentId' },
         { title: 'Usuário', key: 'user' },
        { title: 'Livro', key: 'book' },
        { title: 'Quantidade', key: 'qtdMoved' },
        { title: 'Tipo', key: 'type' },
        { title: 'Data de Criação', key: 'createdTime' },
        { title: 'Ações', key: 'actions', sortable: false }
    ]

    const tableEngine = useServerTable(movimentService.getAll, headers, 'Movimentações')

    return {
        ...tableEngine
    }
}