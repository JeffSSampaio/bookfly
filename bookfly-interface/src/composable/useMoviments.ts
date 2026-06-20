import {movimentService} from '@/services/movimentServices';
import { useServerTable } from './useServerTable';

export function useMoviments() {
    function getHeaders(){
        const headers = [
            { title: 'ID', key: 'movimentId' },
             { title: 'Usuário', key: 'user' },
            { title: 'Livro', key: 'book' },
            { title: 'Quantidade', key: 'qtdMoved' },
            { title: 'Tipo', key: 'type' },
            { title: 'Data de Criação', key: 'createdTime' },
            { title: 'Ações', key: 'actions', sortable: false }
        ]
        return headers
    }

    async function getRows(){
 
            const response = await movimentService.getAll();
            const list = Array.isArray(response) ? response : [];
            return list.map((data: any) => {
                return {
                    ...data,
                    book: data.book.title ?? "Sem Titulo",
                    user: data.user.name ?? "Sem Informação"
                };
            });
        
        
    }


    const tableEngine = useServerTable(getRows, getHeaders(), 'Movimentações')

    return {
        ...tableEngine
    }
}