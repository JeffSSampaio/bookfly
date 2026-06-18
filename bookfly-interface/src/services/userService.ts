import {api} from '@/services/apiServices'

export const userService ={
       async getAll(){
             return await api.get('users/list');
        }
}
