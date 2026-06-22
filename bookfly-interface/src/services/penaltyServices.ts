import {api} from '@/services/apiServices';

export const penaltyService ={
         getAll: async () => {
                const response = await api.get('penalties/list');
                return response.data;
        }
}