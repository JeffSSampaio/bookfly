import { loanService } from '@/services/loanService';
import { useServerTable } from './useServerTable';
export const useLoans = () => {
    const headers = [
        { title: 'ID', key: 'id' },
        { title: 'Usuário', key: 'user' },
        { title: 'Livro', key: 'book' },
        { title: 'Data de Empréstimo', key: 'loanDate' },
        { title: 'Data de Devolução', key: 'returnDate' },
        { title: 'Status', key: 'status' },
    ]

    async function getAllLoans() {
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

    const tableEngine = useServerTable(getAllLoans, headers, 'Empréstimos')

    return {
        ...tableEngine
    }
}