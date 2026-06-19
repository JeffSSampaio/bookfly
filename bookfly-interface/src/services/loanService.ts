import {api} from '@/services/apiServices' 

export const loanService = {
    async getAll(){
        return await api.get('loans/list');
    }
}