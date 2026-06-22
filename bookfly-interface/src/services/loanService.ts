import {api} from '@/services/apiServices' 

export const loanService = {
    getAll: async () => {
        const response = await api.get('loans/list');
        return response.data;
    }
}