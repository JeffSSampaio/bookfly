import {api}  from '@/services/apiServices'


export const bookService = {
    async getAll(){
        return await api.get('books/list')
    }
}