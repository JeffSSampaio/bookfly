import { loanService } from '@/services/loanService';
import { useServerTable } from './useServerTable';
export const useLoans = () => {

    function getHeaders(){
        const headers = [
            { title: 'ID', key: 'id' },
            { title: 'Usuário', key: 'user' },
            { title: 'Livro', key: 'book' },
            { title: 'Data de Empréstimo', key: 'loanDate' },
            { title: 'Data de Devolução', key: 'returnDate' },
            { title: 'Status', key: 'status' },
            { title: 'Ações', key: 'actions', sortable: false }
        ]
        return headers
    }

    async function getRows() {
        const response = await loanService.getAll();
        const list = Array.isArray(response) ? response : [];
        return list.map((data: any) => {
            return {
                ...data,
                user: data.user?.name ?? 'Sem usuário',
                book: data.book?.title ?? 'Sem título'
            };
        });
    }

    const tableEngine = useServerTable(getRows, getHeaders(), 'Empréstimos')

    return {
        ...tableEngine
    }
}