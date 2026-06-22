import {api}  from '@/services/apiServices'


export const bookService = {
    getAll: async () => {
        const response = await api.get('books/list');
        return response.data;
    }
}