import {api} from '@/services/apiServices';

export const movimentService ={
         getAll: async () => {
                const response = await api.get('moviments/list');
                return response.data;
        }
}