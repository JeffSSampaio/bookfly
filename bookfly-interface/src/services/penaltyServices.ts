import {api} from '@/services/apiServices';

export const penaltyService ={
         async getAll(){
                return await api.get('penalties/list');
        }
}