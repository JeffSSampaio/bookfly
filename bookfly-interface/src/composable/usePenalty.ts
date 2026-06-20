import {penaltyService} from '@/services/penaltyServices';
import { useServerTable } from './useServerTable';
export  function usePenalty() {
    function getHeaders(){

        const headers = [
            { title: 'ID', key: 'penaltyId' },
            { title: 'Usuário', key: 'user' },
            { title: 'Valor', key: 'amount' },
            { title: 'Status', key: 'statusPenalty' },
            {title: 'Dia da multa', key: 'penaltyDate' },
            { title: 'Ações', key: 'actions', sortable: false }
            
        ]
        return headers
    }
 async function getRows() {
    const response = await penaltyService.getAll();
    const list = Array.isArray(response) ? response : [];
    return list.map((data: any) => {
        return {
            ...data,
            user: data.user?.name ?? 'Sem usuário'
        };
    });
}


    const tableEngine = useServerTable( getRows, getHeaders(), 'Multas')

    return {
        ...tableEngine
    }
}