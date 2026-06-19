import {api} from '@/services/apiServices';

export const movimentService ={
         async getAll(){
                return await api.get('moviments/list');
        }
}