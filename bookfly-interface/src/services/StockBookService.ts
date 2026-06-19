import {api} from '@/services/apiServices';

export const stockBookService ={
            async getAll(){
                return await api.get('stock/list');
            }
}