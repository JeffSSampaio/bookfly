import {api} from '@/services/apiServices';

export const stockBookService ={
            getAll: async () => {
                const response = await api.get('stock/list');
                return response.data;
            }
}